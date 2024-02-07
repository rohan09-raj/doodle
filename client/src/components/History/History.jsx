import useWebSocket from "react-use-websocket";

import event from "../../utils/event.js";
import { WS_URL } from "../../constants/constants.js";

import styles from "./History.module.css";

const History = () => {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: event.isUserEvent,
  });
  const activities = lastJsonMessage?.data.userActivity || [];
  return (
    <div className={styles.history}>
      {activities.map((activity, index) => (
        <div key={`activity-${index}`} className={styles.history__item}>
          <p>{activity}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
