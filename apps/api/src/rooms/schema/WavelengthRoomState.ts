import {
  Schema,
  type,
  MapSchema,
  SetSchema,
  ArraySchema,
} from "@colyseus/schema";

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

  @type("number") target: number = 50; // between 0-100

  @type("string") hinterId: string = "";
  @type("string") hint: string = "";

  @type({ set: "string" }) guessersIds = new SetSchema<string>();
  @type({ map: "number" }) guesses = new MapSchema<number>(); // between 0-100
}

export type RoomPhase = "lobby" | "rounds" | "scoreboard";

export class WavelengthRoomState extends Schema {
  @type("string") phase: RoomPhase = "lobby";

  @type({ map: Player }) players = new MapSchema<Player>();

  @type({ array: Round }) rounds = new ArraySchema<Round>();
  @type("number") roundIndex: number = 0;
}
