import useWebSocket from "react-use-websocket";

import event from "../../utils/event.js";

import { WS_URL } from "../../constants/constants.js";

const Users = () => {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: event.isUserEvent,
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  return users.map((user) => (
    <div key={user.username}>
      <p>{user.username}</p>
    </div>
  ));
};

export default Users;
