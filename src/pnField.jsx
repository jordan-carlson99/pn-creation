import { useState, useEffect } from "react";
import { InputField } from "./inputField";

export function PNField(props) {
  const [rows, setRows] = useState(1);
  const [fieldName, setFieldName] = useState("");
  const [parentAllow, setParentAllow] = useState("notAllowed");
  const [activeArray, setActiveArray] = useState(Array(rows).fill(false));

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

  const handleParentAllow = (updatedArray) => {
    setActiveArray(updatedArray);

    // Check if any value is true to set the delimiter state
    if (updatedArray.includes(true)) {
      setParentAllow("");
    } else {
      setParentAllow("notAllowed");
    }
  };

  let rowElems = [];
  for (let i = 0; i < rows; i++) {
    activeArray[i] = activeArray[i] || false;
    rowElems.push(
      <InputField
        col={props.col}
        fieldName={fieldName}
        setExample={props.setExample}
        defaultDesc={props.defaultDesc}
        key={`pnrow-${i}`}
        parentIndex={i}
        activeArray={activeArray}
        handleParentAllow={handleParentAllow}
      />
    );
  }

  return (
    <div className="pn-field-container card" id={`pn-card-col-${props.col}`}>
      <div className="column btn-group" key={props.col}>
        <input
          type="text"
          onChange={changeName}
          placeholder="Field Name"
          className="field-name form-control"
          value={fieldName}
          title="Enter a name for the field (This will be the table column in Excel)"
        ></input>
        {rowElems}
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={subRow}
        >
          Remove Option
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={addRow}
        >
          Add Option
        </button>
      </div>
      {props.col !== props.total - 1 && (
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Delimiter</span>
          </div>
          <select
            name={`${parentAllow}delimiter`}
            className="btn btn-outline-primary dropdown-toggle"
          >
            <option className="dropdown-item">(none)</option>
            <option>-</option>
          </select>
        </div>
      )}
    </div>
  );
}
