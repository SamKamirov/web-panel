#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const { CONFIG } = require("./config/config");
const { upload } = require("./rsync");
const { checkForLocation } = require("./lib");

const SAVE_PATH = `${__dirname}/../public/data`;

const LOCATIONS = {
  'zar': {
    path: `${SAVE_PATH}/zar.json`,
  },
  'log': {
    path: `${SAVE_PATH}/log.json`,
  }
}

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
      rows: CONFIG.ROWS_TO_SKIP,
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
      (next, prev) =>
        new Date(prev[CONFIG.SORT_KEY]) - new Date(next[CONFIG.SORT_KEY]),
    );

    return converted;
  } catch (e) {
    console.log("Ошибка. Файл пуст или имеет неверный формат.");
    process.exit();
  }
};

const convertJSON = (path) => {
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
    groupBy(sheet, CONFIG.GROUP_BY_FIELD),
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

  const location = checkForLocation(formatted.slice(0, 5), 'log')

  formatted = JSON.stringify(formatted);

  fs.writeFile(LOCATIONS[location].path, formatted, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });

  fs.writeFileSync(
    "../config.json",
    JSON.stringify({
      date: new Date().toLocaleDateString("ru-RU"),
    }),
  );
};

const convertAllFiles = () => {
  findFilesWithExtension(
    CONFIG.DIRECTORY_PATH,
    "xlsx",
    CONFIG.FILE_PATTERN,
  ).then((files) => {
    files.map((file) => convertJSON(file))
    upload()
  });
};

const convertSingleFile = (path) => convertJSON(path);

const convert = (file) => {
  if (file) {
    convertSingleFile(file);
    return;
  }

  return convertAllFiles();
};

const displayHelpInfo = () => {
  console.log('usage: web-converter <command> [<args>]\n')
  console.log('Commands:')
  console.log('  convert         - convert all files')
  console.log('  convert [file]  - convert single file')
  console.log('  upload          - upload all file')
  console.log('  upload [file]   - upload single file')
  console.log('  --help          - get this message')
}

const handleModeProp = () => {
  const [mode, file] = process.argv.slice(2);

  switch (mode) {
    case "upload":
      upload();
      break;
    case "convert":
      file ? convert(file) : convert();
      break;
    case '--help':
      displayHelpInfo()
      break;
    default:
      convert();
      break;
  }
};

const init = () => handleModeProp();

init();
