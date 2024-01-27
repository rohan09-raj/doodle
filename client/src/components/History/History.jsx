import useWebSocket from "react-use-websocket";

import event from "../../utils/event.js";
import { WS_URL } from "../../constants/constants.js";

const History = () => {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: event.isUserEvent,
  });
  const activities = lastJsonMessage?.data.userActivity || [];
  return (
    <ul>
      {activities.map((activity, index) => (
        <li key={`activity-${index}`}>{activity}</li>
      ))}
    </ul>
  );
};

export default History;
