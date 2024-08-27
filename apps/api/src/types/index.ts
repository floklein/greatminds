export enum Messages {
  SetPlayerName = "setPlayerName",
  SetPlayerReady = "setPlayerReady",
  SubmitHint = "submitHint",
  SetGuess = "setGuess",
  PlayAgain = "playAgain",
  KickPlayer = "kickPlayer",
}

export interface Message {
  [Messages.SetPlayerName]: string;
  [Messages.SetPlayerReady]: boolean;
  [Messages.SubmitHint]: string;
  [Messages.SetGuess]: number;
  [Messages.PlayAgain]: void;
  [Messages.KickPlayer]: string;
}
