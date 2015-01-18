var { w, h } = require('./globals');
var Class = require('./lib/class');
// test shape -----------------------
var Shape = Class.extend({
  init: function() {
    this.distance = 100;
    this.angle = 0;
    this.angularVelocity = (Math.PI / 2); // rad/s
    this.radius = 5;
  }
});

var shape;
// App
var App = {
  init: function() {
    shape = new Shape();
  },

  update: function(dt) {
    shape.angle = (shape.angle + shape.angularVelocity * dt) % (Math.PI * 2);
  },

  render: function(ctx, buffers, dt) {
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
}

module.exports = App;
