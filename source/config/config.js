const CONFIG = {
  REMOTE: "username@hostname:/var/www/html/data/",
  SHELL: "ssh -i ~/path/to/ssh-key",
  LOCATIONS: {
    ZAR: {
      path: `${__dirname}/../../public/data/zar.json`
    },
    LOG: {
      path: `${__dirname}/../../public/data/log.json`
    }
  },
  ROWS_TO_SKIP: 7,
  SORT_KEY: "Время создания",
  FILE_PATTERN: "ADocumentJournal",
  GROUP_BY_FIELD: "Дом",
  DIRECTORY_PATH: "./",
};

module.exports = { CONFIG };
