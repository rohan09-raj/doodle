export const WS_URL = "ws://127.0.0.1:8000";

export const EVENT = {
  USER: "userevent",
  DRAW: "contentchange",
};

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  TIMER: "timer",
  JOIN: "join",
  DISCONNECT: "disconnect",
  JOINED: "joined",
  ADD_USER: "addUser",
  REMOVE_USER: "removeUser",
  END: "end",
  GUESS: "guess",
  ROUNDS: "rounds",
  TOTAL_ROUNDS: "total-rounds",
  RESET: "reset",
  END_GAME: "endgame",
  CHOOSE_WORD: "chooseWord",
  WAIT: "wait",
  DRAWING: "drawing",
  DRAWER: "drawer",
  DRAW_DATA: "drawData",
  CLEAR: "clear",
  UPDATE_SCORE: "updateScore",
};

export const COLORS = [
  '#000000',
  '#FFFFFF',
  '#C0C0C0',
  '#808080',
  '#FFA500',
  '#A52A2A',
  '#800000',
  '#008000',
  '#808000',
  '#FF0000',
  '#00FFFF',
  '#0000FF',
  '#0000A0',
  '#ADD8E6',
  '#800080',
  '#FFFF00',
  '#00FF00',
  '#FF00FF'
]