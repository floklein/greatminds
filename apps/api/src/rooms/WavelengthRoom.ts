import { Room, Client, Deferred } from "@colyseus/core";
import { WavelengthRoomState } from "./schema/WavelengthRoomState";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROOM_ID_LENGTH = 5;

function generateRoomIdSingle() {
  let result = "";
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }
  return result;
}

export class WavelengthRoom extends Room<WavelengthRoomState> {
  LOBBY_CHANNEL = "my_lobby";

  maxClients = 10;

  async onCreate(options: any) {
    this.roomId = await this.generateRoomId();
    this.setState(new WavelengthRoomState());
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id: string;
    do {
      id = generateRoomIdSingle();
    } while (currentIds.includes(id));
    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.clock.setTimeout(() => {
      client.send("type", "Welcome!");
    }, 1000);
  }

  async onLeave(client: Client, consented: boolean) {
    if (consented) {
      console.log(client.sessionId, "left with consent!");
      return;
    }
    console.log(client.sessionId, "left...");
    try {
      await this.allowReconnection(client, 5);
      console.log(client.sessionId, "...but reconnected!");
    } catch (error) {
      console.log(client.sessionId, "...and did not reconnect!");
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
