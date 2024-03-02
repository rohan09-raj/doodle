import PropTypes from "prop-types";
import Card from "../basic/Card/Card";
import Button from "../basic/Button/Button";

const Words = ({ words, handleWordSubmit }) => {
  return (
    <Card>
      <h3>Choose a word !</h3>
      <div className="word-options-container">
        {words.map((word, index) => (
          <Button
            key={index}
            text={word}
            onClick={() => handleWordSubmit(word)}
          />
        ))}
      </div>
    </Card>
  );
};

Words.propTypes = {
  words: PropTypes.array,
  handleWordSubmit: PropTypes.func,
};

export default Words;
