import {
  Schema,
  type,
  MapSchema,
  ArraySchema,
  filterChildren,
  filter,
} from "@colyseus/schema";
import { Client } from "colyseus";
import { getRandomRange } from "../../config/sets";

export class Player extends Schema {
  @type("string") sessionId: string = "";
  @type("string") name: string = "";
  @type("boolean") ready: boolean = false;
  @type("number") score: number = 0;

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }
}

export type RoundStep = "revealing" | "hinting" | "guessing" | "scoring";

export class Round extends Schema {
  @type("string") step: RoundStep = "revealing";

  @type("string") from: string = "";
  @type("string") to: string = "";

  @filter(function (this: Round, client: Client, value: number, root: Schema) {
    return client.sessionId === this.hinter?.sessionId;
  })
  @type("number")
  target: number = Math.round(Math.random() * 100); // between 0-100

  @type(Player) hinter: Player | null = null;
  @type("string") hint: string = "";

  @type({ map: Player }) guessers = new MapSchema<Player>();
  @filterChildren(function filter(
    this: Round,
    client: Client,
    key: string,
    value: number,
    root: Schema,
  ) {
    return (
      this.step === "scoring" ||
      client.sessionId === key ||
      client.sessionId === this.hinter?.sessionId
    );
  })
  @type({ map: "number" })
  guesses = new MapSchema<number>(); // between 0-100

  constructor(hinter: Player, players: MapSchema<Player>) {
    super();
    this.hinter = hinter;
    this.guessers = new MapSchema<Player>(players);
    this.guessers.delete(hinter.sessionId);
    const range = getRandomRange();
    this.from = range.from;
    this.to = range.to;
  }
}

export type RoomPhase = "lobby" | "rounds" | "scoreboard";

export class WavelengthRoomState extends Schema {
  @type("string") phase: RoomPhase = "lobby";

  @type("number") maxPlayers: number = 10;
  @type({ map: Player }) players = new MapSchema<Player>();

  @type({ array: Round }) rounds = new ArraySchema<Round>();
  @type("number") roundIndex: number = -1;
  @type(Round) round: Round | null = null;
}
