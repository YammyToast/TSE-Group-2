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
import { Manager } from './types.js';
// we do a little dependency injection.
function setupApp() {
    return __awaiter(this, void 0, void 0, function* () {
        let labelContainer = $('#canvas-label-wrapper');
        let controller = yield setupCanvas(COLOURSLIGHT, labelContainer);
        controller.setupLabels(DEFAULTLABELS);
        controller.positionLabels();
        controller.renderLabels();
        controller.renderSelectBarLabels();
        return new Manager(controller);
    });
}
let app = Promise.all([setupApp()]).then((obj) => {
    console.log(obj);
});
//# sourceMappingURL=app.js.map