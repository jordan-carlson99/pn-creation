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

const dKTemplateDefaults = [
  { Power: "" },
  { "Operating Temp Range": "" },
  { "Package / Case": "" },
  { "Supplier Device Package": "" },
  { "Size / Dimensions": "" },
  { "Number of Terminations": "" },
  { "Other Part Number": "" },
  { MOQ: "" },
  { "Order Multiple": "" },
];

function App() {
  const [fields, setFields] = useState([{ "": "" }]);
  const [blobLink, setBlobLink] = useState("/");
  const [example, setExample] = useState(null);
  const [exampleText, setExampleText] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("DigiKey Template");

  const formRef = useRef(null);

  const addField = () => {
    try {
      setFields([...fields, { "": "" }]);
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  const subField = () => {
    try {
      if (fields.length > 0) {
        setFields(fields.slice(0, fields.length - 1));
      }
    } catch (error) {
      console.error("Error removing field:", error);
    }
  };

  const resetField = () => {
    try {
      setFields([{ "": "" }]);
    } catch (error) {
      console.error("Error resetting fields:", error);
    }
  };

  const handleSetTemplate = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const addTemplate = () => {
    try {
      if (selectedTemplate === "DigiKey Template") {
        setFields([...fields, ...dKTemplateDefaults]);
      } else if (selectedTemplate === "Default Resistor Template") {
        setFields([...fields, ...resistorDefaults]);
      }
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  function run() {
    try {
      let formData = getFormData(formRef);
      if (!formData) {
        return [false, false, false];
      }

      let keys = formData[1];
      let combos = [];
      generateCombinations(formData[0], keys, 0, [], {}, combos, formData[2]);
      if (combos) {
        setExampleText(Object.keys(combos[0])[0]);
        let csv = convertToCSV(combos);
        const blob = new Blob([csv], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        setBlobLink(url);
        return combos;
      }
    } catch (error) {
      console.error("Error in run function:", error);
      return [false, false, false];
    }
  }

  function getFormData(formRef) {
    try {
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

      for (const val of formData.entries()) {
        if (val[0].includes("notAllowed")) {
          continue;
        }
        if (val[0].slice(0, 8).includes("fieldVal")) {
          if (valObj[val[0].split("fieldVal ")[1]] != undefined) {
            valObj[val[0].split("fieldVal ")[1]].push(val[1]);
          } else {
            valObj[val[0].split("fieldVal ")[1]] = [val[1]];
          }
          prevVal = val[1];
          prevField =
            val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
        } else if (val[0].slice(0, 8).includes("descVal")) {
          if (descObj[val[0].split("descVal ")[1]] != undefined) {
            descObj[val[0].split("descVal ")[1]].push(val[1]);
          } else {
            descObj[val[0].split("descVal ")[1]] = [val[1]];
          }
          prevDesc = val[1];
          prevField =
            val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
        } else if (val[0].includes("delimiter")) {
          delimArr.push(val[1]);
          prevField =
            val[0].split("fieldVal ")[1] || val[0].split("descVal ")[1];
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
    } catch (error) {
      console.error("Error getting form data:", error);
      return null;
    }
  }

  function generateCombinations(
    obj,
    keys,
    index,
    currentPN,
    currentDetails,
    returnArray,
    delimiters
  ) {
    try {
      if (index == keys.length) {
        delimiters.forEach((d, i) => {
          if (currentPN[i] === undefined || currentPN[i] === "") {
            currentPN[i] = "";
          }

          if (d != "(none)") {
            if (
              // If the pn value is null or if the pn doesnt already include the delimiter
              currentPN[i] == "" ||
              !currentPN[i]
                ?.slice(currentPN[i].length - 1, currentPN[i].length)
                ?.includes(d)
            ) {
              currentPN[i] = currentPN[i] + d;
            }
          }
        });
        returnArray.push({
          [currentPN.join("")]: Object.assign({}, currentDetails),
        });
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
            returnArray,
            delimiters
          );

          currentPN.pop();
          delete currentDetails[currentKey];
        }
      }
    } catch (error) {
      console.error("Error generating combinations:", error);
    }
  }

  function convertToCSV(inputArray) {
    try {
      let header;
      let rows = [];
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
    } catch (error) {
      console.error("Error converting to CSV:", error);
      return "";
    }
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
    try {
      let arr = value.split("~");
      increment = parseFloat(increment);
      let start = parseFloat(arr[0]);
      let end = parseFloat(arr[1]);
      let unit = arr[1].split(end)[1];
      let descSuffix = description.split(end)[1] || description;
      let valArr = [];
      let descArr = [];
      let eValueRange = eiaValueRange(
        eiaValues,
        preDecimalDigits,
        postDecimalDigits
      );

      for (let i = start; i <= end; i += increment) {
        let roundedValue = i.toFixed(6);

        if (eValueRange && eValueRange.includes(roundedValue)) {
          const formattedNumber = formatNumbering(
            roundedValue,
            preDecimalDigits,
            postDecimalDigits,
            digitFormatting,
            delimiter
          );
          if (formattedNumber) {
            valArr.push(`${formattedNumber.pnValue}${unit}`);
            descArr.push(`${formattedNumber.roundedValue} ${descSuffix}`);
          }
        } else if (eValueRange == undefined) {
          const formattedNumber = formatNumbering(
            roundedValue,
            preDecimalDigits,
            postDecimalDigits,
            digitFormatting,
            delimiter
          );

          if (formattedNumber) {
            valArr.push(`${formattedNumber.pnValue}${unit}`);
            descArr.push(`${formattedNumber.roundedValue} ${descSuffix}`);
          }
        }
      }
      return [valArr, descArr];
    } catch (error) {
      console.error("Error creating range:", error);
      return [[], []];
    }
  }

  function eiaValueRange(eiaValues) {
    try {
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
    } catch (error) {
      console.error("Error getting EIA value range:", error);
      return [];
    }
  }

  function formatNumbering(
    roundedValue,
    preDecimalDigits,
    postDecimalDigits,
    digitFormatting,
    delimiter
  ) {
    try {
      preDecimalDigits = parseInt(preDecimalDigits);
      postDecimalDigits = parseInt(postDecimalDigits);
      let returnValue;

      if (digitFormatting == "significantDigit") {
        roundedValue = parseFloat(roundedValue).toFixed(6);

        // If its under 100 we use delimiters
        if (roundedValue < 100) {
          let placeValue = getLastNonZeroIndex(roundedValue);

          // Invalid combinations (uses too many digits, 10R1 (10.1) vs 10R1 (10.11) )
          if (
            // 10R1 (10.10) <= good 10R1 (10.11) <= bad
            (placeValue > 1 && roundedValue >= 10) ||
            // R012 (0.012) <= good 1R01 (1.012) <= bad
            (placeValue > 2 && !roundedValue.split(".")[0].startsWith("0")) ||
            (placeValue > 0 &&
              roundedValue >= 10 &&
              roundedValue.split(".")[1].startsWith("0"))
          ) {
            return false;
          }

          // Delimiter with 0 removed
          if (placeValue > 1 && roundedValue < 1) {
            delimiter = delimiter || "";
            returnValue = roundedValue.split(".").join(delimiter).slice(1, 5);
            // Basic delimiter
          } else {
            delimiter = delimiter || "";
            returnValue = roundedValue.split(".").join(delimiter).slice(0, 4);
          }

          // 4th digit
        } else if (roundedValue >= 100) {
          // Starting from last significant number, count the numbers
          let nonSigDigit = roundedValue.slice(
            3,
            roundedValue.split(".")[0].length
          );
          returnValue = roundedValue
            .split(".")[0]
            .slice(0, 3)
            .concat(nonSigDigit.length);
        }
      } else {
        let precedingZeroes = "";
        const preChars = roundedValue.split(".")[0].length;
        const lastZero = roundedValue.split(".")[1].indexOf("0");
        let zeroRegex = /[1,2,3,4,5,6,7,8,9]+/gm;

        for (let i = preChars; i < preDecimalDigits; i++) {
          precedingZeroes += "0";
        }

        if (lastZero <= postDecimalDigits) {
          returnValue =
            precedingZeroes +
            parseFloat(roundedValue).toFixed(postDecimalDigits);
        } else {
          returnValue =
            precedingZeroes + roundedValue.slice(0, preChars + lastZero + 1);
        }

        if (
          preDecimalDigits === 0 &&
          !zeroRegex.test(returnValue.split(".")[0])
        ) {
          returnValue = "." + returnValue.split(".")[1];
        }

        if (delimiter) {
          returnValue = returnValue
            .split(".")
            .join(delimiter)
            .slice(0, preDecimalDigits + postDecimalDigits + 1);
        }
      }

      return { pnValue: returnValue, roundedValue: parseFloat(roundedValue) };
    } catch (error) {
      console.error("error in formatNumber: ", error);
    }
  }

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

  // Auto generation of PN
  // useEffect(() => {
  //   try {
  //     let data = run();
  //     if (data[0]) {
  //       setExampleText(Object.keys(data[0])[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error in useEffect:", error);
  //   }
  // }, [example]);

  return (
    <>
      <div id="pn-container">
        <form id="pn-form" ref={formRef}>
          {fieldElements}
        </form>
      </div>
      <div className="generation-controls">
        <div id="custom-field-container" className="btn-group">
          <button
            type="button"
            className="addition-btn btn btn-light"
            id="rem-field-btn"
            onClick={subField}
          >
            Remove Field
          </button>
          <div id="preview-reset-container" className="btn-group">
            <button
              type="button"
              className="addition-btn btn btn-light"
              id="preview-btn"
              onClick={run}
            >
              Show Preview
            </button>
            <button
              id="reset-btn"
              className="run-btn btn btn-danger"
              type="button"
              onClick={resetField}
            >
              Reset
            </button>
          </div>
          <button
            type="button"
            className="addition-btn btn btn-light"
            id="add-field-btn"
            onClick={addField}
          >
            Add Field
          </button>
        </div>
        <div className="btn-group">
          <select
            value={selectedTemplate}
            onChange={handleSetTemplate}
            className="btn btn-outline-primary dropdown-toggle"
            id="template-btn"
          >
            <option>DigiKey Template</option>
            <option>Default Resistor Template</option>
          </select>
          <button onClick={addTemplate} className="btn btn-warning">
            Add Template
          </button>
        </div>
        <a
          href={blobLink}
          download={`pn_creation-${exampleText}.csv`}
          id="download-btn"
          onClick={run}
          className="btn btn btn-success"
        >
          Download CSV
        </a>
        <h3 id="example-text">{exampleText}</h3>
      </div>
    </>
  );
}

function getLastNonZeroIndex(num) {
  try {
    let numStr;
    // Convert the number to a string
    if (typeof numStr != "string") {
      numStr = num?.toString();
    }

    // Find the index of the decimal point
    const decimalIndex = numStr.indexOf(".");

    // If there's no decimal point, return 0 (as it's an integer)
    if (decimalIndex === -1) {
      return 0;
    }

    // Get the fractional part of the number as a string
    const fractionPart = numStr.slice(decimalIndex + 1);

    // Loop through the fractional part from the end to find the last non-zero
    for (let i = fractionPart.length - 1; i >= 0; i--) {
      if (fractionPart[i] !== "0") {
        return i;
      }
    }

    // If no non-zero digit is found in the fractional part, return -1 (optional)
    return 0;
  } catch (error) {
    console.error(`error in getting last nonzero index: ${error}`);
  }
}

export default App;
