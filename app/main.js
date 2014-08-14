var game = require('./lib/game');

var w = window.innerWidth;
var h = window.innerHeight;

var $canvas = document.querySelector('#scene');
var ctx = $canvas.getContext('2d');

ctx.canvas.width = w;
ctx.canvas.height = h;

game.run({
    ctx: ctx,
    update: function(step) {
        console.log('render');
    },
    render: function(dt) {
        console.log('update');
    },
    fps: 30,
    slow: 4
    // options
});

// UI
var stopBtn = document.querySelector('#stop-btn');

stopBtn.addEventListener('click', function(e) {
    game.quit();
}, false);
