import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") score: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("number") currentRound: number = 0;
  @type("number") currentStep: number = 0;
}
