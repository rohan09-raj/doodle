import { useContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Users from "../../components/Users/Users";
import Words from "../../components/Words/Words";
import Card from "../../components/basic/Card/Card";
import Canvas from "../../components/Canvas/Canvas";
import Guesses from "../../components/Guesses/Guesses";
import ScoreBoard from "../../components/ScoreBoard/ScoreBoard";
import IconButton from "../../components/basic/IconButton/IconButton";
import FinalScoreCard from "../../components/FinalScoreCard/FinalScoreCard";
import { clearCanvas } from "../../components/Canvas/handlers/handlers";
import { UserContext } from "../../context/UserContext";
import { UsersContext } from "../../context/UsersContext";
import { GuessListContext } from "../../context/GuessListContext";
import { getUnknownWord } from "../../utils/game";
import { SOCKET_EVENTS, COLORS, CANVAS_STATUS } from "../../constants/constants";
import { MdModeEdit } from "react-icons/md";
import { BsEraserFill } from "react-icons/bs";

import styles from "./PlayArea.module.css";

const PlayArea = ({ socketRef, wait, setWait }) => {
  const [users, setUsers] = useContext(UsersContext);
  const [user, setUser] = useContext(UserContext);
  const [finalScores, setFinalScores] = useState([]);
  const [scoredUsers, setScoredUsers] = useState([]);
  const [canvasStatus, setCanvasStatus] = useState(CANVAS_STATUS.CANVAS);
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
    socketRef.current.emit(SOCKET_EVENTS.JOINED, user.username);

    socketRef.current.on(SOCKET_EVENTS.ADD_USER, (u) => {
      setUsers((prev) => {
        return [...prev, u];
      });
    });

    socketRef.current.on(SOCKET_EVENTS.WAIT, (val) => {
      setWait(val);
    });

    socketRef.current.on(SOCKET_EVENTS.UPDATE_SCORE, (u) => {
      setUsers((prev) => {
        return prev.map((el) => (el.id === u.id ? u : el));
      });
    });

    socketRef.current.on(SOCKET_EVENTS.GUESS, (g) => {
      setGuessList((prev) => [...prev, g]);
    });

    socketRef.current.on(SOCKET_EVENTS.CHOOSE_WORD, (words) => {
      setWords(words);
      setCanvasStatus(CANVAS_STATUS.WORDS);
      setFinalScores([]);
    });

    socketRef.current.on(SOCKET_EVENTS.DRAWING, ({ drawing }) => {
      setDrawing(drawing);
    });

    socketRef.current.on(SOCKET_EVENTS.TIMER, (counter) => {
      setTime(counter);
    });
    socketRef.current.on(SOCKET_EVENTS.END, (scoredUsers) => {
      setCanvasStatus(CANVAS_STATUS.END);
      setScoredUsers(scoredUsers);
      setDrawing([]);
      setTime("-");
    });

    socketRef.current.on(SOCKET_EVENTS.TOTAL_ROUNDS, (totalRounds) => {
      setTotalRounds(totalRounds);
    });

    socketRef.current.on(SOCKET_EVENTS.ROUNDS, (round) => {
      setRounds(round);
    });

    socketRef.current.on(SOCKET_EVENTS.END_GAME, (allUsers) => {
      setFinalScores(
        allUsers.sort((a, b) => {
          return a.score >= b.score ? -1 : 1;
        })
      );
      setCanvasStatus(CANVAS_STATUS.ENDGAME);
    });

    socketRef.current.on(SOCKET_EVENTS.RESET, () => {
      setUsers((prev) => {
        return prev.map((el) => {
          return {
            ...el,
            score: 0,
          };
        });
      });
      setTime("-");
      setGuessList([]);
    });

    socketRef.current.on(SOCKET_EVENTS.DRAWER, ({ id, newWord }) => {
      setDrawerId(id);
      setWord(newWord);
      setScoredUsers([]);
      setCanvasStatus(CANVAS_STATUS.CANVAS);
    });

    socketRef.current.on(SOCKET_EVENTS.REMOVE_USER, (u) => {
      setUsers((prev) => {
        return prev.filter((el) => el.id !== u.id);
      });
    });
  }, []);

  const handleClear = () => {
    if (socketRef.current.id === drawerId) {
      clearCanvas(canvas.getContext("2d"), canvas);
      setDrawing([]);
      socketRef.current.emit(SOCKET_EVENTS.CLEAR);
    }
  };

  const handleWordSubmit = (w) => {
    socketRef.current.emit(SOCKET_EVENTS.CHOOSE_WORD, w);
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
      case CANVAS_STATUS.WORDS:
        return renderWordOptions();
      case CANVAS_STATUS.CANVAS:
        return renderCanvas();
      case CANVAS_STATUS.END:
        return renderScoreBoard();
      case CANVAS_STATUS.ENDGAME:
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
