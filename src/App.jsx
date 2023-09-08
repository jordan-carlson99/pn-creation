import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PNField } from "./pnField";

function App() {
  const [fields, setFields] = useState(1);
  const [blobLink, setBlobLink] = useState("/");
  const [example, setExample] = useState(null);
  const [exampleText, setExampleText] = useState(null);
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

  function run() {
    let data = getFormData(formRef);
    let keys = data[1];
    let combos = {};
    generateCombinations(data[0], keys, 0, [], {}, combos, data[2]);
    console.log(combos);
    let csv = convertToCSV(combos);
    console.log(csv);
    const blob = new Blob([csv], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    setBlobLink(url);
    return combos;
  }

  // the input, the current iteration, the working set, the working details, the object writing to, an array of delimeters to map

  const fieldElements = [];
  for (let i = 0; i < fields; i++) {
    fieldElements.push(
      <PNField key={i} col={i} total={fields} setExample={setExample} />
    );
  }
  useEffect(() => {
    let data = run();
    if (data) {
      setExampleText(Object.keys(data)[0]);
      console.log(exampleText);
    }
  }, [example]);

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
        Download CSV
      </a>
      <h3>{exampleText}</h3>
    </>
  );
}

function getFormData(formRef) {
  let valObj = {};
  let descObj = {};
  let obj = {};
  let keys = [];
  let delimArr = [];
  let prevVal;
  let prevDesc;
  let prevField;
  let uniqueDelim = "";
  const formData = new FormData(formRef.current);
  for (const val of formData.entries()) {
    console.log(val);
    if (val[0].slice(0, 8).includes("fieldVal")) {
      if (valObj[val[0].split("fieldVal ")[1]] != undefined) {
        valObj[val[0].split("fieldVal ")[1]].push(val[1]);
      } else {
        valObj[val[0].split("fieldVal ")[1]] = [val[1]];
      }
      prevVal = val[1];
      prevField = val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
    } else if (val[0].slice(0, 8).includes("descVal")) {
      if (descObj[val[0].split("descVal ")[1]] != undefined) {
        descObj[val[0].split("descVal ")[1]].push(val[1]);
      } else {
        descObj[val[0].split("descVal ")[1]] = [val[1]];
      }
      prevDesc = val[1];
      prevField = val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
    } else if (val[0].includes("delimeter")) {
      delimArr.push(val[1]);
      prevField = val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
    } else if (val[0].includes("unit")) {
      let ranges = createRange(val[1], prevVal, prevDesc, uniqueDelim);
      valObj[prevField].pop();
      descObj[prevField].pop();
      ranges[0].forEach((range, i) => {
        let value = range;
        let desc = ranges[1][i];
        valObj[prevField].push(value);
        descObj[prevField].push(desc);
      });
    } else if (val[0].includes("rangeDelim")) {
      if (val[1] != "") {
        uniqueDelim = val[1];
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

  return [obj, keys, delimArr];
}

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

function createRange(increment, value, description, delimeter) {
  let decimalPlaces = 1;
  let arr = value.split("~");
  if (increment.split(".")[1]) {
    decimalPlaces = increment.split(".")[1].length;
  }
  increment = parseFloat(increment);
  // console.log(arr);
  let start = parseFloat(arr[0]);
  let end = parseFloat(arr[1]);
  let unit = arr[1].split(end)[1];
  let descPrefix = description.split(start)[0] || "";
  let descSuffix = description.split(end)[1] || description;
  let valArr = [];
  let descArr = [];

  // start + 1 since we already put the previous value on here in getFormData
  for (let i = start; i < end; i += increment) {
    let roundedValue = i.toFixed(decimalPlaces);
    if (delimeter) {
      roundedValue = roundedValue.split(".").join(delimeter);
    } else {
      roundedValue = roundedValue + delimeter + "0";
    }
    valArr.push(`${roundedValue}${unit}`);
    descArr.push(`${descPrefix} ${roundedValue} ${descSuffix}`);
  }
  return [valArr, descArr];
}

export default App;
