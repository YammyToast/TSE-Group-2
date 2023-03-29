import { setupCanvas } from './sketch.js';
import { COLOURSLIGHT, DEFAULTLABELS } from './config.js';
import { Manager } from './manager.js'
import { Controller } from './controller.js'

// we do a little dependency injection.
async function setupApp() : Promise<Manager> {
    
    let labelContainer: JQuery<HTMLElement> = $('#canvas-label-wrapper')
    let controller: Controller = await setupCanvas(COLOURSLIGHT, labelContainer)
    let manager = new Manager(controller)
    // add guard clause if max values fails.
    // reject promise etc.
    // use this as a test for server connectivity.
    manager.getMaximumValues()
    return manager
}

let app = Promise.all([setupApp()])
.then((obj) => {
    let manager: Manager = obj[0]
    manager.controller.setupLabels(DEFAULTLABELS);
    manager.controller.positionLabels();
    manager.controller.renderLabels();
    manager.controller.renderSelectBarLabels();
    manager.handleYearSelection(2010)
})
.catch((error) => {
    console.log(error)
})
