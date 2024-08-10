const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROOM_ID_LENGTH = 5;

export function createRoomId() {
  let result = "";
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }
  return result;
}
