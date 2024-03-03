import PropTypes from "prop-types";
import { MdModeEdit } from "react-icons/md";
import styles from "./Users.module.css";

const Users = ({ users, user, drawerId }) => {
  const getPlayerName = (username) => {
    return username + (user.username === username ? " (You)" : "");
  };

  return (
    <div className={styles.users}>
      {users.map((u, index) => (
        <div className={styles.users__item} key={index}>
          <p>{getPlayerName(u.username)}</p>
          {u.id === drawerId && <MdModeEdit size={20} />}
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
