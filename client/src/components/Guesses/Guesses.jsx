import { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import Input from "../basic/Input/Input";
import { GuessListContext } from "../../context/GuessListContext";
import styles from "./Guesses.module.css";
import IconButton from "../basic/IconButton/IconButton";
import { BsFillSendFill } from "react-icons/bs";
import { SOCKET_EVENTS } from "../../constants/constants";

const Guesses = ({ socketRef }) => {
  const [guess, setGuess] = useState("");
  const [guessList] = useContext(GuessListContext);
  const guessListRef = useRef(null);

  useEffect(() => {
    if (guessListRef.current) {
      guessListRef.current.scrollTop = guessListRef.current.scrollHeight;
    }
  }, [guessList]);

  const handleGuessChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  };

  const handleGuessSubmit = () => {
    if (guess.length > 0 && guess.trim().length > 0) {
      socketRef.current.emit(SOCKET_EVENTS.GUESS, guess.trim());
      setGuess("");
    }
  };

  return (
    <div className={styles.guesses}>
      <div ref={guessListRef} className={styles.guesses__list}>
        {guessList.map((guess, index) => (
          <div key={`activity-${index}`} className={styles.guess__item}>
            <p
              style={{
                color: `${guess.color}`,
                margin: "0",
                padding: "10px",
                overflowWrap: "break-word",
                transition: "0.5s ease",
              }}
            >
              {guess.sender ? (
                <span
                  style={{
                    fontWeight: "800",
                  }}
                >
                  {guess.sender} :{" "}
                </span>
              ) : null}
              <span>{guess.message}</span>
            </p>
          </div>
        ))}
      </div>

      <div className={styles.guess__input}>
        <Input placeholder="Enter your guess" onInput={handleGuessChange} />
        <IconButton
          icon={<BsFillSendFill size={24} />}
          isSelected="true"
          onClick={handleGuessSubmit}
        />
      </div>
    </div>
  );
};

Guesses.propTypes = {
  socketRef: PropTypes.object,
};

export default Guesses;
