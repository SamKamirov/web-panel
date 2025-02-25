const Rsync = require("rsync");

const REMOTE = "";
const SOURCE_PATH = "";
const PASSWORD = "";

const rsync = new Rsync()
  // .shell("ssh -i /path/to/your/private/key") // Указываем путь к приватному ключу
  .shell(`sshpass -p ${PASSWORD} ssh -o StrictHostKeyChecking=no`) // Указываем путь к приватному ключу
  .flags("avz")
  .source(SOURCE_PATH)
  .destination(REMOTE);

rsync.execute(
  function (error, code, cmd) {
    if (error) {
      console.error("Error:", error);
      return;
    }
    console.log("Sync completed successfully");
  },
  function (data) {
    console.log("Progress:", data.toString());
  },
  function (data) {
    console.error("Error:", data.toString());
  },
);
