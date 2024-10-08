import { useRef, useState, useEffect } from "react";
import { InputField } from "./inputField";

export function PNField(props) {
  const [rows, setRows] = useState(1);
  const [fieldName, setFieldName] = useState("");
  const [parentAllow, setParentAllow] = useState("notAllowed");

  // props.field given to field name on mount
  useEffect(() => {
    try {
      if (props.field) {
        setFieldName(props.field);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [props.field]);

  const addRow = () => {
    try {
      setRows(rows + 1);
    } catch (error) {
      console.error("Error in addRow:", error);
    }
  };

  const subRow = () => {
    try {
      if (rows > 1) {
        setRows(rows - 1);
      }
    } catch (error) {
      console.error("Error in subRow:", error);
    }
  };

  const changeName = (e) => {
    try {
      setFieldName(e.target.value);
    } catch (error) {
      console.error("Error in changeName:", error);
    }
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
        setParentAllow={setParentAllow}
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
          <select name={`${parentAllow}delimiter`}>
            <option>(none)</option>
            <option>-</option>
          </select>
        </div>
      )}
    </>
  );
}
