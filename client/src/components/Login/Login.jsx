/* eslint-disable react/prop-types */
import { useContext, useState } from "react";

import Card from "../basic/Card/Card";
import Input from "../basic/Input/Input";
import Button from "../basic/Button/Button";

import { SOCKET_EVENTS } from "../../constants/constants";
import { UserContext } from "../../context/UserContext";
import { UsersContext } from "../../context/UsersContext";

const Login = ({ socketRef, setGame }) => {
  const [user, setUser] = useContext(UserContext);
  const [users, setUsers] = useContext(UsersContext);
  const [error, setError] = useState("");

  const onHandlePlay = () => {
    if (!user.username.trim()) {
      setError("Please enter your name!");
      return;
    }

    socketRef.current.emit(SOCKET_EVENTS.JOIN, user, (result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setError("");
        setGame(true);
        setUsers(result.allUsers);
      }
    });
  };

  return (
    <Card>
      <Input
        placeholder="Enter your name"
        onInput={(event) =>
          setUser((prev) => {
            return { ...prev, username: event.target.value };
          })
        }
      />
      {error && <p>{error}</p>}
      <Button onClick={() => onHandlePlay()} text="Play" />
    </Card>
  );
};

export default Login;
