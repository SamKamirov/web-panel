import Unit from "./controller/unit";
import DataModel from "./model";
import DisplayModel from "./model/display-model";

const container = document.querySelector(".unit");

const dataModel = new DataModel();
const displayModel = new DisplayModel();

const app = new Unit({ container, dataModel, displayModel });

dataModel.init();
app.init();
