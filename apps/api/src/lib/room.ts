import { MapSchema } from "@colyseus/schema";
import {
  PERFECT_SCORE_DISTANCE,
  PERFECT_SCORE_POINTS,
  GREAT_SCORE_DISTANCE,
  GREAT_SCORE_POINTS,
  OKAY_SCORE_DISTANCE,
  OKAY_SCORE_POINTS,
  BAD_SCORE_DISTANCE,
  BAD_SCORE_POINTS,
} from "../exports";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROOM_ID_LENGTH = 5;

export function createRoomId() {
  let result = "";
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }
  return result;
}

export function getRoundsLength(playersLength: number) {
  if (playersLength <= 2) {
    return 10;
  }
  if (playersLength === 3) {
    return 9;
  }
  if (playersLength === 4) {
    return 8;
  }
  if (playersLength === 5) {
    return 10;
  }
  return playersLength;
}

export function getDistance(target: number, guess: number | undefined) {
  return guess !== undefined ? Math.abs(target - guess) : Infinity;
}

export function getScore(target: number, guess: number | undefined) {
  const distance = getDistance(target, guess);
  if (distance <= PERFECT_SCORE_DISTANCE) {
    return PERFECT_SCORE_POINTS;
  } else if (distance <= GREAT_SCORE_DISTANCE) {
    return GREAT_SCORE_POINTS;
  } else if (distance <= OKAY_SCORE_DISTANCE) {
    return OKAY_SCORE_POINTS;
  } else if (distance <= BAD_SCORE_DISTANCE) {
    return BAD_SCORE_POINTS;
  } else {
    return 0;
  }
}

export function getHinterScore(
  scores: MapSchema<number>,
  guessersLength: number,
) {
  let hinterScore = 0;
  scores.forEach((score) => {
    hinterScore += score;
  });
  return Math.ceil(hinterScore / (guessersLength + 1));
}
