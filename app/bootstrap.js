var GLOBALS = require('./globals');
var world = require('./world');
var loop = require('./lib/loop');
var gui = require('./helpers/gui');
// create scene
var $canvas = document.querySelector('#scene');
var ctx = $canvas.getContext('2d');

ctx.canvas.width = GLOBALS.w;
ctx.canvas.height = GLOBALS.h;

// create buffers

// init application
world.init();
// launch loop
var options = {
    ctx: ctx,
    buffers: [],
    update: world.update,
    render: world.render,
    fps: GLOBALS.fps,
    gui: gui.model
};

gui.controllers.pause.onChange(function(value) {
    value ? loop.quit() : loop.run(options);
});

loop.run(options);
