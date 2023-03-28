import { Controller } from './controller.js'

export class Manager {
    controller: Controller;



    constructor(_controller: Controller) {
        this.controller = _controller;
        this.controller.managerChangeCallback = this.contextChangeCallback;
    }

    contextChangeCallback(_active: string) {
        console.log(_active)
    }
}



