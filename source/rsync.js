const CONFIG = require("./config/config");

const Rsync = require("rsync");

const rsync = new Rsync()
  .shell(CONFIG.SHELL)
  .flags("avz")
  .source(`../public/data/data.json`)
  .destination(CONFIG.REMOTE);

const upload = () => {
  rsync.cwd(__dirname);
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
};

module.exports = { upload };
