/* eslint-disable react/prop-types */
import styles from "./IconButton.module.css";

const IconButton = ({ icon, isSelected, onClick }) => {
  return <button className={`${styles.icbutton} ${isSelected ? styles.selected : ""}`} onClick={() => onClick()}>{icon}</button>;
};

export default IconButton;
