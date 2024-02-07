import styles from "./Button.module.css";

/* eslint-disable react/prop-types */
const Button = ({text, onClick}) => {
  return <button className={styles.button} onClick={() => onClick()}>{text}</button>;
};

export default Button;
