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

  const handleValidation = (e) => {
    props.setValidation(e.target.value);
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
        <div className="range-options">
          <div className="delimiter-row">
            <input
              type="text"
              placeholder="Delimiter"
              name="rangeDelim"
              className="delimiter-input"
            ></input>
            <select
              name="validateEIA"
              className="validation-dropdown"
              value={props.validation}
              onChange={handleValidation}
            >
              <option value="EIA">EIA Validation</option>
              <option value="">No validation</option>
            </select>
          </div>
          <div className="options-container">
            {props.validation == "EIA" && (
              <div className="eia-container">
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
            )}

            <div className="digit-container">
              <div className="digit-select-container">
                <label>Pre Decimal Digits</label>
                <select
                  name="preDecimalDigits"
                  id="pre-decimal-digits"
                  onChange={checkForRangeAndSetExample}
                  className="digit-select"
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              <div className="digit-select-container">
                <label>Post Decimal Digits</label>
                <select
                  name="postDecimalDigits"
                  id="post-decimal-digits"
                  onChange={checkForRangeAndSetExample}
                  className="digit-select"
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div className="digit-select-container">
                <label>Unit Size</label>
                <select
                  name="unit"
                  onChange={checkForRangeAndSetExample}
                  className="digit-select"
                >
                  <option>100</option>
                  <option>10</option>
                  <option>5</option>
                  <option>1</option>
                  <option>0.1</option>
                  <option>0.01</option>
                  <option>0.001</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
