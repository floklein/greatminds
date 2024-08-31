import { Room, ClientArray as CClientArray } from "@colyseus/core";
import {
  Player,
  RoomPhase,
  Round,
  RoundStep,
  GreatMindsRoomState,
} from "./schema/GreatMindsRoomState";
import { createRoomId, getRoundsLength } from "../lib/room";
import { Message, Messages } from "../types";
import { getHinterScore, getScore } from "../lib/room";
import {
  ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS,
  ROOM_MAX_CLIENTS,
} from "../config/room";
import { Client, UserData } from "../types";

export class GreatMindsRoom extends Room<GreatMindsRoomState> {
  LOBBY_CHANNEL = "greatminds_lobby";

  clients = new CClientArray<UserData>();
  maxClients = ROOM_MAX_CLIENTS;

  // LIFECYCLE

  async onCreate() {
    this.roomId = await this.generateRoomId();
    this.setState(new GreatMindsRoomState());
    this.onMessage<Message[Messages.SetPlayerReady]>(
      Messages.SetPlayerReady,
      (client, message) => {
        console.log(client.sessionId, "ready =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          console.error("Player not found");
          return;
        }
        player.ready = message;
        if (
          this.state.players.size >= 2 &&
          Array.from(this.state.players.values()).every(
            (player) => player.ready,
          )
        ) {
          console.log("all players ready");
          this.setPhase("rounds");
        }
      },
    );
    this.onMessage<Message[Messages.SetPlayerName]>(
      Messages.SetPlayerName,
      (client, message) => {
        console.log(client.sessionId, "name =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          console.error("Player not found");
          return;
        }
        player.name = message;
      },
    );
    this.onMessage<Message[Messages.SubmitHint]>(
      Messages.SubmitHint,
      (client, message) => {
        console.log(client.sessionId, "hint =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          console.error("Player not found");
          return;
        }
        if (!this.state.round || !this.state.round.hinter) {
          console.error("No current round or hinter");
          return;
        }
        if (this.state.round.step !== "hinting") {
          console.error("Not in hinting step");
          return;
        }
        if (player.sessionId !== this.state.round.hinter.sessionId) {
          console.error("Player is not the hinter");
          return;
        }
        if (message.length === 0) {
          console.error("Hint is empty");
          return;
        }
        this.state.round.hint = message;
        this.setRoundStep("guessing");
      },
    );
    this.onMessage<Message[Messages.SetGuess]>(
      Messages.SetGuess,
      (client, message) => {
        console.log(client.sessionId, "guess =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          console.error("Player not found");
          return;
        }
        if (!this.state.round) {
          console.error("No current round");
          return;
        }
        if (this.state.round.step !== "guessing") {
          console.error("Not in guessing step");
          return;
        }
        if (!this.state.round.guessers.has(client.sessionId)) {
          console.error("Player is not a guesser");
          return;
        }
        this.state.round.guesses.set(client.sessionId, message);
      },
    );
    this.onMessage<Message[Messages.PlayAgain]>(Messages.PlayAgain, () => {
      console.log("play again");
      this.setPhase("lobby");
    });
    this.onMessage<Message[Messages.KickPlayer]>(
      Messages.KickPlayer,
      (client, message) => {
        if (!this.isAdmin(client)) {
          console.error("Not admin");
          return;
        }
        if (message === this.state.admin?.sessionId) {
          console.error("Cannot kick admin");
          return;
        }
        if (message === client.sessionId) {
          console.error("Cannot kick yourself");
          return;
        }
        const kickedClient = this.clients.getById(message);
        if (!kickedClient) {
          console.error("Client to kick not found");
          return;
        }
        console.log(client.sessionId, "kicked", message);
        kickedClient.userData ??= {};
        kickedClient.userData.isKicked = true;
        kickedClient.leave();
      },
    );
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");
    client.userData = { isKicked: false };
    const player = new Player(client.sessionId);
    this.state.players.set(client.sessionId, player);
    if (!this.state.admin) {
      this.state.admin = player;
    }
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented === false && client.userData?.isKicked !== true) {
        console.log(client.sessionId, "left...");
        await this.allowReconnection(
          client,
          ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS,
        );
        console.log(client.sessionId, "...but reconnected!");
      } else {
        console.log(client.sessionId, "left with consent!");
        return;
      }
    } catch (error) {
      console.log(client.sessionId, "...and did not reconnect!");
      this.state.players.delete(client.sessionId);
    } finally {
      if (
        this.state.phase === "lobby" &&
        this.state.players.size >= 2 &&
        Array.from(this.state.players.values()).every((player) => player.ready)
      ) {
        this.setPhase("rounds");
      }
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  // CORE

  setPhase(phase: RoomPhase) {
    this.state.phase = phase;
    if (phase === "lobby") {
      console.log("starting lobby phase");
      this.unlock();
      this.state.players.forEach((player) => {
        player.ready = false;
        player.score = 0;
        this.state.players.set(player.sessionId, player);
      });
      this.state.round = null;
      this.state.roundIndex = 0;
      this.state.rounds.clear();
    }
    if (phase === "rounds") {
      console.log("starting rounds phase");
      this.lock();
      const playersArray = Array.from(this.state.players.values());
      const roundsLength = getRoundsLength(this.state.players.size);
      for (let i = 0; i < roundsLength; i++) {
        this.state.rounds.push(
          new Round(playersArray[i % playersArray.length], this.state.players),
        );
      }
      this.setRound(0);
    }
    if (phase === "scoreboard") {
      console.log("starting scoreboard phase");
    }
  }

  setRound(roundIndex: number) {
    if (roundIndex >= this.state.rounds.length) {
      this.setPhase("scoreboard");
      return;
    }
    this.state.roundIndex = roundIndex;
    this.state.round = this.state.rounds[roundIndex];
    this.clock.setTimeout(() => {
      this.setRoundStep("hinting");
    }, 5 * 1000);
  }

  setRoundStep(step: RoundStep) {
    if (!this.state.round) {
      console.error("No current round");
      return;
    }
    this.state.round.step = step;
    if (step === "revealing") {
      console.log("starting revealing step (SHOULD NOT HAPPEN)");
    }
    if (step === "hinting") {
      console.log("starting hinting step");
    }
    if (step === "guessing") {
      console.log("starting guessing step");
      this.clock.setTimeout(() => {
        this.setRoundStep("scoring");
      }, 30 * 1000);
    }
    if (step === "scoring") {
      console.log("starting scoring step");
      this.state.round.guesses = this.state.round.guesses.clone(); // trigger filter workaround https://github.com/colyseus/schema/issues/102
      this.state.round.target = this.state.round.target; // same
      this.state.round.guessers.forEach((guesser) => {
        if (!this.state.round) {
          console.error("No current round");
          return;
        }
        const guess = this.state.round.guesses.get(guesser.sessionId);
        const score = getScore(this.state.round.target, guess);
        this.state.round.scores.set(guesser.sessionId, score);
        guesser.score += score;
      });
      if (this.state.round.hinter) {
        const hinterScore = getHinterScore(
          this.state.round.scores,
          this.state.round.guessers.size,
        );
        this.state.round.scores.set(
          this.state.round.hinter.sessionId,
          hinterScore,
        );
        this.state.round.hinter.score += hinterScore;
      }
      this.clock.setTimeout(() => {
        this.setRound(this.state.roundIndex + 1);
      }, 10 * 1000);
    }
  }

  // UTILS

  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id: string;
    do {
      id = createRoomId();
    } while (currentIds.includes(id));
    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  isAdmin(client: Client) {
    return client.sessionId === this.state.admin?.sessionId;
  }
}
