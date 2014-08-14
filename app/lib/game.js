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
