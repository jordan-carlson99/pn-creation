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
    fieldElements.push(<PNField key={i} col={i} total={fields} />);
  }

  function getFormData() {
    let valObj = {};
    let descObj = {};
    let obj = {};
    let keys = [];
    let delimArr = [];
    const formData = new FormData(formRef.current);
    for (const val of formData.entries()) {
      // console.log(val);
      if (val[0].slice(0, 8).includes("fieldVal")) {
        // console.log("field");
        if (valObj[val[0].split("fieldVal ")[1]] != undefined) {
          valObj[val[0].split("fieldVal ")[1]].push(val[1]);
        } else {
          valObj[val[0].split("fieldVal ")[1]] = [val[1]];
        }
      } else if (val[0].slice(0, 7).includes("descVal")) {
        // console.log("desc");
        if (descObj[val[0].split("descVal ")[1]] != undefined) {
          descObj[val[0].split("descVal ")[1]].push(val[1]);
        } else {
          descObj[val[0].split("descVal ")[1]] = [val[1]];
        }
      } else if (val[0].includes("delimeter")) {
        // console.log("delim");
        delimArr.push(val[1]);
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

    return [obj, keys, delimArr];
  }

  function run() {
    let data = getFormData();
    let keys = data[1];
    let combos = {};
    // console.log(data[2]);
    generateCombinations(data[0], keys, 0, [], {}, combos, data[2]);
    // console.log(combos);
    let csv = convertToCSV(combos);
    console.log(csv);
    const blob = new Blob([csv], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    setBlobLink(url);
  }

  // the input, the current iteration, the working set, the working details, the object writing to, an array of delimeters to map
  function generateCombinations(
    obj,
    keys,
    index,
    currentPN,
    currentDetails,
    returnObject,
    delimeters
  ) {
    if (index == keys.length) {
      // map out delimiters to pn by apopending to their string before joining
      delimeters.forEach((d, i) => {
        if (d != "(none)") {
          // so we dont keep adding "-" everytime we get to the same pn
          if (
            !currentPN[i]
              .slice(currentPN[i].length - 1, currentPN[i].length)
              .includes(d)
          ) {
            currentPN[i] = currentPN[i] + d;
          }
        }
      });
      // append to combos object
      returnObject[currentPN.join("")] = Object.assign({}, currentDetails);
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
          returnObject,
          delimeters
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
