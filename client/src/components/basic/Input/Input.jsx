import styles from "./Input.module.css";

/* eslint-disable react/prop-types */
const Input = ({ placeholder, onInput }) => {
  return (
    <input
      className={styles.input}
      type="text"
      onInput={(event) => onInput(event)}
      placeholder={placeholder}
    />
  );
};

export default Input;
