#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");

const ROWS_TO_SKIP = 7;
const SORT_KEY = "Время создания";
const FILE_SUBSTRING = "ADocumentJournal";
const GROUP_BY_FIELD = "Дом";
const SAVE_PATH = `${__dirname}/public/data/data.json`;
const DIRECTORY_PATH = "./";

function findFilesWithExtension(directory, extension, searchQuery = "") {
  return new Promise((resolve) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error(`Ошибка при чтении директории: ${err.message}`);
        return;
      }

      const filteredFiles = files.filter(
        (file) =>
          path.extname(file).toLowerCase() === `.${extension.toLowerCase()}` &&
          file.includes(searchQuery),
      );

      if (filteredFiles.length > 0) {
        resolve(filteredFiles);
      } else {
        console.log(`Подходящих файлов не найдено.`);
      }
    });
  });
}

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
  try {
    const converted = sheet.sort(
      (next, prev) => new Date(prev[SORT_KEY]) - new Date(next[SORT_KEY]),
    );

    return converted;
  } catch (e) {
    console.log("Ошибка. Файл пуст или имеет неверный формат.");
    process.exit();
  }
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

  const groupedAddressesByHouse = Object.entries(
    groupBy(sheet, GROUP_BY_FIELD),
  );

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

  fs.writeFile(SAVE_PATH, formatted, (err) => {
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

const convertAllFiles = () => {
  findFilesWithExtension(DIRECTORY_PATH, "xlsx", FILE_SUBSTRING).then((files) =>
    files.map((file) => formatJSON(file)),
  );
};

const convertSingleFile = (path) => formatJSON(path);

const init = () => {
  const [firstFile, secondFile] = process.argv.slice(2);

  if (firstFile) {
    convertSingleFile(firstFile);
    return;
  }

  if (firstFile && secondFile) {
    convertAllFiles();
    return;
  }

  convertAllFiles();
};

init();
