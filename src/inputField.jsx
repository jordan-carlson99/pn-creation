import { useState, useEffect } from "react";

export function InputField(props) {
  const [isRange, setIsRange] = useState(false);
  const [validation, setValidation] = useState("EIA");
  const [significantDigitValidation, setSignificantDigitValidation] =
    useState("significantDigit");
  const [desc, setDesc] = useState("");

  // This is pre-pended to the input names, if it's empty, the names will be pulled, it it's not, they wont be
  const [allow, setAllow] = useState("notAllowed");

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
    setValidation(e.target.value);
  };

  const handleDigitFormatting = (e) => {
    setSignificantDigitValidation(e.target.value);
  };

  const changeDesc = (e) => {
    setDesc(e.target.value);
  };

  const handleAllow = (e) => {
    if (!e.target.checked) {
      setAllow("notAllowed");
      props.setParentAllow("notAllowed");
    } else {
      setAllow("");
      props.setParentAllow("");
    }
  };

  useEffect(() => {
    if (props.defaultDesc) {
      setDesc(props.defaultDesc);
    }
  }, [props.defaultDesc]);

  return (
    <div className="input-field">
      <div className="field-container">
        <input
          type="checkbox"
          name="isUse"
          value={true}
          onChange={handleAllow}
        ></input>
        <input
          name={`${allow}fieldVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder="Part numbering value"
          onChange={checkForRangeAndSetExample}
        ></input>
        <input
          name={`${allow}descVal ${props.col}-${props.fieldName}`}
          type="text"
          placeholder={isRange ? "Unit" : "Description"}
          value={desc}
          onChange={changeDesc}
        ></input>
      </div>

      {isRange && (
        <div className="range-options">
          <div className="delimiter-row">
            <input
              type="text"
              placeholder="Delimiter"
              name={`${allow}rangeDelim`}
              className="delimiter-input"
            ></input>
            <select
              name={`${allow}validateEIA`}
              className="validation-dropdown"
              value={validation}
              onChange={handleValidation}
            >
              <option value="EIA">EIA Validation</option>
              <option value="">No validation</option>
            </select>
            {/* <label>Digit Formatting</label> */}
            <select
              onChange={handleDigitFormatting}
              name={`${allow}digitFormatting`}
              className="digit-formatting-dropdown"
              value={significantDigitValidation}
            >
              <option value="significantDigit">Significant Digit</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="options-container">
            {validation == "EIA" && (
              <div className="eia-container">
                <label htmlFor="eia-e6">
                  E6
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    value="e6"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e6Field ${props.col}-${props.fieldName}`}
                    placeholder="E6 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e6Desc ${props.col}-${props.fieldName}`}
                    placeholder="E6 Description"
                  ></input> */}
                </label>
                <label htmlFor="eia-e12">
                  E12
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    id="eia-e12"
                    value="e12"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e12Field ${props.col}-${props.fieldName}`}
                    placeholder="E12 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e12Desc ${props.col}-${props.fieldName}`}
                    placeholder="E12 Description"
                  ></input> */}
                </label>
                <label htmlFor="eia-e24">
                  E24
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    id="eia-e24"
                    value="e24"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e24Field ${props.col}-${props.fieldName}`}
                    placeholder="E24 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e24Desc ${props.col}-${props.fieldName}`}
                    placeholder="E24 Description"
                  ></input> */}
                </label>

                <label htmlFor="eia-e48">
                  E48
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    id="eia-e48"
                    value="e48"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e48Field ${props.col}-${props.fieldName}`}
                    placeholder="E48 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e48Desc ${props.col}-${props.fieldName}`}
                    placeholder="E48 Description"
                  ></input> */}
                </label>
                <label htmlFor="eia-e96">
                  E96
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    id="eia-e96"
                    value="e96"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e96Field ${props.col}-${props.fieldName}`}
                    placeholder="E96 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e96Desc ${props.col}-${props.fieldName}`}
                    placeholder="E96 Description"
                  ></input> */}
                </label>
                <label htmlFor="eia-e192">
                  E192
                  <input
                    type="checkbox"
                    name={`${allow}eiaValue`}
                    id="eia-e192"
                    value="e192"
                    onChange={checkForRangeAndSetExample}
                  ></input>
                  {/* <input
                    type="text"
                    name={`e192Field ${props.col}-${props.fieldName}`}
                    placeholder="E192 Part Numbering Value"
                  ></input>
                  <input
                    type="text"
                    name={`e192Desc ${props.col}-${props.fieldName}`}
                    placeholder="E192 Description"
                  ></input> */}
                </label>
              </div>
            )}

            <div className="digit-container">
              {significantDigitValidation === "significantDigit" ? (
                <></>
              ) : (
                <>
                  <div className="digit-select-container">
                    <label>Pre Decimal Digits</label>
                    <select
                      name={`${allow}preDecimalDigits`}
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
                      name={`${allow}postDecimalDigits`}
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
                </>
              )}
              <div className="digit-select-container">
                <label>Unit Size</label>
                <select
                  name={`${allow}unit`}
                  onChange={checkForRangeAndSetExample}
                  className="digit-select"
                >
                  <option>10000</option>
                  <option>1000</option>
                  <option>100</option>
                  <option>10</option>
                  <option>5</option>
                  <option>1</option>
                  <option>0.1</option>
                  <option>0.01</option>
                  <option>0.001</option>
                  <option>0.0001</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
