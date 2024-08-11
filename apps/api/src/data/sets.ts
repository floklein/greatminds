type WavelengthRange = { from: string; to: string };

type WavelengthSet = WavelengthRange[];

export const set: WavelengthSet = [
  { from: "cold", to: "hot" },
  { from: "small", to: "big" },
  { from: "slow", to: "fast" },
  { from: "weak", to: "strong" },
  { from: "young", to: "old" },
  { from: "soft", to: "hard" },
  { from: "light", to: "dark" },
  { from: "near", to: "far" },
  { from: "smooth", to: "rough" },
  { from: "easy", to: "hard" },
  { from: "simple", to: "complex" },
  { from: "quiet", to: "loud" },
  { from: "low", to: "high" },
  { from: "dull", to: "bright" },
  { from: "thin", to: "thick" },
  { from: "empty", to: "full" },
  { from: "sweet", to: "sour" },
  { from: "clean", to: "dirty" },
  { from: "smooth", to: "bumpy" },
  { from: "shallow", to: "deep" },
  { from: "narrow", to: "wide" },
  { from: "short", to: "tall" },
  { from: "light", to: "heavy" },
];

export function getRandomRange(): WavelengthRange {
  return set[Math.floor(Math.random() * set.length)];
}
