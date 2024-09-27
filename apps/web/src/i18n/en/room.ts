export const room = {
  title: {
    settings: "Game",
    players: "Players",
    revealing1: "This round's Master is ",
    revealing1_hinter: "You are this round's Master, ",
    hinting1: " is looking for a hint...",
    hinting1_hinter: ", type a hint that will help Guessers guess the target.",
    guessing1: "{{hinter}} wrote ",
    guessing2: " as a hint. Guessers, you have 30 seconds to guess.",
    guessing2_hinter: ". Guessers have 30 seconds to guess...",
    scoring1: "Well played ",
    scoring2: "everyone",
    scoring3: "! Next round in 10 seconds...",
    scoreboard1: "And the ",
    scoreboard2: "winner",
    scoreboard3: " is...",
  },
  form: {
    label: {
      gameId: "ID",
      mode: "Game mode",
      private: "Visibility",
    },
    placeholder: {
      name: "Your name",
      hint: "Your hint",
    },
    error: {
      requiredName: "Please enter your name",
      validName: "16 characters max",
      requiredHint: "Please enter a hint",
      validHint: "50 characters max",
    },
    value: {
      textHints: "Text hints",
      sketchHints: "Sketch hints",
      private: "Private",
      public: "Public",
    },
  },
  pop: {
    title: {
      leave: "Are you sure?",
      kick: "Are you sure?",
    },
    description: {
      leave: "You'll lose your progress in this game.",
      kick: "You'll kick {{player}} from the game.",
    },
    ok: {
      leave: "Yes!",
    },
    cancel: {
      leave: "No, I'll stay...",
    },
  },
  button: {
    leaveGame: "Leave",
    ready: "Ready",
    notReady: "Ready?",
    submitHint: "Submit",
    playAgain: "Play again?",
  },
  tooltip: {
    copied: "Copied!",
    copy: "Copy",
    you: "You",
    guess: "{{player}}",
    target: "Target",
  },
  badge: {
    ready: "Ready",
    notReady: "Not ready",
    comingSoon: "Coming soon",
  },
  list: {
    title: {
      roundScoreboard: "Round scores",
      scoreboard: "Final scores",
    },
    text: {
      playerN: "Player {{index}}",
    },
    description: {
      hinter: "Master",
      guesser: "Guesser",
      you: "you",
    },
  },
  tag: {
    admin: "Admin",
  },
  menu: {
    label: {
      kick: "Kick {{player}}",
    },
  },
};
