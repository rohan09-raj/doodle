import PropTypes from "prop-types";
import Card from "../basic/Card/Card";

const FinalScoreCard = ({ finalScores }) => {
  return (
    <Card>
      {finalScores.map((u, index) => {
        return (
          <div key={index}>
            <h3> # {index + 1} </h3>
            <h3> {u.username} </h3>
            <h3> {u.score} </h3>
          </div>
        );
      })}
    </Card>
  );
};

FinalScoreCard.propTypes = {
  finalScores: PropTypes.array,
};

export default FinalScoreCard;
