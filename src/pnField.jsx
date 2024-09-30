import { useRef, useState } from "react";
import { InputField } from "./inputField";

export function PNField(props) {
  const [rows, setRows] = useState(1);
  const [fieldName, setFieldName] = useState("");
  const [isRange, setIsRange] = useState(false);

  const addRow = () => {
    setRows(rows + 1);
  };
  const subRow = () => {
    setRows(rows - 1);
  };

  const changeName = (e) => {
    setFieldName(e.target.value);
  };

  let rowElems = [];
  for (let i = 0; i < rows; i++) {
    rowElems.push(
      <InputField
        col={props.col}
        fieldName={fieldName}
        setExample={props.setExample}
        validation={props.validation}
        setValidation={props.setValidation}
        isRange={isRange}
      />
    );
  }

  const handleSetRange = (e) => {
    setIsRange(e.target.checked);
  };

  return (
    <>
      <div className="column" key={props.col}>
        <div>
          <input
            type="text"
            onChange={changeName}
            placeholder="Field Name"
            className="field-name"
          ></input>
          <label>Range</label>
          <input
            type="checkbox"
            className="range-check"
            onChange={handleSetRange}
          ></input>
        </div>
        {rowElems}
        <button type="button" className="addition-btn" onClick={subRow}>
          -
        </button>
        <button type="button" className="addition-btn" onClick={addRow}>
          +
        </button>
      </div>
      {props.col !== props.total - 1 && (
        <div className="delimiter-container">
          <select name="delimiter">
            <option>(none)</option>
            <option>-</option>
          </select>
        </div>
      )}
    </>
  );
}
