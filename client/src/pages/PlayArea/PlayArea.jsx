import PropTypes from "prop-types";
import Users from "../../components/Users/Users";
import Canvas from "../../components/Canvas/Canvas";
import History from "../../components/History/History";

import styles from "./PlayArea.module.css";
import { useEffect } from "react";
import { SOCKET_EVENTS } from "../../constants/constants";
import Card from "../../components/basic/Card/Card";

const PlayArea = ({ socketRef, wait, setWait }) => {
  useEffect(() => {
    socketRef.current.on(SOCKET_EVENTS.WAIT, (value) => {
      setWait(value);
    });
  }, []);

  return wait ? (
    <Card>
      <h2>Waiting for players to join...</h2>
    </Card>
  ) : (
    <div className={styles.area}>
      <Users />
      <Canvas />
      <History />
    </div>
  );
};

PlayArea.propTypes = {
  socketRef: PropTypes.object,
  setWait: PropTypes.func,
  wait: PropTypes.bool,
};

export default PlayArea;
