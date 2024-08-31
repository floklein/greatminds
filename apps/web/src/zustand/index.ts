import type { ToJSON } from "@colyseus/schema";
import { GreatMindsRoomState } from "@greatminds/api";
import { Room } from "colyseus.js";
import { create } from "zustand";

export interface Store {
  room: Room<GreatMindsRoomState> | null;
  setRoom: (room: Room<GreatMindsRoomState> | null) => void;
  roomState: ToJSON<GreatMindsRoomState> | null;
  setRoomState: (roomState: ToJSON<GreatMindsRoomState> | null) => void;
}

export const useStore = create<Store>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  roomState: null,
  setRoomState: (roomState) => set({ roomState }),
}));
