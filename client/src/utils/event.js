import { EVENT } from "../constants/constants.js";

const isUserEvent = (message) => {
  const event = JSON.parse(message.data);
  return event.type === EVENT.USER;
};

const isDrawEvent = (message) => {
  let event = JSON.parse(message.data);
  return event.type === EVENT.DRAW;
};

export default {
  isUserEvent,
  isDrawEvent
};
