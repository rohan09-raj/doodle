import Users from "../../components/Users/Users";
import Canvas from "../../components/Canvas/Canvas";
import History from "../../components/History/History";

import styles from "./PlayArea.module.css";

const PlayArea = () => {
  return (
    <div className={styles.area}>
      <Users />
      <Canvas />
      <History />
    </div>
  );
};

export default PlayArea;
