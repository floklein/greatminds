import { Room, Client } from "@colyseus/core";
import {
  Player,
  RoomPhase,
  Round,
  RoundStep,
  WavelengthRoomState,
} from "./schema/WavelengthRoomState";
import { createRoomId } from "../lib/room";
import { Message, Messages } from "../types";

export class WavelengthRoom extends Room<WavelengthRoomState> {
  LOBBY_CHANNEL = "wavelength_lobby";

  maxClients = 10;

  async onCreate(options: any) {
    this.roomId = await this.generateRoomId();
    this.setState(new WavelengthRoomState());
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
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player(client.sessionId));
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented) {
        console.log(client.sessionId, "left with consent!");
        return;
      }
      console.log(client.sessionId, "left...");
      await this.allowReconnection(client, 30);
      console.log(client.sessionId, "...but reconnected!");
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

  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id: string;
    do {
      id = createRoomId();
    } while (currentIds.includes(id));
    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  setPhase(phase: RoomPhase) {
    this.state.phase = phase;
    if (phase === "lobby") {
      console.log("starting lobby phase");
      this.unlock();
    }
    if (phase === "rounds") {
      console.log("starting rounds phase");
      this.lock();
      this.state.players.forEach((player) => {
        this.state.rounds.push(new Round(player, this.state.players));
      });
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
      this.clock.setTimeout(() => {
        this.setRound(this.state.roundIndex + 1);
      }, 5 * 1000);
    }
  }
}
