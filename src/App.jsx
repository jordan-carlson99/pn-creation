import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PNField } from "./pnField";
import { e6, e12, e24, e48, e96, e192 } from "./eiaValues.js";

const resistorDefaults = [
  { Category: "Resistors" },
  { "Sub-Category": "Chip Resistors - Surface Mount" },
  { Packaging: "Tape & Reel (TR)" },
  { "Is The Part Static Sensitive": "Static Not Applicable" },
  { "MSL (moisture sensitivity level)": "1- Unlimited" },
  { "RoHS Status": "RoHS3 Compliant" },
  { "CA Prop 65": "Compliant" },
  { "ECCN Number": "Null" },
  { "Country of Origin": "Taiwan" },
  { "Shelf Life Requirements": "5+ Years" },
  { "Special Handling Instructions": "None" },
  { "Product Life Cycle Status": "Active" },
  { NCNR: "Yes" },
  { "Weight UOM": "Milligrams" },
  { "HTS (Harmonized Tariff Schedule)": "8533.10.0042" },
  { "Cage Code": "07WP9" },
];

function App() {
  const [fields, setFields] = useState([{ "": "" }]);
  const [blobLink, setBlobLink] = useState("/");
  const [example, setExample] = useState(null);
  const [exampleText, setExampleText] = useState(null);

  const formRef = useRef(null);

  const addField = () => {
    setFields([...fields, { "": "" }]);
  };

  const subField = () => {
    if (fields.length > 0) {
      setFields(fields.slice(0, fields.length - 1));
    }
  };

  const resetField = () => {
    setFields([{ "": "" }]);
  };

  const addTemplate = () => {
    // setFields(defaultTemplate);
  };

  const addMetadata = () => {
    setFields([...fields, ...resistorDefaults]);
  };

  function run() {
    let formData = getFormData(formRef);

    let keys = formData[1];
    let combos = [];
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
    let digitFormatting = "significantDigit";

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
      } else if (val[0].includes("delimiter")) {
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
          postDecimalDigits,
          digitFormatting
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
      } else if (val[0].includes("digitFormatting")) {
        digitFormatting = val[1];
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
    obj, // The input object containing key-value pairs (each value is an array of objects)
    keys, // The array of keys to iterate over
    index, // The current index in the keys array (to control recursion)
    currentPN, // The current part number (array form) being built as we go through the keys
    currentDetails, // The current details object to store values associated with the current key
    returnArray, // The object that will contain all the generated combinations
    delimiters // Array of delimiters to be added between part numbers if needed
  ) {
    if (index == keys.length) {
      // Base case: If we've gone through all the keys

      // Loop through the delimiters to append them to the part number (PN) string
      delimiters.forEach((d, i) => {
        if (d != "(none)") {
          // If the delimiter is not "(none)", we add it to the part number

          // Ensure the delimiter is not already at the end of the current part number
          if (
            !currentPN[i]
              .slice(currentPN[i].length - 1, currentPN[i].length)
              .includes(d)
          ) {
            currentPN[i] = currentPN[i] + d; // Append the delimiter to the part number
          }
        }
      });
      // console.log(currentPN, currentPN.join(""));

      // Store the current part number and its corresponding details in the return object
      returnArray.push({
        [currentPN.join("")]: Object.assign({}, currentDetails),
      }); // Combine part number into a string and copy current details then push that into return array
      // console.log(returnObject);
    } else {
      // Recursive case: If we haven't gone through all the keys yet

      const currentKey = keys[index]; // Get the current key to work with
      const innerArray = obj[currentKey]; // Get the array of objects associated with the current key

      // Loop through each object in the inner array
      for (const innerObj of innerArray) {
        const innerKey = Object.keys(innerObj)[0]; // Get the key of the current object in the array
        const innerVal = Object.values(innerObj)[0]; // Get the value of the current object

        currentPN.push(innerKey); // Add the current key to the part number array

        const updatedDetails = Object.assign({}, currentDetails); // Create a new copy of the current details object
        updatedDetails[currentKey] = innerVal; // Add the value of the current key to the details

        // Recursively call the function to go deeper into the next key
        generateCombinations(
          obj,
          keys,
          index + 1, // Move to the next key
          currentPN,
          updatedDetails,
          returnArray,
          delimiters
        );

        // Backtrack: remove the last added part number and detail to explore other combinations
        currentPN.pop(); // Remove the last part of the part number
        delete currentDetails[currentKey]; // Remove the last key from the details
      }
    }
  }

  function convertToCSV(inputArray) {
    let header;
    let rows = [];
    // Adding this tells excel its encoded in utf8 (removes weird character artefacts)
    const BOM = "\uFEFF";
    inputArray.forEach((inputObject) => {
      for (let pn in inputObject) {
        header = "PN," + Object.keys(inputObject[pn]).join(",");
      }
      const row = Object.entries(inputObject).map(([key, value]) => {
        const values = Object.values(value)
          .map((val) => `"${val}"`)
          .join(",");
        return `"${key}",${values}`;
      });
      rows.push(row);
    });
    return `${BOM}${header}\n${rows.join("\n")}`;
  }

  function createRange(
    increment,
    value,
    description,
    delimiter,
    eiaValues,
    preDecimalDigits,
    postDecimalDigits,
    digitFormatting
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
    eValueRange = eiaValueRange(eiaValues, preDecimalDigits, postDecimalDigits);
    // start + 1 since we already put the previous value on here in getFormData
    for (let i = start; i <= end; i += increment) {
      // ! If you change this, change the toFixed value in in eiaValueRange aswell
      let roundedValue = i.toFixed(6);

      if (eValueRange && eValueRange.includes(roundedValue)) {
        const formattedNumber = formatNumbering(
          roundedValue,
          preDecimalDigits,
          postDecimalDigits,
          digitFormatting,
          delimiter
        );

        // console.log(formattedNumber);

        valArr.push(`${formattedNumber.pnValue}${unit}`);
        descArr.push(`${formattedNumber.roundedValue} ${descSuffix}`);
      } else if (eValueRange == undefined) {
        const formattedNumber = formatNumbering(
          roundedValue,
          preDecimalDigits,
          postDecimalDigits,
          digitFormatting,
          delimiter
        );

        valArr.push(`${formattedNumber.pnValue}${unit}`);
        descArr.push(`${formattedNumber.roundedValue} ${descSuffix}`);
      }
    }
    return [valArr, descArr];
  }

  function eiaValueRange(eiaValues) {
    let values = [];
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

    return values;
  }

  // Take an number and return one formatted based on the amount of digits pre and post decimal place
  // Or formats to 3 significant digits with 1 metadata character
  function formatNumbering(
    roundedValue,
    preDecimalDigits,
    postDecimalDigits,
    digitFormatting,
    delimiter
  ) {
    let returnValue;

    if (digitFormatting == "significantDigit") {
      const postDecimalDigits = roundedValue.split(".")[1].split("");
      const preDecimalDigits = roundedValue.split(".")[0].split("");
      let postDecimalNonZeroes = 0;
      postDecimalDigits.map((digit) => {
        if (digit !== "0") {
          postDecimalNonZeroes++;
        }
      });

      // if its less than 3 digits, we still add the delimiter (10 = 10R0)
      // if there's significant digits within the decimal point then it needs delimiter
      if (postDecimalNonZeroes > 0 || preDecimalDigits.length < 3) {
        if (roundedValue.startsWith("0", 0)) {
          roundedValue = roundedValue.slice(1, roundedValue.length);
        }

        if (!roundedValue.includes(".")) {
          returnValue = roundedValue + ".";
        } else {
          returnValue = roundedValue;
        }
      } else if (postDecimalNonZeroes === 0 && preDecimalDigits.length > 2) {
        let preDecimalZeroes = 0;
        preDecimalDigits.map((digit) => {
          if (digit === "0") {
            preDecimalZeroes++;
          }
        });
        let fourthDigit = roundedValue.slice(3, preDecimalDigits.length).length;
        returnValue = roundedValue.slice(0, 3).concat(fourthDigit);
      }
    } else {
      let precedingZeroes = "";
      const preChars = roundedValue.split(".")[0].length;
      const lastZero = roundedValue.split(".")[1].indexOf("0");

      for (let i = preChars; i < preDecimalDigits; i++) {
        precedingZeroes += "0";
      }

      if (!roundedValue.includes(".")) {
        returnValue = roundedValue + ".";
      } else {
        returnValue = roundedValue;
      }

      if (lastZero <= postDecimalDigits) {
        returnValue =
          precedingZeroes + parseFloat(roundedValue).toFixed(postDecimalDigits);
      } else {
        returnValue =
          precedingZeroes + roundedValue.slice(0, preChars + lastZero + 1);
      }
    }

    if (delimiter) {
      returnValue = returnValue.split(".").join(delimiter).slice(0, 4);
    }

    return { pnValue: returnValue, roundedValue: parseFloat(roundedValue) };
  }

  // the input, the current iteration, the working set, the working details, the object writing to, an array of delimiters to map

  const fieldElements = [];
  fields.forEach((field, i) => {
    for (let param in field) {
      fieldElements.push(
        <PNField
          key={`pnfield-${i}`}
          col={i}
          total={fields.length}
          setExample={setExample}
          field={param}
          setFields={setFields}
          fields={fields}
          defaultDesc={field[param]}
        />
      );
    }
  });

  useEffect(() => {
    let data = run();
    if (data[0]) {
      setExampleText(Object.keys(data[0])[0]);
    }
  }, [example]);

  return (
    <>
      <div id="pn-container">
        <form id="pn-form" ref={formRef}>
          {fieldElements}
        </form>
      </div>
      <div className="generation-controls">
        <div>
          <button type="button" className="addition-btn" onClick={subField}>
            -
          </button>

          <button className="run-btn" type="button" onClick={run}>
            Run
          </button>
          <button className="run-btn" type="button" onClick={resetField}>
            Reset
          </button>
          <button type="button" className="addition-btn" onClick={addField}>
            +
          </button>
          <button
            type="button"
            className="template-input"
            onClick={addTemplate}
          >
            Add Default
          </button>
          <button
            type="button"
            className="template-addition"
            onClick={addMetadata}
          >
            Add Metadata
          </button>
        </div>
        <a href={blobLink} download={`pn_creation-${exampleText}.csv`}>
          Download CSV
        </a>
        <h3>{exampleText}</h3>
      </div>
    </>
  );
}

export default App;
