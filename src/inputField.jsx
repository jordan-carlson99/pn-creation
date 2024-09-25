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
          {/* <label>
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
          </label> */}
          <div id="eia-container">
            <label htmlFor="eia-e6">
              E6
              <input type="checkbox" name="eiaValue" value="e6"></input>
            </label>
            <label htmlFor="eia-e12">
              E12
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e12"
                value="e12"
              ></input>
            </label>
            <label htmlFor="eia-e24">
              E24
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e24"
                value="e24"
              ></input>
            </label>
            <label htmlFor="eia-e48">
              E48
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e48"
                value="e48"
              ></input>
            </label>
            <label htmlFor="eia-e96">
              E96
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e96"
                value="e96"
              ></input>
            </label>
            <label htmlFor="eia-e192">
              E192
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e192"
                value="e192"
              ></input>
            </label>
          </div>
          <label>
            Pre Decimal Digits
            <select name="preDecimalDigits" id="pre-decimal-digits">
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </label>
          <label>
            Post Decimal Digits
            <select name="postDecimalDigits" id="post-decimal-digits">
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
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
