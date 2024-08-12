export enum Messages {
  SetPlayerName = "setPlayerName",
  SetPlayerReady = "setPlayerReady",
  SubmitHint = "submitHint",
  SetGuess = "setGuess",
}

export interface Message {
  [Messages.SetPlayerName]: string;
  [Messages.SetPlayerReady]: boolean;
  [Messages.SubmitHint]: string;
  [Messages.SetGuess]: number;
}
