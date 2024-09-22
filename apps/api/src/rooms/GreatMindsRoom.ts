import { Room, ClientArray as CClientArray, logger } from "@colyseus/core";
import {
  Player,
  RoomPhase,
  Round,
  RoundStep,
  GreatMindsRoomState,
} from "./schema/GreatMindsRoomState";
import { createRoomId, getRoundsLength } from "../lib/room";
import { Errors, Message, Messages } from "../types";
import { getHinterScore, getScore } from "../lib/room";
import {
  ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS,
  ROOM_MAX_CLIENTS,
  REVEALING_STEP_DURATION_SECONDS,
  GUESSING_STEP_DURATION_SECONDS,
  SCORING_STEP_DURATION_SECONDS,
} from "../config/room";
import { Client, UserData } from "../types";

export class GreatMindsRoom extends Room<GreatMindsRoomState> {
  LOBBY_CHANNEL = "greatminds_lobby";

  clients = new CClientArray<UserData>();
  maxClients = ROOM_MAX_CLIENTS;

  // LIFECYCLE

  async onCreate() {
    this.roomId = await this.generateRoomId();
    this.setPrivate(true);
    this.setState(new GreatMindsRoomState());
    this.onMessage<Message[Messages.SetPlayerReady]>(
      Messages.SetPlayerReady,
      (client, message) => {
        logger.info(client.sessionId, "ready =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          logger.error("Player not found");
          return;
        }
        player.ready = message;
        if (
          this.state.players.size >= 2 &&
          Array.from(this.state.players.values()).every(
            (player) => player.ready,
          )
        ) {
          logger.info("all players ready");
          this.setPhase("rounds");
        }
      },
    );
    this.onMessage<Message[Messages.SetPlayerName]>(
      Messages.SetPlayerName,
      (client, message) => {
        logger.info(client.sessionId, "name =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          logger.error("Player not found");
          return;
        }
        player.name = message;
      },
    );
    this.onMessage<Message[Messages.SubmitHint]>(
      Messages.SubmitHint,
      (client, message) => {
        logger.info(client.sessionId, "hint =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          logger.error("Player not found");
          return;
        }
        if (!this.state.round || !this.state.round.hinter) {
          logger.error("No current round or hinter");
          return;
        }
        if (this.state.round.step !== "hinting") {
          logger.error("Not in hinting step");
          return;
        }
        if (player.sessionId !== this.state.round.hinter.sessionId) {
          logger.error("Player is not the hinter");
          return;
        }
        if (message.length === 0) {
          logger.error("Hint is empty");
          return;
        }
        this.state.round.hint = message;
        this.setRoundStep("guessing");
      },
    );
    this.onMessage<Message[Messages.SetGuess]>(
      Messages.SetGuess,
      (client, message) => {
        logger.info(client.sessionId, "guess =", message);
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          logger.error("Player not found");
          return;
        }
        if (!this.state.round) {
          logger.error("No current round");
          return;
        }
        if (this.state.round.step !== "guessing") {
          logger.error("Not in guessing step");
          return;
        }
        if (!this.state.round.guessers.has(client.sessionId)) {
          logger.error("Player is not a guesser");
          return;
        }
        this.state.round.guesses.set(client.sessionId, message);
      },
    );
    this.onMessage<Message[Messages.PlayAgain]>(
      Messages.PlayAgain,
      (client) => {
        if (!this.isAdmin(client)) {
          logger.error("Not admin");
          return;
        }
        logger.info("play again");
        this.setPhase("lobby");
      },
    );
    this.onMessage<Message[Messages.KickPlayer]>(
      Messages.KickPlayer,
      (client, message) => {
        if (!this.isAdmin(client)) {
          logger.error("Not admin");
          return;
        }
        if (message === this.state.admin?.sessionId) {
          logger.error("Cannot kick admin");
          return;
        }
        if (message === client.sessionId) {
          logger.error("Cannot kick yourself");
          return;
        }
        const kickedClient = this.clients.getById(message);
        if (!kickedClient) {
          logger.error("Client to kick not found");
          return;
        }
        logger.info(client.sessionId, "kicked", message);
        kickedClient.userData ??= {};
        kickedClient.userData.isKicked = true;
        kickedClient.leave();
      },
    );
    this.onMessage<Message[Messages.SetPrivate]>(
      Messages.SetPrivate,
      async (client, message) => {
        if (!this.isAdmin(client)) {
          logger.error("Not admin");
          return;
        }
        await this.setPrivate(message);
      },
    );
    this.onMessage<Message[Messages.SetMode]>(
      Messages.SetMode,
      (client, message) => {
        if (!this.isAdmin(client)) {
          logger.error("Not admin");
          return;
        }
        this.state.mode = message;
      },
    );
  }

  onJoin(client: Client) {
    logger.info(client.sessionId, "joined!");
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
        logger.info(client.sessionId, "left...");
        await this.allowReconnection(
          client,
          ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS,
        );
        logger.info(client.sessionId, "...but reconnected!");
        return;
      }
      logger.info(client.sessionId, "left with consent!");
      this.handleClientLeft(client);
    } catch (error) {
      logger.info(client.sessionId, "...and did not reconnect!");
      this.handleClientLeft(client);
    }
  }

  onDispose() {
    logger.info("room", this.roomId, "disposing...");
  }

  async setPrivate(newPrivate: boolean) {
    await super.setPrivate(newPrivate);
    this.state.private = newPrivate;
  }

  // CORE

  setPhase(phase: RoomPhase) {
    this.state.phase = phase;
    if (phase === "lobby") {
      logger.info("starting lobby phase");
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
      logger.info("starting rounds phase");
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
      logger.info("starting scoreboard phase");
    }
  }

  setRound(roundIndex: number) {
    if (roundIndex >= this.state.rounds.length) {
      this.setPhase("scoreboard");
      return;
    }
    this.state.roundIndex = roundIndex;
    this.state.round = this.state.rounds[roundIndex];
    if (
      !this.state.round.hinter ||
      !this.state.players.get(this.state.round.hinter.sessionId)
    ) {
      logger.error("No hinter");
      this.setRound(roundIndex + 1);
      return;
    }
    this.clock.setTimeout(() => {
      this.setRoundStep("hinting");
    }, REVEALING_STEP_DURATION_SECONDS * 1000);
  }

  setRoundStep(step: RoundStep) {
    if (!this.state.round) {
      logger.error("No current round");
      return;
    }
    this.state.round.step = step;
    if (step === "revealing") {
      logger.info("starting revealing step (SHOULD NOT HAPPEN)");
    }
    if (step === "hinting") {
      logger.info("starting hinting step");
    }
    if (step === "guessing") {
      logger.info("starting guessing step");
      this.clock.setTimeout(() => {
        this.setRoundStep("scoring");
      }, GUESSING_STEP_DURATION_SECONDS * 1000);
    }
    if (step === "scoring") {
      logger.info("starting scoring step");
      this.state.round.guesses = this.state.round.guesses.clone(); // trigger filter workaround https://github.com/colyseus/schema/issues/102
      this.state.round.target = this.state.round.target; // same
      this.state.round.guessers.forEach((guesser) => {
        if (!this.state.round) {
          logger.error("No current round");
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
      }, SCORING_STEP_DURATION_SECONDS * 1000);
    }
  }

  handleClientLeft(client: Client) {
    this.state.players.delete(client.sessionId);
    if (
      this.state.phase === "lobby" &&
      this.state.players.size >= 2 &&
      Array.from(this.state.players.values()).every((player) => player.ready)
    ) {
      this.setPhase("rounds");
    }
    if (
      this.state.phase === "rounds" &&
      this.state.round?.hint.length === 0 &&
      client.sessionId === this.state.round?.hinter?.sessionId
    ) {
      this.broadcast(Messages.SendError, Errors.HinterLeft, {
        except: client,
      });
      this.setRound(this.state.roundIndex + 1);
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
