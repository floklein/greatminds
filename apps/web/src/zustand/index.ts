import { WavelengthRoomState } from "@wavelength/api";
import { Room } from "colyseus.js";
import { create } from "zustand";

export interface Store {
  room: Room<WavelengthRoomState> | null;
  setRoom: (room: Room<WavelengthRoomState> | null) => void;
}

export const useStore = create<Store>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
