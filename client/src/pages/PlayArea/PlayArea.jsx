import PropTypes from "prop-types";
import Users from "../../components/Users/Users";
import Canvas from "../../components/Canvas/Canvas";
import Guesses from "../../components/Guesses/Guesses";
import { getUnknownWord } from "../../utils/game";
import styles from "./PlayArea.module.css";
import { useContext, useEffect, useState } from "react";
import { SOCKET_EVENTS, COLORS } from "../../constants/constants";
import Card from "../../components/basic/Card/Card";
import { UserContext } from "../../context/UserContext";
import { UsersContext } from "../../context/UsersContext";
import { GuessListContext } from "../../context/GuessListContext";
import Words from "../../components/Words/Words";
import ScoreBoard from "../../components/ScoreBoard/ScoreBoard";
import FinalScoreCard from "../../components/FinalScoreCard/FinalScoreCard";

const PlayArea = ({ socketRef, wait, setWait }) => {
  const user = useContext(UserContext);
  const [users, setUsers] = useContext(UsersContext);
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
  const [color, setColor] = useState(COLORS[0]);
  const [guessList, setGuessList] = useContext(GuessListContext);

  useEffect(() => {
    socketRef.current.on(SOCKET_EVENTS.WAIT, (value) => {
      setWait(value);
    });

    socketRef.current.emit(SOCKET_EVENTS.JOINED, user.username);

    socketRef.current.on(SOCKET_EVENTS.ADD_USER, (user) => {
      setUsers((prev) => {
        return [...prev, user];
      });
    });

    socketRef.current.on(SOCKET_EVENTS.DRAWER, ({ id, newWord }) => {
      setDrawerId(id);
      setWord(newWord);
      setScoredUsers([]);
      setCanvasStatus("canvas");
    });

    socketRef.current.on(SOCKET_EVENTS.CHOOSE_WORD, (words) => {
      setWords(words);
      setCanvasStatus("words");
      setFinalScores([]);
    });

    socketRef.current.on(SOCKET_EVENTS.DRAWING, ({ drawing }) => {
      setDrawing(drawing);
    });

    socketRef.current.on(SOCKET_EVENTS.UPDATE_SCORE, (u) => {
      setUsers((prev) => {
        return prev.map((el) => (el.id === u.id ? u : el));
      });
    });

    socketRef.current.on(SOCKET_EVENTS.TIMER, (counter) => {
      setTime(counter);
    });

    socketRef.current.on(SOCKET_EVENTS.TOTAL_ROUNDS, (totalRounds) => {
      setTotalRounds(totalRounds);
    });

    socketRef.current.on(SOCKET_EVENTS.ROUNDS, (round) => {
      setRounds(round);
    });

    socketRef.current.on(SOCKET_EVENTS.GUESS, (guess) => {
      setGuessList((prev) => [...prev, guess]);
    });

    socketRef.current.on(SOCKET_EVENTS.END_GAME, (allUsers) => {
      setFinalScores(
        allUsers.sort((a, b) => {
          return a.score >= b.score ? -1 : 1;
        })
      );
      setCanvasStatus("endgame");
    });

    socketRef.current.on(SOCKET_EVENTS.END, (scoredUsers) => {
      setCanvasStatus("end");
      setScoredUsers(scoredUsers);
      setDrawing([]);
      setTime("-");
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

    socketRef.current.on(SOCKET_EVENTS.REMOVE_USER, (u) => {
      setUsers((prev) => {
        return prev.filter((el) => el.id !== u.id);
      });
    });
  }, []);

  const handleWordSubmit = (w) => {
    socketRef.current.emit(SOCKET_EVENTS.CHOOSE_WORD, w);
    setWords([]);
  };

  const CanvasStatus = () => {
    switch (canvasStatus) {
      case "words":
        return <Words words={words} handleWordSubmit={handleWordSubmit} />;
      case "canvas":
        return (
          <Canvas
            socketRef={socketRef}
            drawerId={drawerId}
            drawing={drawing}
            setDrawing={setDrawing}
            editOption={editOption}
            setEditOption={setEditOption}
            color={color}
          />
        );
      case "end":
        return (
          <ScoreBoard word={word} users={users} scoredUsers={scoredUsers} />
        );
      case "endgame":
        return <FinalScoreCard finalScores={finalScores} />;
      default:
        break;
    }
  };

  return wait ? (
    <Card>
      <h2>Waiting for players to join...</h2>
    </Card>
  ) : (
    <div>
      <div className={styles.game}>
        <h1 className="timer">{`${time} seconds left`}</h1>
        <h1 className="rounds">{`${rounds} / ${totalRounds}`}</h1>
        <h1 className="word">
          {socketRef.current.id === drawerId ? word : getUnknownWord(word)}
        </h1>
      </div>
      <div className={styles.area}>
        <Users users={users} user={user} drawerId={drawerId} />
        <CanvasStatus />
        <Guesses socketRef={socketRef} />
      </div>
    </div>
  );
};

PlayArea.propTypes = {
  socketRef: PropTypes.object,
  setWait: PropTypes.func,
  wait: PropTypes.bool,
};

export default PlayArea;
