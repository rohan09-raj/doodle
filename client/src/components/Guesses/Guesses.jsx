import { useState, useEffect, useRef, useContext } from "react";
import Input from "../basic/Input/Input";
import { GuessListContext } from "../../context/GuessListContext";
import styles from "./Guesses.module.css";

const Guesses = ({ socketRef }) => {
  const [guess, setGuess] = useState("");
  const [guessList, setGuessList] = useContext(GuessListContext);
  const guessListRef = useRef(null);

  useEffect(() => {
    if (guessListRef.current) {
      guessListRef.current.scrollTop = guessListRef.current.scrollHeight;
    }
  }, [guessList]);

  return (
    <div className={styles.guesses}>
      {guessList.map((activity, index) => (
        <div key={`activity-${index}`} className={styles.guess__item}>
          <p>{activity}</p>
        </div>
      ))}

      <Input onInput={(event) => setGuess(event.target.value)} />
    </div>
  );
};

export default Guesses;
