import { WebSocket } from "ws";
import { EVENT_TYPES } from "../constants/constant.js";

export function broadcastMessage(json, clients) {
  const data = JSON.stringify(json);
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export function handleMessage(message, userId, users, clients, userActivity, canvasData) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === EVENT_TYPES.USER_EVENT) {
    users[userId] = dataFromClient;
    userActivity.push(`${dataFromClient.username} joined to edit the document`);
    json.data = { users, userActivity };
  } else if (dataFromClient.type === EVENT_TYPES.CONTENT_CHANGE) {
    canvasData = dataFromClient.content;
    json.data = { canvasData, userActivity };
  }
  broadcastMessage(json, clients);
}

export function handleDisconnect(userId, clients, users, userActivity) {
  console.log(`${userId} disconnected.`);
  const json = { type: EVENT_TYPES.USER_EVENT };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left the document`);
  json.data = { users, userActivity };
  delete clients[userId];
  delete users[userId];
  broadcastMessage(json);
}
