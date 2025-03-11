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
      A: 'N',
      B: '{{B7}}',
      C: '{{C7}}',
      D: '{{D7}}',
      E: '{{E7}}',
      F: '{{F7}}',
      G: '{{G7}}',
      H: '{{H7}}',
      I: '{{I7}}',
      J: '{{J7}}',
      K: '{{K7}}',
      L: '{{L7}}',
      M: '{{M7}}',
      N: '{{N7}}',
      O: '{{O7}}',
      P: '{{P7}}',
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

  const formatGroupedAddresses = (addresses) => {
    return Array.from(addresses, (item) => {
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
  }

  let addresses = {
    groupedByHouse: [],
    groupedByAddress: []
  };

  const groupedAddressesByHouse = Object.entries(groupBy([...sheet], CONFIG.GROUP_BY_FIELDS.HOUSE));
  const groupedAddressesByAddress = Object.entries(groupBy([...sheet], CONFIG.GROUP_BY_FIELDS.ADDRESS));

  const formattedGroupedAddressesByHouse = formatGroupedAddresses(groupedAddressesByHouse)
  const formattedGroupedAddressesByAddress = formatGroupedAddresses(groupedAddressesByAddress)

  addresses.groupedByHouse = formattedGroupedAddressesByHouse;
  addresses.groupedByAddress = formattedGroupedAddressesByAddress;

  const location = checkForLocation(formattedGroupedAddressesByHouse.slice(0, 5), 'log')

  const stringifiedAddresses = JSON.stringify(addresses);

  fs.writeFile(LOCATIONS[location].path, stringifiedAddresses, (err) => {
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
  ).then((files) => files.map((file) => convertJSON(file)));
};

const convertSingleFile = (path) => convertJSON(path);

const convert = (file) => {
  if (file) {
    convertSingleFile(file);
    return;
  }

  convertAllFiles();
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
      file ? upload(file) : upload();
      break;
    case "convert":
      file ? convert(file) : convert();
      break;
    case '--help':
      displayHelpInfo()
      break;
    default:
      convert();
      upload();
      break;
  }
};

const init = () => handleModeProp();

init();
