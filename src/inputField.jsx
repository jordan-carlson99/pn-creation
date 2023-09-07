export function InputField(props) {
  return (
    <div className="input-field">
      <div className="field-container">
        <input
          name={`fieldVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Part numbering value"
        ></input>
        <input
          name={`descVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Description"
        ></input>
      </div>
    </div>
  );
}
