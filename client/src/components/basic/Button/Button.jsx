/* eslint-disable react/prop-types */
const Button = ({text, onClick}) => {
  return <button onClick={() => onClick()}>{text}</button>;
};

export default Button;
