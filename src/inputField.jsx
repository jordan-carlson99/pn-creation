export function InputField(props) {
  return (
    <>
      <input
        name={`field ${props.col}-${props.fieldName}`}
        type="text"
        placeholder="Part numbering value"
      ></input>
      <input
        name={`desc ${props.col}-${props.fieldName}`}
        type="text"
        placeholder="Description"
      ></input>
    </>
  );
}
