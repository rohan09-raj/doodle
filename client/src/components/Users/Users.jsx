import useWebSocket from "react-use-websocket";

import event from "../../utils/event.js";
import { WS_URL } from "../../constants/constants.js";

import styles from "./Users.module.css";

const Users = () => {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: event.isUserEvent,
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  return (
    <div className={styles.users}>
      {users.map((user) => (
        <div className={styles.users__item} key={user.username}>
          <p>{user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
