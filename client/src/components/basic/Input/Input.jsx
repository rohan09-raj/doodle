import styles from "./Input.module.css";

/* eslint-disable react/prop-types */
const Input = ({ value, placeholder, onInput, onKeyUp }) => {
  return (
    <input
      value={value}
      className={styles.input}
      type="text"
      onInput={(event) => onInput(event)}
      placeholder={placeholder}
      onKeyUp={(event) => {
        event.key === "Enter" && onKeyUp(event);
      }}
    />
  );
};

export default Input;
