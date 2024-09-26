import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PNField } from "./pnField";

// EIA values
const e6 = [1, 1.5, 2.2, 3.3, 4.7, 6.8];
const e12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
const e24 = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9,
  4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];
const e48 = [
  1.0, 1.05, 1.1, 1.15, 1.21, 1.27, 1.33, 1.4, 1.47, 1.54, 1.62, 1.69, 1.78,
  1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01, 3.16, 3.32,
  3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36, 5.62, 5.9, 6.19,
  6.49, 6.81, 7.15, 7.5, 7.87, 8.25, 8.66, 9.09, 9.53,
];
const e96 = [
  1.0, 1.02, 1.05, 1.07, 1.1, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.3, 1.33,
  1.37, 1.4, 1.43, 1.47, 1.5, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82,
  1.87, 1.91, 1.96, 2.0, 2.05, 2.1, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49,
  2.55, 2.61, 2.67, 2.74, 2.8, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.4,
  3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53, 4.64,
  4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.9, 6.04, 6.19, 6.34,
  6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.5, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66,
  8.87, 9.09, 9.31, 9.53, 9.76,
];
const e192 = [
  1.0, 1.01, 1.02, 1.04, 1.05, 1.06, 1.07, 1.09, 1.1, 1.11, 1.13, 1.14, 1.15,
  1.17, 1.18, 1.2, 1.21, 1.23, 1.24, 1.26, 1.27, 1.29, 1.3, 1.32, 1.33, 1.35,
  1.37, 1.38, 1.4, 1.42, 1.43, 1.45, 1.47, 1.49, 1.5, 1.52, 1.54, 1.56, 1.58,
  1.6, 1.62, 1.64, 1.65, 1.67, 1.69, 1.72, 1.74, 1.76, 1.78, 1.8, 1.82, 1.84,
  1.87, 1.89, 1.91, 1.93, 1.96, 1.98, 2.0, 2.03, 2.05, 2.08, 2.1, 2.13, 2.15,
  2.18, 2.21, 2.23, 2.26, 2.29, 2.32, 2.34, 2.37, 2.4, 2.43, 2.46, 2.49, 2.52,
  2.55, 2.58, 2.61, 2.64, 2.67, 2.71, 2.74, 2.77, 2.8, 2.84, 2.87, 2.91, 2.94,
  2.98, 3.01, 3.05, 3.09, 3.12, 3.16, 3.2, 3.24, 3.28, 3.32, 3.36, 3.4, 3.44,
  3.48, 3.52, 3.57, 3.61, 3.65, 3.7, 3.74, 3.79, 3.83, 3.88, 3.92, 3.97, 4.02,
  4.07, 4.12, 4.17, 4.22, 4.27, 4.32, 4.37, 4.42, 4.48, 4.53, 4.59, 4.64, 4.7,
  4.75, 4.81, 4.87, 4.93, 4.99, 5.05, 5.11, 5.17, 5.23, 5.3, 5.36, 5.42, 5.49,
  5.56, 5.62, 5.69, 5.76, 5.83, 5.9, 5.97, 6.04, 6.12, 6.19, 6.26, 6.34, 6.42,
  6.49, 6.57, 6.65, 6.73, 6.81, 6.9, 6.98, 7.06, 7.15, 7.23, 7.32, 7.41, 7.5,
  7.59, 7.68, 7.77, 7.87, 7.96, 8.06, 8.16, 8.25, 8.35, 8.45, 8.56, 8.66, 8.76,
  8.87, 8.98, 9.09, 9.2, 9.31, 9.42, 9.53, 9.65, 9.76, 9.88,
];
function App() {
  const [fields, setFields] = useState(1);
  const [blobLink, setBlobLink] = useState("/");
  const [example, setExample] = useState(null);
  const [exampleText, setExampleText] = useState(null);
  const [validation, setValidation] = useState("EIA");

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
    let formData = getFormData(formRef);

    let keys = formData[1];
    let combos = {};
    generateCombinations(
      // field values
      formData[0],
      keys,
      0,
      [],
      {},
      combos,
      formData[2],
      formData[3]
    );
    let csv = convertToCSV(combos);
    const blob = new Blob([csv], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    setBlobLink(url);
    return combos;
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
    let eiaValues = [];
    let preDecimalDigits;
    let postDecimalDigits;

    const formData = new FormData(formRef.current);

    // ! This should not be iterated like this. It means unit has to come last for ranges
    for (const val of formData.entries()) {
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
        let ranges = createRange(
          val[1],
          prevVal,
          prevDesc,
          uniqueDelim,
          eiaValues,
          preDecimalDigits,
          postDecimalDigits
        );
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
      } else if (val[0].includes("eiaValue")) {
        eiaValues.push(val[1]);
      } else if (val[0].includes("preDecimalDigits")) {
        preDecimalDigits = val[1];
      } else if (val[0].includes("postDecimalDigits")) {
        postDecimalDigits = val[1];
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
      // map out delimiters to pn by appending to their string before joining
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

  function createRange(
    increment,
    value,
    description,
    delimeter,
    eiaValues,
    preDecimalDigits,
    postDecimalDigits
  ) {
    let arr = value.split("~");
    increment = parseFloat(increment);
    let start = parseFloat(arr[0]);
    let end = parseFloat(arr[1]);
    let unit = arr[1].split(end)[1];
    let descSuffix = description.split(end)[1] || description;
    let valArr = [];
    let descArr = [];
    let eValueRange;

    // Return all possible values based on the eia values selected if eia validation selected
    if (validation === "EIA") {
      eValueRange = eiaValueRange(
        eiaValues,
        preDecimalDigits,
        postDecimalDigits
      );
    }

    // start + 1 since we already put the previous value on here in getFormData
    for (let i = start; i < end; i += increment) {
      // ! If you change this, change the toFixed value in in eiaValueRange aswell
      let roundedValue = i.toFixed(6);

      if (
        validation === "EIA" &&
        eValueRange &&
        eValueRange.includes(roundedValue)
      ) {
        roundedValue = formatNumbering(
          roundedValue,
          preDecimalDigits,
          postDecimalDigits
        );

        let delimitedRoundedValue;
        if (delimeter) {
          delimitedRoundedValue = roundedValue.split(".").join(delimeter);
        } else {
          delimitedRoundedValue = roundedValue;
        }
        valArr.push(`${delimitedRoundedValue}${unit}`);
        descArr.push(`${roundedValue} ${descSuffix}`);
      } else if (validation === "") {
        roundedValue = formatNumbering(
          roundedValue,
          preDecimalDigits,
          postDecimalDigits
        );

        let delimitedRoundedValue;
        if (delimeter) {
          delimitedRoundedValue = roundedValue.split(".").join(delimeter);
        } else {
          delimitedRoundedValue = roundedValue;
        }
        valArr.push(`${delimitedRoundedValue}${unit}`);
        descArr.push(`${roundedValue} ${descSuffix}`);
      }
    }
    return [valArr, descArr];
  }

  function eiaValueRange(eiaValues) {
    let values = [];
    let magnitudes = [0.001, 0.01, 0.1, 1, 10, 100];
    if (eiaValues.includes("e6")) {
      values.push(...e6);
    }
    if (eiaValues.includes("e12")) {
      values.push(...e12);
    }
    if (eiaValues.includes("e24")) {
      values.push(...e24);
    }
    if (eiaValues.includes("e48")) {
      values.push(...e48);
    }
    if (eiaValues.includes("e96")) {
      values.push(...e96);
    }
    if (eiaValues.includes("e192")) {
      values.push(...e192);
    }

    if (values.length < 1) {
      return;
    }

    return values
      .map((val) => {
        return magnitudes.map((mag) => {
          return (mag * val).toFixed(6);
        });
      })
      .flat();
  }

  // Take an number and return one formatted based on the amount of digits pre and post decimal place
  function formatNumbering(roundedValue, preDecimalDigits, postDecimalDigits) {
    let precedingZeroes = "";
    const preChars = roundedValue.split(".")[0].length;
    const lastZero = roundedValue.split(".")[1].indexOf("0");

    for (let i = preChars; i < preDecimalDigits; i++) {
      precedingZeroes += "0";
    }

    if (lastZero <= postDecimalDigits) {
      roundedValue =
        precedingZeroes + parseFloat(roundedValue).toFixed(postDecimalDigits);
    } else {
      roundedValue =
        precedingZeroes + roundedValue.slice(0, preChars + lastZero + 1);
    }

    return roundedValue;
  }

  // the input, the current iteration, the working set, the working details, the object writing to, an array of delimeters to map

  const fieldElements = [];
  for (let i = 0; i < fields; i++) {
    fieldElements.push(
      <PNField
        key={i}
        col={i}
        total={fields}
        setExample={setExample}
        validation={validation}
        setValidation={setValidation}
      />
    );
  }
  useEffect(() => {
    let data = run();
    if (data) {
      setExampleText(Object.keys(data)[0]);
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

export default App;
