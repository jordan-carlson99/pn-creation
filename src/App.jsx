import { useState, useRef } from "react";
import "./App.css";
import { PNField } from "./pnField";

function App() {
  const [fields, setFields] = useState(1);
  const [blobLink, setBlobLink] = useState("/");
  const formRef = useRef(null);

  const addField = () => {
    setFields(fields + 1);
  };

  const subField = () => {
    if (fields > 0) {
      setFields(fields - 1);
    }
  };

  const resetField = () => {
    setFields(0);
  };

  const fieldElements = [];
  for (let i = 0; i < fields; i++) {
    fieldElements.push(<PNField key={i} col={i} />);
  }

  function getFormData() {
    let valObj = {};
    let descObj = {};
    let obj = {};
    let keys = [];
    const formData = new FormData(formRef.current);
    for (const val of formData.entries()) {
      if (val[0].includes("field")) {
        if (valObj[val[0].split("field ")[1]] != undefined) {
          valObj[val[0].split("field ")[1]].push(val[1]);
        } else {
          valObj[val[0].split("field ")[1]] = [val[1]];
        }
      } else {
        if (descObj[val[0].split("desc ")[1]] != undefined) {
          descObj[val[0].split("desc ")[1]].push(val[1]);
        } else {
          descObj[val[0].split("desc ")[1]] = [val[1]];
        }
      }
    }
    for (let params in valObj) {
      keys.push(params);
      let arr = [];
      valObj[params].forEach((elem, i) => {
        arr.push({ [elem]: descObj[params][i] });
      });
      obj[params] = arr;
    }

    return [obj, keys];
  }

  function run() {
    let data = getFormData();
    let keys = data[1];
    let combos = {};
    let testObj = {
      "0-test": [
        {
          val: "desc",
        },
      ],
    };
    // console.log(data[0]);
    generateCombinations(data[0], keys, 0, [], {}, combos);
    // console.log(combos);
    let csv = convertToCSV(combos);
    console.log(csv);
    const blob = new Blob([csv], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    setBlobLink(url);
  }

  // the input, the current iteration, and the working set
  function generateCombinations(
    obj,
    keys,
    index,
    currentPN,
    currentDetails,
    returnObject
  ) {
    if (index == keys.length) {
      // append to combos object
      returnObject[currentPN.join("-")] = Object.assign({}, currentDetails);
    } else {
      const currentKey = keys[index];
      const innerArray = obj[currentKey];
      for (const innerObj of innerArray) {
        const innerKey = Object.keys(innerObj)[0];
        const innerVal = Object.values(innerObj)[0];
        currentPN.push(innerKey);

        const updatedDetails = Object.assign({}, currentDetails);
        updatedDetails[currentKey] = innerVal;

        generateCombinations(
          obj,
          keys,
          index + 1,
          currentPN,
          updatedDetails,
          returnObject
        );
        currentPN.pop();
        delete currentDetails[currentKey];
      }
    }
  }

  return (
    <>
      <div id="pn-container">
        <form id="pn-form" ref={formRef}>
          {fieldElements}
        </form>
        <button type="button" className="addition-btn" onClick={subField}>
          -
        </button>
        <button type="button" className="addition-btn" onClick={addField}>
          +
        </button>
      </div>
      <div>
        <button className="run-btn" type="button" onClick={run}>
          Run
        </button>
        <button className="run-btn" type="button" onClick={resetField}>
          Reset
        </button>
      </div>
      <a href={blobLink} download="part_data.csv">
        link
      </a>
    </>
  );
}

function convertToCSV(inputObject) {
  let header;
  for (let pn in inputObject) {
    // console.log(pn);
    header = "PN," + Object.keys(inputObject[pn]).join(",");
    // console.log(header);
  }
  const rows = Object.entries(inputObject).map(([key, value]) => {
    const values = Object.values(value)
      .map((val) => `"${val}"`)
      .join(",");
    return `"${key}",${values}`;
  });

  return `${header}\n${rows.join("\n")}`;
}

export default App;
