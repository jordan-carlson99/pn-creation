import { useState, useEffect } from "react";

export function InputField(props) {
  const [isRange, setIsRange] = useState(false);

  const checkForRangeAndSetExample = (e) => {
    props.setExample(e.target.value);
    if (e.target.name.includes("fieldVal")) {
      if (e.target.value.includes("~")) {
        setIsRange(true);
      } else {
        if (isRange == true) {
          setIsRange(false);
        }
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
          placeholder={isRange ? "Unit" : "Description"}
        ></input>
      </div>
      {isRange && (
        <>
          <input type="text" placeholder="Delimeter" name="rangeDelim"></input>
          <div id="eia-container">
            <label htmlFor="eia-e6">
              E6
              <input
                type="checkbox"
                name="eiaValue"
                value="e6"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
            <label htmlFor="eia-e12">
              E12
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e12"
                value="e12"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
            <label htmlFor="eia-e24">
              E24
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e24"
                value="e24"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
            <label htmlFor="eia-e48">
              E48
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e48"
                value="e48"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
            <label htmlFor="eia-e96">
              E96
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e96"
                value="e96"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
            <label htmlFor="eia-e192">
              E192
              <input
                type="checkbox"
                name="eiaValue"
                id="eia-e192"
                value="e192"
                onChange={checkForRangeAndSetExample}
              ></input>
            </label>
          </div>
          <label>
            Pre Decimal Digits
            <select
              name="preDecimalDigits"
              id="pre-decimal-digits"
              onChange={checkForRangeAndSetExample}
            >
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </label>
          <label>
            Post Decimal Digits
            <select
              name="postDecimalDigits"
              id="post-decimal-digits"
              onChange={checkForRangeAndSetExample}
            >
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
            <select name="unit" onChange={checkForRangeAndSetExample}>
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
