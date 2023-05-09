var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupCanvas } from './sketch.js';
import { COLOURSLIGHT, DEFAULTLABELS } from './config.js';
import { Manager } from './manager.js';
import { drawGraph } from './graph.js';
/**
 * Factory for the creation of the object hierarchy.
 * Initializes the Manager and Controller objects.
 * Requires a successful request to the data server succeed.
 * @returns Promise of an instance of a Manager.
*/
function setupApp() {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the labelContainer object within the HTML DOM.
        // This requires the document to have rendered first.
        let labelContainer = $('#canvas-label-wrapper');
        // Initialize a controller. The setupCanvas function calls for a 
        // basic setup render to be successful.
        let controller = yield setupCanvas(COLOURSLIGHT, labelContainer);
        // we do a little dependency injection.
        // Inject the Controller into a new Manager instance.
        let manager = new Manager(controller);
        // add guard clause if max values fails.
        // reject promise etc.
        // use this as a test for server connectivity.
        manager.getMaximumValues();
        // Return the completed manager object.
        return manager;
    });
}
let app = Promise.all([setupApp()])
    .then((obj) => {
    let manager = obj[0];
    manager.controller.setupLabels(DEFAULTLABELS);
    manager.controller.positionLabels();
    manager.controller.renderLabels();
    manager.controller.renderSelectBarLabels();
    manager.handleYearSelection(2010);
})
    .catch((error) => {
    console.log(error);
});
var cnv = document.getElementById("graph-1");
drawGraph(cnv);
//# sourceMappingURL=app.js.map