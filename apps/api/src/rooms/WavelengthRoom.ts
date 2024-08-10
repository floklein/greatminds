import { Room, Client, Deferred } from "@colyseus/core";
import { Player, WavelengthRoomState } from "./schema/WavelengthRoomState";
import { createRoomId } from "../lib/room";

export class WavelengthRoom extends Room<WavelengthRoomState> {
  LOBBY_CHANNEL = "my_lobby";

  maxClients = 10;

  async onCreate(options: any) {
    this.roomId = await this.generateRoomId();
    this.setState(new WavelengthRoomState());
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

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player(client.sessionId));
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
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
