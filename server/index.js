import { Server } from "socket.io";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { handleMessage, handleDisconnect } from "./handlers/handlers.js";
import { PORT } from "./constants/constant.js";

const clients = {};
const users = {};
let canvasData = null;
let userActivity = [];

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", function (connection) {
  const userId = uuidv4();
  console.log("Recieved a new connection");
  clients[userId] = connection;
  console.log(`${userId} connected.`);
  connection.on("message", (message) =>
    handleMessage(message, userId, users, clients, userActivity, canvasData)
  );
  connection.on("close", () =>
    handleDisconnect(userId, clients, users, userActivity)
  );
});
