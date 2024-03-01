export const PORT = 8000;

export const EVENT_TYPES = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange",
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
