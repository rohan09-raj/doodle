import { Server } from "socket.io";
import http from "http";
import Game from "./handlers/game.js";
import { PORT, SOCKET_EVENTS } from "./constants/constant.js";
import { words } from "./constants/words.js";

const game = new Game(words);
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on(SOCKET_EVENTS.CONNECTION, function (connection) {
  //  Timer
  const runTimer = () => {
    var counter = 120;
    interval = setInterval(() => {
      io.emit("timer", counter);
      if (counter === 0) {
        clearInterval(interval);
        io.emit(SOCKET_EVENTS.END, game.guessedUsers);
        io.emit(SOCKET_EVENTS.GUESS, {
          message: `The word was ${game.word}`,
          color: "green",
        });
        game.resetGuessedUsers();

        checkRounds();
      }
      counter--;
    }, 1000);
  };

  //  Check for rounds
  const checkRounds = () => {
    //  If everyone has drawn
    if (game.drawnUsers.length === game.users.length) {
      game.rounds += 1;
      if (game.rounds < game.totalRounds) {
        io.emit(SOCKET_EVENTS.ROUNDS, game.rounds + 1);
      }
      game.resetDrawnUsers();
    }

    //  If all the rounds are done
    if (game.rounds === game.totalRounds) {
      io.emit(SOCKET_EVENTS.RESET);
      io.emit(SOCKET_EVENTS.END_GAME, game.getAllUsers());
      game.endgame = true;

      game.rounds = 0;
      setTimeout(() => {
        game.endgame = false;
        io.emit(SOCKET_EVENTS.ROUNDS, game.rounds + 1);
        changeTurn();
      }, 5000);
    } else {
      game.word = "";
      changeTurn(3);
    }
  };

  const changeTurn = (time = 3) => {
    //  Reset drawing
    game.resetDrawing();
    //  Choose new drawer and words
    const { drawer, words } = game.start();
    game.addDrawnUser(drawer);
    //  Start new turn
    setTimeout(() => {
      io.emit(SOCKET_EVENTS.GUESS, {
        message: `${drawer.username} is choosing a word now!`,
        color: "brown",
      });
      io.to(drawer.id).emit(SOCKET_EVENTS.CHOOSE_WORD, words);
    }, time * 1000);
  };

  connection.on(SOCKET_EVENTS.JOIN, ({ username }, callback) => {
    const { error, user } = game.addUser(socket.id, username);
    if (error) {
      return callback({ error });
    }
    //  Notify clients
    socket.broadcast.emit(SOCKET_EVENTS.ADD_USER, user);
    const allUsers = game.getAllUsers();
    callback({ allUsers });
  });

  connection.on(SOCKET_EVENTS.JOINED, (username) => {
    io.emit(SOCKET_EVENTS.GUESS, {
      message: `${username} has joined.`,
      color: "blue",
    });
    io.emit(SOCKET_EVENTS.TOTAL_ROUNDS, game.totalRounds);

    const allUsers = game.getAllUsers();

    if (allUsers.length >= 2) {
      io.emit(SOCKET_EVENTS.WAIT, false);

      io.emit(SOCKET_EVENTS.ROUNDS, game.rounds + 1);

      if (game.game) {
        //  If a game is on
        const drawer = game.getUser(game.drawerId);
        if (game.word !== "") {
          socket.emit(SOCKET_EVENTS.GUESS, {
            message: `${drawer.username} is drawing now!`,
            color: "purple",
          });
          socket.emit(SOCKET_EVENTS.DRAWING, { drawing: game.drawing });
          socket.emit(SOCKET_EVENTS.DRAWER, {
            id: game.drawerId,
            newWord: game.word,
          });
        } else {
          socket.emit(SOCKET_EVENTS.GUESS, {
            message: `${drawer.username} is choosing a word now!`,
            color: "brown",
          });
        }
      } else {
        // If game is not on
        changeTurn(0);
      }
    } else {
      io.emit(SOCKET_EVENTS.WAIT, true);
      game.game = false;
    }
  });

  //  Drawing
  socket.on(SOCKET_EVENTS.CLEAR, () => {
    socket.broadcast.emit(SOCKET_EVENTS.CLEAR);
    game.resetDrawing();
  });
  socket.on(SOCKET_EVENTS.DRAW_DATA, ({ x1, y1, x2, y2, color }) => {
    socket.broadcast.emit(SOCKET_EVENTS.DRAW_DATA, { x1, y1, x2, y2, color });
    game.addDrawData({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
  });

  //  When drawer chooses a word
  socket.on(SOCKET_EVENTS.CHOOSE_WORD, (word) => {
    game.word = word;

    const drawer = game.getUser(game.drawerId);

    io.emit(SOCKET_EVENTS.DRAWER, { id: game.drawerId, newWord: word });
    io.emit(SOCKET_EVENTS.GUESS, {
      message: `${drawer.username} is drawing now!`,
      color: "purple",
    });

    runTimer();
  });

  //  User makes a guess
  socket.on(SOCKET_EVENTS.GUESS, (guess) => {
    const user = game.getUser(socket.id);

    if (socket.id !== game.drawerId) {
      const index = game.guessedUsers.findIndex((u) => u.id === socket.id);

      //  Already guessed the word
      if (index != -1) {
        io.emit(SOCKET_EVENTS.GUESS, {
          sender: user.username,
          message: guess,
          color: "green",
        });
        return;
      }

      //  Guessed the word
      if (guess.toLowerCase() === game.word.toLowerCase()) {
        const { error } = game.addGuessedUser(user);
        if (error) {
          io.emit(SOCKET_EVENTS.GUESS, {
            sender: user.username,
            message: guess,
            color: "green",
          });
        } else {
          game.updateScore(user.id, user.score + 100);
          io.emit(SOCKET_EVENTS.GUESS, {
            message: `${user.username} guessed the word.`,
            color: "green",
          });
          io.emit(SOCKET_EVENTS.UPDATE_SCORE, user);

          //  If all have guessed
          if (game.guessedUsers.length === game.users.length - 1) {
            clearInterval(interval);
            io.emit(SOCKET_EVENTS.END, game.guessedUsers);
            io.emit(SOCKET_EVENTS.GUESS, {
              message: `The word was ${game.word}`,
              color: "green",
            });
            game.game = false;
            game.word = "";
            game.resetGuessedUsers();
            game.resetDrawing();

            checkRounds();
          }
        }
      } else {
        if (guess.length === game.word.length) {
          let misMatch = 0;
          for (let i = 0; i < game.word.length; i++) {
            if (guess[i].toLowerCase() !== game.word[i].toLowerCase()) {
              misMatch += 1;
            }
          }
          if (misMatch === 1) {
            socket.broadcast.emit(SOCKET_EVENTS.GUESS, {
              sender: user.username,
              message: guess,
              color: "black",
            });
            socket.emit(SOCKET_EVENTS.GUESS, {
              sender: user.username,
              message: guess,
              color: "black",
            });
            socket.emit(SOCKET_EVENTS.GUESS, {
              message: `${guess} is close`,
              color: "green",
            });
          } else {
            io.emit(SOCKET_EVENTS.GUESS, {
              sender: user.username,
              message: guess,
              color: "black",
            });
          }
        } else {
          io.emit(SOCKET_EVENTS.GUESS, {
            sender: user.username,
            message: guess,
            color: "black",
          });
        }
      }
    } else {
      io.emit(SOCKET_EVENTS.GUESS, {
        sender: user.username,
        message: guess,
        color: "black",
      });
    }
  });

  //  On user disconnect
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    const user = game.getUser(socket.id);
    if (user) {
      socket.broadcast.emit(SOCKET_EVENTS.REMOVE_USER, user);
      io.emit(SOCKET_EVENTS.GUESS, {
        message: `${user.username} left.`,
        color: "red",
      });
      const allUsers = game.getAllUsers();
      if (allUsers.length <= 2) {
        io.emit(SOCKET_EVENTS.WAIT, true);
        game.rounds = 0;
        game.game = false;
        game.reset();
        game.word = "";
        clearInterval(interval);
        game.resetGuessedUsers();
        io.emit(SOCKET_EVENTS.RESET);
        io.emit(SOCKET_EVENTS.CLEAR);
      } else if (user.id === game.drawerId) {
        io.emit(SOCKET_EVENTS.CLEAR);
        game.removeDrawnUser(user.id);
        clearInterval(interval);

        if (game.word !== "") {
          io.emit(SOCKET_EVENTS.GUESS, {
            message: `The word was ${game.word}!`,
            color: "green",
          });
        }

        checkRounds();

        if (game.endgame === false) {
          io.emit(SOCKET_EVENTS.END, game.guessedUsers);
          game.word = "";
          game.game = false;
          game.resetGuessedUsers();
        }
      }
      game.removeUser(socket.id);
      game.resetDrawing();

      //  Check if all have guessed
      if (
        game.users.length >= 2 &&
        game.guessedUsers.length === game.users.length - 1
      ) {
        clearInterval(interval);

        if (game.endgame === false) {
          io.emit(SOCKET_EVENTS.END, game.guessedUsers);
          game.game = false;
          io.emit(SOCKET_EVENTS.GUESS, {
            message: `The word was ${game.word}`,
            color: "green",
          });
          game.word = "";
          game.resetGuessedUsers();

          checkRounds();
        }
      }
    }
  });
});
