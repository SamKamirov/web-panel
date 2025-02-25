import Unit from "./controller/unit";
import DataModel from "./model";

const container = document.querySelector(".unit");

const dataModel = new DataModel();

const app = new Unit({ container, model: dataModel });

dataModel.init();
app.init();
