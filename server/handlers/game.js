class Game {
  constructor(words) {
    this.game = false;
    this.endgame = false;

    //  Users
    this.users = [];
    this.guessedUsers = [];
    this.drawnUsers = [];

    //  Drawing
    this.drawerIndex = -1;
    this.drawerId = "";
    this.words = Object.keys(words);
    this.word = "";
    this.drawing = [];

    //  Rounds
    this.rounds = 0;
    this.totalRounds = 3;
  }
}

// ****************************************************
// User methods
// ***************************************************

Game.prototype.addUser = function (id, username) {
  const exists = this.users.find((user) => user.username === username);
  if (exists) {
    return { error: "Username unavailable!" };
  }
  const user = {
    id,
    username,
    score: 0,
  };
  this.users.push(user);
  return { user };
};

Game.prototype.getUser = function (userId) {
  return this.users.find((el) => el.id === userId);
};

Game.prototype.getAllUsers = function () {
  return this.users; // Return all the users in the room
};

Game.prototype.removeUser = function (id) {
  var index = this.users.findIndex((el) => el.id === id);
  this.removeDrawnUser(id);
  this.removeGuessedUser(id);

  if (index !== -1) {
    this.users.splice(index, 1);
  }
};

Game.prototype.updateScore = function (userId, score) {
  const index = this.users.findIndex((el) => el.id === userId);

  if (index !== -1) {
    this.users[index].score = score;
  }
};

Game.prototype.resetScores = function () {
  this.users = this.users.map((user) => {
    return {
      ...user,
      score: 0,
    };
  });
};

// ****************************************************
// Guessed User methods
// ****************************************************

Game.prototype.addGuessedUser = function (user) {
  const exists = this.guessedUsers.find((id) => id === user.id);
  if (exists) {
    return { error: "Already guessed!" };
  }
  this.guessedUsers.push(user.id);
  return { id: user.id };
};
//  Reset guesses user list
Game.prototype.resetGuessedUsers = function () {
  this.guessedUsers.splice(0, this.guessedUsers.length);
};

Game.prototype.removeGuessedUser = function (id) {
  var index = this.guessedUsers.findIndex((el) => el === id);
  if (index != -1) {
    this.guessedUsers.splice(index, 1);
  }
};

// ****************************************************
// Drawn User methods
// ****************************************************

Game.prototype.addDrawnUser = function (user) {
  const exists = this.drawnUsers.find((id) => id === user.id);
  if (exists) {
    return { error: "Already guessed!" };
  }
  this.drawnUsers.push(user.id);
  return { id: user.id };
};

Game.prototype.resetDrawnUsers = function () {
  this.drawnUsers.splice(0, this.drawnUsers.length);
};

Game.prototype.removeDrawnUser = function (id) {
  var index = this.users.findIndex((el) => el === id);
  if (index != -1) {
    this.drawnUsers.splice(index, 1);
  }
};

// ****************************************************
// Game methods
// ****************************************************

Game.prototype.reset = function () {
  this.resetScores();
  this.resetGuessedUsers();
  this.resetDrawnUsers();
  this.resetDrawing();
  this.drawerIndex = -1;
};

Game.prototype.start = function () {
  this.game = true;
  this.chooseDrawer();
  return {
    drawer: this.getUser(this.drawerId),
    words: this.chooseWordIndices(),
  };
};

Game.prototype.chooseWordIndices = function () {
  let words = [];
  for (let i = 0; i < 3; i++) {
    let index = Math.floor(Math.random() * this.words.length);
    while (1) {
      if (words.findIndex((e) => e === index) !== -1) {
        index = Math.floor(Math.random() * this.words.length);
      } else {
        break;
      }
    }
    words.push(this.words[index]);
  }
  return words;
};

Game.prototype.chooseWord = function () {
  this.word = this.words[Math.floor(Math.random() * this.words.length)];
};

Game.prototype.chooseDrawer = function () {
  this.drawerIndex =
    this.drawerIndex >= this.users.length - 1 ? 0 : this.drawerIndex + 1;
  this.drawerId = this.users[this.drawerIndex].id;
};

Game.prototype.addDrawData = function (initial, final, color) {
  this.drawing.push({
    initial,
    final,
    color,
  });
};

Game.prototype.resetDrawing = function () {
  this.drawing = [];
};

export default Game;
