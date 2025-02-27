const Rsync = require("rsync");

const REMOTE = "username@hostname:path/to/static/folder";
const SOURCE_PATH = `${__dirname}public/data/data.json`;
const PASSWORD = "";

const rsync = new Rsync()
  .shell("ssh -i ~/path/to/ssh/key") // Указываем путь к приватному ключу
  // .shell(`sshpass -p ${PASSWORD} ssh -o StrictHostKeyChecking=no`) // Указываем пароль для сервера
  .flags("avz")
  .source(SOURCE_PATH)
  .destination(REMOTE);

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
