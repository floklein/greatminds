import { ToJSON } from "@colyseus/schema";
import { Player, WavelengthRoomState } from "@wavelength/api";
import { Room } from "colyseus.js";
import { create } from "zustand";

export interface Store {
  room: Room<WavelengthRoomState> | null;
  setRoom: (room: Room<WavelengthRoomState> | null) => void;
  roomState: ToJSON<WavelengthRoomState> | null;
  setRoomState: (roomState: ToJSON<WavelengthRoomState> | null) => void;
}

export const useStore = create<Store>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  roomState: null,
  setRoomState: (roomState) => set({ roomState }),
}));
