import { MyRoomState } from "@wavelength/api";
import { Room } from "colyseus.js";
import { create } from "zustand";

export interface Store {
  room: Room<MyRoomState> | null;
  setRoom: (room: Room<MyRoomState> | null) => void;
}

export const useStore = create<Store>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
