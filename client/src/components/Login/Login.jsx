/* eslint-disable react/prop-types */
import { useState } from "react";
import useWebSocket from "react-use-websocket";

import Card from "../basic/Card/Card";
import Input from "../basic/Input/Input";
import Button from "../basic/Button/Button";

import { WS_URL } from "../../constants/constants";

const Login = ({onPlay}) => {
  const[username, setUsername] = useState("");

  useWebSocket(WS_URL, {
    share: true,
    filter: () => false,
  })

  const onHandlePlay = () => {
    if (!username.trim()) return;
    onPlay && onPlay(username);
  }

  return (
    <Card>
      <Input onInput={(event) => setUsername(event.target.value)} />
      <Button onClick={() => onHandlePlay()} text="Play" />
      <Button text="Create a private room" />
    </Card>
  );
};

export default Login;
