(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./lib/game":2}],2:[function(require,module,exports){
// http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var game = {
    run: function(options) {

        var now,
            dt       = 0,
            last     = timestamp(),
            slow     = options.slow || 1, // slow motion scaling factor
            step     = 1/options.fps,
            slowStep = slow * step,
            update   = options.update,
            render   = options.render;

        (function(that) {
            function loop() {
                now = timestamp();
                dt = dt + Math.min(1, (now - last) / 1000);

                while(dt > slowStep) {
                    dt = dt - slowStep;
                    update(step);
                }

                render(dt/slow);

                last = now;
                that.rAFid = requestAnimationFrame(loop);
            }

            requestAnimationFrame(loop);
        }(this));
    },

    quit: function() {
        cancelAnimationFrame(this.rAFid);
    }
};

module.exports = exports = game;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iZW4vU2l0ZXMvanMvcGxhdGZvcm0tZ2FtZS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi9hcHAvbWFpbi5qcyIsIi9Vc2Vycy9iZW4vU2l0ZXMvanMvcGxhdGZvcm0tZ2FtZS9hcHAvbGliL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2FtZSA9IHJlcXVpcmUoJy4vbGliL2dhbWUnKTtcblxudmFyIHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbnZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG52YXIgJGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzY2VuZScpO1xudmFyIGN0eCA9ICRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY3R4LmNhbnZhcy53aWR0aCA9IHc7XG5jdHguY2FudmFzLmhlaWdodCA9IGg7XG5cbmdhbWUucnVuKHtcbiAgICBjdHg6IGN0eCxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlbmRlcicpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbihkdCkge1xuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgfSxcbiAgICBmcHM6IDMwLFxuICAgIHNsb3c6IDRcbiAgICAvLyBvcHRpb25zXG59KTtcblxuLy8gVUlcbnZhciBzdG9wQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0b3AtYnRuJyk7XG5cbnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZ2FtZS5xdWl0KCk7XG59LCBmYWxzZSk7XG4iLCIvLyBodHRwOi8vY29kZWluY29tcGxldGUuY29tL3Bvc3RzLzIwMTMvMTIvNC9qYXZhc2NyaXB0X2dhbWVfZm91bmRhdGlvbnNfdGhlX2dhbWVfbG9vcC9cbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPyB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn1cblxudmFyIGdhbWUgPSB7XG4gICAgcnVuOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIG5vdyxcbiAgICAgICAgICAgIGR0ICAgICAgID0gMCxcbiAgICAgICAgICAgIGxhc3QgICAgID0gdGltZXN0YW1wKCksXG4gICAgICAgICAgICBzbG93ICAgICA9IG9wdGlvbnMuc2xvdyB8fCAxLCAvLyBzbG93IG1vdGlvbiBzY2FsaW5nIGZhY3RvclxuICAgICAgICAgICAgc3RlcCAgICAgPSAxL29wdGlvbnMuZnBzLFxuICAgICAgICAgICAgc2xvd1N0ZXAgPSBzbG93ICogc3RlcCxcbiAgICAgICAgICAgIHVwZGF0ZSAgID0gb3B0aW9ucy51cGRhdGUsXG4gICAgICAgICAgICByZW5kZXIgICA9IG9wdGlvbnMucmVuZGVyO1xuXG4gICAgICAgIChmdW5jdGlvbih0aGF0KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgICAgIG5vdyA9IHRpbWVzdGFtcCgpO1xuICAgICAgICAgICAgICAgIGR0ID0gZHQgKyBNYXRoLm1pbigxLCAobm93IC0gbGFzdCkgLyAxMDAwKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGR0ID4gc2xvd1N0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgZHQgPSBkdCAtIHNsb3dTdGVwO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGUoc3RlcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVuZGVyKGR0L3Nsb3cpO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcbiAgICAgICAgICAgICAgICB0aGF0LnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH0odGhpcykpO1xuICAgIH0sXG5cbiAgICBxdWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2FtZTtcbiJdfQ==
