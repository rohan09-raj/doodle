import styles from "./Input.module.css";

/* eslint-disable react/prop-types */
const Input = ({onInput}) => {
  return (
    <input className={styles.input} type="text" onInput={(event) => onInput(event)} placeholder="Enter your name" />
  )
}

export default Input