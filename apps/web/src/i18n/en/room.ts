export const room = {
  title: {
    players: "Players",
    revealing1: "This round's Hinter is ",
    hinting1: " is looking for a hint...",
    guessing1: "The hint is ",
    guessing2: ". Guessers have 30 seconds to guess...",
    scoring1: "Well played ",
    scoring2: "everyone",
    scoring3: "! Next round in 10 seconds...",
    scoreboard1: "And the ",
    scoreboard2: "winner",
    scoreboard3: " is...",
  },
  form: {
    label: {
      gameId: "Game ID",
    },
    placeholder: {
      name: "Your name",
      hint: "Your hint",
    },
    error: {
      requiredName: "Please enter your name",
      validName: "16 characters max",
      requiredHint: "Please enter a hint to help the Guessers",
      validHint: "50 characters max",
    },
  },
  pop: {
    title: {
      leave: "Are you sure?",
    },
    description: {
      leave: "You'll lose your progress in this game.",
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
    guess: "{{player}}: {{value}}",
    target: "Target: {{value}}",
  },
  badge: {
    ready: "Ready",
    notReady: "Not ready",
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
      hinter: "Hinter",
      guesser: "Guesser",
      you: "you",
    },
  },
};
