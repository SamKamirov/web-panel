import Unit from "./controller/unit";
import AddressesModel from "./model/addresses-model";
import DisplayModel from "./model/display-model";

const container = document.querySelector(".unit");

const dataModel = new AddressesModel();
const displayModel = new DisplayModel();

const app = new Unit({ container, dataModel, displayModel });

dataModel.init();
app.init();
