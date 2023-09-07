import { useState } from "react";

export function InputField(props) {
  const [isRange, setIsRange] = useState(false);

  const checkForRange = (e) => {
    if (e.target.value.includes("~")) {
      setIsRange(true);
    } else {
      if (isRange == true) {
        setIsRange(false);
      }
    }
  };
  return (
    <div className="input-field">
      <div className="field-container">
        <input
          name={`fieldVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Part numbering value"
          onChange={checkForRange}
        ></input>
        <input
          name={`descVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Description"
        ></input>
      </div>
      {isRange && (
        <select name="unit">
          <option>100</option>
          <option>10</option>
          <option>1</option>
          <option>0.1</option>
          <option>0.01</option>
          <option>0.001</option>
        </select>
      )}
    </div>
  );
}
