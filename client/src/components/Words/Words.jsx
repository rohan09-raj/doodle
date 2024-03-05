import PropTypes from "prop-types";
import Card from "../basic/Card/Card";
import Button from "../basic/Button/Button";

import styles from "./Words.module.css";

const Words = ({ words, handleWordSubmit }) => {
  return (
    <Card>
      <h2 className={styles.words__heading}>Choose a word !</h2>
      <div className={styles.words__options}>
        {words.map((word, index) => (
          <span key={index} className={styles.words__option}>
            <Button text={word} onClick={() => handleWordSubmit(word)} />
          </span>
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
