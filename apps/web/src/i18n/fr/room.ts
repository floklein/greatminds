export const room = {
  title: {
    settings: "Partie",
    players: "Joueurs",
    revealing1: "Le Master de ce tour est ",
    revealing1_hinter: "Vous êtes le Master de ce tour, ",
    hinting1: " cherche un indice...",
    hinting1_hinter: ", tapez un indice qui aidera les Guessers à deviner la cible.",
    guessing1: "{{hinter}} a écrit ",
    guessing2: " en indice. Guessers, vous avez 30 secondes pour deviner.",
    guessing2_hinter: ". Les Guessers ont 30 secondes pour deviner...",
    scoring1: "Bien joué ",
    scoring2: "à tous",
    scoring3: " ! Prochain tour dans 10 secondes...",
    scoreboard1: "Et le ",
    scoreboard2: "gagnant",
    scoreboard3: " est...",
  },
  form: {
    label: {
      gameId: "ID de la partie",
      mode: "Mode de jeu",
      private: "Visibilité",
    },
    placeholder: {
      name: "Votre nom",
      hint: "Votre indice",
    },
    error: {
      requiredName: "Veuillez entrer votre nom",
      validName: "16 caractères max",
      requiredHint: "Veuillez entrer un indice",
      validHint: "50 caractères max",
    },
    value: {
      textHints: "Indice textuel",
      sketchHints: "Indice dessiné",
      private: "Privée",
      public: "Publique",
    },
  },
  pop: {
    title: {
      leave: "Êtes-vous sûr ?",
      kick: "Êtes-vous sûr ?",
    },
    description: {
      leave: "Vous perdrez votre progression dans cette partie.",
      kick: "Vous allez expulser {{player}} de la partie.",
    },
    ok: {
      leave: "Oui !",
    },
    cancel: {
      leave: "Non, je reste...",
    },
  },
  button: {
    leaveGame: "Quitter",
    ready: "Prêt",
    notReady: "Prêt ?",
    submitHint: "Envoyer",
    playAgain: "Rejouer ?",
  },
  tooltip: {
    copied: "Copié !",
    copy: "Copier",
    you: "Vous",
    guess: "{{player}}",
    target: "Cible",
  },
  badge: {
    ready: "Prêt",
    notReady: "Pas prêt",
    comingSoon: "Bientôt",
  },
  list: {
    title: {
      roundScoreboard: "Scores du tour",
      scoreboard: "Scores finaux",
    },
    text: {
      playerN: "Joueur {{index}}",
    },
    description: {
      hinter: "Master",
      guesser: "Guesser",
      you: "vous",
    },
  },
  tag: {
    admin: "Admin",
  },
  menu: {
    label: {
      kick: "Expulser {{player}}",
    },
  },
};
