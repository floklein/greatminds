export const PERFECT_SCORE_DISTANCE = 0;
export const GREAT_SCORE_DISTANCE = 2.5;
export const OKAY_SCORE_DISTANCE = 5.5;
export const BAD_SCORE_DISTANCE = 10.5;

export const PERFECT_SCORE_POINTS = 10;
export const GREAT_SCORE_POINTS = 5;
export const OKAY_SCORE_POINTS = 3;
export const BAD_SCORE_POINTS = 1;

export const getDistance = (target: number, guess: number) =>
  Math.abs(target - guess);

export const getScore = (target: number, guess: number) => {
  const distance = getDistance(target, guess);
  if (distance === PERFECT_SCORE_DISTANCE) {
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
};
