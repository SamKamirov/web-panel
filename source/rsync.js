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
        console.error("Error:", error);
        return;
      }
      console.log("Files transfer completed successfully");
    },
    function (data) {
      console.log("Progress:", data.toString());
    },
    function (data) {
      console.error("Error:", data.toString());
    },
  );
}

const upload = (file) => {
  rsync.cwd(__dirname);

  if (!file) {
    uploadAllFiles()
    return
  }

  rsync.source(file)
};

module.exports = { upload };
