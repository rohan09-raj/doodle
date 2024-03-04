import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import { WS_URL } from "../../constants/constants";
import Login from "../../components/Login/Login";
import PlayArea from "../PlayArea/PlayArea";
import { GuessListProvider } from "../../context/GuessListContext";

import styles from "./Home.module.css";

const Home = () => {
  const [game, setGame] = useState(false);
  const [wait, setWait] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(WS_URL, { transports: ["websocket"] });
  }, []);

  return (
    <GuessListProvider>
      <div className={styles.home}>
        <h1 className={styles.home__heading}>Doodle</h1>
        {game ? (
          <PlayArea socketRef={socketRef} wait={wait} setWait={setWait} />
        ) : (
          <Login socketRef={socketRef} setGame={setGame} />
        )}
      </div>
    </GuessListProvider>
  );
};

export default Home;
