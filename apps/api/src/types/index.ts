import { Client as CClient } from "@colyseus/core";

export enum GameMode {
  TextHints = "textHints",
  SketchHints = "sketchHints",
}

export enum Messages {
  SendError = "sendError",
  SetPlayerName = "setPlayerName",
  SetPlayerReady = "setPlayerReady",
  SubmitHint = "submitHint",
  SetGuess = "setGuess",
  PlayAgain = "playAgain",
  KickPlayer = "kickPlayer",
  SetPrivate = "setPrivate",
  SetMode = "setMode",
}

export interface Message {
  [Messages.SendError]: Errors.HinterLeft;
  [Messages.SetPlayerName]: string;
  [Messages.SetPlayerReady]: boolean;
  [Messages.SubmitHint]: string;
  [Messages.SetGuess]: number;
  [Messages.PlayAgain]: void;
  [Messages.KickPlayer]: string;
  [Messages.SetPrivate]: boolean;
  [Messages.SetMode]: GameMode;
}

export type UserData = { isKicked?: boolean };
export type Client = CClient<UserData>;

export enum Errors {
  HinterLeft = "hinterLeft",
}
