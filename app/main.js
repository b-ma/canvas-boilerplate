var gui = require('./gui');
var vector = require('vector');
var loop = require('./lib/loop');
var Class = require('./lib/class');

var w = window.innerWidth;
var h = window.innerHeight;

var $canvas = document.querySelector('#scene');
var ctx = $canvas.getContext('2d');

ctx.canvas.width = w;
ctx.canvas.height = h;

// test shape -----------------------

var Shape = Class.extend({
    init: function() {
        this.distance = 100;
        this.angle = 0;
        this.angularVelocity = (Math.PI / 2);
        this.radius = 5;
    }
});
var shape = new Shape();

var update = function(dt) {
    shape.angle += shape.angularVelocity * dt;
}

var render = function(dt) {
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w/2, h/2);

    ctx.rotate(shape.angle);
    ctx.translate(shape.distance, 0);

    ctx.beginPath();
    ctx.fillStyle = '#ff530d';
    ctx.arc(0, 0, shape.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.restore();
}

// end test --------------------------

var options = {
    ctx: ctx,
    buffers: [],
    update: update,
    render: render,
    fps: 60,
    gui: gui.model
};

gui.controllers.pause.onChange(function(value) {
    value ? loop.quit() : loop.run(options);
});

loop.run(options);
