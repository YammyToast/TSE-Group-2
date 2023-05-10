import { setupCanvas } from "./sketch.js";
import { COLOURSLIGHT, DEFAULTLABELS } from "./config.js";
import { Manager } from "./manager.js";
import { Controller } from "./controller.js";
import { drawGraph } from "./graph.js";

/**
 * Factory for the creation of the object hierarchy.
 * Initializes the Manager and Controller objects.
 * Requires a successful request to the data server succeed.
 * @returns Promise of an instance of a Manager.
 */
async function setupApp(): Promise<Manager> {
  // Find the labelContainer object within the HTML DOM.
  // This requires the document to have rendered first.
  let labelContainer: JQuery<HTMLElement> = $("#canvas-label-wrapper");
  // Initialize a controller. The setupCanvas function calls for a
  // basic setup render to be successful.
  let controller: Controller = await setupCanvas(COLOURSLIGHT, labelContainer);
  // we do a little dependency injection.
  // Inject the Controller into a new Manager instance.
  let manager = new Manager(controller);
  // add guard clause if max values fails.
  // reject promise etc.
  // use this as a test for server connectivity.
  manager.getMaximumValues();
  // Return the completed manager object.
  return manager;
}


let app = Promise.all([setupApp()])
.then((obj) => {
    let manager: Manager = obj[0];
    manager.controller.setupLabels(DEFAULTLABELS);
    manager.controller.positionLabels();
    manager.controller.renderLabels();
    manager.controller.renderSelectBarLabels();
    manager.handleYearSelection(1981)
    return manager
  })
  .catch((error) => {
    console.log(error);
  }).then((_manager) => {
    if(!_manager) throw 0;
      //JS to take the slider value, set the center point and tie the year value to the slider.
      document.getElementById("yearslider").oninput = function (e) {
        let value = (document.getElementById("yearslider") as any).value;
        // at 0%, top -41%
        let groundedValue = value - 1941;
        let percentOffset = groundedValue / (2023 - 1941);
        let offsetValue = 50 + -(100 * percentOffset);
        //console.log(offsetValue)
        document.getElementById("sliderlabel").style.top = `${offsetValue}%`;
      
        document.getElementById("sliderlabel").textContent = value;
        _manager.handleYearSelection(value)
      };

  });




