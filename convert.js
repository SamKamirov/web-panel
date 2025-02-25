#!/usr/bin/env node
"use strict";
const process = require("process");
const fs = require("node:fs");
const excelToJson = require("convert-excel-to-json");

const ROWS_TO_SKIP = 7;
const SORT_KEY = "Время создания";

let filePath;
let MONTH = "./30.xlsx";

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
      L: "Метка",
      M: "Комментарий",
      N: "Адрес",
      O: "Удобное время",
      P: "Статус",
    },
  });

  return result;
};

const sortByDate = (sheet) => {
  const converted = sheet.sort(
    (next, prev) => new Date(prev[SORT_KEY]) - new Date(next[SORT_KEY]),
  );

  return converted;
};

const formatJSON = (path) => {
  const convertedFile = convertFile(path);

  const convertedJSON = JSON.stringify(convertedFile);

  let sheet = JSON.parse(convertedJSON)["Лист1"];

  sheet = sortByDate(sheet);

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const groupedAddressesByHouse = Object.entries(groupBy(sheet, "Дом"));

  let formatted = Array.from(groupedAddressesByHouse, (item) => {
    return {
      id: item[0],
      applications: Array.from(item[1], (element) => {
        return {
          id: element["N"],
          timestamp: element["Время создания"],
          house: element["Дом"],
          type: element["Тип"],
        };
      }),
    };
  });

  formatted = JSON.stringify(formatted);

  fs.writeFile(`${"./public/data/data.json"}`, formatted, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });

  fs.writeFileSync(
    "./config.json",
    JSON.stringify({
      date: new Date().toLocaleDateString("ru-RU"),
    }),
  );
};

const convertExcelToJSON = () => formatJSON(MONTH);

convertExcelToJSON(filePath);
