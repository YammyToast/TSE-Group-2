export class Manager {
    constructor(_controller) {
        this.controller = _controller;
        this.controller.managerChangeCallback = this.contextChangeCallback;
    }
    contextChangeCallback(_active) {
        console.log(_active);
    }
}
//# sourceMappingURL=manager.js.map