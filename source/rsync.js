const Rsync = require("rsync");
const { CONFIG } = require("./config/config");
const path = require('node:path')
const fs = require("fs");

const uploadAllFiles = () => {
  for (const [key, value] of Object.entries(CONFIG.LOCATIONS)) {
    if (fs.existsSync(value.path.toString())) {
      rsync.source(path.resolve(value.path.toString()))
      executeShell()
    }
  }
}

const rsync = new Rsync()
  .shell(CONFIG.SHELL)
  .flags("avz")
  .destination(CONFIG.REMOTE);

const executeShell = () => {
  rsync.execute(
    function (error) {
      if (error) {
        console.error("Ошибка: файл не существует или есть ошибка в конфигурации.");
        return;
      }
      console.log("Files transfer completed successfully");
    }
  );
}

const upload = (file) => {
  rsync.cwd(__dirname);

  if (!file) {
    uploadAllFiles()
    return
  }

  rsync.source(path.resolve(file))
  executeShell()
};

module.exports = { upload };
