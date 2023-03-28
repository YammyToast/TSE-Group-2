import { setupCanvas } from './sketch.js';
import { COLOURSLIGHT, DEFAULTLABELS } from './config.js';
import { Manager } from './manager.js'
import { Controller } from './controller.js'

// we do a little dependency injection.
async function setupApp() : Promise<Manager> {
    
    let labelContainer: JQuery<HTMLElement> = $('#canvas-label-wrapper')
    let controller: Controller = await setupCanvas(COLOURSLIGHT, labelContainer)
    controller.setupLabels(DEFAULTLABELS);
    controller.positionLabels();
    controller.renderLabels();
    controller.renderSelectBarLabels();
    return new Manager(controller)
}

let app = Promise.all([setupApp()]).then((obj) => {
    console.log(obj)
})
