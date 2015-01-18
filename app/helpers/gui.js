var dat = require('dat-gui');
var gui = new dat.GUI();

// model
var model = {
  pause: false,
  slow: 1
};

// controllers
var pauseController = gui.add(model, 'pause');
gui.add(model, 'slow', 1, 10).step(1);

// export
module.exports = {
  model: model,
  controllers: {
    pause: pauseController
  }
}

