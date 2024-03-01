import PropTypes from "prop-types";
import { MdModeEdit } from "react-icons/md";
import styles from "./Users.module.css";

const Users = ({ users, user, drawerId }) => {
  const selfUser = user[0];
  const getPlayerName = (username) => {
    console.log(selfUser.username, username, selfUser.username === username)
    return username + (selfUser.username === username ? " (You)" : "");
  };

  return (
    <div className={styles.users}>
      {users.map((user, index) => (
        <div className={styles.users__item} key={index}>
          <p>{getPlayerName(user.username)}</p>
          {user.id === drawerId && <MdModeEdit size={20} />}
        </div>
      ))}
    </div>
  );
};

Users.propTypes = {
  users: PropTypes.array,
  user: PropTypes.array,
  drawerId: PropTypes.string,
};

export default Users;
