import { useRef, useState, useEffect } from "react";
import { InputField } from "./inputField";

export function PNField(props) {
  const [rows, setRows] = useState(1);
  const [fieldName, setFieldName] = useState("");

  // props.field given to field name on mount
  useEffect(() => {
    if (props.field) {
      setFieldName(props.field);
    }
  }, [props.field]);

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
        defaultDesc={props.defaultDesc}
        key={`pnrow-${i}`}
      />
    );
  }

  return (
    <>
      <div className="column" key={props.col}>
        <input
          type="text"
          onChange={changeName}
          placeholder="Field Name"
          className="field-name"
          value={fieldName}
        ></input>
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
