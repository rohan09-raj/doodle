import PropTypes from "prop-types";
import Card from "../basic/Card/Card";

import styles from "./ScoreBoard.module.css";

const ScoreBoard = ({ word, users, scoredUsers }) => {
  const renderScoreCard = (user, i) => {
    const index = scoredUsers.findIndex((u) => u === user.id);
    return (
      <p key={i} className={styles.score}>
        {user.username} -{" "}
        <span className={styles.score__number}> {index === -1 ? 0 : 100} </span>
      </p>
    );
  };

  return (
    <Card>
      <h2 className={styles.board__heading}> The word was : {word} </h2>
      {users.map((user, index) => renderScoreCard(user, index))}
    </Card>
  );
};

ScoreBoard.propTypes = {
  word: PropTypes.string,
  users: PropTypes.array,
  scoredUsers: PropTypes.array,
};

export default ScoreBoard;
