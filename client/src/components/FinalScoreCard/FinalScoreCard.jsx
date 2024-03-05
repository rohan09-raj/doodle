import PropTypes from "prop-types";
import Card from "../basic/Card/Card";

import styles from "./FinalScoreCard.module.css";

const FinalScoreCard = ({ finalScores }) => {
  return (
    <Card>
      <h2 className={styles.board__heading}> Final Scores </h2>
      {finalScores.map((u, index) => {
        return (
          <p key={index} className={styles.score}>
            <span> # {index + 1} </span>
            <span className={styles.score__username}> {u.username} </span>
            <span> {u.score} </span>
          </p>
        );
      })}
    </Card>
  );
};

FinalScoreCard.propTypes = {
  finalScores: PropTypes.array,
};

export default FinalScoreCard;
