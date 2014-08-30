var dat = require('dat-gui');


var gui = new dat.GUI();

var model = {
    pause: false,
    slow: 1
};

var pauseController = gui.add(model, 'pause');
gui.add(model, 'slow', 1, 10).step(1);

module.exports = {
    model: model,
    controllers: {
        pause: pauseController
    }
}

