import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { WS_URL } from "../../constants/constants";
import Login from "../../components/Login/Login";
import PlayArea from "../PlayArea/PlayArea";

import styles from "./Home.module.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: "userevent",
      });
    }
  }, [username, sendJsonMessage, readyState]);

  return (
    <div className={styles.home}>
      <h1 className={styles.home__heading}>Doodle</h1>
      <div>{username ? <PlayArea /> : <Login onPlay={setUsername} />}</div>
    </div>
  );
};

export default Home;
