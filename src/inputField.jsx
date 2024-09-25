import { useState } from "react";

export function InputField(props) {
  const [isRange, setIsRange] = useState(false);

  const checkForRangeAndSetExample = (e) => {
    props.setExample(e.target.value);
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
          onChange={checkForRangeAndSetExample}
        ></input>
        <input
          name={`descVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Description"
        ></input>
      </div>
      {isRange && (
        <>
          <input type="text" placeholder="Delimeter" name="rangeDelim"></input>
          <label>
            EIA Value
            <select name="eiaValue" placeholder="EIA Value">
              <option>N/A</option>
              <option>E6</option>
              <option>E12</option>
              <option>E24</option>
              <option>E48</option>
              <option>E96</option>
              <option>E192</option>
            </select>
          </label>
          <label>
            Unit Size
            <select name="unit">
              <option>100</option>
              <option>10</option>
              <option>5</option>
              <option>1</option>
              <option>0.1</option>
              <option>0.01</option>
              <option>0.001</option>
            </select>
          </label>
        </>
      )}
    </div>
  );
}
