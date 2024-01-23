/* eslint-disable react/prop-types */
const Input = ({onInput}) => {
  return (
    <input type="text" onInput={(event) => onInput(event)} />
  )
}

export default Input