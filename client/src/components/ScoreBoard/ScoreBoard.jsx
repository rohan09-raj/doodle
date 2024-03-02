import PropTypes from "prop-types";
import Card from "../basic/Card/Card";

const ScoreBoard = ({ word, users, scoredUsers }) => {
  const renderScoreCard = (user, i) => {
    const index = scoredUsers.findIndex((u) => u === user.id);
    return (
      <div key={i}>
        <h5> {user.username} </h5>
        <h5 style={{ color: "green" }}> {index === -1 ? 0 : 100} </h5>
      </div>
    );
  };

  return (
    <Card>
      <h3> The word was : {word} </h3>
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
