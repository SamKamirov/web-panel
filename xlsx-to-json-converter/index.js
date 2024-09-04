// #! path/to/node/interpreter
"use strict";
const process = require("process");
const fs = require("node:fs");
const excelToJson = require("convert-excel-to-json");
const path = require("path");

const ROWS_TO_SKIP = 7;

let filePath;
let SEVEN = "./7.xlsx";
let MONTH = "./30.xlsx";
let DAY = "./1.xlsx";

process.argv.slice(2).forEach((value) => {
  filePath = value;
});

const convertFile = (path) => {
  const result = excelToJson({
    sourceFile: `${path}`,
    header: {
      rows: ROWS_TO_SKIP,
    },
    columnToKey: {
      A: "N",
      B: "Время создания",
      C: "Автор",
      D: "Содержание",
      E: "Тип",
      F: "Дом",
      G: "Источник",
      H: "Заявитель",
      I: "Помещение",
      J: "Реакция жильца",
      K: "Испольнитель",
      L: "Комментарий",
      M: "Адрес",
      N: "Удобное время",
      O: "Статус",
    },
  });

  return result;
};

const formatJSON = (path) => {
  const result = convertFile(path);

  const newFileName = path
    .replace("xlsx", "json")
    .slice(path.lastIndexOf("/"))
    .replace("/", "");

  const converted = JSON.stringify(result);

  fs.writeFile(`./${newFileName}`, converted, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });

  const sheet = JSON.parse(converted)["Лист1"];

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const grouped = Object.entries(groupBy(sheet, "Адрес"));

  let formatted = Array.from(grouped, (item) => {
    return {
      id: item[0],
      applications: Array.from(item[1], (element) => {
        return {
          id: element["N"],
          timestamp: element["Время создания"],
        };
      }),
    };
  });

  formatted = JSON.stringify(formatted);

  fs.writeFile(`${"../panel/formatted_" + newFileName}`, formatted, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });

  fs.writeFileSync(
    "../panel/config.json",
    JSON.stringify({
      date: new Date().toLocaleDateString("ru-RU"),
    }),
  );
};

const convertExcelToJSON = (path) => {
  if (!path) {
    convertAllFiles();
    return;
  }
  convertSingleFile(path);
};

const convertSingleFile = (path) => formatJSON(path);

const convertAllFiles = () => {
  formatJSON(SEVEN);
  formatJSON(MONTH);
  formatJSON(DAY);
};

convertExcelToJSON(filePath);
