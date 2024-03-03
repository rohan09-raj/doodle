import PropTypes from "prop-types";
import Users from "../../components/Users/Users";
import Canvas from "../../components/Canvas/Canvas";
import Guesses from "../../components/Guesses/Guesses";
import { getUnknownWord } from "../../utils/game";
import styles from "./PlayArea.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { SOCKET_EVENTS, COLORS } from "../../constants/constants";
import Card from "../../components/basic/Card/Card";
import { UserContext } from "../../context/UserContext";
import { UsersContext } from "../../context/UsersContext";
import { GuessListContext } from "../../context/GuessListContext";
import Words from "../../components/Words/Words";
import ScoreBoard from "../../components/ScoreBoard/ScoreBoard";
import FinalScoreCard from "../../components/FinalScoreCard/FinalScoreCard";
import {
  clearCanvas,
  drawBackground,
  drawLine,
  eraseCanvas,
} from "../../components/Canvas/handlers/handlers";
import IconButton from "../../components/basic/IconButton/IconButton";
import { MdModeEdit } from "react-icons/md";
import { BsEraserFill } from "react-icons/bs";

const PlayArea = ({ socketRef, wait, setWait }) => {
  const [users, setUsers] = useContext(UsersContext);
  const [user, setUser] = useContext(UserContext);
  const [finalScores, setFinalScores] = useState([]);
  const [scoredUsers, setScoredUsers] = useState([]);
  const [canvasStatus, setCanvasStatus] = useState("canvas");
  const [drawerId, setDrawerId] = useState("");
  const [drawing, setDrawing] = useState([]);
  const [words, setWords] = useState([]);
  const [word, setWord] = useState("_");
  const [time, setTime] = useState("-");
  const [rounds, setRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [editOption, setEditOption] = useState("edit");
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState(COLORS[0]);
  const canvasParent = useRef(null);
  const [guessList, setGuessList] = useContext(GuessListContext);

  useEffect(() => {
    socketRef.current.emit("joined", user.username);

    //  When a user joins
    socketRef.current.on("addUser", (u) => {
      setUsers((prev) => {
        return [...prev, u];
      });
    });

    //  Wait
    socketRef.current.on("wait", (val) => {
      setWait(val);
    });

    //  Update the score
    socketRef.current.on("updateScore", (u) => {
      setUsers((prev) => {
        return prev.map((el) => (el.id === u.id ? u : el));
      });
    });

    //  A guess is made
    socketRef.current.on("guess", (g) => {
      setGuessList((prev) => [...prev, g]);
    });

    //  Choose a word
    socketRef.current.on("chooseWord", (words) => {
      setWords(words);
      setCanvasStatus("words");
      setFinalScores([]);
    });

    //  On drawing
    socketRef.current.on("drawing", ({ drawing }) => {
      setDrawing(drawing);
    });

    //  Timer
    socketRef.current.on("timer", (counter) => {
      setTime(counter);
    });
    socketRef.current.on("end", (scoredUsers) => {
      setCanvasStatus("end");
      // setTurnEnd(true)
      setScoredUsers(scoredUsers);
      setDrawing([]);
      setTime("-");
    });

    //  Rounds
    socketRef.current.on("total-rounds", (totalRounds) => {
      setTotalRounds(totalRounds);
    });
    socketRef.current.on("rounds", (round) => {
      setRounds(round);
    });
    socketRef.current.on("endgame", (allUsers) => {
      setFinalScores(
        allUsers.sort((a, b) => {
          return a.score >= b.score ? -1 : 1;
        })
      );
      setCanvasStatus("endgame");
    });

    //  Reset scores
    socketRef.current.on("reset", () => {
      //  Set scores to zero
      setUsers((prev) => {
        return prev.map((el) => {
          return {
            ...el,
            score: 0,
          };
        });
      });

      setTime("-");

      //  Set the guess list empty
      setGuessList([]);
    });

    //  Drawer index
    socketRef.current.on("drawer", ({ id, newWord }) => {
      setDrawerId(id);
      setWord(newWord);
      setScoredUsers([]);
      setCanvasStatus("canvas");
      // setTurnEnd(false)
    });

    //  When a user leaves
    socketRef.current.on("removeUser", (u) => {
      setUsers((prev) => {
        return prev.filter((el) => el.id !== u.id);
      });
    });
  }, []);

  //  Options handler
  const handleClear = () => {
    if (socketRef.current.id === drawerId) {
      clearCanvas(canvas.getContext("2d"), canvas);
      setDrawing([]);
      socketRef.current.emit("clear");
    }
  };

  const handleWordSubmit = (w) => {
    socketRef.current.emit("chooseWord", w);
    setWords([]);
  };

  const handleEditOption = () => {
    setEditOption("edit");
  };

  const handleEraseOption = () => {
    setEditOption("erase");
  };

  const handleColorChange = (e) => {
    setColor(e);
  };

  const options = [
    {
      name: "edit",
      handler: handleEditOption,
    },
    {
      name: "erase",
      handler: handleEraseOption,
    },
    {
      name: "clear",
      handler: handleClear,
    },
  ];

  //  Render functions
  const renderOptions = () => {
    return (
      <div className={styles.canvas__controls}>
        <IconButton
          isSelected={editOption === "edit"}
          icon={<MdModeEdit size={20} />}
          onClick={options[0].handler}
        />

        <IconButton
          isSelected={editOption === "erase"}
          icon={<MdModeEdit size={20} />}
          onClick={options[1].handler}
        />

        <IconButton
          icon={<BsEraserFill size={20} />}
          onClick={options[2].handler}
        />
      </div>
    );
  };

  const renderScoreBoard = () => {
    return <ScoreBoard word={word} users={users} scoredUsers={scoredUsers} />;
  };

  const renderCanvas = () => {
    return (
      <Canvas
        canvasParent={canvasParent}
        socketRef={socketRef}
        drawing={drawing}
        setDrawing={setDrawing}
        drawerId={drawerId}
        drawBackground={drawBackground}
        drawLine={drawLine}
        clearCanvas={clearCanvas}
        eraseCanvas={eraseCanvas}
        setCanvas={setCanvas}
        editOption={editOption}
        color={color}
        time={time}
      />
    );
  };

  const renderWordOptions = () => {
    return <Words words={words} handleWordSubmit={handleWordSubmit} />;
  };

  const renderFinalScores = () => {
    return <FinalScoreCard finalScores={finalScores} />;
  };

  const renderCanvasStatus = () => {
    switch (canvasStatus) {
      case "words":
        return renderWordOptions();
      case "canvas":
        return renderCanvas();
      case "end":
        return renderScoreBoard();
      case "endgame":
        return renderFinalScores();
      default:
        break;
    }
  };

  return wait ? (
    <Card>
      <h2>Waiting for players to join...</h2>
    </Card>
  ) : (
    <div className={styles.area}>
      <div className={styles.game}>
        <h1 className="timer">{`${time} seconds left`}</h1>
        <h1 className="rounds">{`${rounds} / ${totalRounds}`}</h1>
        <h1 className="word">
          {socketRef.current.id === drawerId ? word : getUnknownWord(word)}
        </h1>
      </div>
      <div className={styles.canvas__area}>
        <Users users={users} user={user} drawerId={drawerId} />

        <div ref={canvasParent} className="canvas-container">
          {renderCanvasStatus()}
        </div>

        <Guesses socketRef={socketRef} />
      </div>
      {renderOptions()}
    </div>
  );
};

PlayArea.propTypes = {
  socketRef: PropTypes.object,
  setWait: PropTypes.func,
  wait: PropTypes.bool,
};

export default PlayArea;
