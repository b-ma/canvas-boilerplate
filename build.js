(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
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
  controllers: {pause: pauseController}
};


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/gui.js
},{"dat-gui":7}],2:[function(require,module,exports){
"use strict";
var initializing = false,
    fnTest = /xyz/.test(function() {
      xyz;
    }) ? /\b_super\b/ : /.*/;
var Class = function() {};
Class.extend = function extend(prop) {
  var _super = this.prototype;
  initializing = true;
  var prototype = new this();
  initializing = false;
  for (var name in prop) {
    prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
      return function() {
        var tmp = this._super;
        this._super = _super[name];
        var ret = fn.apply(this, arguments);
        this._super = tmp;
        return ret;
      };
    })(name, prop[name]) : prop[name];
  }
  function Class() {
    if (!initializing && this.init)
      this.init.apply(this, arguments);
  }
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.extend = extend;
  return Class;
};
module.exports = Class;


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/lib/class.js
},{}],3:[function(require,module,exports){
"use strict";
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
var loop = {
  run: function(options) {
    var now,
        dt = 0,
        last = timestamp(),
        step = 1 / options.fps,
        ctx = options.ctx,
        buffers = options.buffers,
        update = options.update,
        render = options.render,
        gui = options.gui;
    (function(that) {
      function loop() {
        var slow = gui.slow;
        var slowStep = slow * step;
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > slowStep) {
          dt = dt - slowStep;
          update(step);
        }
        render(ctx, buffers, dt / slow);
        last = now;
        that.rAFid = requestAnimationFrame(loop);
      }
      that.rAFid = requestAnimationFrame(loop);
    }(this));
  },
  quit: function() {
    cancelAnimationFrame(this.rAFid);
  }
};
module.exports = exports = loop;


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/lib/loop.js
},{}],4:[function(require,module,exports){
"use strict";
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
var Shape = Class.extend({init: function() {
    this.distance = 100;
    this.angle = 0;
    this.angularVelocity = (Math.PI / 2);
    this.radius = 5;
  }});
var shape = new Shape();
var update = function(dt) {
  shape.angle = (shape.angle + shape.angularVelocity * dt) % (Math.PI * 2);
};
var render = function(dt) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(shape.angle);
  ctx.translate(shape.distance, 0);
  ctx.beginPath();
  ctx.fillStyle = '#ff530d';
  ctx.arc(0, 0, shape.radius, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
};
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


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/main.js
},{"./gui":1,"./lib/class":2,"./lib/loop":3,"vector":11}],5:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":6}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
"use strict";
module.exports = require('./vendor/dat.gui');
module.exports.color = require('./vendor/dat.color');


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/node_modules/dat-gui/index.js
},{"./vendor/dat.color":8,"./vendor/dat.gui":9}],8:[function(require,module,exports){
"use strict";
var dat = module.exports = dat || {};
dat.color = dat.color || {};
dat.utils = dat.utils || {};
dat.utils.common = (function() {
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;
  return {
    BREAK: {},
    extend: function(target) {
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        for (var key in obj)
          if (!this.isUndefined(obj[key]))
            target[key] = obj[key];
      }, this);
      return target;
    },
    defaults: function(target) {
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        for (var key in obj)
          if (this.isUndefined(target[key]))
            target[key] = obj[key];
      }, this);
      return target;
    },
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
      return function() {
        var args = ARR_SLICE.call(arguments);
        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }
        return args[0];
      };
    },
    each: function(obj, itr, scope) {
      if (ARR_EACH && obj.forEach === ARR_EACH) {
        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        for (var key = 0,
            l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK)
            return;
      } else {
        for (var key in obj)
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
      }
    },
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    toArray: function(obj) {
      if (obj.toArray)
        return obj.toArray();
      return ARR_SLICE.call(obj);
    },
    isUndefined: function(obj) {
      return obj === undefined;
    },
    isNull: function(obj) {
      return obj === null;
    },
    isNaN: function(obj) {
      return obj !== obj;
    },
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    isObject: function(obj) {
      return obj === Object(obj);
    },
    isNumber: function(obj) {
      return obj === obj + 0;
    },
    isString: function(obj) {
      return obj === obj + '';
    },
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  };
})();
dat.color.toString = (function(common) {
  return function(color) {
    if (color.a == 1 || common.isUndefined(color.a)) {
      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }
      return '#' + s;
    } else {
      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
    }
  };
})(dat.utils.common);
dat.Color = dat.color.Color = (function(interpret, math, toString, common) {
  var Color = function() {
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }
    this.__state.a = this.__state.a || 1;
  };
  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
  common.extend(Color.prototype, {
    toString: function() {
      return toString(this);
    },
    toOriginal: function() {
      return this.__state.conversion.write(this);
    }
  });
  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);
  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');
  Object.defineProperty(Color.prototype, 'a', {
    get: function() {
      return this.__state.a;
    },
    set: function(v) {
      this.__state.a = v;
    }
  });
  Object.defineProperty(Color.prototype, 'hex', {
    get: function() {
      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }
      return this.__state.hex;
    },
    set: function(v) {
      this.__state.space = 'HEX';
      this.__state.hex = v;
    }
  });
  function defineRGBComponent(target, component, componentHexIndex) {
    Object.defineProperty(target, component, {
      get: function() {
        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }
        recalculateRGB(this, component, componentHexIndex);
        return this.__state[component];
      },
      set: function(v) {
        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }
        this.__state[component] = v;
      }
    });
  }
  function defineHSVComponent(target, component) {
    Object.defineProperty(target, component, {
      get: function() {
        if (this.__state.space === 'HSV')
          return this.__state[component];
        recalculateHSV(this);
        return this.__state[component];
      },
      set: function(v) {
        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }
        this.__state[component] = v;
      }
    });
  }
  function recalculateRGB(color, component, componentHexIndex) {
    if (color.__state.space === 'HEX') {
      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {
      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {
      throw 'Corrupted color state';
    }
  }
  function recalculateHSV(color) {
    var result = math.rgb_to_hsv(color.r, color.g, color.b);
    common.extend(color.__state, {
      s: result.s,
      v: result.v
    });
    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  }
  return Color;
})(dat.color.interpret = (function(toString, common) {
  var result,
      toReturn;
  var interpret = function() {
    toReturn = false;
    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];
    common.each(INTERPRETATIONS, function(family) {
      if (family.litmus(original)) {
        common.each(family.conversions, function(conversion, conversionName) {
          result = conversion.read(original);
          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;
          }
        });
        return common.BREAK;
      }
    });
    return toReturn;
  };
  var INTERPRETATIONS = [{
    litmus: common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null)
            return false;
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString())
          };
        },
        write: toString
      },
      SIX_CHAR_HEX: {
        read: function(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null)
            return false;
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString())
          };
        },
        write: toString
      },
      CSS_RGB: {
        read: function(original) {
          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null)
            return false;
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: toString
      },
      CSS_RGBA: {
        read: function(original) {
          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
          if (test === null)
            return false;
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: toString
      }
    }
  }, {
    litmus: common.isNumber,
    conversions: {HEX: {
        read: function(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },
        write: function(color) {
          return color.hex;
        }
      }}
  }, {
    litmus: common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function(original) {
          if (original.length != 3)
            return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function(original) {
          if (original.length != 4)
            return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  }, {
    litmus: common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b) && common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },
        write: function(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },
        write: function(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v) && common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },
        write: function(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },
        write: function(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }];
  return interpret;
})(dat.color.toString, dat.utils.common), dat.color.math = (function() {
  var tmpComponent;
  return {
    hsv_to_rgb: function(h, s, v) {
      var hi = Math.floor(h / 60) % 6;
      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },
    rgb_to_hsv: function(r, g, b) {
      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h,
          s;
      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }
      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }
      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },
    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },
    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },
    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~(0xFF << tmpComponent));
    }
  };
})(), dat.color.toString, dat.utils.common);


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/node_modules/dat-gui/vendor/dat.color.js
},{}],9:[function(require,module,exports){
"use strict";
var dat = module.exports = dat || {};
dat.gui = dat.gui || {};
dat.utils = dat.utils || {};
dat.controllers = dat.controllers || {};
dat.dom = dat.dom || {};
dat.color = dat.color || {};
dat.utils.css = (function() {
  return {
    load: function(url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  };
})();
dat.utils.common = (function() {
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;
  return {
    BREAK: {},
    extend: function(target) {
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        for (var key in obj)
          if (!this.isUndefined(obj[key]))
            target[key] = obj[key];
      }, this);
      return target;
    },
    defaults: function(target) {
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        for (var key in obj)
          if (this.isUndefined(target[key]))
            target[key] = obj[key];
      }, this);
      return target;
    },
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
      return function() {
        var args = ARR_SLICE.call(arguments);
        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }
        return args[0];
      };
    },
    each: function(obj, itr, scope) {
      if (ARR_EACH && obj.forEach === ARR_EACH) {
        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        for (var key = 0,
            l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK)
            return;
      } else {
        for (var key in obj)
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
      }
    },
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    toArray: function(obj) {
      if (obj.toArray)
        return obj.toArray();
      return ARR_SLICE.call(obj);
    },
    isUndefined: function(obj) {
      return obj === undefined;
    },
    isNull: function(obj) {
      return obj === null;
    },
    isNaN: function(obj) {
      return obj !== obj;
    },
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    isObject: function(obj) {
      return obj === Object(obj);
    },
    isNumber: function(obj) {
      return obj === obj + 0;
    },
    isString: function(obj) {
      return obj === obj + '';
    },
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  };
})();
dat.controllers.Controller = (function(common) {
  var Controller = function(object, property) {
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  };
  common.extend(Controller.prototype, {
    onChange: function(fnc) {
      this.__onChange = fnc;
      return this;
    },
    onFinishChange: function(fnc) {
      this.__onFinishChange = fnc;
      return this;
    },
    setValue: function(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    },
    getValue: function() {
      return this.object[this.property];
    },
    updateDisplay: function() {
      return this;
    },
    isModified: function() {
      return this.initialValue !== this.getValue();
    }
  });
  return Controller;
})(dat.utils.common);
dat.dom.dom = (function(common) {
  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };
  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });
  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
  function cssValueToPixels(val) {
    if (val === '0' || common.isUndefined(val))
      return 0;
    var match = val.match(CSS_VALUE_PIXELS);
    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }
    return 0;
  }
  var dom = {
    makeSelectable: function(elem, selectable) {
      if (elem === undefined || elem.style === undefined)
        return;
      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {};
      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';
    },
    makeFullscreen: function(elem, horizontal, vertical) {
      if (common.isUndefined(horizontal))
        horizontal = true;
      if (common.isUndefined(vertical))
        vertical = true;
      elem.style.position = 'absolute';
      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }
    },
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {} else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },
    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },
    getWidth: function(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style['width']);
    },
    getHeight: function(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style['height']);
    },
    getOffset: function(elem) {
      var offset = {
        left: 0,
        top: 0
      };
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },
    isActive: function(elem) {
      return elem === document.activeElement && (elem.type || elem.href);
    }
  };
  return dom;
})(dat.utils.common);
dat.controllers.OptionController = (function(Controller, dom, common) {
  var OptionController = function(object, property, options) {
    OptionController.superclass.call(this, object, property);
    var _this = this;
    this.__select = document.createElement('select');
    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }
    common.each(options, function(value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    this.updateDisplay();
    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    this.domElement.appendChild(this.__select);
  };
  OptionController.superclass = Controller;
  common.extend(OptionController.prototype, Controller.prototype, {
    setValue: function(v) {
      var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    },
    updateDisplay: function() {
      this.__select.value = this.getValue();
      return OptionController.superclass.prototype.updateDisplay.call(this);
    }
  });
  return OptionController;
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.NumberController = (function(Controller, common) {
  var NumberController = function(object, property, params) {
    NumberController.superclass.call(this, object, property);
    params = params || {};
    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;
    if (common.isUndefined(this.__step)) {
      if (this.initialValue == 0) {
        this.__impliedStep = 1;
      } else {
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10;
      }
    } else {
      this.__impliedStep = this.__step;
    }
    this.__precision = numDecimals(this.__impliedStep);
  };
  NumberController.superclass = Controller;
  common.extend(NumberController.prototype, Controller.prototype, {
    setValue: function(v) {
      if (this.__min !== undefined && v < this.__min) {
        v = this.__min;
      } else if (this.__max !== undefined && v > this.__max) {
        v = this.__max;
      }
      if (this.__step !== undefined && v % this.__step != 0) {
        v = Math.round(v / this.__step) * this.__step;
      }
      return NumberController.superclass.prototype.setValue.call(this, v);
    },
    min: function(v) {
      this.__min = v;
      return this;
    },
    max: function(v) {
      this.__max = v;
      return this;
    },
    step: function(v) {
      this.__step = v;
      return this;
    }
  });
  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }
  return NumberController;
})(dat.controllers.Controller, dat.utils.common);
dat.controllers.NumberControllerBox = (function(NumberController, dom, common) {
  var NumberControllerBox = function(object, property, params) {
    this.__truncationSuspended = false;
    NumberControllerBox.superclass.call(this, object, property, params);
    var _this = this;
    var prev_y;
    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }
    });
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted))
        _this.setValue(attempted);
    }
    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }
    function onMouseDrag(e) {
      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prev_y = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }
    this.updateDisplay();
    this.domElement.appendChild(this.__input);
  };
  NumberControllerBox.superclass = NumberController;
  common.extend(NumberControllerBox.prototype, NumberController.prototype, {updateDisplay: function() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
    }});
  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }
  return NumberControllerBox;
})(dat.controllers.NumberController, dat.dom.dom, dat.utils.common);
dat.controllers.NumberControllerSlider = (function(NumberController, dom, css, common, styleSheet) {
  var NumberControllerSlider = function(object, property, min, max, step) {
    NumberControllerSlider.superclass.call(this, object, property, {
      min: min,
      max: max,
      step: step
    });
    var _this = this;
    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    dom.bind(this.__background, 'mousedown', onMouseDown);
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      _this.setValue(map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    this.updateDisplay();
    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);
  };
  NumberControllerSlider.superclass = NumberController;
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };
  common.extend(NumberControllerSlider.prototype, NumberController.prototype, {updateDisplay: function() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
    }});
  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }
  return NumberControllerSlider;
})(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
dat.controllers.FunctionController = (function(Controller, dom, common) {
  var FunctionController = function(object, property, text) {
    FunctionController.superclass.call(this, object, property);
    var _this = this;
    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(this.__button, 'button');
    this.domElement.appendChild(this.__button);
  };
  FunctionController.superclass = Controller;
  common.extend(FunctionController.prototype, Controller.prototype, {fire: function() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.getValue().call(this.object);
    }});
  return FunctionController;
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.BooleanController = (function(Controller, dom, common) {
  var BooleanController = function(object, property) {
    BooleanController.superclass.call(this, object, property);
    var _this = this;
    this.__prev = this.getValue();
    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');
    dom.bind(this.__checkbox, 'change', onChange, false);
    this.domElement.appendChild(this.__checkbox);
    this.updateDisplay();
    function onChange() {
      _this.setValue(!_this.__prev);
    }
  };
  BooleanController.superclass = Controller;
  common.extend(BooleanController.prototype, Controller.prototype, {
    setValue: function(v) {
      var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    },
    updateDisplay: function() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
      } else {
        this.__checkbox.checked = false;
      }
      return BooleanController.superclass.prototype.updateDisplay.call(this);
    }
  });
  return BooleanController;
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.color.toString = (function(common) {
  return function(color) {
    if (color.a == 1 || common.isUndefined(color.a)) {
      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }
      return '#' + s;
    } else {
      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
    }
  };
})(dat.utils.common);
dat.color.interpret = (function(toString, common) {
  var result,
      toReturn;
  var interpret = function() {
    toReturn = false;
    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];
    common.each(INTERPRETATIONS, function(family) {
      if (family.litmus(original)) {
        common.each(family.conversions, function(conversion, conversionName) {
          result = conversion.read(original);
          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;
          }
        });
        return common.BREAK;
      }
    });
    return toReturn;
  };
  var INTERPRETATIONS = [{
    litmus: common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null)
            return false;
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString())
          };
        },
        write: toString
      },
      SIX_CHAR_HEX: {
        read: function(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null)
            return false;
          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString())
          };
        },
        write: toString
      },
      CSS_RGB: {
        read: function(original) {
          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null)
            return false;
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: toString
      },
      CSS_RGBA: {
        read: function(original) {
          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
          if (test === null)
            return false;
          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: toString
      }
    }
  }, {
    litmus: common.isNumber,
    conversions: {HEX: {
        read: function(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },
        write: function(color) {
          return color.hex;
        }
      }}
  }, {
    litmus: common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function(original) {
          if (original.length != 3)
            return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function(original) {
          if (original.length != 4)
            return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  }, {
    litmus: common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b) && common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },
        write: function(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },
        write: function(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v) && common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },
        write: function(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },
        write: function(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }];
  return interpret;
})(dat.color.toString, dat.utils.common);
dat.GUI = dat.gui.GUI = (function(css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {
  css.inject(styleSheet);
  var CSS_NAMESPACE = 'dg';
  var HIDE_KEY_CODE = 72;
  var CLOSE_BUTTON_HEIGHT = 20;
  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();
  var SAVE_DIALOGUE;
  var auto_place_virgin = true;
  var auto_place_container;
  var hide = false;
  var hideable_guis = [];
  var GUI = function(params) {
    var _this = this;
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);
    dom.addClass(this.domElement, CSS_NAMESPACE);
    this.__folders = {};
    this.__controllers = [];
    this.__rememberedObjects = [];
    this.__rememberedObjectIndecesToControllers = [];
    this.__listening = [];
    params = params || {};
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });
    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });
    if (!common.isUndefined(params.load)) {
      if (params.preset)
        params.load.preset = params.preset;
    } else {
      params.load = {preset: DEFAULT_DEFAULT_PRESET_NAME};
    }
    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }
    params.resizable = common.isUndefined(params.parent) && params.resizable;
    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
    var use_local_storage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
    Object.defineProperties(this, {
      parent: {get: function() {
          return params.parent;
        }},
      scrollable: {get: function() {
          return params.scrollable;
        }},
      autoPlace: {get: function() {
          return params.autoPlace;
        }},
      preset: {
        get: function() {
          if (_this.parent) {
            return _this.getRoot().preset;
          } else {
            return params.load.preset;
          }
        },
        set: function(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }
      },
      width: {
        get: function() {
          return params.width;
        },
        set: function(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      name: {
        get: function() {
          return params.name;
        },
        set: function(v) {
          params.name = v;
          if (title_row_name) {
            title_row_name.innerHTML = params.name;
          }
        }
      },
      closed: {
        get: function() {
          return params.closed;
        },
        set: function(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
          }
          this.onResize();
          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
          }
        }
      },
      load: {get: function() {
          return params.load;
        }},
      useLocalStorage: {
        get: function() {
          return use_local_storage;
        },
        set: function(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            use_local_storage = bool;
            if (bool) {
              dom.bind(window, 'unload', saveToLocalStorage);
            } else {
              dom.unbind(window, 'unload', saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
          }
        }
      }
    });
    if (common.isUndefined(params.parent)) {
      params.closed = false;
      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);
      if (SUPPORTS_LOCAL_STORAGE) {
        if (use_local_storage) {
          _this.useLocalStorage = true;
          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }
        }
      }
      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);
      dom.bind(this.__closeButton, 'click', function() {
        _this.closed = !_this.closed;
      });
    } else {
      if (params.closed === undefined) {
        params.closed = true;
      }
      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');
      var title_row = addRow(_this, title_row_name);
      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };
      dom.addClass(this.__ul, GUI.CLASS_CLOSED);
      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);
      if (!params.closed) {
        this.closed = false;
      }
    }
    if (params.autoPlace) {
      if (common.isUndefined(params.parent)) {
        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }
        auto_place_container.appendChild(this.domElement);
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
      }
      if (!this.parent)
        setWidth(_this, params.width);
    }
    dom.bind(window, 'resize', function() {
      _this.onResize();
    });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() {
      _this.onResize();
    });
    dom.bind(this.__ul, 'transitionend', function() {
      _this.onResize();
    });
    dom.bind(this.__ul, 'oTransitionEnd', function() {
      _this.onResize();
    });
    this.onResize();
    if (params.resizable) {
      addResizeHandle(this);
    }
    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
    var root = _this.getRoot();
    function resetWidth() {
      var root = _this.getRoot();
      root.width += 1;
      common.defer(function() {
        root.width -= 1;
      });
    }
    if (!params.parent) {
      resetWidth();
    }
  };
  GUI.toggleHide = function() {
    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };
  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';
  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';
  dom.bind(window, 'keydown', function(e) {
    if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }
  }, false);
  common.extend(GUI.prototype, {
    add: function(object, property) {
      return add(this, object, property, {factoryArgs: Array.prototype.slice.call(arguments, 2)});
    },
    addColor: function(object, property) {
      return add(this, object, property, {color: true});
    },
    remove: function(controller) {
      this.__ul.removeChild(controller.__li);
      this.__controllers.slice(this.__controllers.indexOf(controller), 1);
      var _this = this;
      common.defer(function() {
        _this.onResize();
      });
    },
    destroy: function() {
      if (this.autoPlace) {
        auto_place_container.removeChild(this.domElement);
      }
    },
    addFolder: function(name) {
      if (this.__folders[name] !== undefined) {
        throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
      }
      var new_gui_params = {
        name: name,
        parent: this
      };
      new_gui_params.autoPlace = this.autoPlace;
      if (this.load && this.load.folders && this.load.folders[name]) {
        new_gui_params.closed = this.load.folders[name].closed;
        new_gui_params.load = this.load.folders[name];
      }
      var gui = new GUI(new_gui_params);
      this.__folders[name] = gui;
      var li = addRow(this, gui.domElement);
      dom.addClass(li, 'folder');
      return gui;
    },
    open: function() {
      this.closed = false;
    },
    close: function() {
      this.closed = true;
    },
    onResize: function() {
      var root = this.getRoot();
      if (root.scrollable) {
        var top = dom.getOffset(root.__ul).top;
        var h = 0;
        common.each(root.__ul.childNodes, function(node) {
          if (!(root.autoPlace && node === root.__save_row))
            h += dom.getHeight(node);
        });
        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = 'auto';
        }
      }
      if (root.__resize_handle) {
        common.defer(function() {
          root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
        });
      }
      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + 'px';
      }
    },
    remember: function() {
      if (common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
      }
      if (this.parent) {
        throw new Error("You can only call remember on a top level GUI.");
      }
      var _this = this;
      common.each(Array.prototype.slice.call(arguments), function(object) {
        if (_this.__rememberedObjects.length == 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) == -1) {
          _this.__rememberedObjects.push(object);
        }
      });
      if (this.autoPlace) {
        setWidth(this, this.width);
      }
    },
    getRoot: function() {
      var gui = this;
      while (gui.parent) {
        gui = gui.parent;
      }
      return gui;
    },
    getSaveObject: function() {
      var toReturn = this.load;
      toReturn.closed = this.closed;
      if (this.__rememberedObjects.length > 0) {
        toReturn.preset = this.preset;
        if (!toReturn.remembered) {
          toReturn.remembered = {};
        }
        toReturn.remembered[this.preset] = getCurrentPreset(this);
      }
      toReturn.folders = {};
      common.each(this.__folders, function(element, key) {
        toReturn.folders[key] = element.getSaveObject();
      });
      return toReturn;
    },
    save: function() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }
      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
    },
    saveAs: function(presetName) {
      if (!this.load.remembered) {
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }
      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
    },
    revert: function(gui) {
      common.each(this.__controllers, function(controller) {
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }
      }, this);
      common.each(this.__folders, function(folder) {
        folder.revert(folder);
      });
      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },
    listen: function(controller) {
      var init = this.__listening.length == 0;
      this.__listening.push(controller);
      if (init)
        updateDisplays(this.__listening);
    }
  });
  function add(gui, object, property, params) {
    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }
    var controller;
    if (params.color) {
      controller = new ColorController(object, property);
    } else {
      var factoryArgs = [object, property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);
    }
    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }
    recallSavedValue(gui, controller);
    dom.addClass(controller.domElement, 'c');
    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;
    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);
    var li = addRow(gui, container, params.before);
    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());
    augmentController(gui, li, controller);
    gui.__controllers.push(controller);
    return controller;
  }
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom)
      li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }
  function augmentController(gui, li, controller) {
    controller.__li = li;
    controller.__gui = gui;
    common.extend(controller, {
      options: function(options) {
        if (arguments.length > 1) {
          controller.remove();
          return add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [common.toArray(arguments)]
          });
        }
        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();
          return add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [options]
          });
        }
      },
      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },
      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },
      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }
    });
    if (controller instanceof NumberControllerSlider) {
      var box = new NumberControllerBox(controller.object, controller.property, {
        min: controller.__min,
        max: controller.__max,
        step: controller.__step
      });
      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        };
      });
      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
    } else if (controller instanceof NumberControllerBox) {
      var r = function(returned) {
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {
          controller.remove();
          return add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [controller.__min, controller.__max, controller.__step]
          });
        }
        return returned;
      };
      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);
    } else if (controller instanceof BooleanController) {
      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });
      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation();
      });
    } else if (controller instanceof FunctionController) {
      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });
      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });
      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });
    } else if (controller instanceof ColorController) {
      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);
      controller.updateDisplay();
    }
    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);
  }
  function recallSavedValue(gui, controller) {
    var root = gui.getRoot();
    var matched_index = root.__rememberedObjects.indexOf(controller.object);
    if (matched_index != -1) {
      var controller_map = root.__rememberedObjectIndecesToControllers[matched_index];
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] = controller_map;
      }
      controller_map[controller.property] = controller;
      if (root.load && root.load.remembered) {
        var preset_map = root.load.remembered;
        var preset;
        if (preset_map[gui.preset]) {
          preset = preset_map[gui.preset];
        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];
        } else {
          return;
        }
        if (preset[matched_index] && preset[matched_index][controller.property] !== undefined) {
          var value = preset[matched_index][controller.property];
          controller.initialValue = value;
          controller.setValue(value);
        }
      }
    }
  }
  function getLocalStorageHash(gui, key) {
    return document.location.href + '.' + key;
  }
  function addSaveMenu(gui) {
    var div = gui.__save_row = document.createElement('li');
    dom.addClass(gui.domElement, 'has-save');
    gui.__ul.insertBefore(div, gui.__ul.firstChild);
    dom.addClass(div, 'save-row');
    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');
    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');
    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');
    var select = gui.__preset_select = document.createElement('select');
    if (gui.load && gui.load.remembered) {
      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });
    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }
    dom.bind(select, 'change', function() {
      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }
      gui.preset = this.value;
    });
    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);
    if (SUPPORTS_LOCAL_STORAGE) {
      var showHideExplain = function() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      };
      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');
      saveLocally.style.display = 'block';
      var localStorageCheckBox = document.getElementById('dg-local-storage');
      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }
      showHideExplain();
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });
    }
    var newConstructorTextArea = document.getElementById('dg-new-constructor');
    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });
    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });
    dom.bind(button, 'click', function() {
      gui.save();
    });
    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName)
        gui.saveAs(presetName);
    });
    dom.bind(button3, 'click', function() {
      gui.revert();
    });
  }
  function addResizeHandle(gui) {
    gui.__resize_handle = document.createElement('div');
    common.extend(gui.__resize_handle.style, {
      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
    });
    var pmouseX;
    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);
    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
    function dragStart(e) {
      e.preventDefault();
      pmouseX = e.clientX;
      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);
      return false;
    }
    function drag(e) {
      e.preventDefault();
      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;
      return false;
    }
    function dragStop() {
      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);
    }
  }
  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }
    if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }
  function getCurrentPreset(gui, useInitialValues) {
    var toReturn = {};
    common.each(gui.__rememberedObjects, function(val, index) {
      var saved_values = {};
      var controller_map = gui.__rememberedObjectIndecesToControllers[index];
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });
      toReturn[index] = saved_values;
    });
    return toReturn;
  }
  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }
  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }
  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }
  function updateDisplays(controllerArray) {
    if (controllerArray.length != 0) {
      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });
    }
    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });
  }
  return GUI;
})(dat.utils.css, "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>", ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", dat.controllers.factory = (function(OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {
  return function(object, property) {
    var initialValue = object[property];
    if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
      return new OptionController(object, property, arguments[2]);
    }
    if (common.isNumber(initialValue)) {
      if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
      } else {
        return new NumberControllerBox(object, property, {
          min: arguments[2],
          max: arguments[3]
        });
      }
    }
    if (common.isString(initialValue)) {
      return new StringController(object, property);
    }
    if (common.isFunction(initialValue)) {
      return new FunctionController(object, property, '');
    }
    if (common.isBoolean(initialValue)) {
      return new BooleanController(object, property);
    }
  };
})(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = (function(Controller, dom, common) {
  var StringController = function(object, property) {
    StringController.superclass.call(this, object, property);
    var _this = this;
    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');
    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    this.updateDisplay();
    this.domElement.appendChild(this.__input);
  };
  StringController.superclass = Controller;
  common.extend(StringController.prototype, Controller.prototype, {updateDisplay: function() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return StringController.superclass.prototype.updateDisplay.call(this);
    }});
  return StringController;
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = (function(Controller, dom, Color, interpret, common) {
  var ColorController = function(object, property) {
    ColorController.superclass.call(this, object, property);
    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);
    var _this = this;
    this.domElement = document.createElement('div');
    dom.makeSelectable(this.domElement, false);
    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';
    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';
    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';
    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';
    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';
    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__selector, 'mousedown', function(e) {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function(e) {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var value_field = document.createElement('div');
    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');
    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });
    hueGradient(this.__hue_field);
    common.extend(this.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);
    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }
    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }
    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);
    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);
    this.updateDisplay();
    function setSV(e) {
      e.preventDefault();
      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;
      if (v > 1)
        v = 1;
      else if (v < 0)
        v = 0;
      if (s > 1)
        s = 1;
      else if (s < 0)
        s = 0;
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      e.preventDefault();
      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;
      if (h > 1)
        h = 1;
      else if (h < 0)
        h = 0;
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
  };
  ColorController.superclass = Controller;
  common.extend(ColorController.prototype, Controller.prototype, {updateDisplay: function() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        common.each(Color.COMPONENTS, function(component) {
          if (!common.isUndefined(i[component]) && !common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          common.extend(this.__color.__state, i);
        }
      }
      common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
      var _flip = 255 - flip;
      common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());
      common.extend(this.__input.style, {
        backgroundColor: this.__input.value = this.__color.toString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }});
  var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
  }
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  }
  return ColorController;
})(dat.controllers.Controller, dat.dom.dom, dat.color.Color = (function(interpret, math, toString, common) {
  var Color = function() {
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }
    this.__state.a = this.__state.a || 1;
  };
  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
  common.extend(Color.prototype, {
    toString: function() {
      return toString(this);
    },
    toOriginal: function() {
      return this.__state.conversion.write(this);
    }
  });
  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);
  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');
  Object.defineProperty(Color.prototype, 'a', {
    get: function() {
      return this.__state.a;
    },
    set: function(v) {
      this.__state.a = v;
    }
  });
  Object.defineProperty(Color.prototype, 'hex', {
    get: function() {
      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }
      return this.__state.hex;
    },
    set: function(v) {
      this.__state.space = 'HEX';
      this.__state.hex = v;
    }
  });
  function defineRGBComponent(target, component, componentHexIndex) {
    Object.defineProperty(target, component, {
      get: function() {
        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }
        recalculateRGB(this, component, componentHexIndex);
        return this.__state[component];
      },
      set: function(v) {
        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }
        this.__state[component] = v;
      }
    });
  }
  function defineHSVComponent(target, component) {
    Object.defineProperty(target, component, {
      get: function() {
        if (this.__state.space === 'HSV')
          return this.__state[component];
        recalculateHSV(this);
        return this.__state[component];
      },
      set: function(v) {
        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }
        this.__state[component] = v;
      }
    });
  }
  function recalculateRGB(color, component, componentHexIndex) {
    if (color.__state.space === 'HEX') {
      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {
      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {
      throw 'Corrupted color state';
    }
  }
  function recalculateHSV(color) {
    var result = math.rgb_to_hsv(color.r, color.g, color.b);
    common.extend(color.__state, {
      s: result.s,
      v: result.v
    });
    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  }
  return Color;
})(dat.color.interpret, dat.color.math = (function() {
  var tmpComponent;
  return {
    hsv_to_rgb: function(h, s, v) {
      var hi = Math.floor(h / 60) % 6;
      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },
    rgb_to_hsv: function(r, g, b) {
      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h,
          s;
      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }
      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }
      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },
    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },
    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },
    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~(0xFF << tmpComponent));
    }
  };
})(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = (function() {
  return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
    window.setTimeout(callback, 1000 / 60);
  };
})(), dat.dom.CenteredDiv = (function(dom, common) {
  var CenteredDiv = function() {
    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });
  };
  CenteredDiv.prototype.show = function() {
    var _this = this;
    this.backgroundElement.style.display = 'block';
    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';
    this.layout();
    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });
  };
  CenteredDiv.prototype.hide = function() {
    var _this = this;
    var hide = function() {
      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';
      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);
    };
    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);
    this.backgroundElement.style.opacity = 0;
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';
  };
  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  function lockScroll(e) {
    console.log(e);
  }
  return CenteredDiv;
})(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common);


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/node_modules/dat-gui/vendor/dat.gui.js
},{}],10:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $keys = $Object.keys;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  var $preventExtensions = Object.preventExtensions;
  var $seal = Object.seal;
  var $isExtensible = Object.isExtensible;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  var privateNames = $create(null);
  function isPrivateName(s) {
    return privateNames[s];
  }
  function createPrivateName() {
    var s = newUniqueString();
    privateNames[s] = true;
    return s;
  }
  function isShimSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isShimSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  var hashProperty = createPrivateName();
  var hashPropertyDescriptor = {value: undefined};
  var hashObjectProperties = {
    hash: {value: undefined},
    self: {value: undefined}
  };
  var hashCounter = 0;
  function getOwnHashObject(object) {
    var hashObject = object[hashProperty];
    if (hashObject && hashObject.self === object)
      return hashObject;
    if ($isExtensible(object)) {
      hashObjectProperties.hash.value = hashCounter++;
      hashObjectProperties.self.value = object;
      hashPropertyDescriptor.value = $create(null, hashObjectProperties);
      $defineProperty(object, hashProperty, hashPropertyDescriptor);
      return hashPropertyDescriptor.value;
    }
    return undefined;
  }
  function freeze(object) {
    getOwnHashObject(object);
    return $freeze.apply(this, arguments);
  }
  function preventExtensions(object) {
    getOwnHashObject(object);
    return $preventExtensions.apply(this, arguments);
  }
  function seal(object) {
    getOwnHashObject(object);
    return $seal.apply(this, arguments);
  }
  freeze(SymbolValue.prototype);
  function isSymbolString(s) {
    return symbolValues[s] || privateNames[s];
  }
  function toProperty(name) {
    if (isShimSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function removeSymbolKeys(array) {
    var rv = [];
    for (var i = 0; i < array.length; i++) {
      if (!isSymbolString(array[i])) {
        rv.push(array[i]);
      }
    }
    return rv;
  }
  function getOwnPropertyNames(object) {
    return removeSymbolKeys($getOwnPropertyNames(object));
  }
  function keys(object) {
    return removeSymbolKeys($keys(object));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol) {
        rv.push(symbol);
      }
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function defineProperty(object, name, descriptor) {
    if (isShimSymbol(name)) {
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    $defineProperty(Object, 'freeze', {value: freeze});
    $defineProperty(Object, 'preventExtensions', {value: preventExtensions});
    $defineProperty(Object, 'seal', {value: seal});
    $defineProperty(Object, 'keys', {value: keys});
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        var name = names[j];
        if (isSymbolString(name))
          continue;
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function isObject(x) {
    return x != null && (typeof x === 'object' || typeof x === 'function');
  }
  function toObject(x) {
    if (x == null)
      throw $TypeError();
    return $Object(x);
  }
  function checkObjectCoercible(argument) {
    if (argument == null) {
      throw new TypeError('Value cannot be converted to an Object');
    }
    return argument;
  }
  function polyfillSymbol(global, Symbol) {
    if (!global.Symbol) {
      global.Symbol = Symbol;
      Object.getOwnPropertySymbols = getOwnPropertySymbols;
    }
    if (!global.Symbol.iterator) {
      global.Symbol.iterator = Symbol('Symbol.iterator');
    }
  }
  function setupGlobals(global) {
    polyfillSymbol(global, Symbol);
    global.Reflect = global.Reflect || {};
    global.Reflect.global = global.Reflect.global || global;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    checkObjectCoercible: checkObjectCoercible,
    createPrivateName: createPrivateName,
    defineProperties: $defineProperties,
    defineProperty: $defineProperty,
    exportStar: exportStar,
    getOwnHashObject: getOwnHashObject,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    getOwnPropertyNames: $getOwnPropertyNames,
    isObject: isObject,
    isPrivateName: isPrivateName,
    isSymbolString: isSymbolString,
    keys: $keys,
    setupGlobals: setupGlobals,
    toObject: toObject,
    toProperty: toProperty,
    typeof: typeOf
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
(function() {
  'use strict';
  var path;
  function relativeRequire(callerPath, requiredPath) {
    path = path || typeof require !== 'undefined' && require('path');
    function isDirectory(path) {
      return path.slice(-1) === '/';
    }
    function isAbsolute(path) {
      return path[0] === '/';
    }
    function isRelative(path) {
      return path[0] === '.';
    }
    if (isDirectory(requiredPath) || isAbsolute(requiredPath))
      return;
    return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
  }
  $traceurRuntime.require = relativeRequire;
})();
(function() {
  'use strict';
  function spread() {
    var rv = [],
        j = 0,
        iterResult;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
      if (typeof valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)] !== 'function') {
        throw new TypeError('Cannot spread non-iterable object.');
      }
      var iter = valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)]();
      while (!(iterResult = iter.next()).done) {
        rv[j++] = iterResult.value;
      }
    }
    return rv;
  }
  $traceurRuntime.spread = spread;
})();
(function() {
  'use strict';
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $__0 = Object,
      getOwnPropertyNames = $__0.getOwnPropertyNames,
      getOwnPropertySymbols = $__0.getOwnPropertySymbols;
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    do {
      var result = $getOwnPropertyDescriptor(proto, name);
      if (result)
        return result;
      proto = $getPrototypeOf(proto);
    } while (proto);
    return undefined;
  }
  function superConstructor(ctor) {
    return ctor.__proto__;
  }
  function superCall(self, homeObject, name, args) {
    return superGet(self, homeObject, name).apply(self, args);
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (!descriptor.get)
        return descriptor.value;
      return descriptor.get.call(self);
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError(("super has no setter '" + name + "'."));
  }
  function getDescriptors(object) {
    var descriptors = {};
    var names = getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    var symbols = getOwnPropertySymbols(object);
    for (var i = 0; i < symbols.length; i++) {
      var symbol = symbols[i];
      descriptors[$traceurRuntime.toProperty(symbol)] = $getOwnPropertyDescriptor(object, $traceurRuntime.toProperty(symbol));
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
      throw new $TypeError('super prototype must be an Object or null');
    }
    if (superClass === null)
      return null;
    throw new $TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  $traceurRuntime.createClass = createClass;
  $traceurRuntime.defaultSuperCall = defaultSuperCall;
  $traceurRuntime.superCall = superCall;
  $traceurRuntime.superConstructor = superConstructor;
  $traceurRuntime.superGet = superGet;
  $traceurRuntime.superSet = superSet;
})();
(function() {
  'use strict';
  if (typeof $traceurRuntime !== 'object') {
    throw new Error('traceur runtime not found.');
  }
  var createPrivateName = $traceurRuntime.createPrivateName;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $create = Object.create;
  var $TypeError = TypeError;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    },
    handleException: function(ex) {
      this.GState = ST_CLOSED;
      this.state = END_STATE;
      throw ex;
    }
  };
  function nextOrThrow(ctx, moveNext, action, x) {
    switch (ctx.GState) {
      case ST_EXECUTING:
        throw new Error(("\"" + action + "\" on executing generator"));
      case ST_CLOSED:
        if (action == 'next') {
          return {
            value: undefined,
            done: true
          };
        }
        throw x;
      case ST_NEWBORN:
        if (action === 'throw') {
          ctx.GState = ST_CLOSED;
          throw x;
        }
        if (x !== undefined)
          throw $TypeError('Sent value to newborn generator');
      case ST_SUSPENDED:
        ctx.GState = ST_EXECUTING;
        ctx.action = action;
        ctx.sent = x;
        var value = moveNext(ctx);
        var done = value === ctx;
        if (done)
          value = ctx.returnValue;
        ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
        return {
          value: value,
          done: done
        };
    }
  }
  var ctxName = createPrivateName();
  var moveNextName = createPrivateName();
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
  GeneratorFunctionPrototype.prototype = {
    constructor: GeneratorFunctionPrototype,
    next: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
    },
    throw: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
    }
  };
  $defineProperties(GeneratorFunctionPrototype.prototype, {
    constructor: {enumerable: false},
    next: {enumerable: false},
    throw: {enumerable: false}
  });
  Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
    return this;
  }));
  function createGeneratorInstance(innerFunction, functionObject, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    var object = $create(functionObject.prototype);
    object[ctxName] = ctx;
    object[moveNextName] = moveNext;
    return object;
  }
  function initGeneratorFunction(functionObject) {
    functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = GeneratorFunctionPrototype;
    return functionObject;
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        this.resolve(this.returnValue);
        break;
      case RETHROW_STATE:
        this.reject(this.storedException);
        break;
      default:
        this.reject(getInternalError(this.state));
    }
  };
  AsyncFunctionContext.prototype.handleException = function() {
    this.state = RETHROW_STATE;
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.errback = function(err) {
      handleCatch(ctx, err);
      moveNext(ctx);
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          handleCatch(ctx, ex);
        }
      }
    };
  }
  function handleCatch(ctx, ex) {
    ctx.storedException = ex;
    var last = ctx.tryStack_[ctx.tryStack_.length - 1];
    if (!last) {
      ctx.handleException(ex);
      return;
    }
    ctx.state = last.catch !== undefined ? last.catch : last.finally;
    if (last.finallyFallThrough !== undefined)
      ctx.finallyFallThrough = last.finallyFallThrough;
  }
  $traceurRuntime.asyncWrap = asyncWrap;
  $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
  $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
})();
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function() {
  'use strict';
  var types = {
    any: {name: 'any'},
    boolean: {name: 'boolean'},
    number: {name: 'number'},
    string: {name: 'string'},
    symbol: {name: 'symbol'},
    void: {name: 'void'}
  };
  var GenericType = function GenericType(type, argumentTypes) {
    this.type = type;
    this.argumentTypes = argumentTypes;
  };
  ($traceurRuntime.createClass)(GenericType, {}, {});
  var typeRegister = Object.create(null);
  function genericType(type) {
    for (var argumentTypes = [],
        $__1 = 1; $__1 < arguments.length; $__1++)
      argumentTypes[$__1 - 1] = arguments[$__1];
    var typeMap = typeRegister;
    var key = $traceurRuntime.getOwnHashObject(type).hash;
    if (!typeMap[key]) {
      typeMap[key] = Object.create(null);
    }
    typeMap = typeMap[key];
    for (var i = 0; i < argumentTypes.length - 1; i++) {
      key = $traceurRuntime.getOwnHashObject(argumentTypes[i]).hash;
      if (!typeMap[key]) {
        typeMap[key] = Object.create(null);
      }
      typeMap = typeMap[key];
    }
    var tail = argumentTypes[argumentTypes.length - 1];
    key = $traceurRuntime.getOwnHashObject(tail).hash;
    if (!typeMap[key]) {
      typeMap[key] = new GenericType(type, argumentTypes);
    }
    return typeMap[key];
  }
  $traceurRuntime.GenericType = GenericType;
  $traceurRuntime.genericType = genericType;
  $traceurRuntime.type = types;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var ModuleEvaluationError = function ModuleEvaluationError(erroneousModuleName, cause) {
    this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
    if (!(cause instanceof $ModuleEvaluationError) && cause.stack)
      this.stack = this.stripStack(cause.stack);
    else
      this.stack = '';
  };
  var $ModuleEvaluationError = ModuleEvaluationError;
  ($traceurRuntime.createClass)(ModuleEvaluationError, {
    stripError: function(message) {
      return message.replace(/.*Error:/, this.constructor.name + ':');
    },
    stripCause: function(cause) {
      if (!cause)
        return '';
      if (!cause.message)
        return cause + '';
      return this.stripError(cause.message);
    },
    loadedBy: function(moduleName) {
      this.stack += '\n loaded by ' + moduleName;
    },
    stripStack: function(causeStack) {
      var stack = [];
      causeStack.split('\n').some((function(frame) {
        if (/UncoatedModuleInstantiator/.test(frame))
          return true;
        stack.push(frame);
      }));
      stack[0] = this.stripError(stack[0]);
      return stack.join('\n');
    }
  }, {}, Error);
  function beforeLines(lines, number) {
    var result = [];
    var first = number - 3;
    if (first < 0)
      first = 0;
    for (var i = first; i < number; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function afterLines(lines, number) {
    var last = number + 1;
    if (last > lines.length - 1)
      last = lines.length - 1;
    var result = [];
    for (var i = number; i <= last; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function columnSpacing(columns) {
    var result = '';
    for (var i = 0; i < columns - 1; i++) {
      result += '-';
    }
    return result;
  }
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superConstructor($UncoatedModuleInstantiator).call(this, url, null);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      try {
        var relativeRequire;
        if (typeof $traceurRuntime !== undefined) {
          relativeRequire = $traceurRuntime.require.bind(null, this.url);
        }
        return this.value_ = this.func.call(global, relativeRequire);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        if (ex.stack) {
          var lines = this.func.toString().split('\n');
          var evaled = [];
          ex.stack.split('\n').some(function(frame) {
            if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
              return true;
            var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
            if (m) {
              var line = parseInt(m[2], 10);
              evaled = evaled.concat(beforeLines(lines, line));
              evaled.push(columnSpacing(m[3]) + '^');
              evaled = evaled.concat(afterLines(lines, line));
              evaled.push('= = = = = = = = =');
            } else {
              evaled.push(frame);
            }
          });
          ex.stack = evaled.join('\n');
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== 'string')
        throw new TypeError('module name must be a string, not ' + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, deps, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length && !func.length) {
        this.registerModule(name, deps, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: function() {
            var $__0 = arguments;
            var depMap = {};
            deps.forEach((function(dep, index) {
              return depMap[dep] = $__0[index];
            }));
            var registryEntry = func.call(this, depMap);
            registryEntry.execute.call(this);
            return registryEntry.exports;
          }
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  var moduleStoreModule = new Module({ModuleStore: ModuleStore});
  ModuleStore.set('@traceur/src/runtime/ModuleStore', moduleStoreModule);
  ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    registerModule: ModuleStore.registerModule.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/utils.js";
  var $ceil = Math.ceil;
  var $floor = Math.floor;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $pow = Math.pow;
  var $min = Math.min;
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x >>> 0;
  }
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function isCallable(x) {
    return typeof x === 'function';
  }
  function isNumber(x) {
    return typeof x === 'number';
  }
  function toInteger(x) {
    x = +x;
    if ($isNaN(x))
      return 0;
    if (x === 0 || !$isFinite(x))
      return x;
    return x > 0 ? $floor(x) : $ceil(x);
  }
  var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
  function toLength(x) {
    var len = toInteger(x);
    return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
  }
  function checkIterable(x) {
    return !isObject(x) ? undefined : x[Symbol.iterator];
  }
  function isConstructor(x) {
    return isCallable(x);
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function maybeDefine(object, name, descr) {
    if (!(name in object)) {
      Object.defineProperty(object, name, descr);
    }
  }
  function maybeDefineMethod(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function maybeDefineConst(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function maybeAddConsts(object, consts) {
    for (var i = 0; i < consts.length; i += 2) {
      var name = consts[i];
      var value = consts[i + 1];
      maybeDefineConst(object, name, value);
    }
  }
  function maybeAddIterator(object, func, Symbol) {
    if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
      return;
    if (object['@@iterator'])
      func = object['@@iterator'];
    Object.defineProperty(object, Symbol.iterator, {
      value: func,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  var polyfills = [];
  function registerPolyfill(func) {
    polyfills.push(func);
  }
  function polyfillAll(global) {
    polyfills.forEach((function(f) {
      return f(global);
    }));
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    },
    get isObject() {
      return isObject;
    },
    get isCallable() {
      return isCallable;
    },
    get isNumber() {
      return isNumber;
    },
    get toInteger() {
      return toInteger;
    },
    get toLength() {
      return toLength;
    },
    get checkIterable() {
      return checkIterable;
    },
    get isConstructor() {
      return isConstructor;
    },
    get createIteratorResultObject() {
      return createIteratorResultObject;
    },
    get maybeDefine() {
      return maybeDefine;
    },
    get maybeDefineMethod() {
      return maybeDefineMethod;
    },
    get maybeDefineConst() {
      return maybeDefineConst;
    },
    get maybeAddFunctions() {
      return maybeAddFunctions;
    },
    get maybeAddConsts() {
      return maybeAddConsts;
    },
    get maybeAddIterator() {
      return maybeAddIterator;
    },
    get registerPolyfill() {
      return registerPolyfill;
    },
    get polyfillAll() {
      return polyfillAll;
    }
  };
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Map.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      maybeAddIterator = $__0.maybeAddIterator,
      registerPolyfill = $__0.registerPolyfill;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  var deletedSentinel = {};
  function lookupIndex(map, key) {
    if (isObject(key)) {
      var hashObject = getOwnHashObject(key);
      return hashObject && map.objectIndex_[hashObject.hash];
    }
    if (typeof key === 'string')
      return map.stringIndex_[key];
    return map.primitiveIndex_[key];
  }
  function initMap(map) {
    map.entries_ = [];
    map.objectIndex_ = Object.create(null);
    map.stringIndex_ = Object.create(null);
    map.primitiveIndex_ = Object.create(null);
    map.deletedCount_ = 0;
  }
  var Map = function Map() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Map called on incompatible type');
    if ($hasOwnProperty.call(this, 'entries_')) {
      throw new TypeError('Map can not be reentrantly initialised');
    }
    initMap(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__2 = iterable[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3; !($__3 = $__2.next()).done; ) {
        var $__4 = $__3.value,
            key = $__4[0],
            value = $__4[1];
        {
          this.set(key, value);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Map, {
    get size() {
      return this.entries_.length / 2 - this.deletedCount_;
    },
    get: function(key) {
      var index = lookupIndex(this, key);
      if (index !== undefined)
        return this.entries_[index + 1];
    },
    set: function(key, value) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index = lookupIndex(this, key);
      if (index !== undefined) {
        this.entries_[index + 1] = value;
      } else {
        index = this.entries_.length;
        this.entries_[index] = key;
        this.entries_[index + 1] = value;
        if (objectMode) {
          var hashObject = getOwnHashObject(key);
          var hash = hashObject.hash;
          this.objectIndex_[hash] = index;
        } else if (stringMode) {
          this.stringIndex_[key] = index;
        } else {
          this.primitiveIndex_[key] = index;
        }
      }
      return this;
    },
    has: function(key) {
      return lookupIndex(this, key) !== undefined;
    },
    delete: function(key) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index;
      var hash;
      if (objectMode) {
        var hashObject = getOwnHashObject(key);
        if (hashObject) {
          index = this.objectIndex_[hash = hashObject.hash];
          delete this.objectIndex_[hash];
        }
      } else if (stringMode) {
        index = this.stringIndex_[key];
        delete this.stringIndex_[key];
      } else {
        index = this.primitiveIndex_[key];
        delete this.primitiveIndex_[key];
      }
      if (index !== undefined) {
        this.entries_[index] = deletedSentinel;
        this.entries_[index + 1] = undefined;
        this.deletedCount_++;
        return true;
      }
      return false;
    },
    clear: function() {
      initMap(this);
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      for (var i = 0; i < this.entries_.length; i += 2) {
        var key = this.entries_[i];
        var value = this.entries_[i + 1];
        if (key === deletedSentinel)
          continue;
        callbackFn.call(thisArg, value, key, this);
      }
    },
    entries: $traceurRuntime.initGeneratorFunction(function $__5() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return [key, value];
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__5, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__6() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return key;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__6, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__7() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return value;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    })
  }, {});
  Object.defineProperty(Map.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Map.prototype.entries
  });
  function polyfillMap(global) {
    var $__4 = global,
        Object = $__4.Object,
        Symbol = $__4.Symbol;
    if (!global.Map)
      global.Map = Map;
    var mapPrototype = global.Map.prototype;
    if (mapPrototype.entries === undefined)
      global.Map = Map;
    if (mapPrototype.entries) {
      maybeAddIterator(mapPrototype, mapPrototype.entries, Symbol);
      maybeAddIterator(Object.getPrototypeOf(new global.Map().entries()), function() {
        return this;
      }, Symbol);
    }
  }
  registerPolyfill(polyfillMap);
  return {
    get Map() {
      return Map;
    },
    get polyfillMap() {
      return polyfillMap;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Set.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Set.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      maybeAddIterator = $__0.maybeAddIterator,
      registerPolyfill = $__0.registerPolyfill;
  var Map = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js").Map;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  function initSet(set) {
    set.map_ = new Map();
  }
  var Set = function Set() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Set called on incompatible type');
    if ($hasOwnProperty.call(this, 'map_')) {
      throw new TypeError('Set can not be reentrantly initialised');
    }
    initSet(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__4 = iterable[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__5; !($__5 = $__4.next()).done; ) {
        var item = $__5.value;
        {
          this.add(item);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Set, {
    get size() {
      return this.map_.size;
    },
    has: function(key) {
      return this.map_.has(key);
    },
    add: function(key) {
      this.map_.set(key, key);
      return this;
    },
    delete: function(key) {
      return this.map_.delete(key);
    },
    clear: function() {
      return this.map_.clear();
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      var $__2 = this;
      return this.map_.forEach((function(value, key) {
        callbackFn.call(thisArg, key, key, $__2);
      }));
    },
    values: $traceurRuntime.initGeneratorFunction(function $__7() {
      var $__8,
          $__9;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__8 = this.map_.keys()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__9 = $__8[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__9.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__9.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__9.value;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    }),
    entries: $traceurRuntime.initGeneratorFunction(function $__10() {
      var $__11,
          $__12;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__11 = this.map_.entries()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__12 = $__11[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__12.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__12.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__12.value;
            default:
              return $ctx.end();
          }
      }, $__10, this);
    })
  }, {});
  Object.defineProperty(Set.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  Object.defineProperty(Set.prototype, 'keys', {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  function polyfillSet(global) {
    var $__6 = global,
        Object = $__6.Object,
        Symbol = $__6.Symbol;
    if (!global.Set)
      global.Set = Set;
    var setPrototype = global.Set.prototype;
    if (setPrototype.values) {
      maybeAddIterator(setPrototype, setPrototype.values, Symbol);
      maybeAddIterator(Object.getPrototypeOf(new global.Set().values()), function() {
        return this;
      }, Symbol);
    }
  }
  registerPolyfill(polyfillSet);
  return {
    get Set() {
      return Set;
    },
    get polyfillSet() {
      return polyfillSet;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Set.js" + '');
System.registerModule("traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js";
  var len = 0;
  function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      scheduleFlush();
    }
  }
  var $__default = asap;
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    len = 0;
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js";
  var async = System.get("traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js").default;
  var registerPolyfill = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js").registerPolyfill;
  var promiseRaw = {};
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function idResolveHandler(x) {
    return x;
  }
  function idRejectHandler(x) {
    throw x;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
    var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 0:
        promise.onResolve_.push(onResolve, deferred);
        promise.onReject_.push(onReject, deferred);
        break;
      case +1:
        promiseEnqueue(promise.value_, [onResolve, deferred]);
        break;
      case -1:
        promiseEnqueue(promise.value_, [onReject, deferred]);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    if (this === $Promise) {
      var promise = promiseInit(new $Promise(promiseRaw));
      return {
        promise: promise,
        resolve: (function(x) {
          promiseResolve(promise, x);
        }),
        reject: (function(r) {
          promiseReject(promise, r);
        })
      };
    } else {
      var result = {};
      result.promise = new C((function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      }));
      return result;
    }
  }
  function promiseSet(promise, status, value, onResolve, onReject) {
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = onResolve;
    promise.onReject_ = onReject;
    return promise;
  }
  function promiseInit(promise) {
    return promiseSet(promise, 0, undefined, [], []);
  }
  var Promise = function Promise(resolver) {
    if (resolver === promiseRaw)
      return;
    if (typeof resolver !== 'function')
      throw new TypeError;
    var promise = promiseInit(this);
    try {
      resolver((function(x) {
        promiseResolve(promise, x);
      }), (function(r) {
        promiseReject(promise, r);
      }));
    } catch (e) {
      promiseReject(promise, e);
    }
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function(onResolve, onReject) {
      if (typeof onResolve !== 'function')
        onResolve = idResolveHandler;
      if (typeof onReject !== 'function')
        onReject = idRejectHandler;
      var that = this;
      var constructor = this.constructor;
      return chain(this, function(x) {
        x = promiseCoerce(constructor, x);
        return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }, onReject);
    }
  }, {
    resolve: function(x) {
      if (this === $Promise) {
        if (isPromise(x)) {
          return x;
        }
        return promiseSet(new $Promise(promiseRaw), +1, x);
      } else {
        return new this(function(resolve, reject) {
          resolve(x);
        });
      }
    },
    reject: function(r) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), -1, r);
      } else {
        return new this((function(resolve, reject) {
          reject(r);
        }));
      }
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var resolutions = [];
      try {
        var count = values.length;
        if (count === 0) {
          deferred.resolve(resolutions);
        } else {
          for (var i = 0; i < values.length; i++) {
            this.resolve(values[i]).then(function(i, x) {
              resolutions[i] = x;
              if (--count === 0)
                deferred.resolve(resolutions);
            }.bind(undefined, i), (function(r) {
              deferred.reject(r);
            }));
          }
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.resolve(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  var $Promise = Promise;
  var $PromiseReject = $Promise.reject;
  function promiseResolve(promise, x) {
    promiseDone(promise, +1, x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, -1, r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 0)
      return;
    promiseEnqueue(value, reactions);
    promiseSet(promise, status, value);
  }
  function promiseEnqueue(value, tasks) {
    async((function() {
      for (var i = 0; i < tasks.length; i += 2) {
        promiseHandle(value, tasks[i], tasks[i + 1]);
      }
    }));
  }
  function promiseHandle(value, handler, deferred) {
    try {
      var result = handler(value);
      if (result === deferred.promise)
        throw new TypeError;
      else if (isPromise(result))
        chain(result, deferred.resolve, deferred.reject);
      else
        deferred.resolve(result);
    } catch (e) {
      try {
        deferred.reject(e);
      } catch (e) {}
    }
  }
  var thenableSymbol = '@@thenable';
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function promiseCoerce(constructor, x) {
    if (!isPromise(x) && isObject(x)) {
      var then;
      try {
        then = x.then;
      } catch (r) {
        var promise = $PromiseReject.call(constructor, r);
        x[thenableSymbol] = promise;
        return promise;
      }
      if (typeof then === 'function') {
        var p = x[thenableSymbol];
        if (p) {
          return p;
        } else {
          var deferred = getDeferred(constructor);
          x[thenableSymbol] = deferred.promise;
          try {
            then.call(x, deferred.resolve, deferred.reject);
          } catch (r) {
            deferred.reject(r);
          }
          return deferred.promise;
        }
      }
    }
    return x;
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  registerPolyfill(polyfillPromise);
  return {
    get Promise() {
      return Promise;
    },
    get polyfillPromise() {
      return polyfillPromise;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      createIteratorResultObject = $__0.createIteratorResultObject,
      isObject = $__0.isObject;
  var toProperty = $traceurRuntime.toProperty;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var iteratedString = Symbol('iteratedString');
  var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
  var StringIterator = function StringIterator() {};
  ($traceurRuntime.createClass)(StringIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
    value: function() {
      var o = this;
      if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
        throw new TypeError('this must be a StringIterator object');
      }
      var s = o[toProperty(iteratedString)];
      if (s === undefined) {
        return createIteratorResultObject(undefined, true);
      }
      var position = o[toProperty(stringIteratorNextIndex)];
      var len = s.length;
      if (position >= len) {
        o[toProperty(iteratedString)] = undefined;
        return createIteratorResultObject(undefined, true);
      }
      var first = s.charCodeAt(position);
      var resultString;
      if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
        resultString = String.fromCharCode(first);
      } else {
        var second = s.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) {
          resultString = String.fromCharCode(first);
        } else {
          resultString = String.fromCharCode(first) + String.fromCharCode(second);
        }
      }
      o[toProperty(stringIteratorNextIndex)] = position + resultString.length;
      return createIteratorResultObject(resultString, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
  function createStringIterator(string) {
    var s = String(string);
    var iterator = Object.create(StringIterator.prototype);
    iterator[toProperty(iteratedString)] = s;
    iterator[toProperty(stringIteratorNextIndex)] = 0;
    return iterator;
  }
  return {get createStringIterator() {
      return createStringIterator;
    }};
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/String.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/String.js";
  var createStringIterator = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js").createStringIterator;
  var $__1 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill;
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function includes(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    if (search && $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (pos != pos) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    if (searchLength + start > stringLength) {
      return false;
    }
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  function stringPrototypeIterator() {
    var o = $traceurRuntime.checkObjectCoercible(this);
    var s = String(o);
    return createStringIterator(s);
  }
  function polyfillString(global) {
    var String = global.String;
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
    maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
  }
  registerPolyfill(polyfillString);
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get includes() {
      return includes;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    },
    get stringPrototypeIterator() {
      return stringPrototypeIterator;
    },
    get polyfillString() {
      return polyfillString;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/String.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      toObject = $__0.toObject,
      toUint32 = $__0.toUint32,
      createIteratorResultObject = $__0.createIteratorResultObject;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Array.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Array.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js"),
      entries = $__0.entries,
      keys = $__0.keys,
      values = $__0.values;
  var $__1 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      checkIterable = $__1.checkIterable,
      isCallable = $__1.isCallable,
      isConstructor = $__1.isConstructor,
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill,
      toInteger = $__1.toInteger,
      toLength = $__1.toLength,
      toObject = $__1.toObject;
  function from(arrLike) {
    var mapFn = arguments[1];
    var thisArg = arguments[2];
    var C = this;
    var items = toObject(arrLike);
    var mapping = mapFn !== undefined;
    var k = 0;
    var arr,
        len;
    if (mapping && !isCallable(mapFn)) {
      throw TypeError();
    }
    if (checkIterable(items)) {
      arr = isConstructor(C) ? new C() : [];
      for (var $__2 = items[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3; !($__3 = $__2.next()).done; ) {
        var item = $__3.value;
        {
          if (mapping) {
            arr[k] = mapFn.call(thisArg, item, k);
          } else {
            arr[k] = item;
          }
          k++;
        }
      }
      arr.length = k;
      return arr;
    }
    len = toLength(items.length);
    arr = isConstructor(C) ? new C(len) : new Array(len);
    for (; k < len; k++) {
      if (mapping) {
        arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
      } else {
        arr[k] = items[k];
      }
    }
    arr.length = len;
    return arr;
  }
  function of() {
    for (var items = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      items[$__4] = arguments[$__4];
    var C = this;
    var len = items.length;
    var arr = isConstructor(C) ? new C(len) : new Array(len);
    for (var k = 0; k < len; k++) {
      arr[k] = items[k];
    }
    arr.length = len;
    return arr;
  }
  function fill(value) {
    var start = arguments[1] !== (void 0) ? arguments[1] : 0;
    var end = arguments[2];
    var object = toObject(this);
    var len = toLength(object.length);
    var fillStart = toInteger(start);
    var fillEnd = end !== undefined ? toInteger(end) : len;
    fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
    fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
    while (fillStart < fillEnd) {
      object[fillStart] = value;
      fillStart++;
    }
    return object;
  }
  function find(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg);
  }
  function findIndex(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg, true);
  }
  function findHelper(self, predicate) {
    var thisArg = arguments[2];
    var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
    var object = toObject(self);
    var len = toLength(object.length);
    if (!isCallable(predicate)) {
      throw TypeError();
    }
    for (var i = 0; i < len; i++) {
      var value = object[i];
      if (predicate.call(thisArg, value, i, object)) {
        return returnIndex ? i : value;
      }
    }
    return returnIndex ? -1 : undefined;
  }
  function polyfillArray(global) {
    var $__5 = global,
        Array = $__5.Array,
        Object = $__5.Object,
        Symbol = $__5.Symbol;
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
    maybeAddFunctions(Array, ['from', from, 'of', of]);
    maybeAddIterator(Array.prototype, values, Symbol);
    maybeAddIterator(Object.getPrototypeOf([].values()), function() {
      return this;
    }, Symbol);
  }
  registerPolyfill(polyfillArray);
  return {
    get from() {
      return from;
    },
    get of() {
      return of;
    },
    get fill() {
      return fill;
    },
    get find() {
      return find;
    },
    get findIndex() {
      return findIndex;
    },
    get polyfillArray() {
      return polyfillArray;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Array.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Object.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Object.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill;
  var $__1 = $traceurRuntime,
      defineProperty = $__1.defineProperty,
      getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__1.getOwnPropertyNames,
      isPrivateName = $__1.isPrivateName,
      keys = $__1.keys;
  function is(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      var props = source == null ? [] : keys(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        if (isPrivateName(name))
          continue;
        target[name] = source[name];
      }
    }
    return target;
  }
  function mixin(target, source) {
    var props = getOwnPropertyNames(source);
    var p,
        descriptor,
        length = props.length;
    for (p = 0; p < length; p++) {
      var name = props[p];
      if (isPrivateName(name))
        continue;
      descriptor = getOwnPropertyDescriptor(source, props[p]);
      defineProperty(target, props[p], descriptor);
    }
    return target;
  }
  function polyfillObject(global) {
    var Object = global.Object;
    maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
  }
  registerPolyfill(polyfillObject);
  return {
    get is() {
      return is;
    },
    get assign() {
      return assign;
    },
    get mixin() {
      return mixin;
    },
    get polyfillObject() {
      return polyfillObject;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Object.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Number.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Number.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isNumber = $__0.isNumber,
      maybeAddConsts = $__0.maybeAddConsts,
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill,
      toInteger = $__0.toInteger;
  var $abs = Math.abs;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
  var EPSILON = Math.pow(2, -52);
  function NumberIsFinite(number) {
    return isNumber(number) && $isFinite(number);
  }
  ;
  function isInteger(number) {
    return NumberIsFinite(number) && toInteger(number) === number;
  }
  function NumberIsNaN(number) {
    return isNumber(number) && $isNaN(number);
  }
  ;
  function isSafeInteger(number) {
    if (NumberIsFinite(number)) {
      var integral = toInteger(number);
      if (integral === number)
        return $abs(integral) <= MAX_SAFE_INTEGER;
    }
    return false;
  }
  function polyfillNumber(global) {
    var Number = global.Number;
    maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
    maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
  }
  registerPolyfill(polyfillNumber);
  return {
    get MAX_SAFE_INTEGER() {
      return MAX_SAFE_INTEGER;
    },
    get MIN_SAFE_INTEGER() {
      return MIN_SAFE_INTEGER;
    },
    get EPSILON() {
      return EPSILON;
    },
    get isFinite() {
      return NumberIsFinite;
    },
    get isInteger() {
      return isInteger;
    },
    get isNaN() {
      return NumberIsNaN;
    },
    get isSafeInteger() {
      return isSafeInteger;
    },
    get polyfillNumber() {
      return polyfillNumber;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Number.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js";
  var polyfillAll = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js").polyfillAll;
  polyfillAll(Reflect.global);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfillAll(global);
  };
  return {};
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js" + '');

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":6,"path":5}],11:[function(require,module,exports){
"use strict";
var Vector = function(x, y) {
  this.x = !isNaN(x) ? x : 0;
  this.y = !isNaN(y) ? y : 0;
};
Vector.add = function(v1, v2) {
  return new this(v1.x + v2.x, v1.y + v2.y);
};
Vector.substract = function(v1, v2) {
  return new this(v1.x - v2.x, v1.y - v2.y);
};
Vector.multiply = function(v1, v2) {
  return new this(v1.x * v2.x, v1.y * v2.y);
};
Vector.distance = function(v1, v2) {
  var v = this.substract(v2, v1);
  return v.magnitude();
};
Vector.clone = function(v) {
  return new this(v.x, v.y);
};
Vector.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  return this;
};
Vector.prototype.substract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};
Vector.prototype.multiply = function(value) {
  this.x *= value;
  this.y *= value;
  return this;
};
Vector.prototype.divide = function(value) {
  return this.multiply(1 / value);
};
Vector.prototype.truncate = function(value) {
  if (this.magnitude() > value) {
    this.normalize(value);
  }
  return this;
};
Vector.prototype.normalize = function(multiplier) {
  var multiplier = multiplier ? multiplier : 1;
  var mag = this.magnitude();
  if (mag === 0) {
    return this;
  }
  this.x = (this.x / mag);
  this.y = (this.y / mag);
  this.multiply(multiplier);
  return this;
};
Vector.prototype.rotate = function(theta) {
  var finalTheta = this.direction() + theta;
  this.setAngle(finalTheta);
};
Vector.prototype.setAngle = function(theta) {
  var magnitude = this.magnitude();
  this.normalize();
  this.x = Math.cos(theta);
  this.y = Math.sin(theta);
  this.multiply(magnitude);
  return this;
};
Vector.prototype.magnitude = function() {
  var hyp = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  return Math.abs(hyp);
};
Vector.prototype.direction = function() {
  return Math.atan2(this.y, this.x);
};
Vector.prototype.clone = function() {
  return new this.constructor(this.x, this.y);
};
module.exports = Vector;


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/node_modules/vector/index.js
},{}]},{},[10,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmVuL1NpdGVzL2pzL19jYW52YXMtYm9pbGVycGxhdGUvYXBwL2d1aS5qcyIsIi9Vc2Vycy9iZW4vU2l0ZXMvanMvX2NhbnZhcy1ib2lsZXJwbGF0ZS9hcHAvbGliL2NsYXNzLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL2FwcC9saWIvbG9vcC5qcyIsIi9Vc2Vycy9iZW4vU2l0ZXMvanMvX2NhbnZhcy1ib2lsZXJwbGF0ZS9hcHAvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL25vZGVfbW9kdWxlcy9kYXQtZ3VpL2luZGV4LmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL25vZGVfbW9kdWxlcy9kYXQtZ3VpL3ZlbmRvci9kYXQuY29sb3IuanMiLCIvVXNlcnMvYmVuL1NpdGVzL2pzL19jYW52YXMtYm9pbGVycGxhdGUvbm9kZV9tb2R1bGVzL2RhdC1ndWkvdmVuZG9yL2RhdC5ndWkuanMiLCJub2RlX21vZHVsZXMvZXM2aWZ5L25vZGVfbW9kdWxlcy90cmFjZXVyL2Jpbi90cmFjZXVyLXJ1bnRpbWUuanMiLCIvVXNlcnMvYmVuL1NpdGVzL2pzL19jYW52YXMtYm9pbGVycGxhdGUvbm9kZV9tb2R1bGVzL3ZlY3Rvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsQUFBSSxFQUFBLENBQUEsR0FBRSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsU0FBUSxDQUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUUsRUFBSSxFQUFDLENBQUEsRUFBSSxFQUFBLENBQUMsQ0FBQyxDQUFDO0FBQzNCLEFBQUksUUFBQSxDQUFBLENBQUEsRUFBSSxDQUFBLENBQUEsRUFBSSxFQUFDLEdBQUUsRUFBSSxFQUFDLENBQUMsR0FBRSxFQUFJLEVBQUEsQ0FBQyxFQUFJLEVBQUEsQ0FBQyxDQUFDLENBQUM7QUFDbkMsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsQ0FDTixDQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUNSLEVBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDUixFQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUNSLEVBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDVixDQUFFLEVBQUMsQ0FBQyxDQUFDO0FBRUwsV0FBTztBQUNMLFFBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFBLENBQUMsRUFBSSxJQUFFO0FBQ1osUUFBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUEsQ0FBQyxFQUFJLElBQUU7QUFDWixRQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQSxDQUFDLEVBQUksSUFBRTtBQUFBLE1BQ2QsQ0FBQztJQUVIO0FBRUEsYUFBUyxDQUFHLFVBQVMsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFHO0FBRTVCLEFBQUksUUFBQSxDQUFBLEdBQUUsRUFBSSxDQUFBLElBQUcsSUFBSSxBQUFDLENBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUM7QUFDdEIsWUFBRSxFQUFJLENBQUEsSUFBRyxJQUFJLEFBQUMsQ0FBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQztBQUN0QixjQUFJLEVBQUksQ0FBQSxHQUFFLEVBQUksSUFBRTtBQUNoQixV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LENBQUcsV0FBUyxDQUFDLENBQUM7QUFFN0IsQUFBSSxNQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsUUFBTyxjQUFjLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUMxQyxRQUFJLFVBQVUsRUFBSSxTQUFPLENBQUM7QUFDMUIsTUFBRSxTQUFTLEFBQUMsQ0FBQyxLQUFJLENBQUcsZUFBYSxDQUFDLENBQUM7QUFHbkMsQUFBSSxNQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsUUFBTyxjQUFjLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUMzQyxTQUFLLFVBQVUsRUFBSSxPQUFLLENBQUM7QUFDekIsTUFBRSxTQUFTLEFBQUMsQ0FBQyxNQUFLLENBQUcsU0FBTyxDQUFDLENBQUM7QUFDOUIsTUFBRSxTQUFTLEFBQUMsQ0FBQyxNQUFLLENBQUcsT0FBSyxDQUFDLENBQUM7QUFFNUIsQUFBSSxNQUFBLENBQUEsT0FBTSxFQUFJLENBQUEsUUFBTyxjQUFjLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUM1QyxVQUFNLFVBQVUsRUFBSSxNQUFJLENBQUM7QUFDekIsTUFBRSxTQUFTLEFBQUMsQ0FBQyxPQUFNLENBQUcsU0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBRSxTQUFTLEFBQUMsQ0FBQyxPQUFNLENBQUcsVUFBUSxDQUFDLENBQUM7QUFFaEMsQUFBSSxNQUFBLENBQUEsT0FBTSxFQUFJLENBQUEsUUFBTyxjQUFjLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUM1QyxVQUFNLFVBQVUsRUFBSSxTQUFPLENBQUM7QUFDNUIsTUFBRSxTQUFTLEFBQUMsQ0FBQyxPQUFNLENBQUcsU0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBRSxTQUFTLEFBQUMsQ0FBQyxPQUFNLENBQUcsU0FBTyxDQUFDLENBQUM7QUFFL0IsQUFBSSxNQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsR0FBRSxnQkFBZ0IsRUFBSSxDQUFBLFFBQU8sY0FBYyxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFFbkUsT0FBSSxHQUFFLEtBQUss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QSxDQUFDLENBQUM7QUFDckIsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsQ0FBQSxFQUFJLEVBQUMsR0FBRSxFQUFJLEVBQUMsQ0FBQSxFQUFJLEVBQUEsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsQ0FBQSxFQUFJLEVBQUMsR0FBRSxFQUFJLEVBQUMsQ0FBQyxHQUFFLEVBQUksRUFBQSxDQUFDLEVBQUksRUFBQSxDQUFDLENBQUMsQ0FBQztBQUNuQyxBQUFJLFFBQUEsQ0FBQSxDQUFBLEVBQUksQ0FBQSxDQUNOLENBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDUixFQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUNSLEVBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDUixFQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUNWLENBQUUsRUFBQyxDQUFDLENBQUM7QUFFTCxXQUFPO0FBQ0wsUUFBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUEsQ0FBQyxFQUFJLElBQUU7QUFDWixRQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQSxDQUFDLEVBQUksSUFBRTtBQUNaLFFBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFBLENBQUMsRUFBSSxJQUFFO0FBQUEsTUFDZCxDQUFDO0lBRUg7QUFFQSxhQUFTLENBQUcsVUFBUyxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUc7QUFFNUIsQUFBSSxRQUFBLENBQUEsR0FBRSxFQUFJLENBQUEsSUFBRyxJQUFJLEFBQUMsQ0FBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQztBQUN0QixZQUFFLEVBQUksQ0FBQSxJQUFHLElBQUksQUFBQyxDQUFDLENBQUEsQ0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BnRkE7QUFBQSxBQUFJLEVBQUEsQ0FBQSxNQUFLLEVBQUksVUFBUyxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUc7QUFDeEIsS0FBRyxFQUFFLEVBQUksQ0FBQSxDQUFDLEtBQUksQUFBQyxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUksRUFBQSxFQUFJLEVBQUEsQ0FBQztBQUMxQixLQUFHLEVBQUUsRUFBSSxDQUFBLENBQUMsS0FBSSxBQUFDLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBSSxFQUFBLEVBQUksRUFBQSxDQUFDO0FBQzlCLENBQUM7QUFHRCxLQUFLLElBQUksRUFBSSxVQUFTLEVBQUMsQ0FBRyxDQUFBLEVBQUMsQ0FBRztBQUMxQixPQUFPLElBQUksS0FBRyxBQUFDLENBQUMsRUFBQyxFQUFFLEVBQUksQ0FBQSxFQUFDLEVBQUUsQ0FBRyxDQUFBLEVBQUMsRUFBRSxFQUFJLENBQUEsRUFBQyxFQUFFLENBQUMsQ0FBQztBQUM3QyxDQUFBO0FBQ0EsS0FBSyxVQUFVLEVBQUksVUFBUyxFQUFDLENBQUcsQ0FBQSxFQUFDLENBQUc7QUFDaEMsT0FBTyxJQUFJ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QUFBLElBQUcsRUFBRSxDQUFDLENBQUM7QUFDL0MsQ0FBQTtBQUVBLEtBQUssUUFBUSxFQUFJLE9BQUssQ0FBQztBQUN2QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZGF0ID0gcmVxdWlyZSgnZGF0LWd1aScpO1xuXG5cbnZhciBndWkgPSBuZXcgZGF0LkdVSSgpO1xuXG52YXIgbW9kZWwgPSB7XG4gICAgcGF1c2U6IGZhbHNlLFxuICAgIHNsb3c6IDFcbn07XG5cbnZhciBwYXVzZUNvbnRyb2xsZXIgPSBndWkuYWRkKG1vZGVsLCAncGF1c2UnKTtcbmd1aS5hZGQobW9kZWwsICdzbG93JywgMSwgMTApLnN0ZXAoMSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIG1vZGVsOiBtb2RlbCxcbiAgICBjb250cm9sbGVyczoge1xuICAgICAgICBwYXVzZTogcGF1c2VDb250cm9sbGVyXG4gICAgfVxufVxuXG4iLCIvKiBTaW1wbGUgSmF2YVNjcmlwdCBJbmhlcml0YW5jZVxuICogQnkgSm9obiBSZXNpZyBodHRwOi8vZWpvaG4ub3JnL1xuICogTUlUIExpY2Vuc2VkLlxuICovXG4vLyBJbnNwaXJlZCBieSBiYXNlMiBhbmQgUHJvdG90eXBlXG52YXIgaW5pdGlhbGl6aW5nID0gZmFsc2UsIGZuVGVzdCA9IC94eXovLnRlc3QoZnVuY3Rpb24oKXt4eXo7fSkgPyAvXFxiX3N1cGVyXFxiLyA6IC8uKi87XG5cbi8vIFRoZSBiYXNlIENsYXNzIGltcGxlbWVudGF0aW9uIChkb2VzIG5vdGhpbmcpXG4vLyB0aGlzLkNsYXNzID0gZnVuY3Rpb24oKXt9O1xudmFyIENsYXNzID0gZnVuY3Rpb24gKCl7fTtcblxuLy8gQ3JlYXRlIGEgbmV3IENsYXNzIHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIGNsYXNzXG5DbGFzcy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmQocHJvcCkge1xuICB2YXIgX3N1cGVyID0gdGhpcy5wcm90b3R5cGU7XG5cbiAgLy8gSW5zdGFudGlhdGUgYSBiYXNlIGNsYXNzIChidXQgb25seSBjcmVhdGUgdGhlIGluc3RhbmNlLFxuICAvLyBkb24ndCBydW4gdGhlIGluaXQgY29uc3RydWN0b3IpXG4gIGluaXRpYWxpemluZyA9IHRydWU7XG4gIHZhciBwcm90b3R5cGUgPSBuZXcgdGhpcygpO1xuICBpbml0aWFsaXppbmcgPSBmYWxzZTtcblxuICAvLyBDb3B5IHRoZSBwcm9wZXJ0aWVzIG92ZXIgb250byB0aGUgbmV3IHByb3RvdHlwZVxuICBmb3IgKHZhciBuYW1lIGluIHByb3ApIHtcbiAgICAvLyBDaGVjayBpZiB3ZSdyZSBvdmVyd3JpdGluZyBhbiBleGlzdGluZyBmdW5jdGlvblxuICAgIHByb3RvdHlwZVtuYW1lXSA9IHR5cGVvZiBwcm9wW25hbWVdID09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgdHlwZW9mIF9zdXBlcltuYW1lXSA9PSBcImZ1bmN0aW9uXCIgJiYgZm5UZXN0LnRlc3QocHJvcFtuYW1lXSkgP1xuICAgICAgKGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0bXAgPSB0aGlzLl9zdXBlcjtcblxuICAgICAgICAgIC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kXG4gICAgICAgICAgLy8gYnV0IG9uIHRoZSBzdXBlci1jbGFzc1xuICAgICAgICAgIHRoaXMuX3N1cGVyID0gX3N1cGVyW25hbWVdO1xuXG4gICAgICAgICAgLy8gVGhlIG1ldGhvZCBvbmx5IG5lZWQgdG8gYmUgYm91bmQgdGVtcG9yYXJpbHksIHNvIHdlXG4gICAgICAgICAgLy8gcmVtb3ZlIGl0IHdoZW4gd2UncmUgZG9uZSBleGVjdXRpbmdcbiAgICAgICAgICB2YXIgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB0aGlzLl9zdXBlciA9IHRtcDtcblxuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH07XG4gICAgICB9KShuYW1lLCBwcm9wW25hbWVdKSA6XG4gICAgICBwcm9wW25hbWVdO1xuICB9XG5cbiAgLy8gVGhlIGR1bW15IGNsYXNzIGNvbnN0cnVjdG9yXG4gIGZ1bmN0aW9uIENsYXNzKCkge1xuICAgIC8vIEFsbCBjb25zdHJ1Y3Rpb24gaXMgYWN0dWFsbHkgZG9uZSBpbiB0aGUgaW5pdCBtZXRob2RcbiAgICBpZiAoICFpbml0aWFsaXppbmcgJiYgdGhpcy5pbml0IClcbiAgICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgLy8gUG9wdWxhdGUgb3VyIGNvbnN0cnVjdGVkIHByb3RvdHlwZSBvYmplY3RcbiAgQ2xhc3MucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXG4gIC8vIEVuZm9yY2UgdGhlIGNvbnN0cnVjdG9yIHRvIGJlIHdoYXQgd2UgZXhwZWN0XG4gIENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsYXNzO1xuXG4gIC8vIEFuZCBtYWtlIHRoaXMgY2xhc3MgZXh0ZW5kYWJsZVxuICBDbGFzcy5leHRlbmQgPSBleHRlbmQ7XG5cbiAgcmV0dXJuIENsYXNzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGFzcztcbiIsIi8vIGh0dHA6Ly9jb2RlaW5jb21wbGV0ZS5jb20vcG9zdHMvMjAxMy8xMi80L2phdmFzY3JpcHRfZ2FtZV9mb3VuZGF0aW9uc190aGVfZ2FtZV9sb29wL1xuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufVxuXG52YXIgbG9vcCA9IHtcbiAgICBydW46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICB2YXIgbm93LFxuICAgICAgICAgICAgZHQgICAgICAgPSAwLFxuICAgICAgICAgICAgbGFzdCAgICAgPSB0aW1lc3RhbXAoKSxcbiAgICAgICAgICAgIHN0ZXAgICAgID0gMSAvIG9wdGlvbnMuZnBzLFxuICAgICAgICAgICAgY3R4ICAgICAgPSBvcHRpb25zLmN0eCxcbiAgICAgICAgICAgIGJ1ZmZlcnMgID0gb3B0aW9ucy5idWZmZXJzLFxuICAgICAgICAgICAgdXBkYXRlICAgPSBvcHRpb25zLnVwZGF0ZSxcbiAgICAgICAgICAgIHJlbmRlciAgID0gb3B0aW9ucy5yZW5kZXIsXG4gICAgICAgICAgICBndWkgICAgICA9IG9wdGlvbnMuZ3VpO1xuXG4gICAgICAgIChmdW5jdGlvbih0aGF0KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgICAgIHZhciBzbG93ICAgICA9IGd1aS5zbG93OyAvLyBzbG93IG1vdGlvbiBzY2FsaW5nIGZhY3RvclxuICAgICAgICAgICAgICAgIHZhciBzbG93U3RlcCA9IHNsb3cgKiBzdGVwO1xuXG4gICAgICAgICAgICAgICAgbm93ID0gdGltZXN0YW1wKCk7XG4gICAgICAgICAgICAgICAgZHQgPSBkdCArIE1hdGgubWluKDEsIChub3cgLSBsYXN0KSAvIDEwMDApO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoZHQgPiBzbG93U3RlcCkge1xuICAgICAgICAgICAgICAgICAgICBkdCA9IGR0IC0gc2xvd1N0ZXA7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZShzdGVwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZW5kZXIoY3R4LCBidWZmZXJzLCBkdC9zbG93KTtcblxuICAgICAgICAgICAgICAgIGxhc3QgPSBub3c7XG4gICAgICAgICAgICAgICAgdGhhdC5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSh0aGlzKSk7XG4gICAgfSxcblxuICAgIHF1aXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJBRmlkKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBsb29wO1xuIiwidmFyIGd1aSA9IHJlcXVpcmUoJy4vZ3VpJyk7XG52YXIgdmVjdG9yID0gcmVxdWlyZSgndmVjdG9yJyk7XG52YXIgbG9vcCA9IHJlcXVpcmUoJy4vbGliL2xvb3AnKTtcbnZhciBDbGFzcyA9IHJlcXVpcmUoJy4vbGliL2NsYXNzJyk7XG5cbnZhciB3ID0gd2luZG93LmlubmVyV2lkdGg7XG52YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxudmFyICRjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2NlbmUnKTtcbnZhciBjdHggPSAkY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmN0eC5jYW52YXMud2lkdGggPSB3O1xuY3R4LmNhbnZhcy5oZWlnaHQgPSBoO1xuXG4vLyB0ZXN0IHNoYXBlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBTaGFwZSA9IENsYXNzLmV4dGVuZCh7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSAxMDA7XG4gICAgICAgIHRoaXMuYW5nbGUgPSAwO1xuICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSA9IChNYXRoLlBJIC8gMik7IC8vIHJhZC9zXG4gICAgICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB9XG59KTtcbnZhciBzaGFwZSA9IG5ldyBTaGFwZSgpO1xuXG52YXIgdXBkYXRlID0gZnVuY3Rpb24oZHQpIHtcbiAgICBzaGFwZS5hbmdsZSA9IChzaGFwZS5hbmdsZSArIHNoYXBlLmFuZ3VsYXJWZWxvY2l0eSAqIGR0KSAlIChNYXRoLlBJICogMik7XG59XG5cbnZhciByZW5kZXIgPSBmdW5jdGlvbihkdCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUody8yLCBoLzIpO1xuXG4gICAgY3R4LnJvdGF0ZShzaGFwZS5hbmdsZSk7XG4gICAgY3R4LnRyYW5zbGF0ZShzaGFwZS5kaXN0YW5jZSwgMCk7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjZmY1MzBkJztcbiAgICBjdHguYXJjKDAsIDAsIHNoYXBlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBjdHguZmlsbCgpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbn1cblxuLy8gZW5kIHRlc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG9wdGlvbnMgPSB7XG4gICAgY3R4OiBjdHgsXG4gICAgYnVmZmVyczogW10sXG4gICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgcmVuZGVyOiByZW5kZXIsXG4gICAgZnBzOiA2MCxcbiAgICBndWk6IGd1aS5tb2RlbFxufTtcblxuZ3VpLmNvbnRyb2xsZXJzLnBhdXNlLm9uQ2hhbmdlKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFsdWUgPyBsb29wLnF1aXQoKSA6IGxvb3AucnVuKG9wdGlvbnMpO1xufSk7XG5cbmxvb3AucnVuKG9wdGlvbnMpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3ZlbmRvci9kYXQuZ3VpJylcbm1vZHVsZS5leHBvcnRzLmNvbG9yID0gcmVxdWlyZSgnLi92ZW5kb3IvZGF0LmNvbG9yJykiLCIvKipcbiAqIGRhdC1ndWkgSmF2YVNjcmlwdCBDb250cm9sbGVyIExpYnJhcnlcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9kYXQtZ3VpXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBDcmVhdGl2ZSBMYWJcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKi9cblxuLyoqIEBuYW1lc3BhY2UgKi9cbnZhciBkYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGRhdCB8fCB7fTtcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmRhdC5jb2xvciA9IGRhdC5jb2xvciB8fCB7fTtcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmRhdC51dGlscyA9IGRhdC51dGlscyB8fCB7fTtcblxuZGF0LnV0aWxzLmNvbW1vbiA9IChmdW5jdGlvbiAoKSB7XG4gIFxuICB2YXIgQVJSX0VBQ0ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcbiAgdmFyIEFSUl9TTElDRSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICAvKipcbiAgICogQmFuZC1haWQgbWV0aG9kcyBmb3IgdGhpbmdzIHRoYXQgc2hvdWxkIGJlIGEgbG90IGVhc2llciBpbiBKYXZhU2NyaXB0LlxuICAgKiBJbXBsZW1lbnRhdGlvbiBhbmQgc3RydWN0dXJlIGluc3BpcmVkIGJ5IHVuZGVyc2NvcmUuanNcbiAgICogaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS91bmRlcnNjb3JlL1xuICAgKi9cblxuICByZXR1cm4geyBcbiAgICBcbiAgICBCUkVBSzoge30sXG4gIFxuICAgIGV4dGVuZDogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBcbiAgICAgIHRoaXMuZWFjaChBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgICAgaWYgKCF0aGlzLmlzVW5kZWZpbmVkKG9ialtrZXldKSkgXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICBcbiAgICAgIH0sIHRoaXMpO1xuICAgICAgXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgXG4gICAgfSxcbiAgICBcbiAgICBkZWZhdWx0czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBcbiAgICAgIHRoaXMuZWFjaChBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgICAgaWYgKHRoaXMuaXNVbmRlZmluZWQodGFyZ2V0W2tleV0pKSBcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIFxuICAgICAgfSwgdGhpcyk7XG4gICAgICBcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgXG4gICAgfSxcbiAgICBcbiAgICBjb21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b0NhbGwgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgYXJncyA9IEFSUl9TTElDRS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0b0NhbGwubGVuZ3RoIC0xOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBbdG9DYWxsW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIGVhY2g6IGZ1bmN0aW9uKG9iaiwgaXRyLCBzY29wZSkge1xuXG4gICAgICBcbiAgICAgIGlmIChBUlJfRUFDSCAmJiBvYmouZm9yRWFjaCA9PT0gQVJSX0VBQ0gpIHsgXG4gICAgICAgIFxuICAgICAgICBvYmouZm9yRWFjaChpdHIsIHNjb3BlKTtcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09IG9iai5sZW5ndGggKyAwKSB7IC8vIElzIG51bWJlciBidXQgbm90IE5hTlxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIga2V5ID0gMCwgbCA9IG9iai5sZW5ndGg7IGtleSA8IGw7IGtleSsrKVxuICAgICAgICAgIGlmIChrZXkgaW4gb2JqICYmIGl0ci5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5KSA9PT0gdGhpcy5CUkVBSykgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikgXG4gICAgICAgICAgaWYgKGl0ci5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5KSA9PT0gdGhpcy5CUkVBSylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgfSxcbiAgICBcbiAgICBkZWZlcjogZnVuY3Rpb24oZm5jKSB7XG4gICAgICBzZXRUaW1lb3V0KGZuYywgMCk7XG4gICAgfSxcbiAgICBcbiAgICB0b0FycmF5OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmoudG9BcnJheSkgcmV0dXJuIG9iai50b0FycmF5KCk7XG4gICAgICByZXR1cm4gQVJSX1NMSUNFLmNhbGwob2JqKTtcbiAgICB9LFxuXG4gICAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgXG4gICAgaXNOdWxsOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gICAgfSxcbiAgICBcbiAgICBpc05hTjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBvYmo7XG4gICAgfSxcbiAgICBcbiAgICBpc0FycmF5OiBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3RvciA9PT0gQXJyYXk7XG4gICAgfSxcbiAgICBcbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuICAgIFxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG9iaiswO1xuICAgIH0sXG4gICAgXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gb2JqKycnO1xuICAgIH0sXG4gICAgXG4gICAgaXNCb29sZWFuOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IGZhbHNlIHx8IG9iaiA9PT0gdHJ1ZTtcbiAgICB9LFxuICAgIFxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIH1cbiAgXG4gIH07XG4gICAgXG59KSgpO1xuXG5cbmRhdC5jb2xvci50b1N0cmluZyA9IChmdW5jdGlvbiAoY29tbW9uKSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9yKSB7XG5cbiAgICBpZiAoY29sb3IuYSA9PSAxIHx8IGNvbW1vbi5pc1VuZGVmaW5lZChjb2xvci5hKSkge1xuXG4gICAgICB2YXIgcyA9IGNvbG9yLmhleC50b1N0cmluZygxNik7XG4gICAgICB3aGlsZSAocy5sZW5ndGggPCA2KSB7XG4gICAgICAgIHMgPSAnMCcgKyBzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJyMnICsgcztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHJldHVybiAncmdiYSgnICsgTWF0aC5yb3VuZChjb2xvci5yKSArICcsJyArIE1hdGgucm91bmQoY29sb3IuZykgKyAnLCcgKyBNYXRoLnJvdW5kKGNvbG9yLmIpICsgJywnICsgY29sb3IuYSArICcpJztcblxuICAgIH1cblxuICB9XG5cbn0pKGRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5Db2xvciA9IGRhdC5jb2xvci5Db2xvciA9IChmdW5jdGlvbiAoaW50ZXJwcmV0LCBtYXRoLCB0b1N0cmluZywgY29tbW9uKSB7XG5cbiAgdmFyIENvbG9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLl9fc3RhdGUgPSBpbnRlcnByZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmICh0aGlzLl9fc3RhdGUgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyAnRmFpbGVkIHRvIGludGVycHJldCBjb2xvciBhcmd1bWVudHMnO1xuICAgIH1cblxuICAgIHRoaXMuX19zdGF0ZS5hID0gdGhpcy5fX3N0YXRlLmEgfHwgMTtcblxuXG4gIH07XG5cbiAgQ29sb3IuQ09NUE9ORU5UUyA9IFsncicsJ2cnLCdiJywnaCcsJ3MnLCd2JywnaGV4JywnYSddO1xuXG4gIGNvbW1vbi5leHRlbmQoQ29sb3IucHJvdG90eXBlLCB7XG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcodGhpcyk7XG4gICAgfSxcblxuICAgIHRvT3JpZ2luYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5jb252ZXJzaW9uLndyaXRlKHRoaXMpO1xuICAgIH1cblxuICB9KTtcblxuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAncicsIDIpO1xuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnZycsIDEpO1xuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnYicsIDApO1xuXG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdoJyk7XG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdzJyk7XG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICd2Jyk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbG9yLnByb3RvdHlwZSwgJ2EnLCB7XG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5hO1xuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHRoaXMuX19zdGF0ZS5hID0gdjtcbiAgICB9XG5cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbG9yLnByb3RvdHlwZSwgJ2hleCcsIHtcblxuICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmICghdGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnSEVYJykge1xuICAgICAgICB0aGlzLl9fc3RhdGUuaGV4ID0gbWF0aC5yZ2JfdG9faGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fX3N0YXRlLmhleDtcblxuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcblxuICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ0hFWCc7XG4gICAgICB0aGlzLl9fc3RhdGUuaGV4ID0gdjtcblxuICAgIH1cblxuICB9KTtcblxuICBmdW5jdGlvbiBkZWZpbmVSR0JDb21wb25lbnQodGFyZ2V0LCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb21wb25lbnQsIHtcblxuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5fX3N0YXRlLnNwYWNlID09PSAnUkdCJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY2FsY3VsYXRlUkdCKHRoaXMsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ1JHQicpIHtcbiAgICAgICAgICByZWNhbGN1bGF0ZVJHQih0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KTtcbiAgICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnUkdCJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmluZUhTVkNvbXBvbmVudCh0YXJnZXQsIGNvbXBvbmVudCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG5cbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdO1xuXG4gICAgICAgIHJlY2FsY3VsYXRlSFNWKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ0hTVicpIHtcbiAgICAgICAgICByZWNhbGN1bGF0ZUhTVih0aGlzKTtcbiAgICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnSFNWJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2FsY3VsYXRlUkdCKGNvbG9yLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KSB7XG5cbiAgICBpZiAoY29sb3IuX19zdGF0ZS5zcGFjZSA9PT0gJ0hFWCcpIHtcblxuICAgICAgY29sb3IuX19zdGF0ZVtjb21wb25lbnRdID0gbWF0aC5jb21wb25lbnRfZnJvbV9oZXgoY29sb3IuX19zdGF0ZS5oZXgsIGNvbXBvbmVudEhleEluZGV4KTtcblxuICAgIH0gZWxzZSBpZiAoY29sb3IuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicpIHtcblxuICAgICAgY29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLCBtYXRoLmhzdl90b19yZ2IoY29sb3IuX19zdGF0ZS5oLCBjb2xvci5fX3N0YXRlLnMsIGNvbG9yLl9fc3RhdGUudikpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhyb3cgJ0NvcnJ1cHRlZCBjb2xvciBzdGF0ZSc7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2FsY3VsYXRlSFNWKGNvbG9yKSB7XG5cbiAgICB2YXIgcmVzdWx0ID0gbWF0aC5yZ2JfdG9faHN2KGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuXG4gICAgY29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLFxuICAgICAgICB7XG4gICAgICAgICAgczogcmVzdWx0LnMsXG4gICAgICAgICAgdjogcmVzdWx0LnZcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIWNvbW1vbi5pc05hTihyZXN1bHQuaCkpIHtcbiAgICAgIGNvbG9yLl9fc3RhdGUuaCA9IHJlc3VsdC5oO1xuICAgIH0gZWxzZSBpZiAoY29tbW9uLmlzVW5kZWZpbmVkKGNvbG9yLl9fc3RhdGUuaCkpIHtcbiAgICAgIGNvbG9yLl9fc3RhdGUuaCA9IDA7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gQ29sb3I7XG5cbn0pKGRhdC5jb2xvci5pbnRlcnByZXQgPSAoZnVuY3Rpb24gKHRvU3RyaW5nLCBjb21tb24pIHtcblxuICB2YXIgcmVzdWx0LCB0b1JldHVybjtcblxuICB2YXIgaW50ZXJwcmV0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0b1JldHVybiA9IGZhbHNlO1xuXG4gICAgdmFyIG9yaWdpbmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBjb21tb24udG9BcnJheShhcmd1bWVudHMpIDogYXJndW1lbnRzWzBdO1xuXG4gICAgY29tbW9uLmVhY2goSU5URVJQUkVUQVRJT05TLCBmdW5jdGlvbihmYW1pbHkpIHtcblxuICAgICAgaWYgKGZhbWlseS5saXRtdXMob3JpZ2luYWwpKSB7XG5cbiAgICAgICAgY29tbW9uLmVhY2goZmFtaWx5LmNvbnZlcnNpb25zLCBmdW5jdGlvbihjb252ZXJzaW9uLCBjb252ZXJzaW9uTmFtZSkge1xuXG4gICAgICAgICAgcmVzdWx0ID0gY29udmVyc2lvbi5yZWFkKG9yaWdpbmFsKTtcblxuICAgICAgICAgIGlmICh0b1JldHVybiA9PT0gZmFsc2UgJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdG9SZXR1cm4gPSByZXN1bHQ7XG4gICAgICAgICAgICByZXN1bHQuY29udmVyc2lvbk5hbWUgPSBjb252ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgIHJlc3VsdC5jb252ZXJzaW9uID0gY29udmVyc2lvbjtcbiAgICAgICAgICAgIHJldHVybiBjb21tb24uQlJFQUs7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbW1vbi5CUkVBSztcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG9SZXR1cm47XG5cbiAgfTtcblxuICB2YXIgSU5URVJQUkVUQVRJT05TID0gW1xuXG4gICAgLy8gU3RyaW5nc1xuICAgIHtcblxuICAgICAgbGl0bXVzOiBjb21tb24uaXNTdHJpbmcsXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgVEhSRUVfQ0hBUl9IRVg6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL14jKFtBLUYwLTldKShbQS1GMC05XSkoW0EtRjAtOV0pJC9pKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICAgICAgaGV4OiBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICcweCcgK1xuICAgICAgICAgICAgICAgICAgICAgIHRlc3RbMV0udG9TdHJpbmcoKSArIHRlc3RbMV0udG9TdHJpbmcoKSArXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdFsyXS50b1N0cmluZygpICsgdGVzdFsyXS50b1N0cmluZygpICtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0WzNdLnRvU3RyaW5nKCkgKyB0ZXN0WzNdLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgU0lYX0NIQVJfSEVYOiB7XG5cbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuXG4gICAgICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9eIyhbQS1GMC05XXs2fSkkL2kpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdIRVgnLFxuICAgICAgICAgICAgICBoZXg6IHBhcnNlSW50KCcweCcgKyB0ZXN0WzFdLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgQ1NTX1JHQjoge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXnJnYlxcKFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqXFwpLyk7XG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgIHI6IHBhcnNlRmxvYXQodGVzdFsxXSksXG4gICAgICAgICAgICAgIGc6IHBhcnNlRmxvYXQodGVzdFsyXSksXG4gICAgICAgICAgICAgIGI6IHBhcnNlRmxvYXQodGVzdFszXSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IHRvU3RyaW5nXG5cbiAgICAgICAgfSxcblxuICAgICAgICBDU1NfUkdCQToge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXnJnYmFcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgICAgICBnOiBwYXJzZUZsb2F0KHRlc3RbMl0pLFxuICAgICAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pLFxuICAgICAgICAgICAgICBhOiBwYXJzZUZsb2F0KHRlc3RbNF0pXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIE51bWJlcnNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzTnVtYmVyLFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIEhFWDoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgICAgIGhleDogb3JpZ2luYWwsXG4gICAgICAgICAgICAgIGNvbnZlcnNpb25OYW1lOiAnSEVYJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvci5oZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBBcnJheXNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzQXJyYXksXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgUkdCX0FSUkFZOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbC5sZW5ndGggIT0gMykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBvcmlnaW5hbFswXSxcbiAgICAgICAgICAgICAgZzogb3JpZ2luYWxbMV0sXG4gICAgICAgICAgICAgIGI6IG9yaWdpbmFsWzJdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYl07XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgUkdCQV9BUlJBWToge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9IDQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogb3JpZ2luYWxbMF0sXG4gICAgICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgICAgICBiOiBvcmlnaW5hbFsyXSxcbiAgICAgICAgICAgICAgYTogb3JpZ2luYWxbM11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iLCBjb2xvci5hXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gT2JqZWN0c1xuICAgIHtcblxuICAgICAgbGl0bXVzOiBjb21tb24uaXNPYmplY3QsXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgUkdCQV9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5yKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5nKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5hKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgICByOiBvcmlnaW5hbC5yLFxuICAgICAgICAgICAgICAgIGc6IG9yaWdpbmFsLmcsXG4gICAgICAgICAgICAgICAgYjogb3JpZ2luYWwuYixcbiAgICAgICAgICAgICAgICBhOiBvcmlnaW5hbC5hXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICByOiBjb2xvci5yLFxuICAgICAgICAgICAgICBnOiBjb2xvci5nLFxuICAgICAgICAgICAgICBiOiBjb2xvci5iLFxuICAgICAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIFJHQl9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5yKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5nKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgICByOiBvcmlnaW5hbC5yLFxuICAgICAgICAgICAgICAgIGc6IG9yaWdpbmFsLmcsXG4gICAgICAgICAgICAgICAgYjogb3JpZ2luYWwuYlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcjogY29sb3IucixcbiAgICAgICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICAgICAgYjogY29sb3IuYlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBIU1ZBX09CSjoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAoY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnMpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnYpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmEpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3BhY2U6ICdIU1YnLFxuICAgICAgICAgICAgICAgIGg6IG9yaWdpbmFsLmgsXG4gICAgICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgICAgICB2OiBvcmlnaW5hbC52LFxuICAgICAgICAgICAgICAgIGE6IG9yaWdpbmFsLmFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGg6IGNvbG9yLmgsXG4gICAgICAgICAgICAgIHM6IGNvbG9yLnMsXG4gICAgICAgICAgICAgIHY6IGNvbG9yLnYsXG4gICAgICAgICAgICAgIGE6IGNvbG9yLmFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgSFNWX09CSjoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAoY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnMpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnYpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3BhY2U6ICdIU1YnLFxuICAgICAgICAgICAgICAgIGg6IG9yaWdpbmFsLmgsXG4gICAgICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgICAgICB2OiBvcmlnaW5hbC52XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgICAgICB2OiBjb2xvci52XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG5cbiAgXTtcblxuICByZXR1cm4gaW50ZXJwcmV0O1xuXG5cbn0pKGRhdC5jb2xvci50b1N0cmluZyxcbmRhdC51dGlscy5jb21tb24pLFxuZGF0LmNvbG9yLm1hdGggPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciB0bXBDb21wb25lbnQ7XG5cbiAgcmV0dXJuIHtcblxuICAgIGhzdl90b19yZ2I6IGZ1bmN0aW9uKGgsIHMsIHYpIHtcblxuICAgICAgdmFyIGhpID0gTWF0aC5mbG9vcihoIC8gNjApICUgNjtcblxuICAgICAgdmFyIGYgPSBoIC8gNjAgLSBNYXRoLmZsb29yKGggLyA2MCk7XG4gICAgICB2YXIgcCA9IHYgKiAoMS4wIC0gcyk7XG4gICAgICB2YXIgcSA9IHYgKiAoMS4wIC0gKGYgKiBzKSk7XG4gICAgICB2YXIgdCA9IHYgKiAoMS4wIC0gKCgxLjAgLSBmKSAqIHMpKTtcbiAgICAgIHZhciBjID0gW1xuICAgICAgICBbdiwgdCwgcF0sXG4gICAgICAgIFtxLCB2LCBwXSxcbiAgICAgICAgW3AsIHYsIHRdLFxuICAgICAgICBbcCwgcSwgdl0sXG4gICAgICAgIFt0LCBwLCB2XSxcbiAgICAgICAgW3YsIHAsIHFdXG4gICAgICBdW2hpXTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcjogY1swXSAqIDI1NSxcbiAgICAgICAgZzogY1sxXSAqIDI1NSxcbiAgICAgICAgYjogY1syXSAqIDI1NVxuICAgICAgfTtcblxuICAgIH0sXG5cbiAgICByZ2JfdG9faHN2OiBmdW5jdGlvbihyLCBnLCBiKSB7XG5cbiAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgICAgICBkZWx0YSA9IG1heCAtIG1pbixcbiAgICAgICAgICBoLCBzO1xuXG4gICAgICBpZiAobWF4ICE9IDApIHtcbiAgICAgICAgcyA9IGRlbHRhIC8gbWF4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoOiBOYU4sXG4gICAgICAgICAgczogMCxcbiAgICAgICAgICB2OiAwXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChyID09IG1heCkge1xuICAgICAgICBoID0gKGcgLSBiKSAvIGRlbHRhO1xuICAgICAgfSBlbHNlIGlmIChnID09IG1heCkge1xuICAgICAgICBoID0gMiArIChiIC0gcikgLyBkZWx0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGggPSA0ICsgKHIgLSBnKSAvIGRlbHRhO1xuICAgICAgfVxuICAgICAgaCAvPSA2O1xuICAgICAgaWYgKGggPCAwKSB7XG4gICAgICAgIGggKz0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaDogaCAqIDM2MCxcbiAgICAgICAgczogcyxcbiAgICAgICAgdjogbWF4IC8gMjU1XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICByZ2JfdG9faGV4OiBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgICB2YXIgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoMCwgMiwgcik7XG4gICAgICBoZXggPSB0aGlzLmhleF93aXRoX2NvbXBvbmVudChoZXgsIDEsIGcpO1xuICAgICAgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoaGV4LCAwLCBiKTtcbiAgICAgIHJldHVybiBoZXg7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudF9mcm9tX2hleDogZnVuY3Rpb24oaGV4LCBjb21wb25lbnRJbmRleCkge1xuICAgICAgcmV0dXJuIChoZXggPj4gKGNvbXBvbmVudEluZGV4ICogOCkpICYgMHhGRjtcbiAgICB9LFxuXG4gICAgaGV4X3dpdGhfY29tcG9uZW50OiBmdW5jdGlvbihoZXgsIGNvbXBvbmVudEluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIDw8ICh0bXBDb21wb25lbnQgPSBjb21wb25lbnRJbmRleCAqIDgpIHwgKGhleCAmIH4gKDB4RkYgPDwgdG1wQ29tcG9uZW50KSk7XG4gICAgfVxuXG4gIH1cblxufSkoKSxcbmRhdC5jb2xvci50b1N0cmluZyxcbmRhdC51dGlscy5jb21tb24pOyIsIi8qKlxuICogZGF0LWd1aSBKYXZhU2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeVxuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2RhdC1ndWlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIENyZWF0aXZlIExhYlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqL1xuXG4vKiogQG5hbWVzcGFjZSAqL1xudmFyIGRhdCA9IG1vZHVsZS5leHBvcnRzID0gZGF0IHx8IHt9O1xuXG4vKiogQG5hbWVzcGFjZSAqL1xuZGF0Lmd1aSA9IGRhdC5ndWkgfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQudXRpbHMgPSBkYXQudXRpbHMgfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQuY29udHJvbGxlcnMgPSBkYXQuY29udHJvbGxlcnMgfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQuZG9tID0gZGF0LmRvbSB8fCB7fTtcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmRhdC5jb2xvciA9IGRhdC5jb2xvciB8fCB7fTtcblxuZGF0LnV0aWxzLmNzcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZDogZnVuY3Rpb24gKHVybCwgZG9jKSB7XG4gICAgICBkb2MgPSBkb2MgfHwgZG9jdW1lbnQ7XG4gICAgICB2YXIgbGluayA9IGRvYy5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG4gICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9LFxuICAgIGluamVjdDogZnVuY3Rpb24oY3NzLCBkb2MpIHtcbiAgICAgIGRvYyA9IGRvYyB8fCBkb2N1bWVudDtcbiAgICAgIHZhciBpbmplY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBpbmplY3RlZC50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgIGluamVjdGVkLmlubmVySFRNTCA9IGNzcztcbiAgICAgIGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGluamVjdGVkKTtcbiAgICB9XG4gIH1cbn0pKCk7XG5cblxuZGF0LnV0aWxzLmNvbW1vbiA9IChmdW5jdGlvbiAoKSB7XG4gIFxuICB2YXIgQVJSX0VBQ0ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcbiAgdmFyIEFSUl9TTElDRSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICAvKipcbiAgICogQmFuZC1haWQgbWV0aG9kcyBmb3IgdGhpbmdzIHRoYXQgc2hvdWxkIGJlIGEgbG90IGVhc2llciBpbiBKYXZhU2NyaXB0LlxuICAgKiBJbXBsZW1lbnRhdGlvbiBhbmQgc3RydWN0dXJlIGluc3BpcmVkIGJ5IHVuZGVyc2NvcmUuanNcbiAgICogaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS91bmRlcnNjb3JlL1xuICAgKi9cblxuICByZXR1cm4geyBcbiAgICBcbiAgICBCUkVBSzoge30sXG4gIFxuICAgIGV4dGVuZDogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBcbiAgICAgIHRoaXMuZWFjaChBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgICAgaWYgKCF0aGlzLmlzVW5kZWZpbmVkKG9ialtrZXldKSkgXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICBcbiAgICAgIH0sIHRoaXMpO1xuICAgICAgXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgXG4gICAgfSxcbiAgICBcbiAgICBkZWZhdWx0czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBcbiAgICAgIHRoaXMuZWFjaChBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgICAgaWYgKHRoaXMuaXNVbmRlZmluZWQodGFyZ2V0W2tleV0pKSBcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIFxuICAgICAgfSwgdGhpcyk7XG4gICAgICBcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgXG4gICAgfSxcbiAgICBcbiAgICBjb21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b0NhbGwgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgYXJncyA9IEFSUl9TTElDRS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0b0NhbGwubGVuZ3RoIC0xOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBbdG9DYWxsW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIGVhY2g6IGZ1bmN0aW9uKG9iaiwgaXRyLCBzY29wZSkge1xuXG4gICAgICBcbiAgICAgIGlmIChBUlJfRUFDSCAmJiBvYmouZm9yRWFjaCA9PT0gQVJSX0VBQ0gpIHsgXG4gICAgICAgIFxuICAgICAgICBvYmouZm9yRWFjaChpdHIsIHNjb3BlKTtcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09IG9iai5sZW5ndGggKyAwKSB7IC8vIElzIG51bWJlciBidXQgbm90IE5hTlxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIga2V5ID0gMCwgbCA9IG9iai5sZW5ndGg7IGtleSA8IGw7IGtleSsrKVxuICAgICAgICAgIGlmIChrZXkgaW4gb2JqICYmIGl0ci5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5KSA9PT0gdGhpcy5CUkVBSykgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikgXG4gICAgICAgICAgaWYgKGl0ci5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5KSA9PT0gdGhpcy5CUkVBSylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgfSxcbiAgICBcbiAgICBkZWZlcjogZnVuY3Rpb24oZm5jKSB7XG4gICAgICBzZXRUaW1lb3V0KGZuYywgMCk7XG4gICAgfSxcbiAgICBcbiAgICB0b0FycmF5OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmoudG9BcnJheSkgcmV0dXJuIG9iai50b0FycmF5KCk7XG4gICAgICByZXR1cm4gQVJSX1NMSUNFLmNhbGwob2JqKTtcbiAgICB9LFxuXG4gICAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgXG4gICAgaXNOdWxsOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gICAgfSxcbiAgICBcbiAgICBpc05hTjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBvYmo7XG4gICAgfSxcbiAgICBcbiAgICBpc0FycmF5OiBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3RvciA9PT0gQXJyYXk7XG4gICAgfSxcbiAgICBcbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuICAgIFxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG9iaiswO1xuICAgIH0sXG4gICAgXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gb2JqKycnO1xuICAgIH0sXG4gICAgXG4gICAgaXNCb29sZWFuOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IGZhbHNlIHx8IG9iaiA9PT0gdHJ1ZTtcbiAgICB9LFxuICAgIFxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIH1cbiAgXG4gIH07XG4gICAgXG59KSgpO1xuXG5cbmRhdC5jb250cm9sbGVycy5Db250cm9sbGVyID0gKGZ1bmN0aW9uIChjb21tb24pIHtcblxuICAvKipcbiAgICogQGNsYXNzIEFuIFwiYWJzdHJhY3RcIiBjbGFzcyB0aGF0IHJlcHJlc2VudHMgYSBnaXZlbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgIC8qKlxuICAgICAqIFRob3NlIHdobyBleHRlbmQgdGhpcyBjbGFzcyB3aWxsIHB1dCB0aGVpciBET00gZWxlbWVudHMgaW4gaGVyZS5cbiAgICAgKiBAdHlwZSB7RE9NRWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvYmplY3QgdG8gbWFuaXB1bGF0ZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gbWFuaXB1bGF0ZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBjaGFuZ2UuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB0aGlzLl9fb25DaGFuZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGZpbmlzaGluZyBjaGFuZ2UuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB0aGlzLl9fb25GaW5pc2hDaGFuZ2UgPSB1bmRlZmluZWQ7XG5cbiAgfTtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBDb250cm9sbGVyLnByb3RvdHlwZSxcblxuICAgICAgLyoqIEBsZW5kcyBkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlci5wcm90b3R5cGUgKi9cbiAgICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3BlY2lmeSB0aGF0IGEgZnVuY3Rpb24gZmlyZSBldmVyeSB0aW1lIHNvbWVvbmUgY2hhbmdlcyB0aGUgdmFsdWUgd2l0aFxuICAgICAgICAgKiB0aGlzIENvbnRyb2xsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuYyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSB2YWx1ZVxuICAgICAgICAgKiBpcyBtb2RpZmllZCB2aWEgdGhpcyBDb250cm9sbGVyLlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJ9IHRoaXNcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICB0aGlzLl9fb25DaGFuZ2UgPSBmbmM7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZnkgdGhhdCBhIGZ1bmN0aW9uIGZpcmUgZXZlcnkgdGltZSBzb21lb25lIFwiZmluaXNoZXNcIiBjaGFuZ2luZ1xuICAgICAgICAgKiB0aGUgdmFsdWUgd2loIHRoaXMgQ29udHJvbGxlci4gVXNlZnVsIGZvciB2YWx1ZXMgdGhhdCBjaGFuZ2VcbiAgICAgICAgICogaW5jcmVtZW50YWxseSBsaWtlIG51bWJlcnMgb3Igc3RyaW5ncy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5jIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXJcbiAgICAgICAgICogc29tZW9uZSBcImZpbmlzaGVzXCIgY2hhbmdpbmcgdGhlIHZhbHVlIHZpYSB0aGlzIENvbnRyb2xsZXIuXG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcn0gdGhpc1xuICAgICAgICAgKi9cbiAgICAgICAgb25GaW5pc2hDaGFuZ2U6IGZ1bmN0aW9uKGZuYykge1xuICAgICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZSA9IGZuYztcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdlIHRoZSB2YWx1ZSBvZiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5vYmplY3RbdGhpcy5wcm9wZXJ0eV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICBpZiAodGhpcy5fX29uQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLl9fb25DaGFuZ2UuY2FsbCh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY3VycmVudCB2YWx1ZSBvZiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFt0aGlzLnByb3BlcnR5XTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVmcmVzaGVzIHRoZSB2aXN1YWwgZGlzcGxheSBvZiBhIENvbnRyb2xsZXIgaW4gb3JkZXIgdG8ga2VlcCBzeW5jXG4gICAgICAgICAqIHdpdGggdGhlIG9iamVjdCdzIGN1cnJlbnQgdmFsdWUuXG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcn0gdGhpc1xuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlRGlzcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIHRoZSB2YWx1ZSBoYXMgZGV2aWF0ZWQgZnJvbSBpbml0aWFsVmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIGlzTW9kaWZpZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxWYWx1ZSAhPT0gdGhpcy5nZXRWYWx1ZSgpXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICk7XG5cbiAgcmV0dXJuIENvbnRyb2xsZXI7XG5cblxufSkoZGF0LnV0aWxzLmNvbW1vbik7XG5cblxuZGF0LmRvbS5kb20gPSAoZnVuY3Rpb24gKGNvbW1vbikge1xuXG4gIHZhciBFVkVOVF9NQVAgPSB7XG4gICAgJ0hUTUxFdmVudHMnOiBbJ2NoYW5nZSddLFxuICAgICdNb3VzZUV2ZW50cyc6IFsnY2xpY2snLCdtb3VzZW1vdmUnLCdtb3VzZWRvd24nLCdtb3VzZXVwJywgJ21vdXNlb3ZlciddLFxuICAgICdLZXlib2FyZEV2ZW50cyc6IFsna2V5ZG93biddXG4gIH07XG5cbiAgdmFyIEVWRU5UX01BUF9JTlYgPSB7fTtcbiAgY29tbW9uLmVhY2goRVZFTlRfTUFQLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgY29tbW9uLmVhY2godiwgZnVuY3Rpb24oZSkge1xuICAgICAgRVZFTlRfTUFQX0lOVltlXSA9IGs7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciBDU1NfVkFMVUVfUElYRUxTID0gLyhcXGQrKFxcLlxcZCspPylweC87XG5cbiAgZnVuY3Rpb24gY3NzVmFsdWVUb1BpeGVscyh2YWwpIHtcblxuICAgIGlmICh2YWwgPT09ICcwJyB8fCBjb21tb24uaXNVbmRlZmluZWQodmFsKSkgcmV0dXJuIDA7XG5cbiAgICB2YXIgbWF0Y2ggPSB2YWwubWF0Y2goQ1NTX1ZBTFVFX1BJWEVMUyk7XG5cbiAgICBpZiAoIWNvbW1vbi5pc051bGwobWF0Y2gpKSB7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyAuLi5lbXM/ICU/XG5cbiAgICByZXR1cm4gMDtcblxuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2VcbiAgICogQG1lbWJlciBkYXQuZG9tXG4gICAqL1xuICB2YXIgZG9tID0ge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKiBAcGFyYW0gc2VsZWN0YWJsZVxuICAgICAqL1xuICAgIG1ha2VTZWxlY3RhYmxlOiBmdW5jdGlvbihlbGVtLCBzZWxlY3RhYmxlKSB7XG5cbiAgICAgIGlmIChlbGVtID09PSB1bmRlZmluZWQgfHwgZWxlbS5zdHlsZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgIGVsZW0ub25zZWxlY3RzdGFydCA9IHNlbGVjdGFibGUgPyBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSA6IGZ1bmN0aW9uKCkge1xuICAgICAgfTtcblxuICAgICAgZWxlbS5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gc2VsZWN0YWJsZSA/ICdhdXRvJyA6ICdub25lJztcbiAgICAgIGVsZW0uc3R5bGUuS2h0bWxVc2VyU2VsZWN0ID0gc2VsZWN0YWJsZSA/ICdhdXRvJyA6ICdub25lJztcbiAgICAgIGVsZW0udW5zZWxlY3RhYmxlID0gc2VsZWN0YWJsZSA/ICdvbicgOiAnb2ZmJztcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICogQHBhcmFtIGhvcml6b250YWxcbiAgICAgKiBAcGFyYW0gdmVydGljYWxcbiAgICAgKi9cbiAgICBtYWtlRnVsbHNjcmVlbjogZnVuY3Rpb24oZWxlbSwgaG9yaXpvbnRhbCwgdmVydGljYWwpIHtcblxuICAgICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChob3Jpem9udGFsKSkgaG9yaXpvbnRhbCA9IHRydWU7XG4gICAgICBpZiAoY29tbW9uLmlzVW5kZWZpbmVkKHZlcnRpY2FsKSkgdmVydGljYWwgPSB0cnVlO1xuXG4gICAgICBlbGVtLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgZWxlbS5zdHlsZS5yaWdodCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgZWxlbS5zdHlsZS50b3AgPSAwO1xuICAgICAgICBlbGVtLnN0eWxlLmJvdHRvbSA9IDA7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEBwYXJhbSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgZmFrZUV2ZW50OiBmdW5jdGlvbihlbGVtLCBldmVudFR5cGUsIHBhcmFtcywgYXV4KSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICB2YXIgY2xhc3NOYW1lID0gRVZFTlRfTUFQX0lOVltldmVudFR5cGVdO1xuICAgICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCB0eXBlICcgKyBldmVudFR5cGUgKyAnIG5vdCBzdXBwb3J0ZWQuJyk7XG4gICAgICB9XG4gICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoY2xhc3NOYW1lKTtcbiAgICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNhc2UgJ01vdXNlRXZlbnRzJzpcbiAgICAgICAgICB2YXIgY2xpZW50WCA9IHBhcmFtcy54IHx8IHBhcmFtcy5jbGllbnRYIHx8IDA7XG4gICAgICAgICAgdmFyIGNsaWVudFkgPSBwYXJhbXMueSB8fCBwYXJhbXMuY2xpZW50WSB8fCAwO1xuICAgICAgICAgIGV2dC5pbml0TW91c2VFdmVudChldmVudFR5cGUsIHBhcmFtcy5idWJibGVzIHx8IGZhbHNlLFxuICAgICAgICAgICAgICBwYXJhbXMuY2FuY2VsYWJsZSB8fCB0cnVlLCB3aW5kb3csIHBhcmFtcy5jbGlja0NvdW50IHx8IDEsXG4gICAgICAgICAgICAgIDAsIC8vc2NyZWVuIFhcbiAgICAgICAgICAgICAgMCwgLy9zY3JlZW4gWVxuICAgICAgICAgICAgICBjbGllbnRYLCAvL2NsaWVudCBYXG4gICAgICAgICAgICAgIGNsaWVudFksIC8vY2xpZW50IFlcbiAgICAgICAgICAgICAgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdLZXlib2FyZEV2ZW50cyc6XG4gICAgICAgICAgdmFyIGluaXQgPSBldnQuaW5pdEtleWJvYXJkRXZlbnQgfHwgZXZ0LmluaXRLZXlFdmVudDsgLy8gd2Via2l0IHx8IG1velxuICAgICAgICAgIGNvbW1vbi5kZWZhdWx0cyhwYXJhbXMsIHtcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgICAgICBjdHJsS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGFsdEtleTogZmFsc2UsXG4gICAgICAgICAgICBzaGlmdEtleTogZmFsc2UsXG4gICAgICAgICAgICBtZXRhS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGtleUNvZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNoYXJDb2RlOiB1bmRlZmluZWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpbml0KGV2ZW50VHlwZSwgcGFyYW1zLmJ1YmJsZXMgfHwgZmFsc2UsXG4gICAgICAgICAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLCB3aW5kb3csXG4gICAgICAgICAgICAgIHBhcmFtcy5jdHJsS2V5LCBwYXJhbXMuYWx0S2V5LFxuICAgICAgICAgICAgICBwYXJhbXMuc2hpZnRLZXksIHBhcmFtcy5tZXRhS2V5LFxuICAgICAgICAgICAgICBwYXJhbXMua2V5Q29kZSwgcGFyYW1zLmNoYXJDb2RlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBldnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgcGFyYW1zLmJ1YmJsZXMgfHwgZmFsc2UsXG4gICAgICAgICAgICAgIHBhcmFtcy5jYW5jZWxhYmxlIHx8IHRydWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY29tbW9uLmRlZmF1bHRzKGV2dCwgYXV4KTtcbiAgICAgIGVsZW0uZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGZ1bmNcbiAgICAgKiBAcGFyYW0gYm9vbFxuICAgICAqL1xuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsZW0sIGV2ZW50LCBmdW5jLCBib29sKSB7XG4gICAgICBib29sID0gYm9vbCB8fCBmYWxzZTtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuYywgYm9vbCk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KVxuICAgICAgICBlbGVtLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgZnVuYyk7XG4gICAgICByZXR1cm4gZG9tO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGZ1bmNcbiAgICAgKiBAcGFyYW0gYm9vbFxuICAgICAqL1xuICAgIHVuYmluZDogZnVuY3Rpb24oZWxlbSwgZXZlbnQsIGZ1bmMsIGJvb2wpIHtcbiAgICAgIGJvb2wgPSBib29sIHx8IGZhbHNlO1xuICAgICAgaWYgKGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jLCBib29sKTtcbiAgICAgIGVsc2UgaWYgKGVsZW0uZGV0YWNoRXZlbnQpXG4gICAgICAgIGVsZW0uZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBmdW5jKTtcbiAgICAgIHJldHVybiBkb207XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGVsZW0uY2xhc3NOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGVsZW0uY2xhc3NOYW1lICE9PSBjbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtLmNsYXNzTmFtZS5zcGxpdCgvICsvKTtcbiAgICAgICAgaWYgKGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpID09IC0xKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKGNsYXNzTmFtZSk7XG4gICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRvbTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEBwYXJhbSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWxlbSwgY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGlmIChlbGVtLmNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gZWxlbS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5jbGFzc05hbWUgPT09IGNsYXNzTmFtZSkge1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjbGFzc2VzID0gZWxlbS5jbGFzc05hbWUuc3BsaXQoLyArLyk7XG4gICAgICAgICAgdmFyIGluZGV4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICBjbGFzc2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZG9tO1xuICAgIH0sXG5cbiAgICBoYXNDbGFzczogZnVuY3Rpb24oZWxlbSwgY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnKD86XnxcXFxccyspJyArIGNsYXNzTmFtZSArICcoPzpcXFxccyt8JCknKS50ZXN0KGVsZW0uY2xhc3NOYW1lKSB8fCBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIGdldFdpZHRoOiBmdW5jdGlvbihlbGVtKSB7XG5cbiAgICAgIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG5cbiAgICAgIHJldHVybiBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydib3JkZXItbGVmdC13aWR0aCddKSArXG4gICAgICAgICAgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLXJpZ2h0LXdpZHRoJ10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLWxlZnQnXSkgK1xuICAgICAgICAgIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ3BhZGRpbmctcmlnaHQnXSkgK1xuICAgICAgICAgIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ3dpZHRoJ10pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgZ2V0SGVpZ2h0OiBmdW5jdGlvbihlbGVtKSB7XG5cbiAgICAgIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG5cbiAgICAgIHJldHVybiBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydib3JkZXItdG9wLXdpZHRoJ10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydib3JkZXItYm90dG9tLXdpZHRoJ10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLXRvcCddKSArXG4gICAgICAgICAgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy1ib3R0b20nXSkgK1xuICAgICAgICAgIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ2hlaWdodCddKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIGdldE9mZnNldDogZnVuY3Rpb24oZWxlbSkge1xuICAgICAgdmFyIG9mZnNldCA9IHtsZWZ0OiAwLCB0b3A6MH07XG4gICAgICBpZiAoZWxlbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIG9mZnNldC5sZWZ0ICs9IGVsZW0ub2Zmc2V0TGVmdDtcbiAgICAgICAgICBvZmZzZXQudG9wICs9IGVsZW0ub2Zmc2V0VG9wO1xuICAgICAgICB9IHdoaWxlIChlbGVtID0gZWxlbS5vZmZzZXRQYXJlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICB9LFxuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3Bvc3RzLzI2ODQ1NjEvcmV2aXNpb25zXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBpc0FjdGl2ZTogZnVuY3Rpb24oZWxlbSkge1xuICAgICAgcmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKCBlbGVtLnR5cGUgfHwgZWxlbS5ocmVmICk7XG4gICAgfVxuXG4gIH07XG5cbiAgcmV0dXJuIGRvbTtcblxufSkoZGF0LnV0aWxzLmNvbW1vbik7XG5cblxuZGF0LmNvbnRyb2xsZXJzLk9wdGlvbkNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKENvbnRyb2xsZXIsIGRvbSwgY29tbW9uKSB7XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBQcm92aWRlcyBhIHNlbGVjdCBpbnB1dCB0byBhbHRlciB0aGUgcHJvcGVydHkgb2YgYW4gb2JqZWN0LCB1c2luZyBhXG4gICAqIGxpc3Qgb2YgYWNjZXB0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAZXh0ZW5kcyBkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlclxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmdbXX0gb3B0aW9ucyBBIG1hcCBvZiBsYWJlbHMgdG8gYWNjZXB0YWJsZSB2YWx1ZXMsIG9yXG4gICAqIGEgbGlzdCBvZiBhY2NlcHRhYmxlIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgT3B0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIG9wdGlvbnMpIHtcblxuICAgIE9wdGlvbkNvbnRyb2xsZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkcm9wIGRvd24gbWVudVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB0aGlzLl9fc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG5cbiAgICBpZiAoY29tbW9uLmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgIGNvbW1vbi5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgbWFwW2VsZW1lbnRdID0gZWxlbWVudDtcbiAgICAgIH0pO1xuICAgICAgb3B0aW9ucyA9IG1hcDtcbiAgICB9XG5cbiAgICBjb21tb24uZWFjaChvcHRpb25zLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG5cbiAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdC5pbm5lckhUTUwgPSBrZXk7XG4gICAgICBvcHQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgIF90aGlzLl9fc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG5cbiAgICB9KTtcblxuICAgIC8vIEFja25vd2xlZGdlIG9yaWdpbmFsIHZhbHVlXG4gICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG5cbiAgICBkb20uYmluZCh0aGlzLl9fc2VsZWN0LCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVzaXJlZFZhbHVlID0gdGhpcy5vcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShkZXNpcmVkVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19zZWxlY3QpO1xuXG4gIH07XG5cbiAgT3B0aW9uQ29udHJvbGxlci5zdXBlcmNsYXNzID0gQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBPcHRpb25Db250cm9sbGVyLnByb3RvdHlwZSxcbiAgICAgIENvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICB7XG5cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBPcHRpb25Db250cm9sbGVyLnN1cGVyY2xhc3MucHJvdG90eXBlLnNldFZhbHVlLmNhbGwodGhpcywgdik7XG4gICAgICAgICAgaWYgKHRoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZURpc3BsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuX19zZWxlY3QudmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgcmV0dXJuIE9wdGlvbkNvbnRyb2xsZXIuc3VwZXJjbGFzcy5wcm90b3R5cGUudXBkYXRlRGlzcGxheS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIHJldHVybiBPcHRpb25Db250cm9sbGVyO1xuXG59KShkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcixcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNvbW1vbik7XG5cblxuZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKENvbnRyb2xsZXIsIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUmVwcmVzZW50cyBhIGdpdmVuIHByb3BlcnR5IG9mIGFuIG9iamVjdCB0aGF0IGlzIGEgbnVtYmVyLlxuICAgKlxuICAgKiBAZXh0ZW5kcyBkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlclxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc10gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtcy5taW5dIE1pbmltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtcy5tYXhdIE1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtcy5zdGVwXSBJbmNyZW1lbnQgYnkgd2hpY2ggdG8gY2hhbmdlIHZhbHVlXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgTnVtYmVyQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIHBhcmFtcykge1xuXG4gICAgTnVtYmVyQ29udHJvbGxlci5zdXBlcmNsYXNzLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgICB0aGlzLl9fbWluID0gcGFyYW1zLm1pbjtcbiAgICB0aGlzLl9fbWF4ID0gcGFyYW1zLm1heDtcbiAgICB0aGlzLl9fc3RlcCA9IHBhcmFtcy5zdGVwO1xuXG4gICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZCh0aGlzLl9fc3RlcCkpIHtcblxuICAgICAgaWYgKHRoaXMuaW5pdGlhbFZhbHVlID09IDApIHtcbiAgICAgICAgdGhpcy5fX2ltcGxpZWRTdGVwID0gMTsgLy8gV2hhdCBhcmUgd2UsIHBzeWNoaWNzP1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxuICAgICAgICB0aGlzLl9faW1wbGllZFN0ZXAgPSBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyh0aGlzLmluaXRpYWxWYWx1ZSkvTWF0aC5MTjEwKSkvMTA7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLl9faW1wbGllZFN0ZXAgPSB0aGlzLl9fc3RlcDtcblxuICAgIH1cblxuICAgIHRoaXMuX19wcmVjaXNpb24gPSBudW1EZWNpbWFscyh0aGlzLl9faW1wbGllZFN0ZXApO1xuXG5cbiAgfTtcblxuICBOdW1iZXJDb250cm9sbGVyLnN1cGVyY2xhc3MgPSBDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIE51bWJlckNvbnRyb2xsZXIucHJvdG90eXBlLFxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIC8qKiBAbGVuZHMgZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXIucHJvdG90eXBlICovXG4gICAgICB7XG5cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uKHYpIHtcblxuICAgICAgICAgIGlmICh0aGlzLl9fbWluICE9PSB1bmRlZmluZWQgJiYgdiA8IHRoaXMuX19taW4pIHtcbiAgICAgICAgICAgIHYgPSB0aGlzLl9fbWluO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fX21heCAhPT0gdW5kZWZpbmVkICYmIHYgPiB0aGlzLl9fbWF4KSB7XG4gICAgICAgICAgICB2ID0gdGhpcy5fX21heDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5fX3N0ZXAgIT09IHVuZGVmaW5lZCAmJiB2ICUgdGhpcy5fX3N0ZXAgIT0gMCkge1xuICAgICAgICAgICAgdiA9IE1hdGgucm91bmQodiAvIHRoaXMuX19zdGVwKSAqIHRoaXMuX19zdGVwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBOdW1iZXJDb250cm9sbGVyLnN1cGVyY2xhc3MucHJvdG90eXBlLnNldFZhbHVlLmNhbGwodGhpcywgdik7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3BlY2lmeSBhIG1pbmltdW0gdmFsdWUgZm9yIDxjb2RlPm9iamVjdFtwcm9wZXJ0eV08L2NvZGU+LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gbWluVmFsdWUgVGhlIG1pbmltdW0gdmFsdWUgZm9yXG4gICAgICAgICAqIDxjb2RlPm9iamVjdFtwcm9wZXJ0eV08L2NvZGU+XG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlcn0gdGhpc1xuICAgICAgICAgKi9cbiAgICAgICAgbWluOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgdGhpcy5fX21pbiA9IHY7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZnkgYSBtYXhpbXVtIHZhbHVlIGZvciA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heFZhbHVlIFRoZSBtYXhpbXVtIHZhbHVlIGZvclxuICAgICAgICAgKiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJ9IHRoaXNcbiAgICAgICAgICovXG4gICAgICAgIG1heDogZnVuY3Rpb24odikge1xuICAgICAgICAgIHRoaXMuX19tYXggPSB2O1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZ5IGEgc3RlcCB2YWx1ZSB0aGF0IGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyXG4gICAgICAgICAqIGluY3JlbWVudHMgYnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwVmFsdWUgVGhlIHN0ZXAgdmFsdWUgZm9yXG4gICAgICAgICAqIGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyXG4gICAgICAgICAqIEBkZWZhdWx0IGlmIG1pbmltdW0gYW5kIG1heGltdW0gc3BlY2lmaWVkIGluY3JlbWVudCBpcyAxJSBvZiB0aGVcbiAgICAgICAgICogZGlmZmVyZW5jZSBvdGhlcndpc2Ugc3RlcFZhbHVlIGlzIDFcbiAgICAgICAgICogQHJldHVybnMge2RhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyfSB0aGlzXG4gICAgICAgICAqL1xuICAgICAgICBzdGVwOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgdGhpcy5fX3N0ZXAgPSB2O1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIGZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcbiAgICB4ID0geC50b1N0cmluZygpO1xuICAgIGlmICh4LmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICByZXR1cm4geC5sZW5ndGggLSB4LmluZGV4T2YoJy4nKSAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOdW1iZXJDb250cm9sbGVyO1xuXG59KShkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcixcbmRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyQm94ID0gKGZ1bmN0aW9uIChOdW1iZXJDb250cm9sbGVyLCBkb20sIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUmVwcmVzZW50cyBhIGdpdmVuIHByb3BlcnR5IG9mIGFuIG9iamVjdCB0aGF0IGlzIGEgbnVtYmVyIGFuZFxuICAgKiBwcm92aWRlcyBhbiBpbnB1dCBlbGVtZW50IHdpdGggd2hpY2ggdG8gbWFuaXB1bGF0ZSBpdC5cbiAgICpcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdIE9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMubWluXSBNaW5pbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMubWF4XSBNYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMuc3RlcF0gSW5jcmVtZW50IGJ5IHdoaWNoIHRvIGNoYW5nZSB2YWx1ZVxuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5jb250cm9sbGVyc1xuICAgKi9cbiAgdmFyIE51bWJlckNvbnRyb2xsZXJCb3ggPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcblxuICAgIHRoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID0gZmFsc2U7XG5cbiAgICBOdW1iZXJDb250cm9sbGVyQm94LnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8qKlxuICAgICAqIHtOdW1iZXJ9IFByZXZpb3VzIG1vdXNlIHkgcG9zaXRpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdmFyIHByZXZfeTtcblxuICAgIHRoaXMuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5fX2lucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG5cbiAgICAvLyBNYWtlcyBpdCBzbyBtYW51YWxseSBzcGVjaWZpZWQgdmFsdWVzIGFyZSBub3QgdHJ1bmNhdGVkLlxuXG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAnY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2JsdXInLCBvbkJsdXIpO1xuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAvLyBXaGVuIHByZXNzaW5nIGVudGlyZSwgeW91IGNhbiBiZSBhcyBwcmVjaXNlIGFzIHlvdSB3YW50LlxuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgX3RoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICAgIF90aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgIHZhciBhdHRlbXB0ZWQgPSBwYXJzZUZsb2F0KF90aGlzLl9faW5wdXQudmFsdWUpO1xuICAgICAgaWYgKCFjb21tb24uaXNOYU4oYXR0ZW1wdGVkKSkgX3RoaXMuc2V0VmFsdWUoYXR0ZW1wdGVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgICBvbkNoYW5nZSgpO1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlRG93bihlKSB7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIHByZXZfeSA9IGUuY2xpZW50WTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlRHJhZyhlKSB7XG5cbiAgICAgIHZhciBkaWZmID0gcHJldl95IC0gZS5jbGllbnRZO1xuICAgICAgX3RoaXMuc2V0VmFsdWUoX3RoaXMuZ2V0VmFsdWUoKSArIGRpZmYgKiBfdGhpcy5fX2ltcGxpZWRTdGVwKTtcblxuICAgICAgcHJldl95ID0gZS5jbGllbnRZO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19pbnB1dCk7XG5cbiAgfTtcblxuICBOdW1iZXJDb250cm9sbGVyQm94LnN1cGVyY2xhc3MgPSBOdW1iZXJDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIE51bWJlckNvbnRyb2xsZXJCb3gucHJvdG90eXBlLFxuICAgICAgTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIHtcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID8gdGhpcy5nZXRWYWx1ZSgpIDogcm91bmRUb0RlY2ltYWwodGhpcy5nZXRWYWx1ZSgpLCB0aGlzLl9fcHJlY2lzaW9uKTtcbiAgICAgICAgICByZXR1cm4gTnVtYmVyQ29udHJvbGxlckJveC5zdXBlcmNsYXNzLnByb3RvdHlwZS51cGRhdGVEaXNwbGF5LmNhbGwodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICk7XG5cbiAgZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XG4gICAgdmFyIHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIHRlblRvKSAvIHRlblRvO1xuICB9XG5cbiAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJCb3g7XG5cbn0pKGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyLFxuZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlclNsaWRlciA9IChmdW5jdGlvbiAoTnVtYmVyQ29udHJvbGxlciwgZG9tLCBjc3MsIGNvbW1vbiwgc3R5bGVTaGVldCkge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUmVwcmVzZW50cyBhIGdpdmVuIHByb3BlcnR5IG9mIGFuIG9iamVjdCB0aGF0IGlzIGEgbnVtYmVyLCBjb250YWluc1xuICAgKiBhIG1pbmltdW0gYW5kIG1heGltdW0sIGFuZCBwcm92aWRlcyBhIHNsaWRlciBlbGVtZW50IHdpdGggd2hpY2ggdG9cbiAgICogbWFuaXB1bGF0ZSBpdC4gSXQgc2hvdWxkIGJlIG5vdGVkIHRoYXQgdGhlIHNsaWRlciBlbGVtZW50IGlzIG1hZGUgdXAgb2ZcbiAgICogPGNvZGU+Jmx0O2RpdiZndDs8L2NvZGU+IHRhZ3MsIDxzdHJvbmc+bm90PC9zdHJvbmc+IHRoZSBodG1sNVxuICAgKiA8Y29kZT4mbHQ7c2xpZGVyJmd0OzwvY29kZT4gZWxlbWVudC5cbiAgICpcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJcbiAgICogXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtaW5WYWx1ZSBNaW5pbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heFZhbHVlIE1heGltdW0gYWxsb3dlZCB2YWx1ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcFZhbHVlIEluY3JlbWVudCBieSB3aGljaCB0byBjaGFuZ2UgdmFsdWVcbiAgICpcbiAgICogQG1lbWJlciBkYXQuY29udHJvbGxlcnNcbiAgICovXG4gIHZhciBOdW1iZXJDb250cm9sbGVyU2xpZGVyID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgbWluLCBtYXgsIHN0ZXApIHtcblxuICAgIE51bWJlckNvbnRyb2xsZXJTbGlkZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBtaW4sIG1heDogbWF4LCBzdGVwOiBzdGVwIH0pO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX19iYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX2ZvcmVncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBcblxuXG4gICAgZG9tLmJpbmQodGhpcy5fX2JhY2tncm91bmQsICdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgXG4gICAgZG9tLmFkZENsYXNzKHRoaXMuX19iYWNrZ3JvdW5kLCAnc2xpZGVyJyk7XG4gICAgZG9tLmFkZENsYXNzKHRoaXMuX19mb3JlZ3JvdW5kLCAnc2xpZGVyLWZnJyk7XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlRG93bihlKSB7XG5cbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuXG4gICAgICBvbk1vdXNlRHJhZyhlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlRHJhZyhlKSB7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIG9mZnNldCA9IGRvbS5nZXRPZmZzZXQoX3RoaXMuX19iYWNrZ3JvdW5kKTtcbiAgICAgIHZhciB3aWR0aCA9IGRvbS5nZXRXaWR0aChfdGhpcy5fX2JhY2tncm91bmQpO1xuICAgICAgXG4gICAgICBfdGhpcy5zZXRWYWx1ZShcbiAgICAgICAgbWFwKGUuY2xpZW50WCwgb2Zmc2V0LmxlZnQsIG9mZnNldC5sZWZ0ICsgd2lkdGgsIF90aGlzLl9fbWluLCBfdGhpcy5fX21heClcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIGlmIChfdGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChfdGhpcywgX3RoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG5cbiAgICB0aGlzLl9fYmFja2dyb3VuZC5hcHBlbmRDaGlsZCh0aGlzLl9fZm9yZWdyb3VuZCk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19iYWNrZ3JvdW5kKTtcblxuICB9O1xuXG4gIE51bWJlckNvbnRyb2xsZXJTbGlkZXIuc3VwZXJjbGFzcyA9IE51bWJlckNvbnRyb2xsZXI7XG5cbiAgLyoqXG4gICAqIEluamVjdHMgZGVmYXVsdCBzdHlsZXNoZWV0IGZvciBzbGlkZXIgZWxlbWVudHMuXG4gICAqL1xuICBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnVzZURlZmF1bHRTdHlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICBjc3MuaW5qZWN0KHN0eWxlU2hlZXQpO1xuICB9O1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIE51bWJlckNvbnRyb2xsZXJTbGlkZXIucHJvdG90eXBlLFxuICAgICAgTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIHtcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcGN0ID0gKHRoaXMuZ2V0VmFsdWUoKSAtIHRoaXMuX19taW4pLyh0aGlzLl9fbWF4IC0gdGhpcy5fX21pbik7XG4gICAgICAgICAgdGhpcy5fX2ZvcmVncm91bmQuc3R5bGUud2lkdGggPSBwY3QqMTAwKyclJztcbiAgICAgICAgICByZXR1cm4gTnVtYmVyQ29udHJvbGxlclNsaWRlci5zdXBlcmNsYXNzLnByb3RvdHlwZS51cGRhdGVEaXNwbGF5LmNhbGwodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG5cblxuICApO1xuXG4gIGZ1bmN0aW9uIG1hcCh2LCBpMSwgaTIsIG8xLCBvMikge1xuICAgIHJldHVybiBvMSArIChvMiAtIG8xKSAqICgodiAtIGkxKSAvIChpMiAtIGkxKSk7XG4gIH1cblxuICByZXR1cm4gTnVtYmVyQ29udHJvbGxlclNsaWRlcjtcbiAgXG59KShkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlcixcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNzcyxcbmRhdC51dGlscy5jb21tb24sXG5cIi5zbGlkZXIge1xcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAycHggNHB4IHJnYmEoMCwwLDAsMC4xNSk7XFxuICBoZWlnaHQ6IDFlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XFxuICBwYWRkaW5nOiAwIDAuNWVtO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLnNsaWRlci1mZyB7XFxuICBwYWRkaW5nOiAxcHggMCAycHggMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhYWE7XFxuICBoZWlnaHQ6IDFlbTtcXG4gIG1hcmdpbi1sZWZ0OiAtMC41ZW07XFxuICBwYWRkaW5nLXJpZ2h0OiAwLjVlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbSAwIDAgMWVtO1xcbn1cXG5cXG4uc2xpZGVyLWZnOmFmdGVyIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXI6ICAxcHggc29saWQgI2FhYTtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgbWFyZ2luLXJpZ2h0OiAtMWVtO1xcbiAgbWFyZ2luLXRvcDogLTFweDtcXG4gIGhlaWdodDogMC45ZW07XFxuICB3aWR0aDogMC45ZW07XFxufVwiKTtcblxuXG5kYXQuY29udHJvbGxlcnMuRnVuY3Rpb25Db250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBkb20sIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUHJvdmlkZXMgYSBHVUkgaW50ZXJmYWNlIHRvIGZpcmUgYSBzcGVjaWZpZWQgbWV0aG9kLCBhIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgICpcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICpcbiAgICogQG1lbWJlciBkYXQuY29udHJvbGxlcnNcbiAgICovXG4gIHZhciBGdW5jdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCB0ZXh0KSB7XG5cbiAgICBGdW5jdGlvbkNvbnRyb2xsZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX19idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fYnV0dG9uLmlubmVySFRNTCA9IHRleHQgPT09IHVuZGVmaW5lZCA/ICdGaXJlJyA6IHRleHQ7XG4gICAgZG9tLmJpbmQodGhpcy5fX2J1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX3RoaXMuZmlyZSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgZG9tLmFkZENsYXNzKHRoaXMuX19idXR0b24sICdidXR0b24nKTtcblxuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fYnV0dG9uKTtcblxuXG4gIH07XG5cbiAgRnVuY3Rpb25Db250cm9sbGVyLnN1cGVyY2xhc3MgPSBDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIEZ1bmN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUsXG4gICAgICBDb250cm9sbGVyLnByb3RvdHlwZSxcbiAgICAgIHtcbiAgICAgICAgXG4gICAgICAgIGZpcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0aGlzLl9fb25DaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX19vbkNoYW5nZS5jYWxsKHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmdldFZhbHVlKCkuY2FsbCh0aGlzLm9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICApO1xuXG4gIHJldHVybiBGdW5jdGlvbkNvbnRyb2xsZXI7XG5cbn0pKGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyLFxuZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuY29udHJvbGxlcnMuQm9vbGVhbkNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKENvbnRyb2xsZXIsIGRvbSwgY29tbW9uKSB7XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBQcm92aWRlcyBhIGNoZWNrYm94IGlucHV0IHRvIGFsdGVyIHRoZSBib29sZWFuIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICpcbiAgICogQG1lbWJlciBkYXQuY29udHJvbGxlcnNcbiAgICovXG4gIHZhciBCb29sZWFuQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgIEJvb2xlYW5Db250cm9sbGVyLnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5fX3ByZXYgPSB0aGlzLmdldFZhbHVlKCk7XG5cbiAgICB0aGlzLl9fY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuX19jaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcblxuXG4gICAgZG9tLmJpbmQodGhpcy5fX2NoZWNrYm94LCAnY2hhbmdlJywgb25DaGFuZ2UsIGZhbHNlKTtcblxuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fY2hlY2tib3gpO1xuXG4gICAgLy8gTWF0Y2ggb3JpZ2luYWwgdmFsdWVcbiAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcblxuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuICAgICAgX3RoaXMuc2V0VmFsdWUoIV90aGlzLl9fcHJldik7XG4gICAgfVxuXG4gIH07XG5cbiAgQm9vbGVhbkNvbnRyb2xsZXIuc3VwZXJjbGFzcyA9IENvbnRyb2xsZXI7XG5cbiAgY29tbW9uLmV4dGVuZChcblxuICAgICAgQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlLFxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIHtcblxuICAgICAgICBzZXRWYWx1ZTogZnVuY3Rpb24odikge1xuICAgICAgICAgIHZhciB0b1JldHVybiA9IEJvb2xlYW5Db250cm9sbGVyLnN1cGVyY2xhc3MucHJvdG90eXBlLnNldFZhbHVlLmNhbGwodGhpcywgdik7XG4gICAgICAgICAgaWYgKHRoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fX3ByZXYgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZURpc3BsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICh0aGlzLmdldFZhbHVlKCkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuX19jaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnY2hlY2tlZCcpO1xuICAgICAgICAgICAgdGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSB0cnVlOyAgICBcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9fY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBCb29sZWFuQ29udHJvbGxlci5zdXBlcmNsYXNzLnByb3RvdHlwZS51cGRhdGVEaXNwbGF5LmNhbGwodGhpcyk7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgIH1cblxuICApO1xuXG4gIHJldHVybiBCb29sZWFuQ29udHJvbGxlcjtcblxufSkoZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXIsXG5kYXQuZG9tLmRvbSxcbmRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5jb2xvci50b1N0cmluZyA9IChmdW5jdGlvbiAoY29tbW9uKSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9yKSB7XG5cbiAgICBpZiAoY29sb3IuYSA9PSAxIHx8IGNvbW1vbi5pc1VuZGVmaW5lZChjb2xvci5hKSkge1xuXG4gICAgICB2YXIgcyA9IGNvbG9yLmhleC50b1N0cmluZygxNik7XG4gICAgICB3aGlsZSAocy5sZW5ndGggPCA2KSB7XG4gICAgICAgIHMgPSAnMCcgKyBzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJyMnICsgcztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHJldHVybiAncmdiYSgnICsgTWF0aC5yb3VuZChjb2xvci5yKSArICcsJyArIE1hdGgucm91bmQoY29sb3IuZykgKyAnLCcgKyBNYXRoLnJvdW5kKGNvbG9yLmIpICsgJywnICsgY29sb3IuYSArICcpJztcblxuICAgIH1cblxuICB9XG5cbn0pKGRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5jb2xvci5pbnRlcnByZXQgPSAoZnVuY3Rpb24gKHRvU3RyaW5nLCBjb21tb24pIHtcblxuICB2YXIgcmVzdWx0LCB0b1JldHVybjtcblxuICB2YXIgaW50ZXJwcmV0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0b1JldHVybiA9IGZhbHNlO1xuXG4gICAgdmFyIG9yaWdpbmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBjb21tb24udG9BcnJheShhcmd1bWVudHMpIDogYXJndW1lbnRzWzBdO1xuXG4gICAgY29tbW9uLmVhY2goSU5URVJQUkVUQVRJT05TLCBmdW5jdGlvbihmYW1pbHkpIHtcblxuICAgICAgaWYgKGZhbWlseS5saXRtdXMob3JpZ2luYWwpKSB7XG5cbiAgICAgICAgY29tbW9uLmVhY2goZmFtaWx5LmNvbnZlcnNpb25zLCBmdW5jdGlvbihjb252ZXJzaW9uLCBjb252ZXJzaW9uTmFtZSkge1xuXG4gICAgICAgICAgcmVzdWx0ID0gY29udmVyc2lvbi5yZWFkKG9yaWdpbmFsKTtcblxuICAgICAgICAgIGlmICh0b1JldHVybiA9PT0gZmFsc2UgJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdG9SZXR1cm4gPSByZXN1bHQ7XG4gICAgICAgICAgICByZXN1bHQuY29udmVyc2lvbk5hbWUgPSBjb252ZXJzaW9uTmFtZTtcbiAgICAgICAgICAgIHJlc3VsdC5jb252ZXJzaW9uID0gY29udmVyc2lvbjtcbiAgICAgICAgICAgIHJldHVybiBjb21tb24uQlJFQUs7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbW1vbi5CUkVBSztcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG9SZXR1cm47XG5cbiAgfTtcblxuICB2YXIgSU5URVJQUkVUQVRJT05TID0gW1xuXG4gICAgLy8gU3RyaW5nc1xuICAgIHtcblxuICAgICAgbGl0bXVzOiBjb21tb24uaXNTdHJpbmcsXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgVEhSRUVfQ0hBUl9IRVg6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL14jKFtBLUYwLTldKShbQS1GMC05XSkoW0EtRjAtOV0pJC9pKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICAgICAgaGV4OiBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICcweCcgK1xuICAgICAgICAgICAgICAgICAgICAgIHRlc3RbMV0udG9TdHJpbmcoKSArIHRlc3RbMV0udG9TdHJpbmcoKSArXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdFsyXS50b1N0cmluZygpICsgdGVzdFsyXS50b1N0cmluZygpICtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0WzNdLnRvU3RyaW5nKCkgKyB0ZXN0WzNdLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgU0lYX0NIQVJfSEVYOiB7XG5cbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuXG4gICAgICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9eIyhbQS1GMC05XXs2fSkkL2kpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdIRVgnLFxuICAgICAgICAgICAgICBoZXg6IHBhcnNlSW50KCcweCcgKyB0ZXN0WzFdLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgQ1NTX1JHQjoge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXnJnYlxcKFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqXFwpLyk7XG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgIHI6IHBhcnNlRmxvYXQodGVzdFsxXSksXG4gICAgICAgICAgICAgIGc6IHBhcnNlRmxvYXQodGVzdFsyXSksXG4gICAgICAgICAgICAgIGI6IHBhcnNlRmxvYXQodGVzdFszXSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IHRvU3RyaW5nXG5cbiAgICAgICAgfSxcblxuICAgICAgICBDU1NfUkdCQToge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXnJnYmFcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgICAgICBnOiBwYXJzZUZsb2F0KHRlc3RbMl0pLFxuICAgICAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pLFxuICAgICAgICAgICAgICBhOiBwYXJzZUZsb2F0KHRlc3RbNF0pXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIE51bWJlcnNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzTnVtYmVyLFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIEhFWDoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgICAgIGhleDogb3JpZ2luYWwsXG4gICAgICAgICAgICAgIGNvbnZlcnNpb25OYW1lOiAnSEVYJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvci5oZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBBcnJheXNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzQXJyYXksXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgUkdCX0FSUkFZOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbC5sZW5ndGggIT0gMykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBvcmlnaW5hbFswXSxcbiAgICAgICAgICAgICAgZzogb3JpZ2luYWxbMV0sXG4gICAgICAgICAgICAgIGI6IG9yaWdpbmFsWzJdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYl07XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgUkdCQV9BUlJBWToge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9IDQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogb3JpZ2luYWxbMF0sXG4gICAgICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgICAgICBiOiBvcmlnaW5hbFsyXSxcbiAgICAgICAgICAgICAgYTogb3JpZ2luYWxbM11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iLCBjb2xvci5hXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gT2JqZWN0c1xuICAgIHtcblxuICAgICAgbGl0bXVzOiBjb21tb24uaXNPYmplY3QsXG5cbiAgICAgIGNvbnZlcnNpb25zOiB7XG5cbiAgICAgICAgUkdCQV9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5yKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5nKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5hKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgICByOiBvcmlnaW5hbC5yLFxuICAgICAgICAgICAgICAgIGc6IG9yaWdpbmFsLmcsXG4gICAgICAgICAgICAgICAgYjogb3JpZ2luYWwuYixcbiAgICAgICAgICAgICAgICBhOiBvcmlnaW5hbC5hXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICByOiBjb2xvci5yLFxuICAgICAgICAgICAgICBnOiBjb2xvci5nLFxuICAgICAgICAgICAgICBiOiBjb2xvci5iLFxuICAgICAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIFJHQl9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5yKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5nKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgICByOiBvcmlnaW5hbC5yLFxuICAgICAgICAgICAgICAgIGc6IG9yaWdpbmFsLmcsXG4gICAgICAgICAgICAgICAgYjogb3JpZ2luYWwuYlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcjogY29sb3IucixcbiAgICAgICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICAgICAgYjogY29sb3IuYlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBIU1ZBX09CSjoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAoY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnMpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnYpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmEpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3BhY2U6ICdIU1YnLFxuICAgICAgICAgICAgICAgIGg6IG9yaWdpbmFsLmgsXG4gICAgICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgICAgICB2OiBvcmlnaW5hbC52LFxuICAgICAgICAgICAgICAgIGE6IG9yaWdpbmFsLmFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGg6IGNvbG9yLmgsXG4gICAgICAgICAgICAgIHM6IGNvbG9yLnMsXG4gICAgICAgICAgICAgIHY6IGNvbG9yLnYsXG4gICAgICAgICAgICAgIGE6IGNvbG9yLmFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgSFNWX09CSjoge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAoY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnMpICYmXG4gICAgICAgICAgICAgICAgY29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnYpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3BhY2U6ICdIU1YnLFxuICAgICAgICAgICAgICAgIGg6IG9yaWdpbmFsLmgsXG4gICAgICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgICAgICB2OiBvcmlnaW5hbC52XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgICAgICB2OiBjb2xvci52XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG5cbiAgXTtcblxuICByZXR1cm4gaW50ZXJwcmV0O1xuXG5cbn0pKGRhdC5jb2xvci50b1N0cmluZyxcbmRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5HVUkgPSBkYXQuZ3VpLkdVSSA9IChmdW5jdGlvbiAoY3NzLCBzYXZlRGlhbG9ndWVDb250ZW50cywgc3R5bGVTaGVldCwgY29udHJvbGxlckZhY3RvcnksIENvbnRyb2xsZXIsIEJvb2xlYW5Db250cm9sbGVyLCBGdW5jdGlvbkNvbnRyb2xsZXIsIE51bWJlckNvbnRyb2xsZXJCb3gsIE51bWJlckNvbnRyb2xsZXJTbGlkZXIsIE9wdGlvbkNvbnRyb2xsZXIsIENvbG9yQ29udHJvbGxlciwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBDZW50ZXJlZERpdiwgZG9tLCBjb21tb24pIHtcblxuICBjc3MuaW5qZWN0KHN0eWxlU2hlZXQpO1xuXG4gIC8qKiBPdXRlci1tb3N0IGNsYXNzTmFtZSBmb3IgR1VJJ3MgKi9cbiAgdmFyIENTU19OQU1FU1BBQ0UgPSAnZGcnO1xuXG4gIHZhciBISURFX0tFWV9DT0RFID0gNzI7XG5cbiAgLyoqIFRoZSBvbmx5IHZhbHVlIHNoYXJlZCBiZXR3ZWVuIHRoZSBKUyBhbmQgU0NTUy4gVXNlIGNhdXRpb24uICovXG4gIHZhciBDTE9TRV9CVVRUT05fSEVJR0hUID0gMjA7XG5cbiAgdmFyIERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSA9ICdEZWZhdWx0JztcblxuICB2YXIgU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSA9IChmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICdsb2NhbFN0b3JhZ2UnIGluIHdpbmRvdyAmJiB3aW5kb3dbJ2xvY2FsU3RvcmFnZSddICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pKCk7XG5cbiAgdmFyIFNBVkVfRElBTE9HVUU7XG5cbiAgLyoqIEhhdmUgd2UgeWV0IHRvIGNyZWF0ZSBhbiBhdXRvUGxhY2UgR1VJPyAqL1xuICB2YXIgYXV0b19wbGFjZV92aXJnaW4gPSB0cnVlO1xuXG4gIC8qKiBGaXhlZCBwb3NpdGlvbiBkaXYgdGhhdCBhdXRvIHBsYWNlIEdVSSdzIGdvIGluc2lkZSAqL1xuICB2YXIgYXV0b19wbGFjZV9jb250YWluZXI7XG5cbiAgLyoqIEFyZSB3ZSBoaWRpbmcgdGhlIEdVSSdzID8gKi9cbiAgdmFyIGhpZGUgPSBmYWxzZTtcblxuICAvKiogR1VJJ3Mgd2hpY2ggc2hvdWxkIGJlIGhpZGRlbiAqL1xuICB2YXIgaGlkZWFibGVfZ3VpcyA9IFtdO1xuXG4gIC8qKlxuICAgKiBBIGxpZ2h0d2VpZ2h0IGNvbnRyb2xsZXIgbGlicmFyeSBmb3IgSmF2YVNjcmlwdC4gSXQgYWxsb3dzIHlvdSB0byBlYXNpbHlcbiAgICogbWFuaXB1bGF0ZSB2YXJpYWJsZXMgYW5kIGZpcmUgZnVuY3Rpb25zIG9uIHRoZSBmbHkuXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5ndWlcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyYW1zLm5hbWVdIFRoZSBuYW1lIG9mIHRoaXMgR1VJLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5sb2FkXSBKU09OIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNhdmVkIHN0YXRlIG9mXG4gICAqIHRoaXMgR1VJLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtwYXJhbXMuYXV0bz10cnVlXVxuICAgKiBAcGFyYW0ge2RhdC5ndWkuR1VJfSBbcGFyYW1zLnBhcmVudF0gVGhlIEdVSSBJJ20gbmVzdGVkIGluLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtwYXJhbXMuY2xvc2VkXSBJZiB0cnVlLCBzdGFydHMgY2xvc2VkXG4gICAqL1xuICB2YXIgR1VJID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLyoqXG4gICAgICogT3V0ZXJtb3N0IERPTSBFbGVtZW50XG4gICAgICogQHR5cGUgRE9NRWxlbWVudFxuICAgICAqL1xuICAgIHRoaXMuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX191bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX191bCk7XG5cbiAgICBkb20uYWRkQ2xhc3ModGhpcy5kb21FbGVtZW50LCBDU1NfTkFNRVNQQUNFKTtcblxuICAgIC8qKlxuICAgICAqIE5lc3RlZCBHVUkncyBieSBuYW1lXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHRoaXMuX19mb2xkZXJzID0ge307XG5cbiAgICB0aGlzLl9fY29udHJvbGxlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygb2JqZWN0cyBJJ20gcmVtZW1iZXJpbmcgZm9yIHNhdmUsIG9ubHkgdXNlZCBpbiB0b3AgbGV2ZWwgR1VJXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHRoaXMuX19yZW1lbWJlcmVkT2JqZWN0cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogTWFwcyB0aGUgaW5kZXggb2YgcmVtZW1iZXJlZCBvYmplY3RzIHRvIGEgbWFwIG9mIGNvbnRyb2xsZXJzLCBvbmx5IHVzZWRcbiAgICAgKiBpbiB0b3AgbGV2ZWwgR1VJLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFtcbiAgICAgKiAge1xuICAgICAqICAgIHByb3BlcnR5TmFtZTogQ29udHJvbGxlcixcbiAgICAgKiAgICBhbm90aGVyUHJvcGVydHlOYW1lOiBDb250cm9sbGVyXG4gICAgICogIH0sXG4gICAgICogIHtcbiAgICAgKiAgICBwcm9wZXJ0eU5hbWU6IENvbnRyb2xsZXJcbiAgICAgKiAgfVxuICAgICAqIF1cbiAgICAgKi9cbiAgICB0aGlzLl9fcmVtZW1iZXJlZE9iamVjdEluZGVjZXNUb0NvbnRyb2xsZXJzID0gW107XG5cbiAgICB0aGlzLl9fbGlzdGVuaW5nID0gW107XG5cbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgICAvLyBEZWZhdWx0IHBhcmFtZXRlcnNcbiAgICBwYXJhbXMgPSBjb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgICBhdXRvUGxhY2U6IHRydWUsXG4gICAgICB3aWR0aDogR1VJLkRFRkFVTFRfV0lEVEhcbiAgICB9KTtcblxuICAgIHBhcmFtcyA9IGNvbW1vbi5kZWZhdWx0cyhwYXJhbXMsIHtcbiAgICAgIHJlc2l6YWJsZTogcGFyYW1zLmF1dG9QbGFjZSxcbiAgICAgIGhpZGVhYmxlOiBwYXJhbXMuYXV0b1BsYWNlXG4gICAgfSk7XG5cblxuICAgIGlmICghY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5sb2FkKSkge1xuXG4gICAgICAvLyBFeHBsaWNpdCBwcmVzZXRcbiAgICAgIGlmIChwYXJhbXMucHJlc2V0KSBwYXJhbXMubG9hZC5wcmVzZXQgPSBwYXJhbXMucHJlc2V0O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgcGFyYW1zLmxvYWQgPSB7IHByZXNldDogREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FIH07XG5cbiAgICB9XG5cbiAgICBpZiAoY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpICYmIHBhcmFtcy5oaWRlYWJsZSkge1xuICAgICAgaGlkZWFibGVfZ3Vpcy5wdXNoKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgcm9vdCBsZXZlbCBHVUkncyBhcmUgcmVzaXphYmxlLlxuICAgIHBhcmFtcy5yZXNpemFibGUgPSBjb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkgJiYgcGFyYW1zLnJlc2l6YWJsZTtcblxuXG4gICAgaWYgKHBhcmFtcy5hdXRvUGxhY2UgJiYgY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5zY3JvbGxhYmxlKSkge1xuICAgICAgcGFyYW1zLnNjcm9sbGFibGUgPSB0cnVlO1xuICAgIH1cbi8vICAgIHBhcmFtcy5zY3JvbGxhYmxlID0gY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpICYmIHBhcmFtcy5zY3JvbGxhYmxlID09PSB0cnVlO1xuXG4gICAgLy8gTm90IHBhcnQgb2YgcGFyYW1zIGJlY2F1c2UgSSBkb24ndCB3YW50IHBlb3BsZSBwYXNzaW5nIHRoaXMgaW4gdmlhXG4gICAgLy8gY29uc3RydWN0b3IuIFNob3VsZCBiZSBhICdyZW1lbWJlcmVkJyB2YWx1ZS5cbiAgICB2YXIgdXNlX2xvY2FsX3N0b3JhZ2UgPVxuICAgICAgICBTVVBQT1JUU19MT0NBTF9TVE9SQUdFICYmXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKHRoaXMsICdpc0xvY2FsJykpID09PSAndHJ1ZSc7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLFxuXG4gICAgICAgIC8qKiBAbGVuZHMgZGF0Lmd1aS5HVUkucHJvdG90eXBlICovXG4gICAgICAgIHtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBwYXJlbnQgPGNvZGU+R1VJPC9jb2RlPlxuICAgICAgICAgICAqIEB0eXBlIGRhdC5ndWkuR1VJXG4gICAgICAgICAgICovXG4gICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgc2Nyb2xsYWJsZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy5zY3JvbGxhYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBIYW5kbGVzIDxjb2RlPkdVSTwvY29kZT4ncyBlbGVtZW50IHBsYWNlbWVudCBmb3IgeW91XG4gICAgICAgICAgICogQHR5cGUgQm9vbGVhblxuICAgICAgICAgICAqL1xuICAgICAgICAgIGF1dG9QbGFjZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy5hdXRvUGxhY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBpZGVudGlmaWVyIGZvciBhIHNldCBvZiBzYXZlZCB2YWx1ZXNcbiAgICAgICAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwcmVzZXQ6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRSb290KCkucHJlc2V0O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbXMubG9hZC5wcmVzZXQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZ2V0Um9vdCgpLnByZXNldCA9IHY7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmxvYWQucHJlc2V0ID0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRQcmVzZXRTZWxlY3RJbmRleCh0aGlzKTtcbiAgICAgICAgICAgICAgX3RoaXMucmV2ZXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVGhlIHdpZHRoIG9mIDxjb2RlPkdVSTwvY29kZT4gZWxlbWVudFxuICAgICAgICAgICAqIEB0eXBlIE51bWJlclxuICAgICAgICAgICAqL1xuICAgICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLndpZHRoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICBwYXJhbXMud2lkdGggPSB2O1xuICAgICAgICAgICAgICBzZXRXaWR0aChfdGhpcywgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBuYW1lIG9mIDxjb2RlPkdVSTwvY29kZT4uIFVzZWQgZm9yIGZvbGRlcnMuIGkuZVxuICAgICAgICAgICAqIGEgZm9sZGVyJ3MgbmFtZVxuICAgICAgICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAgICAgICAqL1xuICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJhbXMubmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgLy8gVE9ETyBDaGVjayBmb3IgY29sbGlzaW9ucyBhbW9uZyBzaWJsaW5nIGZvbGRlcnNcbiAgICAgICAgICAgICAgcGFyYW1zLm5hbWUgPSB2O1xuICAgICAgICAgICAgICBpZiAodGl0bGVfcm93X25hbWUpIHtcbiAgICAgICAgICAgICAgICB0aXRsZV9yb3dfbmFtZS5pbm5lckhUTUwgPSBwYXJhbXMubmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBXaGV0aGVyIHRoZSA8Y29kZT5HVUk8L2NvZGU+IGlzIGNvbGxhcHNlZCBvciBub3RcbiAgICAgICAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICAgICAgICovXG4gICAgICAgICAgY2xvc2VkOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLmNsb3NlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgcGFyYW1zLmNsb3NlZCA9IHY7XG4gICAgICAgICAgICAgIGlmIChwYXJhbXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgZG9tLmFkZENsYXNzKF90aGlzLl9fdWwsIEdVSS5DTEFTU19DTE9TRUQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVDbGFzcyhfdGhpcy5fX3VsLCBHVUkuQ0xBU1NfQ0xPU0VEKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBGb3IgYnJvd3NlcnMgdGhhdCBhcmVuJ3QgZ29pbmcgdG8gcmVzcGVjdCB0aGUgQ1NTIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIC8vIExldHMganVzdCBjaGVjayBvdXIgaGVpZ2h0IGFnYWluc3QgdGhlIHdpbmRvdyBoZWlnaHQgcmlnaHQgb2ZmXG4gICAgICAgICAgICAgIC8vIHRoZSBiYXQuXG4gICAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcblxuICAgICAgICAgICAgICBpZiAoX3RoaXMuX19jbG9zZUJ1dHRvbikge1xuICAgICAgICAgICAgICAgIF90aGlzLl9fY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gdiA/IEdVSS5URVhUX09QRU4gOiBHVUkuVEVYVF9DTE9TRUQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQ29udGFpbnMgYWxsIHByZXNldHNcbiAgICAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBsb2FkOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLmxvYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdG8gdXNlIDxhIGhyZWY9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vU3RvcmFnZSNsb2NhbFN0b3JhZ2VcIj5sb2NhbFN0b3JhZ2U8L2E+IGFzIHRoZSBtZWFucyBmb3JcbiAgICAgICAgICAgKiA8Y29kZT5yZW1lbWJlcjwvY29kZT5pbmdcbiAgICAgICAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICAgICAgICovXG4gICAgICAgICAgdXNlTG9jYWxTdG9yYWdlOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VfbG9jYWxfc3RvcmFnZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGJvb2wpIHtcbiAgICAgICAgICAgICAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UpIHtcbiAgICAgICAgICAgICAgICB1c2VfbG9jYWxfc3RvcmFnZSA9IGJvb2w7XG4gICAgICAgICAgICAgICAgaWYgKGJvb2wpIHtcbiAgICAgICAgICAgICAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ3VubG9hZCcsIHNhdmVUb0xvY2FsU3RvcmFnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGRvbS51bmJpbmQod2luZG93LCAndW5sb2FkJywgc2F2ZVRvTG9jYWxTdG9yYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaChfdGhpcywgJ2lzTG9jYWwnKSwgYm9vbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIC8vIEFyZSB3ZSBhIHJvb3QgbGV2ZWwgR1VJP1xuICAgIGlmIChjb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkpIHtcblxuICAgICAgcGFyYW1zLmNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBkb20uYWRkQ2xhc3ModGhpcy5kb21FbGVtZW50LCBHVUkuQ0xBU1NfTUFJTik7XG4gICAgICBkb20ubWFrZVNlbGVjdGFibGUodGhpcy5kb21FbGVtZW50LCBmYWxzZSk7XG5cbiAgICAgIC8vIEFyZSB3ZSBzdXBwb3NlZCB0byBiZSBsb2FkaW5nIGxvY2FsbHk/XG4gICAgICBpZiAoU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSkge1xuXG4gICAgICAgIGlmICh1c2VfbG9jYWxfc3RvcmFnZSkge1xuXG4gICAgICAgICAgX3RoaXMudXNlTG9jYWxTdG9yYWdlID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzYXZlZF9ndWkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKHRoaXMsICdndWknKSk7XG5cbiAgICAgICAgICBpZiAoc2F2ZWRfZ3VpKSB7XG4gICAgICAgICAgICBwYXJhbXMubG9hZCA9IEpTT04ucGFyc2Uoc2F2ZWRfZ3VpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19jbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5fX2Nsb3NlQnV0dG9uLmlubmVySFRNTCA9IEdVSS5URVhUX0NMT1NFRDtcbiAgICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19DTE9TRV9CVVRUT04pO1xuICAgICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19jbG9zZUJ1dHRvbik7XG5cbiAgICAgIGRvbS5iaW5kKHRoaXMuX19jbG9zZUJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgX3RoaXMuY2xvc2VkID0gIV90aGlzLmNsb3NlZDtcblxuXG4gICAgICB9KTtcblxuXG4gICAgICAvLyBPaCwgeW91J3JlIGEgbmVzdGVkIEdVSSFcbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAocGFyYW1zLmNsb3NlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmFtcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGl0bGVfcm93X25hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShwYXJhbXMubmFtZSk7XG4gICAgICBkb20uYWRkQ2xhc3ModGl0bGVfcm93X25hbWUsICdjb250cm9sbGVyLW5hbWUnKTtcblxuICAgICAgdmFyIHRpdGxlX3JvdyA9IGFkZFJvdyhfdGhpcywgdGl0bGVfcm93X25hbWUpO1xuXG4gICAgICB2YXIgb25fY2xpY2tfdGl0bGUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgX3RoaXMuY2xvc2VkID0gIV90aGlzLmNsb3NlZDtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgZG9tLmFkZENsYXNzKHRoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCk7XG5cbiAgICAgIGRvbS5hZGRDbGFzcyh0aXRsZV9yb3csICd0aXRsZScpO1xuICAgICAgZG9tLmJpbmQodGl0bGVfcm93LCAnY2xpY2snLCBvbl9jbGlja190aXRsZSk7XG5cbiAgICAgIGlmICghcGFyYW1zLmNsb3NlZCkge1xuICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5hdXRvUGxhY2UpIHtcblxuICAgICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSkge1xuXG4gICAgICAgIGlmIChhdXRvX3BsYWNlX3Zpcmdpbikge1xuICAgICAgICAgIGF1dG9fcGxhY2VfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZG9tLmFkZENsYXNzKGF1dG9fcGxhY2VfY29udGFpbmVyLCBDU1NfTkFNRVNQQUNFKTtcbiAgICAgICAgICBkb20uYWRkQ2xhc3MoYXV0b19wbGFjZV9jb250YWluZXIsIEdVSS5DTEFTU19BVVRPX1BMQUNFX0NPTlRBSU5FUik7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhdXRvX3BsYWNlX2NvbnRhaW5lcik7XG4gICAgICAgICAgYXV0b19wbGFjZV92aXJnaW4gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1dCBpdCBpbiB0aGUgZG9tIGZvciB5b3UuXG4gICAgICAgIGF1dG9fcGxhY2VfY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgLy8gQXBwbHkgdGhlIGF1dG8gc3R5bGVzXG4gICAgICAgIGRvbS5hZGRDbGFzcyh0aGlzLmRvbUVsZW1lbnQsIEdVSS5DTEFTU19BVVRPX1BMQUNFKTtcblxuICAgICAgfVxuXG5cbiAgICAgIC8vIE1ha2UgaXQgbm90IGVsYXN0aWMuXG4gICAgICBpZiAoIXRoaXMucGFyZW50KSBzZXRXaWR0aChfdGhpcywgcGFyYW1zLndpZHRoKTtcblxuICAgIH1cblxuICAgIGRvbS5iaW5kKHdpbmRvdywgJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkgeyBfdGhpcy5vblJlc2l6ZSgpIH0pO1xuICAgIGRvbS5iaW5kKHRoaXMuX191bCwgJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBmdW5jdGlvbigpIHsgX3RoaXMub25SZXNpemUoKTsgfSk7XG4gICAgZG9tLmJpbmQodGhpcy5fX3VsLCAndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uKCkgeyBfdGhpcy5vblJlc2l6ZSgpIH0pO1xuICAgIGRvbS5iaW5kKHRoaXMuX191bCwgJ29UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7IF90aGlzLm9uUmVzaXplKCkgfSk7XG4gICAgdGhpcy5vblJlc2l6ZSgpO1xuXG5cbiAgICBpZiAocGFyYW1zLnJlc2l6YWJsZSkge1xuICAgICAgYWRkUmVzaXplSGFuZGxlKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2goX3RoaXMsICdndWknKSwgSlNPTi5zdHJpbmdpZnkoX3RoaXMuZ2V0U2F2ZU9iamVjdCgpKSk7XG4gICAgfVxuXG4gICAgdmFyIHJvb3QgPSBfdGhpcy5nZXRSb290KCk7XG4gICAgZnVuY3Rpb24gcmVzZXRXaWR0aCgpIHtcbiAgICAgICAgdmFyIHJvb3QgPSBfdGhpcy5nZXRSb290KCk7XG4gICAgICAgIHJvb3Qud2lkdGggKz0gMTtcbiAgICAgICAgY29tbW9uLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJvb3Qud2lkdGggLT0gMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcGFyYW1zLnBhcmVudCkge1xuICAgICAgICByZXNldFdpZHRoKCk7XG4gICAgICB9XG5cbiAgfTtcblxuICBHVUkudG9nZ2xlSGlkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaGlkZSA9ICFoaWRlO1xuICAgIGNvbW1vbi5lYWNoKGhpZGVhYmxlX2d1aXMsIGZ1bmN0aW9uKGd1aSkge1xuICAgICAgZ3VpLmRvbUVsZW1lbnQuc3R5bGUuekluZGV4ID0gaGlkZSA/IC05OTkgOiA5OTk7XG4gICAgICBndWkuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gaGlkZSA/IDAgOiAxO1xuICAgIH0pO1xuICB9O1xuXG4gIEdVSS5DTEFTU19BVVRPX1BMQUNFID0gJ2EnO1xuICBHVUkuQ0xBU1NfQVVUT19QTEFDRV9DT05UQUlORVIgPSAnYWMnO1xuICBHVUkuQ0xBU1NfTUFJTiA9ICdtYWluJztcbiAgR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XID0gJ2NyJztcbiAgR1VJLkNMQVNTX1RPT19UQUxMID0gJ3RhbGxlci10aGFuLXdpbmRvdyc7XG4gIEdVSS5DTEFTU19DTE9TRUQgPSAnY2xvc2VkJztcbiAgR1VJLkNMQVNTX0NMT1NFX0JVVFRPTiA9ICdjbG9zZS1idXR0b24nO1xuICBHVUkuQ0xBU1NfRFJBRyA9ICdkcmFnJztcblxuICBHVUkuREVGQVVMVF9XSURUSCA9IDI0NTtcbiAgR1VJLlRFWFRfQ0xPU0VEID0gJ0Nsb3NlIENvbnRyb2xzJztcbiAgR1VJLlRFWFRfT1BFTiA9ICdPcGVuIENvbnRyb2xzJztcblxuICBkb20uYmluZCh3aW5kb3csICdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICAgIChlLndoaWNoID09PSBISURFX0tFWV9DT0RFIHx8IGUua2V5Q29kZSA9PSBISURFX0tFWV9DT0RFKSkge1xuICAgICAgR1VJLnRvZ2dsZUhpZGUoKTtcbiAgICB9XG5cbiAgfSwgZmFsc2UpO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIEdVSS5wcm90b3R5cGUsXG5cbiAgICAgIC8qKiBAbGVuZHMgZGF0Lmd1aS5HVUkgKi9cbiAgICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIG9iamVjdFxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlcbiAgICAgICAgICogQHJldHVybnMge2RhdC5jb250cm9sbGVycy5Db250cm9sbGVyfSBUaGUgbmV3IGNvbnRyb2xsZXIgdGhhdCB3YXMgYWRkZWQuXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkOiBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG5cbiAgICAgICAgICByZXR1cm4gYWRkKFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICAgIHByb3BlcnR5LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZmFjdG9yeUFyZ3M6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIG9iamVjdFxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlcbiAgICAgICAgICogQHJldHVybnMge2RhdC5jb250cm9sbGVycy5Db2xvckNvbnRyb2xsZXJ9IFRoZSBuZXcgY29udHJvbGxlciB0aGF0IHdhcyBhZGRlZC5cbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqL1xuICAgICAgICBhZGRDb2xvcjogZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXG4gICAgICAgICAgcmV0dXJuIGFkZChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBjb250cm9sbGVyXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjb250cm9sbGVyKSB7XG5cbiAgICAgICAgICAvLyBUT0RPIGxpc3RlbmluZz9cbiAgICAgICAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoY29udHJvbGxlci5fX2xpKTtcbiAgICAgICAgICB0aGlzLl9fY29udHJvbGxlcnMuc2xpY2UodGhpcy5fX2NvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlciksIDEpO1xuICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgY29tbW9uLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX3RoaXMub25SZXNpemUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgaWYgKHRoaXMuYXV0b1BsYWNlKSB7XG4gICAgICAgICAgICBhdXRvX3BsYWNlX2NvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0Lmd1aS5HVUl9IFRoZSBuZXcgZm9sZGVyLlxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhpcyBHVUkgYWxyZWFkeSBoYXMgYSBmb2xkZXIgYnkgdGhlIHNwZWNpZmllZFxuICAgICAgICAgKiBuYW1lXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkRm9sZGVyOiBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgICAgICAvLyBXZSBoYXZlIHRvIHByZXZlbnQgY29sbGlzaW9ucyBvbiBuYW1lcyBpbiBvcmRlciB0byBoYXZlIGEga2V5XG4gICAgICAgICAgLy8gYnkgd2hpY2ggdG8gcmVtZW1iZXIgc2F2ZWQgdmFsdWVzXG4gICAgICAgICAgaWYgKHRoaXMuX19mb2xkZXJzW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGFscmVhZHkgaGF2ZSBhIGZvbGRlciBpbiB0aGlzIEdVSSBieSB0aGUnICtcbiAgICAgICAgICAgICAgICAnIG5hbWUgXCInICsgbmFtZSArICdcIicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBuZXdfZ3VpX3BhcmFtcyA9IHsgbmFtZTogbmFtZSwgcGFyZW50OiB0aGlzIH07XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHBhc3MgZG93biB0aGUgYXV0b1BsYWNlIHRyYWl0IHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gYXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBvcGVuL2Nsb3NlIGZvbGRlciBhY3Rpb25zIHRvXG4gICAgICAgICAgLy8gZW5zdXJlIHRoYXQgYSBzY3JvbGxiYXIgYXBwZWFycyBpZiB0aGUgd2luZG93IGlzIHRvbyBzaG9ydC5cbiAgICAgICAgICBuZXdfZ3VpX3BhcmFtcy5hdXRvUGxhY2UgPSB0aGlzLmF1dG9QbGFjZTtcblxuICAgICAgICAgIC8vIERvIHdlIGhhdmUgc2F2ZWQgYXBwZWFyYW5jZSBkYXRhIGZvciB0aGlzIGZvbGRlcj9cblxuICAgICAgICAgIGlmICh0aGlzLmxvYWQgJiYgLy8gQW55dGhpbmcgbG9hZGVkP1xuICAgICAgICAgICAgICB0aGlzLmxvYWQuZm9sZGVycyAmJiAvLyBXYXMgbXkgcGFyZW50IGEgZGVhZC1lbmQ/XG4gICAgICAgICAgICAgIHRoaXMubG9hZC5mb2xkZXJzW25hbWVdKSB7IC8vIERpZCBkYWRkeSByZW1lbWJlciBtZT9cblxuICAgICAgICAgICAgLy8gU3RhcnQgbWUgY2xvc2VkIGlmIEkgd2FzIGNsb3NlZFxuICAgICAgICAgICAgbmV3X2d1aV9wYXJhbXMuY2xvc2VkID0gdGhpcy5sb2FkLmZvbGRlcnNbbmFtZV0uY2xvc2VkO1xuXG4gICAgICAgICAgICAvLyBQYXNzIGRvd24gdGhlIGxvYWRlZCBkYXRhXG4gICAgICAgICAgICBuZXdfZ3VpX3BhcmFtcy5sb2FkID0gdGhpcy5sb2FkLmZvbGRlcnNbbmFtZV07XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZ3VpID0gbmV3IEdVSShuZXdfZ3VpX3BhcmFtcyk7XG4gICAgICAgICAgdGhpcy5fX2ZvbGRlcnNbbmFtZV0gPSBndWk7XG5cbiAgICAgICAgICB2YXIgbGkgPSBhZGRSb3codGhpcywgZ3VpLmRvbUVsZW1lbnQpO1xuICAgICAgICAgIGRvbS5hZGRDbGFzcyhsaSwgJ2ZvbGRlcicpO1xuICAgICAgICAgIHJldHVybiBndWk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25SZXNpemU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmdldFJvb3QoKTtcblxuICAgICAgICAgIGlmIChyb290LnNjcm9sbGFibGUpIHtcblxuICAgICAgICAgICAgdmFyIHRvcCA9IGRvbS5nZXRPZmZzZXQocm9vdC5fX3VsKS50b3A7XG4gICAgICAgICAgICB2YXIgaCA9IDA7XG5cbiAgICAgICAgICAgIGNvbW1vbi5lYWNoKHJvb3QuX191bC5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgIGlmICghIChyb290LmF1dG9QbGFjZSAmJiBub2RlID09PSByb290Ll9fc2F2ZV9yb3cpKVxuICAgICAgICAgICAgICAgIGggKz0gZG9tLmdldEhlaWdodChub2RlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVySGVpZ2h0IC0gdG9wIC0gQ0xPU0VfQlVUVE9OX0hFSUdIVCA8IGgpIHtcbiAgICAgICAgICAgICAgZG9tLmFkZENsYXNzKHJvb3QuZG9tRWxlbWVudCwgR1VJLkNMQVNTX1RPT19UQUxMKTtcbiAgICAgICAgICAgICAgcm9vdC5fX3VsLnN0eWxlLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIENMT1NFX0JVVFRPTl9IRUlHSFQgKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZG9tLnJlbW92ZUNsYXNzKHJvb3QuZG9tRWxlbWVudCwgR1VJLkNMQVNTX1RPT19UQUxMKTtcbiAgICAgICAgICAgICAgcm9vdC5fX3VsLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyb290Ll9fcmVzaXplX2hhbmRsZSkge1xuICAgICAgICAgICAgY29tbW9uLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByb290Ll9fcmVzaXplX2hhbmRsZS5zdHlsZS5oZWlnaHQgPSByb290Ll9fdWwub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyb290Ll9fY2xvc2VCdXR0b24pIHtcbiAgICAgICAgICAgIHJvb3QuX19jbG9zZUJ1dHRvbi5zdHlsZS53aWR0aCA9IHJvb3Qud2lkdGggKyAncHgnO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXJrIG9iamVjdHMgZm9yIHNhdmluZy4gVGhlIG9yZGVyIG9mIHRoZXNlIG9iamVjdHMgY2Fubm90IGNoYW5nZSBhc1xuICAgICAgICAgKiB0aGUgR1VJIGdyb3dzLiBXaGVuIHJlbWVtYmVyaW5nIG5ldyBvYmplY3RzLCBhcHBlbmQgdGhlbSB0byB0aGUgZW5kXG4gICAgICAgICAqIG9mIHRoZSBsaXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC4uLn0gb2JqZWN0c1xuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgbm90IGNhbGxlZCBvbiBhIHRvcCBsZXZlbCBHVUkuXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtZW1iZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChTQVZFX0RJQUxPR1VFKSkge1xuICAgICAgICAgICAgU0FWRV9ESUFMT0dVRSA9IG5ldyBDZW50ZXJlZERpdigpO1xuICAgICAgICAgICAgU0FWRV9ESUFMT0dVRS5kb21FbGVtZW50LmlubmVySFRNTCA9IHNhdmVEaWFsb2d1ZUNvbnRlbnRzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbiBvbmx5IGNhbGwgcmVtZW1iZXIgb24gYSB0b3AgbGV2ZWwgR1VJLlwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgY29tbW9uLmVhY2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICBhZGRTYXZlTWVudShfdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5pbmRleE9mKG9iamVjdCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgX3RoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5hdXRvUGxhY2UpIHtcbiAgICAgICAgICAgIC8vIFNldCBzYXZlIHJvdyB3aWR0aFxuICAgICAgICAgICAgc2V0V2lkdGgodGhpcywgdGhpcy53aWR0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuZ3VpLkdVSX0gdGhlIHRvcG1vc3QgcGFyZW50IEdVSSBvZiBhIG5lc3RlZCBHVUkuXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Um9vdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGd1aSA9IHRoaXM7XG4gICAgICAgICAgd2hpbGUgKGd1aS5wYXJlbnQpIHtcbiAgICAgICAgICAgIGd1aSA9IGd1aS5wYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBndWk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHN0YXRlIG9mXG4gICAgICAgICAqIHRoaXMgR1VJIGFzIHdlbGwgYXMgaXRzIHJlbWVtYmVyZWQgcHJvcGVydGllcy5cbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTYXZlT2JqZWN0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciB0b1JldHVybiA9IHRoaXMubG9hZDtcblxuICAgICAgICAgIHRvUmV0dXJuLmNsb3NlZCA9IHRoaXMuY2xvc2VkO1xuXG4gICAgICAgICAgLy8gQW0gSSByZW1lbWJlcmluZyBhbnkgdmFsdWVzP1xuICAgICAgICAgIGlmICh0aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB0b1JldHVybi5wcmVzZXQgPSB0aGlzLnByZXNldDtcblxuICAgICAgICAgICAgaWYgKCF0b1JldHVybi5yZW1lbWJlcmVkKSB7XG4gICAgICAgICAgICAgIHRvUmV0dXJuLnJlbWVtYmVyZWQgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9SZXR1cm4ucmVtZW1iZXJlZFt0aGlzLnByZXNldF0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9SZXR1cm4uZm9sZGVycyA9IHt9O1xuICAgICAgICAgIGNvbW1vbi5lYWNoKHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbihlbGVtZW50LCBrZXkpIHtcbiAgICAgICAgICAgIHRvUmV0dXJuLmZvbGRlcnNba2V5XSA9IGVsZW1lbnQuZ2V0U2F2ZU9iamVjdCgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2F2ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBpZiAoIXRoaXMubG9hZC5yZW1lbWJlcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZCA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkW3RoaXMucHJlc2V0XSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcyk7XG4gICAgICAgICAgbWFya1ByZXNldE1vZGlmaWVkKHRoaXMsIGZhbHNlKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHNhdmVBczogZnVuY3Rpb24ocHJlc2V0TmFtZSkge1xuXG4gICAgICAgICAgaWYgKCF0aGlzLmxvYWQucmVtZW1iZXJlZCkge1xuXG4gICAgICAgICAgICAvLyBSZXRhaW4gZGVmYXVsdCB2YWx1ZXMgdXBvbiBmaXJzdCBzYXZlXG4gICAgICAgICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5sb2FkLnJlbWVtYmVyZWRbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcywgdHJ1ZSk7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZFtwcmVzZXROYW1lXSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcyk7XG4gICAgICAgICAgdGhpcy5wcmVzZXQgPSBwcmVzZXROYW1lO1xuICAgICAgICAgIGFkZFByZXNldE9wdGlvbih0aGlzLCBwcmVzZXROYW1lLCB0cnVlKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHJldmVydDogZnVuY3Rpb24oZ3VpKSB7XG5cbiAgICAgICAgICBjb21tb24uZWFjaCh0aGlzLl9fY29udHJvbGxlcnMsIGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgcmV2ZXJ0IHdvcmsgb24gRGVmYXVsdC5cbiAgICAgICAgICAgIGlmICghdGhpcy5nZXRSb290KCkubG9hZC5yZW1lbWJlcmVkKSB7XG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIuc2V0VmFsdWUoY29udHJvbGxlci5pbml0aWFsVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVjYWxsU2F2ZWRWYWx1ZShndWkgfHwgdGhpcy5nZXRSb290KCksIGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgY29tbW9uLmVhY2godGhpcy5fX2ZvbGRlcnMsIGZ1bmN0aW9uKGZvbGRlcikge1xuICAgICAgICAgICAgZm9sZGVyLnJldmVydChmb2xkZXIpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFndWkpIHtcbiAgICAgICAgICAgIG1hcmtQcmVzZXRNb2RpZmllZCh0aGlzLmdldFJvb3QoKSwgZmFsc2UpO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgbGlzdGVuOiBmdW5jdGlvbihjb250cm9sbGVyKSB7XG5cbiAgICAgICAgICB2YXIgaW5pdCA9IHRoaXMuX19saXN0ZW5pbmcubGVuZ3RoID09IDA7XG4gICAgICAgICAgdGhpcy5fX2xpc3RlbmluZy5wdXNoKGNvbnRyb2xsZXIpO1xuICAgICAgICAgIGlmIChpbml0KSB1cGRhdGVEaXNwbGF5cyh0aGlzLl9fbGlzdGVuaW5nKTtcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIGZ1bmN0aW9uIGFkZChndWksIG9iamVjdCwgcHJvcGVydHksIHBhcmFtcykge1xuXG4gICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT2JqZWN0IFwiICsgb2JqZWN0ICsgXCIgaGFzIG5vIHByb3BlcnR5IFxcXCJcIiArIHByb3BlcnR5ICsgXCJcXFwiXCIpO1xuICAgIH1cblxuICAgIHZhciBjb250cm9sbGVyO1xuXG4gICAgaWYgKHBhcmFtcy5jb2xvcikge1xuXG4gICAgICBjb250cm9sbGVyID0gbmV3IENvbG9yQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHZhciBmYWN0b3J5QXJncyA9IFtvYmplY3QscHJvcGVydHldLmNvbmNhdChwYXJhbXMuZmFjdG9yeUFyZ3MpO1xuICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJGYWN0b3J5LmFwcGx5KGd1aSwgZmFjdG9yeUFyZ3MpO1xuXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5iZWZvcmUgaW5zdGFuY2VvZiBDb250cm9sbGVyKSB7XG4gICAgICBwYXJhbXMuYmVmb3JlID0gcGFyYW1zLmJlZm9yZS5fX2xpO1xuICAgIH1cblxuICAgIHJlY2FsbFNhdmVkVmFsdWUoZ3VpLCBjb250cm9sbGVyKTtcblxuICAgIGRvbS5hZGRDbGFzcyhjb250cm9sbGVyLmRvbUVsZW1lbnQsICdjJyk7XG5cbiAgICB2YXIgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBkb20uYWRkQ2xhc3MobmFtZSwgJ3Byb3BlcnR5LW5hbWUnKTtcbiAgICBuYW1lLmlubmVySFRNTCA9IGNvbnRyb2xsZXIucHJvcGVydHk7XG5cbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9sbGVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdmFyIGxpID0gYWRkUm93KGd1aSwgY29udGFpbmVyLCBwYXJhbXMuYmVmb3JlKTtcblxuICAgIGRvbS5hZGRDbGFzcyhsaSwgR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XKTtcbiAgICBkb20uYWRkQ2xhc3MobGksIHR5cGVvZiBjb250cm9sbGVyLmdldFZhbHVlKCkpO1xuXG4gICAgYXVnbWVudENvbnRyb2xsZXIoZ3VpLCBsaSwgY29udHJvbGxlcik7XG5cbiAgICBndWkuX19jb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpO1xuXG4gICAgcmV0dXJuIGNvbnRyb2xsZXI7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByb3cgdG8gdGhlIGVuZCBvZiB0aGUgR1VJIG9yIGJlZm9yZSBhbm90aGVyIHJvdy5cbiAgICpcbiAgICogQHBhcmFtIGd1aVxuICAgKiBAcGFyYW0gW2RvbV0gSWYgc3BlY2lmaWVkLCBpbnNlcnRzIHRoZSBkb20gY29udGVudCBpbiB0aGUgbmV3IHJvd1xuICAgKiBAcGFyYW0gW2xpQmVmb3JlXSBJZiBzcGVjaWZpZWQsIHBsYWNlcyB0aGUgbmV3IHJvdyBiZWZvcmUgYW5vdGhlciByb3dcbiAgICovXG4gIGZ1bmN0aW9uIGFkZFJvdyhndWksIGRvbSwgbGlCZWZvcmUpIHtcbiAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGlmIChkb20pIGxpLmFwcGVuZENoaWxkKGRvbSk7XG4gICAgaWYgKGxpQmVmb3JlKSB7XG4gICAgICBndWkuX191bC5pbnNlcnRCZWZvcmUobGksIHBhcmFtcy5iZWZvcmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBndWkuX191bC5hcHBlbmRDaGlsZChsaSk7XG4gICAgfVxuICAgIGd1aS5vblJlc2l6ZSgpO1xuICAgIHJldHVybiBsaTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGF1Z21lbnRDb250cm9sbGVyKGd1aSwgbGksIGNvbnRyb2xsZXIpIHtcblxuICAgIGNvbnRyb2xsZXIuX19saSA9IGxpO1xuICAgIGNvbnRyb2xsZXIuX19ndWkgPSBndWk7XG5cbiAgICBjb21tb24uZXh0ZW5kKGNvbnRyb2xsZXIsIHtcblxuICAgICAgb3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNvbnRyb2xsZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICByZXR1cm4gYWRkKFxuICAgICAgICAgICAgICBndWksXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIub2JqZWN0LFxuICAgICAgICAgICAgICBjb250cm9sbGVyLnByb3BlcnR5LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVmb3JlOiBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nLFxuICAgICAgICAgICAgICAgIGZhY3RvcnlBcmdzOiBbY29tbW9uLnRvQXJyYXkoYXJndW1lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tb24uaXNBcnJheShvcHRpb25zKSB8fCBjb21tb24uaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICBjb250cm9sbGVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgcmV0dXJuIGFkZChcbiAgICAgICAgICAgICAgZ3VpLFxuICAgICAgICAgICAgICBjb250cm9sbGVyLm9iamVjdCxcbiAgICAgICAgICAgICAgY29udHJvbGxlci5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZm9yZTogY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZyxcbiAgICAgICAgICAgICAgICBmYWN0b3J5QXJnczogW29wdGlvbnNdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgICAgfSxcblxuICAgICAgbmFtZTogZnVuY3Rpb24odikge1xuICAgICAgICBjb250cm9sbGVyLl9fbGkuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdjtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgICB9LFxuXG4gICAgICBsaXN0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb250cm9sbGVyLl9fZ3VpLmxpc3Rlbihjb250cm9sbGVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb250cm9sbGVyLl9fZ3VpLnJlbW92ZShjb250cm9sbGVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8vIEFsbCBzbGlkZXJzIHNob3VsZCBiZSBhY2NvbXBhbmllZCBieSBhIGJveC5cbiAgICBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIE51bWJlckNvbnRyb2xsZXJTbGlkZXIpIHtcblxuICAgICAgdmFyIGJveCA9IG5ldyBOdW1iZXJDb250cm9sbGVyQm94KGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LFxuICAgICAgICAgIHsgbWluOiBjb250cm9sbGVyLl9fbWluLCBtYXg6IGNvbnRyb2xsZXIuX19tYXgsIHN0ZXA6IGNvbnRyb2xsZXIuX19zdGVwIH0pO1xuXG4gICAgICBjb21tb24uZWFjaChbJ3VwZGF0ZURpc3BsYXknLCAnb25DaGFuZ2UnLCAnb25GaW5pc2hDaGFuZ2UnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBwYyA9IGNvbnRyb2xsZXJbbWV0aG9kXTtcbiAgICAgICAgdmFyIHBiID0gYm94W21ldGhvZF07XG4gICAgICAgIGNvbnRyb2xsZXJbbWV0aG9kXSA9IGJveFttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgIHBjLmFwcGx5KGNvbnRyb2xsZXIsIGFyZ3MpO1xuICAgICAgICAgIHJldHVybiBwYi5hcHBseShib3gsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9tLmFkZENsYXNzKGxpLCAnaGFzLXNsaWRlcicpO1xuICAgICAgY29udHJvbGxlci5kb21FbGVtZW50Lmluc2VydEJlZm9yZShib3guZG9tRWxlbWVudCwgY29udHJvbGxlci5kb21FbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgTnVtYmVyQ29udHJvbGxlckJveCkge1xuXG4gICAgICB2YXIgciA9IGZ1bmN0aW9uKHJldHVybmVkKSB7XG5cbiAgICAgICAgLy8gSGF2ZSB3ZSBkZWZpbmVkIGJvdGggYm91bmRhcmllcz9cbiAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihjb250cm9sbGVyLl9fbWluKSAmJiBjb21tb24uaXNOdW1iZXIoY29udHJvbGxlci5fX21heCkpIHtcblxuICAgICAgICAgIC8vIFdlbGwsIHRoZW4gbGV0cyBqdXN0IHJlcGxhY2UgdGhpcyB3aXRoIGEgc2xpZGVyLlxuICAgICAgICAgIGNvbnRyb2xsZXIucmVtb3ZlKCk7XG4gICAgICAgICAgcmV0dXJuIGFkZChcbiAgICAgICAgICAgICAgZ3VpLFxuICAgICAgICAgICAgICBjb250cm9sbGVyLm9iamVjdCxcbiAgICAgICAgICAgICAgY29udHJvbGxlci5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZm9yZTogY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZyxcbiAgICAgICAgICAgICAgICBmYWN0b3J5QXJnczogW2NvbnRyb2xsZXIuX19taW4sIGNvbnRyb2xsZXIuX19tYXgsIGNvbnRyb2xsZXIuX19zdGVwXVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldHVybmVkO1xuXG4gICAgICB9O1xuXG4gICAgICBjb250cm9sbGVyLm1pbiA9IGNvbW1vbi5jb21wb3NlKHIsIGNvbnRyb2xsZXIubWluKTtcbiAgICAgIGNvbnRyb2xsZXIubWF4ID0gY29tbW9uLmNvbXBvc2UociwgY29udHJvbGxlci5tYXgpO1xuXG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBCb29sZWFuQ29udHJvbGxlcikge1xuXG4gICAgICBkb20uYmluZChsaSwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvbS5mYWtlRXZlbnQoY29udHJvbGxlci5fX2NoZWNrYm94LCAnY2xpY2snKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb20uYmluZChjb250cm9sbGVyLl9fY2hlY2tib3gsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gUHJldmVudHMgZG91YmxlLXRvZ2dsZVxuICAgICAgfSlcblxuICAgIH1cbiAgICBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgRnVuY3Rpb25Db250cm9sbGVyKSB7XG5cbiAgICAgIGRvbS5iaW5kKGxpLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9tLmZha2VFdmVudChjb250cm9sbGVyLl9fYnV0dG9uLCAnY2xpY2snKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb20uYmluZChsaSwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb20uYWRkQ2xhc3MoY29udHJvbGxlci5fX2J1dHRvbiwgJ2hvdmVyJyk7XG4gICAgICB9KTtcblxuICAgICAgZG9tLmJpbmQobGksICdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoY29udHJvbGxlci5fX2J1dHRvbiwgJ2hvdmVyJyk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgQ29sb3JDb250cm9sbGVyKSB7XG5cbiAgICAgIGRvbS5hZGRDbGFzcyhsaSwgJ2NvbG9yJyk7XG4gICAgICBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkgPSBjb21tb24uY29tcG9zZShmdW5jdGlvbihyKSB7XG4gICAgICAgIGxpLnN0eWxlLmJvcmRlckxlZnRDb2xvciA9IGNvbnRyb2xsZXIuX19jb2xvci50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICAgIH0sIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSk7XG5cbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgfVxuXG4gICAgY29udHJvbGxlci5zZXRWYWx1ZSA9IGNvbW1vbi5jb21wb3NlKGZ1bmN0aW9uKHIpIHtcbiAgICAgIGlmIChndWkuZ2V0Um9vdCgpLl9fcHJlc2V0X3NlbGVjdCAmJiBjb250cm9sbGVyLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICBtYXJrUHJlc2V0TW9kaWZpZWQoZ3VpLmdldFJvb3QoKSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9LCBjb250cm9sbGVyLnNldFZhbHVlKTtcblxuICB9XG5cbiAgZnVuY3Rpb24gcmVjYWxsU2F2ZWRWYWx1ZShndWksIGNvbnRyb2xsZXIpIHtcblxuICAgIC8vIEZpbmQgdGhlIHRvcG1vc3QgR1VJLCB0aGF0J3Mgd2hlcmUgcmVtZW1iZXJlZCBvYmplY3RzIGxpdmUuXG4gICAgdmFyIHJvb3QgPSBndWkuZ2V0Um9vdCgpO1xuXG4gICAgLy8gRG9lcyB0aGUgb2JqZWN0IHdlJ3JlIGNvbnRyb2xsaW5nIG1hdGNoIGFueXRoaW5nIHdlJ3ZlIGJlZW4gdG9sZCB0b1xuICAgIC8vIHJlbWVtYmVyP1xuICAgIHZhciBtYXRjaGVkX2luZGV4ID0gcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RzLmluZGV4T2YoY29udHJvbGxlci5vYmplY3QpO1xuXG4gICAgLy8gV2h5IHllcywgaXQgZG9lcyFcbiAgICBpZiAobWF0Y2hlZF9pbmRleCAhPSAtMSkge1xuXG4gICAgICAvLyBMZXQgbWUgZmV0Y2ggYSBtYXAgb2YgY29udHJvbGxlcnMgZm9yIHRoY29tbW9uLmlzT2JqZWN0LlxuICAgICAgdmFyIGNvbnRyb2xsZXJfbWFwID1cbiAgICAgICAgICByb290Ll9fcmVtZW1iZXJlZE9iamVjdEluZGVjZXNUb0NvbnRyb2xsZXJzW21hdGNoZWRfaW5kZXhdO1xuXG4gICAgICAvLyBPaHAsIEkgYmVsaWV2ZSB0aGlzIGlzIHRoZSBmaXJzdCBjb250cm9sbGVyIHdlJ3ZlIGNyZWF0ZWQgZm9yIHRoaXNcbiAgICAgIC8vIG9iamVjdC4gTGV0cyBtYWtlIHRoZSBtYXAgZnJlc2guXG4gICAgICBpZiAoY29udHJvbGxlcl9tYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250cm9sbGVyX21hcCA9IHt9O1xuICAgICAgICByb290Ll9fcmVtZW1iZXJlZE9iamVjdEluZGVjZXNUb0NvbnRyb2xsZXJzW21hdGNoZWRfaW5kZXhdID1cbiAgICAgICAgICAgIGNvbnRyb2xsZXJfbWFwO1xuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoaXMgY29udHJvbGxlclxuICAgICAgY29udHJvbGxlcl9tYXBbY29udHJvbGxlci5wcm9wZXJ0eV0gPSBjb250cm9sbGVyO1xuXG4gICAgICAvLyBPa2F5LCBub3cgaGF2ZSB3ZSBzYXZlZCBhbnkgdmFsdWVzIGZvciB0aGlzIGNvbnRyb2xsZXI/XG4gICAgICBpZiAocm9vdC5sb2FkICYmIHJvb3QubG9hZC5yZW1lbWJlcmVkKSB7XG5cbiAgICAgICAgdmFyIHByZXNldF9tYXAgPSByb290LmxvYWQucmVtZW1iZXJlZDtcblxuICAgICAgICAvLyBXaGljaCBwcmVzZXQgYXJlIHdlIHRyeWluZyB0byBsb2FkP1xuICAgICAgICB2YXIgcHJlc2V0O1xuXG4gICAgICAgIGlmIChwcmVzZXRfbWFwW2d1aS5wcmVzZXRdKSB7XG5cbiAgICAgICAgICBwcmVzZXQgPSBwcmVzZXRfbWFwW2d1aS5wcmVzZXRdO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocHJlc2V0X21hcFtERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUVdKSB7XG5cbiAgICAgICAgICAvLyBVaGgsIHlvdSBjYW4gaGF2ZSB0aGUgZGVmYXVsdCBpbnN0ZWFkP1xuICAgICAgICAgIHByZXNldCA9IHByZXNldF9tYXBbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gTmFkYS5cblxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBEaWQgdGhlIGxvYWRlZCBvYmplY3QgcmVtZW1iZXIgdGhjb21tb24uaXNPYmplY3Q/XG4gICAgICAgIGlmIChwcmVzZXRbbWF0Y2hlZF9pbmRleF0gJiZcblxuICAgICAgICAgIC8vIERpZCB3ZSByZW1lbWJlciB0aGlzIHBhcnRpY3VsYXIgcHJvcGVydHk/XG4gICAgICAgICAgICBwcmVzZXRbbWF0Y2hlZF9pbmRleF1bY29udHJvbGxlci5wcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgLy8gV2UgZGlkIHJlbWVtYmVyIHNvbWV0aGluZyBmb3IgdGhpcyBndXkgLi4uXG4gICAgICAgICAgdmFyIHZhbHVlID0gcHJlc2V0W21hdGNoZWRfaW5kZXhdW2NvbnRyb2xsZXIucHJvcGVydHldO1xuXG4gICAgICAgICAgLy8gQW5kIHRoYXQncyB3aGF0IGl0IGlzLlxuICAgICAgICAgIGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgY29udHJvbGxlci5zZXRWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZUhhc2goZ3VpLCBrZXkpIHtcbiAgICAvLyBUT0RPIGhvdyBkb2VzIHRoaXMgZGVhbCB3aXRoIG11bHRpcGxlIEdVSSdzP1xuICAgIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmICsgJy4nICsga2V5O1xuXG4gIH1cblxuICBmdW5jdGlvbiBhZGRTYXZlTWVudShndWkpIHtcblxuICAgIHZhciBkaXYgPSBndWkuX19zYXZlX3JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICBkb20uYWRkQ2xhc3MoZ3VpLmRvbUVsZW1lbnQsICdoYXMtc2F2ZScpO1xuXG4gICAgZ3VpLl9fdWwuaW5zZXJ0QmVmb3JlKGRpdiwgZ3VpLl9fdWwuZmlyc3RDaGlsZCk7XG5cbiAgICBkb20uYWRkQ2xhc3MoZGl2LCAnc2F2ZS1yb3cnKTtcblxuICAgIHZhciBnZWFycyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBnZWFycy5pbm5lckhUTUwgPSAnJm5ic3A7JztcbiAgICBkb20uYWRkQ2xhc3MoZ2VhcnMsICdidXR0b24gZ2VhcnMnKTtcblxuICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIEZ1bmN0aW9uQ29udHJvbGxlclxuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9ICdTYXZlJztcbiAgICBkb20uYWRkQ2xhc3MoYnV0dG9uLCAnYnV0dG9uJyk7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbiwgJ3NhdmUnKTtcblxuICAgIHZhciBidXR0b24yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJ1dHRvbjIuaW5uZXJIVE1MID0gJ05ldyc7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbjIsICdidXR0b24nKTtcbiAgICBkb20uYWRkQ2xhc3MoYnV0dG9uMiwgJ3NhdmUtYXMnKTtcblxuICAgIHZhciBidXR0b24zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJ1dHRvbjMuaW5uZXJIVE1MID0gJ1JldmVydCc7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbjMsICdidXR0b24nKTtcbiAgICBkb20uYWRkQ2xhc3MoYnV0dG9uMywgJ3JldmVydCcpO1xuXG4gICAgdmFyIHNlbGVjdCA9IGd1aS5fX3ByZXNldF9zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcblxuICAgIGlmIChndWkubG9hZCAmJiBndWkubG9hZC5yZW1lbWJlcmVkKSB7XG5cbiAgICAgIGNvbW1vbi5lYWNoKGd1aS5sb2FkLnJlbWVtYmVyZWQsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgYWRkUHJlc2V0T3B0aW9uKGd1aSwga2V5LCBrZXkgPT0gZ3VpLnByZXNldCk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBhZGRQcmVzZXRPcHRpb24oZ3VpLCBERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBkb20uYmluZChzZWxlY3QsICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblxuXG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZ3VpLl9fcHJlc2V0X3NlbGVjdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgZ3VpLl9fcHJlc2V0X3NlbGVjdFtpbmRleF0uaW5uZXJIVE1MID0gZ3VpLl9fcHJlc2V0X3NlbGVjdFtpbmRleF0udmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGd1aS5wcmVzZXQgPSB0aGlzLnZhbHVlO1xuXG4gICAgfSk7XG5cbiAgICBkaXYuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZ2VhcnMpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b24yKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uMyk7XG5cbiAgICBpZiAoU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSkge1xuXG4gICAgICB2YXIgc2F2ZUxvY2FsbHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGctc2F2ZS1sb2NhbGx5Jyk7XG4gICAgICB2YXIgZXhwbGFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZy1sb2NhbC1leHBsYWluJyk7XG5cbiAgICAgIHNhdmVMb2NhbGx5LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICB2YXIgbG9jYWxTdG9yYWdlQ2hlY2tCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGctbG9jYWwtc3RvcmFnZScpO1xuXG4gICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaChndWksICdpc0xvY2FsJykpID09PSAndHJ1ZScpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlQ2hlY2tCb3guc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0hpZGVFeHBsYWluKCkge1xuICAgICAgICBleHBsYWluLnN0eWxlLmRpc3BsYXkgPSBndWkudXNlTG9jYWxTdG9yYWdlID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgIH1cblxuICAgICAgc2hvd0hpZGVFeHBsYWluKCk7XG5cbiAgICAgIC8vIFRPRE86IFVzZSBhIGJvb2xlYW4gY29udHJvbGxlciwgZm9vbCFcbiAgICAgIGRvbS5iaW5kKGxvY2FsU3RvcmFnZUNoZWNrQm94LCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGd1aS51c2VMb2NhbFN0b3JhZ2UgPSAhZ3VpLnVzZUxvY2FsU3RvcmFnZTtcbiAgICAgICAgc2hvd0hpZGVFeHBsYWluKCk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHZhciBuZXdDb25zdHJ1Y3RvclRleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLW5ldy1jb25zdHJ1Y3RvcicpO1xuXG4gICAgZG9tLmJpbmQobmV3Q29uc3RydWN0b3JUZXh0QXJlYSwgJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS5tZXRhS2V5ICYmIChlLndoaWNoID09PSA2NyB8fCBlLmtleUNvZGUgPT0gNjcpKSB7XG4gICAgICAgIFNBVkVfRElBTE9HVUUuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9tLmJpbmQoZ2VhcnMsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgbmV3Q29uc3RydWN0b3JUZXh0QXJlYS5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeShndWkuZ2V0U2F2ZU9iamVjdCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgU0FWRV9ESUFMT0dVRS5zaG93KCk7XG4gICAgICBuZXdDb25zdHJ1Y3RvclRleHRBcmVhLmZvY3VzKCk7XG4gICAgICBuZXdDb25zdHJ1Y3RvclRleHRBcmVhLnNlbGVjdCgpO1xuICAgIH0pO1xuXG4gICAgZG9tLmJpbmQoYnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGd1aS5zYXZlKCk7XG4gICAgfSk7XG5cbiAgICBkb20uYmluZChidXR0b24yLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcmVzZXROYW1lID0gcHJvbXB0KCdFbnRlciBhIG5ldyBwcmVzZXQgbmFtZS4nKTtcbiAgICAgIGlmIChwcmVzZXROYW1lKSBndWkuc2F2ZUFzKHByZXNldE5hbWUpO1xuICAgIH0pO1xuXG4gICAgZG9tLmJpbmQoYnV0dG9uMywgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBndWkucmV2ZXJ0KCk7XG4gICAgfSk7XG5cbi8vICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b24yKTtcblxuICB9XG5cbiAgZnVuY3Rpb24gYWRkUmVzaXplSGFuZGxlKGd1aSkge1xuXG4gICAgZ3VpLl9fcmVzaXplX2hhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgY29tbW9uLmV4dGVuZChndWkuX19yZXNpemVfaGFuZGxlLnN0eWxlLCB7XG5cbiAgICAgIHdpZHRoOiAnNnB4JyxcbiAgICAgIG1hcmdpbkxlZnQ6ICctM3B4JyxcbiAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgIGN1cnNvcjogJ2V3LXJlc2l6ZScsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuLy8gICAgICBib3JkZXI6ICcxcHggc29saWQgYmx1ZSdcblxuICAgIH0pO1xuXG4gICAgdmFyIHBtb3VzZVg7XG5cbiAgICBkb20uYmluZChndWkuX19yZXNpemVfaGFuZGxlLCAnbW91c2Vkb3duJywgZHJhZ1N0YXJ0KTtcbiAgICBkb20uYmluZChndWkuX19jbG9zZUJ1dHRvbiwgJ21vdXNlZG93bicsIGRyYWdTdGFydCk7XG5cbiAgICBndWkuZG9tRWxlbWVudC5pbnNlcnRCZWZvcmUoZ3VpLl9fcmVzaXplX2hhbmRsZSwgZ3VpLmRvbUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBwbW91c2VYID0gZS5jbGllbnRYO1xuXG4gICAgICBkb20uYWRkQ2xhc3MoZ3VpLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19EUkFHKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2V1cCcsIGRyYWdTdG9wKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhZyhlKSB7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgZ3VpLndpZHRoICs9IHBtb3VzZVggLSBlLmNsaWVudFg7XG4gICAgICBndWkub25SZXNpemUoKTtcbiAgICAgIHBtb3VzZVggPSBlLmNsaWVudFg7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRyYWdTdG9wKCkge1xuXG4gICAgICBkb20ucmVtb3ZlQ2xhc3MoZ3VpLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19EUkFHKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgZHJhZyk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBkcmFnU3RvcCk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFdpZHRoKGd1aSwgdykge1xuICAgIGd1aS5kb21FbGVtZW50LnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgLy8gQXV0byBwbGFjZWQgc2F2ZS1yb3dzIGFyZSBwb3NpdGlvbiBmaXhlZCwgc28gd2UgaGF2ZSB0b1xuICAgIC8vIHNldCB0aGUgd2lkdGggbWFudWFsbHkgaWYgd2Ugd2FudCBpdCB0byBibGVlZCB0byB0aGUgZWRnZVxuICAgIGlmIChndWkuX19zYXZlX3JvdyAmJiBndWkuYXV0b1BsYWNlKSB7XG4gICAgICBndWkuX19zYXZlX3Jvdy5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICAgIH1pZiAoZ3VpLl9fY2xvc2VCdXR0b24pIHtcbiAgICAgIGd1aS5fX2Nsb3NlQnV0dG9uLnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFByZXNldChndWksIHVzZUluaXRpYWxWYWx1ZXMpIHtcblxuICAgIHZhciB0b1JldHVybiA9IHt9O1xuXG4gICAgLy8gRm9yIGVhY2ggb2JqZWN0IEknbSByZW1lbWJlcmluZ1xuICAgIGNvbW1vbi5lYWNoKGd1aS5fX3JlbWVtYmVyZWRPYmplY3RzLCBmdW5jdGlvbih2YWwsIGluZGV4KSB7XG5cbiAgICAgIHZhciBzYXZlZF92YWx1ZXMgPSB7fTtcblxuICAgICAgLy8gVGhlIGNvbnRyb2xsZXJzIEkndmUgbWFkZSBmb3IgdGhjb21tb24uaXNPYmplY3QgYnkgcHJvcGVydHlcbiAgICAgIHZhciBjb250cm9sbGVyX21hcCA9XG4gICAgICAgICAgZ3VpLl9fcmVtZW1iZXJlZE9iamVjdEluZGVjZXNUb0NvbnRyb2xsZXJzW2luZGV4XTtcblxuICAgICAgLy8gUmVtZW1iZXIgZWFjaCB2YWx1ZSBmb3IgZWFjaCBwcm9wZXJ0eVxuICAgICAgY29tbW9uLmVhY2goY29udHJvbGxlcl9tYXAsIGZ1bmN0aW9uKGNvbnRyb2xsZXIsIHByb3BlcnR5KSB7XG4gICAgICAgIHNhdmVkX3ZhbHVlc1twcm9wZXJ0eV0gPSB1c2VJbml0aWFsVmFsdWVzID8gY29udHJvbGxlci5pbml0aWFsVmFsdWUgOiBjb250cm9sbGVyLmdldFZhbHVlKCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2F2ZSB0aGUgdmFsdWVzIGZvciB0aGNvbW1vbi5pc09iamVjdFxuICAgICAgdG9SZXR1cm5baW5kZXhdID0gc2F2ZWRfdmFsdWVzO1xuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG9SZXR1cm47XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFByZXNldE9wdGlvbihndWksIG5hbWUsIHNldFNlbGVjdGVkKSB7XG4gICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG9wdC5pbm5lckhUTUwgPSBuYW1lO1xuICAgIG9wdC52YWx1ZSA9IG5hbWU7XG4gICAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIGlmIChzZXRTZWxlY3RlZCkge1xuICAgICAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdC5sZW5ndGggLSAxO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByZXNldFNlbGVjdEluZGV4KGd1aSkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBndWkuX19wcmVzZXRfc2VsZWN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgaWYgKGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLnZhbHVlID09IGd1aS5wcmVzZXQpIHtcbiAgICAgICAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFya1ByZXNldE1vZGlmaWVkKGd1aSwgbW9kaWZpZWQpIHtcbiAgICB2YXIgb3B0ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdFtndWkuX19wcmVzZXRfc2VsZWN0LnNlbGVjdGVkSW5kZXhdO1xuLy8gICAgY29uc29sZS5sb2coJ21hcmsnLCBtb2RpZmllZCwgb3B0KTtcbiAgICBpZiAobW9kaWZpZWQpIHtcbiAgICAgIG9wdC5pbm5lckhUTUwgPSBvcHQudmFsdWUgKyBcIipcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0LmlubmVySFRNTCA9IG9wdC52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5cyhjb250cm9sbGVyQXJyYXkpIHtcblxuXG4gICAgaWYgKGNvbnRyb2xsZXJBcnJheS5sZW5ndGggIT0gMCkge1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHVwZGF0ZURpc3BsYXlzKGNvbnRyb2xsZXJBcnJheSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIGNvbW1vbi5lYWNoKGNvbnRyb2xsZXJBcnJheSwgZnVuY3Rpb24oYykge1xuICAgICAgYy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHJldHVybiBHVUk7XG5cbn0pKGRhdC51dGlscy5jc3MsXG5cIjxkaXYgaWQ9XFxcImRnLXNhdmVcXFwiIGNsYXNzPVxcXCJkZyBkaWFsb2d1ZVxcXCI+XFxuXFxuICBIZXJlJ3MgdGhlIG5ldyBsb2FkIHBhcmFtZXRlciBmb3IgeW91ciA8Y29kZT5HVUk8L2NvZGU+J3MgY29uc3RydWN0b3I6XFxuXFxuICA8dGV4dGFyZWEgaWQ9XFxcImRnLW5ldy1jb25zdHJ1Y3RvclxcXCI+PC90ZXh0YXJlYT5cXG5cXG4gIDxkaXYgaWQ9XFxcImRnLXNhdmUtbG9jYWxseVxcXCI+XFxuXFxuICAgIDxpbnB1dCBpZD1cXFwiZGctbG9jYWwtc3RvcmFnZVxcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiLz4gQXV0b21hdGljYWxseSBzYXZlXFxuICAgIHZhbHVlcyB0byA8Y29kZT5sb2NhbFN0b3JhZ2U8L2NvZGU+IG9uIGV4aXQuXFxuXFxuICAgIDxkaXYgaWQ9XFxcImRnLWxvY2FsLWV4cGxhaW5cXFwiPlRoZSB2YWx1ZXMgc2F2ZWQgdG8gPGNvZGU+bG9jYWxTdG9yYWdlPC9jb2RlPiB3aWxsXFxuICAgICAgb3ZlcnJpZGUgdGhvc2UgcGFzc2VkIHRvIDxjb2RlPmRhdC5HVUk8L2NvZGU+J3MgY29uc3RydWN0b3IuIFRoaXMgbWFrZXMgaXRcXG4gICAgICBlYXNpZXIgdG8gd29yayBpbmNyZW1lbnRhbGx5LCBidXQgPGNvZGU+bG9jYWxTdG9yYWdlPC9jb2RlPiBpcyBmcmFnaWxlLFxcbiAgICAgIGFuZCB5b3VyIGZyaWVuZHMgbWF5IG5vdCBzZWUgdGhlIHNhbWUgdmFsdWVzIHlvdSBkby5cXG4gICAgICBcXG4gICAgPC9kaXY+XFxuICAgIFxcbiAgPC9kaXY+XFxuXFxuPC9kaXY+XCIsXG5cIi5kZyB1bHtsaXN0LXN0eWxlOm5vbmU7bWFyZ2luOjA7cGFkZGluZzowO3dpZHRoOjEwMCU7Y2xlYXI6Ym90aH0uZGcuYWN7cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3JpZ2h0OjA7aGVpZ2h0OjA7ei1pbmRleDowfS5kZzpub3QoLmFjKSAubWFpbntvdmVyZmxvdzpoaWRkZW59LmRnLm1haW57LXdlYmtpdC10cmFuc2l0aW9uOm9wYWNpdHkgMC4xcyBsaW5lYXI7LW8tdHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyO3RyYW5zaXRpb246b3BhY2l0eSAwLjFzIGxpbmVhcn0uZGcubWFpbi50YWxsZXItdGhhbi13aW5kb3d7b3ZlcmZsb3cteTphdXRvfS5kZy5tYWluLnRhbGxlci10aGFuLXdpbmRvdyAuY2xvc2UtYnV0dG9ue29wYWNpdHk6MTttYXJnaW4tdG9wOi0xcHg7Ym9yZGVyLXRvcDoxcHggc29saWQgIzJjMmMyY30uZGcubWFpbiB1bC5jbG9zZWQgLmNsb3NlLWJ1dHRvbntvcGFjaXR5OjEgIWltcG9ydGFudH0uZGcubWFpbjpob3ZlciAuY2xvc2UtYnV0dG9uLC5kZy5tYWluIC5jbG9zZS1idXR0b24uZHJhZ3tvcGFjaXR5OjF9LmRnLm1haW4gLmNsb3NlLWJ1dHRvbnstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAwLjFzIGxpbmVhcjstby10cmFuc2l0aW9uOm9wYWNpdHkgMC4xcyBsaW5lYXI7LW1vei10cmFuc2l0aW9uOm9wYWNpdHkgMC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyO2JvcmRlcjowO3Bvc2l0aW9uOmFic29sdXRlO2xpbmUtaGVpZ2h0OjE5cHg7aGVpZ2h0OjIwcHg7Y3Vyc29yOnBvaW50ZXI7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZC1jb2xvcjojMDAwfS5kZy5tYWluIC5jbG9zZS1idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojMTExfS5kZy5he2Zsb2F0OnJpZ2h0O21hcmdpbi1yaWdodDoxNXB4O292ZXJmbG93LXg6aGlkZGVufS5kZy5hLmhhcy1zYXZlIHVse21hcmdpbi10b3A6MjdweH0uZGcuYS5oYXMtc2F2ZSB1bC5jbG9zZWR7bWFyZ2luLXRvcDowfS5kZy5hIC5zYXZlLXJvd3twb3NpdGlvbjpmaXhlZDt0b3A6MDt6LWluZGV4OjEwMDJ9LmRnIGxpey13ZWJraXQtdHJhbnNpdGlvbjpoZWlnaHQgMC4xcyBlYXNlLW91dDstby10cmFuc2l0aW9uOmhlaWdodCAwLjFzIGVhc2Utb3V0Oy1tb3otdHJhbnNpdGlvbjpoZWlnaHQgMC4xcyBlYXNlLW91dDt0cmFuc2l0aW9uOmhlaWdodCAwLjFzIGVhc2Utb3V0fS5kZyBsaTpub3QoLmZvbGRlcil7Y3Vyc29yOmF1dG87aGVpZ2h0OjI3cHg7bGluZS1oZWlnaHQ6MjdweDtvdmVyZmxvdzpoaWRkZW47cGFkZGluZzowIDRweCAwIDVweH0uZGcgbGkuZm9sZGVye3BhZGRpbmc6MDtib3JkZXItbGVmdDo0cHggc29saWQgcmdiYSgwLDAsMCwwKX0uZGcgbGkudGl0bGV7Y3Vyc29yOnBvaW50ZXI7bWFyZ2luLWxlZnQ6LTRweH0uZGcgLmNsb3NlZCBsaTpub3QoLnRpdGxlKSwuZGcgLmNsb3NlZCB1bCBsaSwuZGcgLmNsb3NlZCB1bCBsaSA+ICp7aGVpZ2h0OjA7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlcjowfS5kZyAuY3J7Y2xlYXI6Ym90aDtwYWRkaW5nLWxlZnQ6M3B4O2hlaWdodDoyN3B4fS5kZyAucHJvcGVydHktbmFtZXtjdXJzb3I6ZGVmYXVsdDtmbG9hdDpsZWZ0O2NsZWFyOmxlZnQ7d2lkdGg6NDAlO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS5kZyAuY3tmbG9hdDpsZWZ0O3dpZHRoOjYwJX0uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XXtib3JkZXI6MDttYXJnaW4tdG9wOjRweDtwYWRkaW5nOjNweDt3aWR0aDoxMDAlO2Zsb2F0OnJpZ2h0fS5kZyAuaGFzLXNsaWRlciBpbnB1dFt0eXBlPXRleHRde3dpZHRoOjMwJTttYXJnaW4tbGVmdDowfS5kZyAuc2xpZGVye2Zsb2F0OmxlZnQ7d2lkdGg6NjYlO21hcmdpbi1sZWZ0Oi01cHg7bWFyZ2luLXJpZ2h0OjA7aGVpZ2h0OjE5cHg7bWFyZ2luLXRvcDo0cHh9LmRnIC5zbGlkZXItZmd7aGVpZ2h0OjEwMCV9LmRnIC5jIGlucHV0W3R5cGU9Y2hlY2tib3hde21hcmdpbi10b3A6OXB4fS5kZyAuYyBzZWxlY3R7bWFyZ2luLXRvcDo1cHh9LmRnIC5jci5mdW5jdGlvbiwuZGcgLmNyLmZ1bmN0aW9uIC5wcm9wZXJ0eS1uYW1lLC5kZyAuY3IuZnVuY3Rpb24gKiwuZGcgLmNyLmJvb2xlYW4sLmRnIC5jci5ib29sZWFuICp7Y3Vyc29yOnBvaW50ZXJ9LmRnIC5zZWxlY3RvcntkaXNwbGF5Om5vbmU7cG9zaXRpb246YWJzb2x1dGU7bWFyZ2luLWxlZnQ6LTlweDttYXJnaW4tdG9wOjIzcHg7ei1pbmRleDoxMH0uZGcgLmM6aG92ZXIgLnNlbGVjdG9yLC5kZyAuc2VsZWN0b3IuZHJhZ3tkaXNwbGF5OmJsb2NrfS5kZyBsaS5zYXZlLXJvd3twYWRkaW5nOjB9LmRnIGxpLnNhdmUtcm93IC5idXR0b257ZGlzcGxheTppbmxpbmUtYmxvY2s7cGFkZGluZzowcHggNnB4fS5kZy5kaWFsb2d1ZXtiYWNrZ3JvdW5kLWNvbG9yOiMyMjI7d2lkdGg6NDYwcHg7cGFkZGluZzoxNXB4O2ZvbnQtc2l6ZToxM3B4O2xpbmUtaGVpZ2h0OjE1cHh9I2RnLW5ldy1jb25zdHJ1Y3RvcntwYWRkaW5nOjEwcHg7Y29sb3I6IzIyMjtmb250LWZhbWlseTpNb25hY28sIG1vbm9zcGFjZTtmb250LXNpemU6MTBweDtib3JkZXI6MDtyZXNpemU6bm9uZTtib3gtc2hhZG93Omluc2V0IDFweCAxcHggMXB4ICM4ODg7d29yZC13cmFwOmJyZWFrLXdvcmQ7bWFyZ2luOjEycHggMDtkaXNwbGF5OmJsb2NrO3dpZHRoOjQ0MHB4O292ZXJmbG93LXk6c2Nyb2xsO2hlaWdodDoxMDBweDtwb3NpdGlvbjpyZWxhdGl2ZX0jZGctbG9jYWwtZXhwbGFpbntkaXNwbGF5Om5vbmU7Zm9udC1zaXplOjExcHg7bGluZS1oZWlnaHQ6MTdweDtib3JkZXItcmFkaXVzOjNweDtiYWNrZ3JvdW5kLWNvbG9yOiMzMzM7cGFkZGluZzo4cHg7bWFyZ2luLXRvcDoxMHB4fSNkZy1sb2NhbC1leHBsYWluIGNvZGV7Zm9udC1zaXplOjEwcHh9I2RhdC1ndWktc2F2ZS1sb2NhbGx5e2Rpc3BsYXk6bm9uZX0uZGd7Y29sb3I6I2VlZTtmb250OjExcHggJ0x1Y2lkYSBHcmFuZGUnLCBzYW5zLXNlcmlmO3RleHQtc2hhZG93OjAgLTFweCAwICMxMTF9LmRnLm1haW46Oi13ZWJraXQtc2Nyb2xsYmFye3dpZHRoOjVweDtiYWNrZ3JvdW5kOiMxYTFhMWF9LmRnLm1haW46Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lcntoZWlnaHQ6MDtkaXNwbGF5Om5vbmV9LmRnLm1haW46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6IzY3Njc2N30uZGcgbGk6bm90KC5mb2xkZXIpe2JhY2tncm91bmQ6IzFhMWExYTtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjMmMyYzJjfS5kZyBsaS5zYXZlLXJvd3tsaW5lLWhlaWdodDoyNXB4O2JhY2tncm91bmQ6I2RhZDVjYjtib3JkZXI6MH0uZGcgbGkuc2F2ZS1yb3cgc2VsZWN0e21hcmdpbi1sZWZ0OjVweDt3aWR0aDoxMDhweH0uZGcgbGkuc2F2ZS1yb3cgLmJ1dHRvbnttYXJnaW4tbGVmdDo1cHg7bWFyZ2luLXRvcDoxcHg7Ym9yZGVyLXJhZGl1czoycHg7Zm9udC1zaXplOjlweDtsaW5lLWhlaWdodDo3cHg7cGFkZGluZzo0cHggNHB4IDVweCA0cHg7YmFja2dyb3VuZDojYzViZGFkO2NvbG9yOiNmZmY7dGV4dC1zaGFkb3c6MCAxcHggMCAjYjBhNThmO2JveC1zaGFkb3c6MCAtMXB4IDAgI2IwYTU4ZjtjdXJzb3I6cG9pbnRlcn0uZGcgbGkuc2F2ZS1yb3cgLmJ1dHRvbi5nZWFyc3tiYWNrZ3JvdW5kOiNjNWJkYWQgdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQXNBQUFBTkNBWUFBQUIvOVpRN0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBUUpKUkVGVWVOcGlZS0FVL1AvL1B3R0lDL0FwQ0FCaUJTQVcrSThBQ2xBY2dLeFE0VDlob01BRVVyeHgyUVNHTjYrZWdEWCsvdldUNGU3TjgyQU1Zb1BBeC9ldndXb1lvU1liQUNYMnM3S3hDeHpjc2V6RGgzZXZGb0RFQllURUVxeWNnZ1dBekE5QXVVU1FRZ2VZUGE5ZlB2Ni9ZV20vQWN4NUlQYjd0eS9mdytRWmJsdzY3dkRzOFIwWUh5UWhnT2J4K3lBSmtCcW1HNWRQUERoMWFQT0dSL2V1Z1cwRzR2bElvVElmeUZjQStRZWtoaEhKaFBkUXhiaUFJZ3VNQlRRWnJQRDcxMDhNNnJvV1lERlFpSUFBdjZBb3cvMWJGd1hnaXMrZjJMVUF5bndvSWFOY3o4WE54M0RsN01FSlVER1FweDlndFE4WUN1ZUIrRDI2T0VDQUFRRGFkdDdlNDZENDJRQUFBQUJKUlU1RXJrSmdnZz09KSAycHggMXB4IG5vLXJlcGVhdDtoZWlnaHQ6N3B4O3dpZHRoOjhweH0uZGcgbGkuc2F2ZS1yb3cgLmJ1dHRvbjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNiYWIxOWU7Ym94LXNoYWRvdzowIC0xcHggMCAjYjBhNThmfS5kZyBsaS5mb2xkZXJ7Ym9yZGVyLWJvdHRvbTowfS5kZyBsaS50aXRsZXtwYWRkaW5nLWxlZnQ6MTZweDtiYWNrZ3JvdW5kOiMwMDAgdXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJRQUZBSkVBQVAvLy8vUHo4Ly8vLy8vLy95SDVCQUVBQUFJQUxBQUFBQUFGQUFVQUFBSUlsSStoS2dGeG9DZ0FPdz09KSA2cHggMTBweCBuby1yZXBlYXQ7Y3Vyc29yOnBvaW50ZXI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpfS5kZyAuY2xvc2VkIGxpLnRpdGxle2JhY2tncm91bmQtaW1hZ2U6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJRQUZBSkVBQVAvLy8vUHo4Ly8vLy8vLy95SDVCQUVBQUFJQUxBQUFBQUFGQUFVQUFBSUlsR0lXcU1DYldBRUFPdz09KX0uZGcgLmNyLmJvb2xlYW57Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICM4MDY3ODd9LmRnIC5jci5mdW5jdGlvbntib3JkZXItbGVmdDozcHggc29saWQgI2U2MWQ1Zn0uZGcgLmNyLm51bWJlcntib3JkZXItbGVmdDozcHggc29saWQgIzJmYTFkNn0uZGcgLmNyLm51bWJlciBpbnB1dFt0eXBlPXRleHRde2NvbG9yOiMyZmExZDZ9LmRnIC5jci5zdHJpbmd7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICMxZWQzNmZ9LmRnIC5jci5zdHJpbmcgaW5wdXRbdHlwZT10ZXh0XXtjb2xvcjojMWVkMzZmfS5kZyAuY3IuZnVuY3Rpb246aG92ZXIsLmRnIC5jci5ib29sZWFuOmhvdmVye2JhY2tncm91bmQ6IzExMX0uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XXtiYWNrZ3JvdW5kOiMzMDMwMzA7b3V0bGluZTpub25lfS5kZyAuYyBpbnB1dFt0eXBlPXRleHRdOmhvdmVye2JhY2tncm91bmQ6IzNjM2MzY30uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XTpmb2N1c3tiYWNrZ3JvdW5kOiM0OTQ5NDk7Y29sb3I6I2ZmZn0uZGcgLmMgLnNsaWRlcntiYWNrZ3JvdW5kOiMzMDMwMzA7Y3Vyc29yOmV3LXJlc2l6ZX0uZGcgLmMgLnNsaWRlci1mZ3tiYWNrZ3JvdW5kOiMyZmExZDZ9LmRnIC5jIC5zbGlkZXI6aG92ZXJ7YmFja2dyb3VuZDojM2MzYzNjfS5kZyAuYyAuc2xpZGVyOmhvdmVyIC5zbGlkZXItZmd7YmFja2dyb3VuZDojNDRhYmRhfVxcblwiLFxuZGF0LmNvbnRyb2xsZXJzLmZhY3RvcnkgPSAoZnVuY3Rpb24gKE9wdGlvbkNvbnRyb2xsZXIsIE51bWJlckNvbnRyb2xsZXJCb3gsIE51bWJlckNvbnRyb2xsZXJTbGlkZXIsIFN0cmluZ0NvbnRyb2xsZXIsIEZ1bmN0aW9uQ29udHJvbGxlciwgQm9vbGVhbkNvbnRyb2xsZXIsIGNvbW1vbikge1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXG4gICAgICAgIHZhciBpbml0aWFsVmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuXG4gICAgICAgIC8vIFByb3ZpZGluZyBvcHRpb25zP1xuICAgICAgICBpZiAoY29tbW9uLmlzQXJyYXkoYXJndW1lbnRzWzJdKSB8fCBjb21tb24uaXNPYmplY3QoYXJndW1lbnRzWzJdKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgT3B0aW9uQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbMl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJvdmlkaW5nIGEgbWFwP1xuXG4gICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIoaW5pdGlhbFZhbHVlKSkge1xuXG4gICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihhcmd1bWVudHNbMl0pICYmIGNvbW1vbi5pc051bWJlcihhcmd1bWVudHNbM10pKSB7XG5cbiAgICAgICAgICAgIC8vIEhhcyBtaW4gYW5kIG1heC5cbiAgICAgICAgICAgIHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlclNsaWRlcihvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IE51bWJlckNvbnRyb2xsZXJCb3gob2JqZWN0LCBwcm9wZXJ0eSwgeyBtaW46IGFyZ3VtZW50c1syXSwgbWF4OiBhcmd1bWVudHNbM10gfSk7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tb24uaXNTdHJpbmcoaW5pdGlhbFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgU3RyaW5nQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tb24uaXNGdW5jdGlvbihpbml0aWFsVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbW1vbi5pc0Jvb2xlYW4oaW5pdGlhbFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgQm9vbGVhbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSkoZGF0LmNvbnRyb2xsZXJzLk9wdGlvbkNvbnRyb2xsZXIsXG5kYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlckJveCxcbmRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyU2xpZGVyLFxuZGF0LmNvbnRyb2xsZXJzLlN0cmluZ0NvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKENvbnRyb2xsZXIsIGRvbSwgY29tbW9uKSB7XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBQcm92aWRlcyBhIHRleHQgaW5wdXQgdG8gYWx0ZXIgdGhlIHN0cmluZyBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgU3RyaW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgIFN0cmluZ0NvbnRyb2xsZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5fX2lucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG5cbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdrZXl1cCcsIG9uQ2hhbmdlKTtcbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdjaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAnYmx1cicsIG9uQmx1cik7XG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuXG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2lucHV0LnZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgICBpZiAoX3RoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoX3RoaXMsIF90aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19pbnB1dCk7XG5cbiAgfTtcblxuICBTdHJpbmdDb250cm9sbGVyLnN1cGVyY2xhc3MgPSBDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIFN0cmluZ0NvbnRyb2xsZXIucHJvdG90eXBlLFxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIHtcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBTdG9wcyB0aGUgY2FyZXQgZnJvbSBtb3Zpbmcgb24gYWNjb3VudCBvZjpcbiAgICAgICAgICAvLyBrZXl1cCAtPiBzZXRWYWx1ZSAtPiB1cGRhdGVEaXNwbGF5XG4gICAgICAgICAgaWYgKCFkb20uaXNBY3RpdmUodGhpcy5fX2lucHV0KSkge1xuICAgICAgICAgICAgdGhpcy5fX2lucHV0LnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gU3RyaW5nQ29udHJvbGxlci5zdXBlcmNsYXNzLnByb3RvdHlwZS51cGRhdGVEaXNwbGF5LmNhbGwodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICk7XG5cbiAgcmV0dXJuIFN0cmluZ0NvbnRyb2xsZXI7XG5cbn0pKGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyLFxuZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKSxcbmRhdC5jb250cm9sbGVycy5GdW5jdGlvbkNvbnRyb2xsZXIsXG5kYXQuY29udHJvbGxlcnMuQm9vbGVhbkNvbnRyb2xsZXIsXG5kYXQudXRpbHMuY29tbW9uKSxcbmRhdC5jb250cm9sbGVycy5Db250cm9sbGVyLFxuZGF0LmNvbnRyb2xsZXJzLkJvb2xlYW5Db250cm9sbGVyLFxuZGF0LmNvbnRyb2xsZXJzLkZ1bmN0aW9uQ29udHJvbGxlcixcbmRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyQm94LFxuZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJTbGlkZXIsXG5kYXQuY29udHJvbGxlcnMuT3B0aW9uQ29udHJvbGxlcixcbmRhdC5jb250cm9sbGVycy5Db2xvckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKENvbnRyb2xsZXIsIGRvbSwgQ29sb3IsIGludGVycHJldCwgY29tbW9uKSB7XG5cbiAgdmFyIENvbG9yQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgIENvbG9yQ29udHJvbGxlci5zdXBlcmNsYXNzLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICB0aGlzLl9fY29sb3IgPSBuZXcgQ29sb3IodGhpcy5nZXRWYWx1ZSgpKTtcbiAgICB0aGlzLl9fdGVtcCA9IG5ldyBDb2xvcigwKTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGRvbS5tYWtlU2VsZWN0YWJsZSh0aGlzLmRvbUVsZW1lbnQsIGZhbHNlKTtcblxuICAgIHRoaXMuX19zZWxlY3RvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX19zZWxlY3Rvci5jbGFzc05hbWUgPSAnc2VsZWN0b3InO1xuXG4gICAgdGhpcy5fX3NhdHVyYXRpb25fZmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fc2F0dXJhdGlvbl9maWVsZC5jbGFzc05hbWUgPSAnc2F0dXJhdGlvbi1maWVsZCc7XG5cbiAgICB0aGlzLl9fZmllbGRfa25vYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX19maWVsZF9rbm9iLmNsYXNzTmFtZSA9ICdmaWVsZC1rbm9iJztcbiAgICB0aGlzLl9fZmllbGRfa25vYl9ib3JkZXIgPSAnMnB4IHNvbGlkICc7XG5cbiAgICB0aGlzLl9faHVlX2tub2IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9faHVlX2tub2IuY2xhc3NOYW1lID0gJ2h1ZS1rbm9iJztcblxuICAgIHRoaXMuX19odWVfZmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9faHVlX2ZpZWxkLmNsYXNzTmFtZSA9ICdodWUtZmllbGQnO1xuXG4gICAgdGhpcy5fX2lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLl9faW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICB0aGlzLl9faW5wdXRfdGV4dFNoYWRvdyA9ICcwIDFweCAxcHggJztcblxuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykgeyAvLyBvbiBlbnRlclxuICAgICAgICBvbkJsdXIuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2JsdXInLCBvbkJsdXIpO1xuXG4gICAgZG9tLmJpbmQodGhpcy5fX3NlbGVjdG9yLCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBkb21cbiAgICAgICAgLmFkZENsYXNzKHRoaXMsICdkcmFnJylcbiAgICAgICAgLmJpbmQod2luZG93LCAnbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoX3RoaXMuX19zZWxlY3RvciwgJ2RyYWcnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHZhciB2YWx1ZV9maWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLl9fc2VsZWN0b3Iuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiAnMTIycHgnLFxuICAgICAgaGVpZ2h0OiAnMTAycHgnLFxuICAgICAgcGFkZGluZzogJzNweCcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcbiAgICAgIGJveFNoYWRvdzogJzBweCAxcHggM3B4IHJnYmEoMCwwLDAsMC4zKSdcbiAgICB9KTtcblxuICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX2ZpZWxkX2tub2Iuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMnB4JyxcbiAgICAgIGhlaWdodDogJzEycHgnLFxuICAgICAgYm9yZGVyOiB0aGlzLl9fZmllbGRfa25vYl9ib3JkZXIgKyAodGhpcy5fX2NvbG9yLnYgPCAuNSA/ICcjZmZmJyA6ICcjMDAwJyksXG4gICAgICBib3hTaGFkb3c6ICcwcHggMXB4IDNweCByZ2JhKDAsMCwwLDAuNSknLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXG4gICAgICB6SW5kZXg6IDFcbiAgICB9KTtcbiAgICBcbiAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19odWVfa25vYi5zdHlsZSwge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogJzE1cHgnLFxuICAgICAgaGVpZ2h0OiAnMnB4JyxcbiAgICAgIGJvcmRlclJpZ2h0OiAnNHB4IHNvbGlkICNmZmYnLFxuICAgICAgekluZGV4OiAxXG4gICAgfSk7XG5cbiAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19zYXR1cmF0aW9uX2ZpZWxkLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNTU1JyxcbiAgICAgIG1hcmdpblJpZ2h0OiAnM3B4JyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICB9KTtcblxuICAgIGNvbW1vbi5leHRlbmQodmFsdWVfZmllbGQuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIGJhY2tncm91bmQ6ICdub25lJ1xuICAgIH0pO1xuICAgIFxuICAgIGxpbmVhckdyYWRpZW50KHZhbHVlX2ZpZWxkLCAndG9wJywgJ3JnYmEoMCwwLDAsMCknLCAnIzAwMCcpO1xuXG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLl9faHVlX2ZpZWxkLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzE1cHgnLFxuICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgIzU1NScsXG4gICAgICBjdXJzb3I6ICducy1yZXNpemUnXG4gICAgfSk7XG5cbiAgICBodWVHcmFkaWVudCh0aGlzLl9faHVlX2ZpZWxkKTtcblxuICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX2lucHV0LnN0eWxlLCB7XG4gICAgICBvdXRsaW5lOiAnbm9uZScsXG4vLyAgICAgIHdpZHRoOiAnMTIwcHgnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbi8vICAgICAgcGFkZGluZzogJzRweCcsXG4vLyAgICAgIG1hcmdpbkJvdHRvbTogJzZweCcsXG4gICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgdGV4dFNoYWRvdzogdGhpcy5fX2lucHV0X3RleHRTaGFkb3cgKyAncmdiYSgwLDAsMCwwLjcpJ1xuICAgIH0pO1xuXG4gICAgZG9tLmJpbmQodGhpcy5fX3NhdHVyYXRpb25fZmllbGQsICdtb3VzZWRvd24nLCBmaWVsZERvd24pO1xuICAgIGRvbS5iaW5kKHRoaXMuX19maWVsZF9rbm9iLCAnbW91c2Vkb3duJywgZmllbGREb3duKTtcblxuICAgIGRvbS5iaW5kKHRoaXMuX19odWVfZmllbGQsICdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBzZXRIKGUpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0SCk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgdW5iaW5kSCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBmaWVsZERvd24oZSkge1xuICAgICAgc2V0U1YoZSk7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdub25lJztcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIHNldFNWKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCB1bmJpbmRTVik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5iaW5kU1YoKSB7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIHNldFNWKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2V1cCcsIHVuYmluZFNWKTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uQmx1cigpIHtcbiAgICAgIHZhciBpID0gaW50ZXJwcmV0KHRoaXMudmFsdWUpO1xuICAgICAgaWYgKGkgIT09IGZhbHNlKSB7XG4gICAgICAgIF90aGlzLl9fY29sb3IuX19zdGF0ZSA9IGk7XG4gICAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBfdGhpcy5fX2NvbG9yLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5iaW5kSCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0SCk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCB1bmJpbmRIKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fc2F0dXJhdGlvbl9maWVsZC5hcHBlbmRDaGlsZCh2YWx1ZV9maWVsZCk7XG4gICAgdGhpcy5fX3NlbGVjdG9yLmFwcGVuZENoaWxkKHRoaXMuX19maWVsZF9rbm9iKTtcbiAgICB0aGlzLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQodGhpcy5fX3NhdHVyYXRpb25fZmllbGQpO1xuICAgIHRoaXMuX19zZWxlY3Rvci5hcHBlbmRDaGlsZCh0aGlzLl9faHVlX2ZpZWxkKTtcbiAgICB0aGlzLl9faHVlX2ZpZWxkLmFwcGVuZENoaWxkKHRoaXMuX19odWVfa25vYik7XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX2lucHV0KTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX3NlbGVjdG9yKTtcblxuICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgZnVuY3Rpb24gc2V0U1YoZSkge1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciB3ID0gZG9tLmdldFdpZHRoKF90aGlzLl9fc2F0dXJhdGlvbl9maWVsZCk7XG4gICAgICB2YXIgbyA9IGRvbS5nZXRPZmZzZXQoX3RoaXMuX19zYXR1cmF0aW9uX2ZpZWxkKTtcbiAgICAgIHZhciBzID0gKGUuY2xpZW50WCAtIG8ubGVmdCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCkgLyB3O1xuICAgICAgdmFyIHYgPSAxIC0gKGUuY2xpZW50WSAtIG8udG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC8gdztcblxuICAgICAgaWYgKHYgPiAxKSB2ID0gMTtcbiAgICAgIGVsc2UgaWYgKHYgPCAwKSB2ID0gMDtcblxuICAgICAgaWYgKHMgPiAxKSBzID0gMTtcbiAgICAgIGVsc2UgaWYgKHMgPCAwKSBzID0gMDtcblxuICAgICAgX3RoaXMuX19jb2xvci52ID0gdjtcbiAgICAgIF90aGlzLl9fY29sb3IucyA9IHM7XG5cbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcblxuXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRIKGUpIHtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgcyA9IGRvbS5nZXRIZWlnaHQoX3RoaXMuX19odWVfZmllbGQpO1xuICAgICAgdmFyIG8gPSBkb20uZ2V0T2Zmc2V0KF90aGlzLl9faHVlX2ZpZWxkKTtcbiAgICAgIHZhciBoID0gMSAtIChlLmNsaWVudFkgLSBvLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAvIHM7XG5cbiAgICAgIGlmIChoID4gMSkgaCA9IDE7XG4gICAgICBlbHNlIGlmIChoIDwgMCkgaCA9IDA7XG5cbiAgICAgIF90aGlzLl9fY29sb3IuaCA9IGggKiAzNjA7XG5cbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gIH07XG5cbiAgQ29sb3JDb250cm9sbGVyLnN1cGVyY2xhc3MgPSBDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIENvbG9yQ29udHJvbGxlci5wcm90b3R5cGUsXG4gICAgICBDb250cm9sbGVyLnByb3RvdHlwZSxcblxuICAgICAge1xuXG4gICAgICAgIHVwZGF0ZURpc3BsYXk6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgdmFyIGkgPSBpbnRlcnByZXQodGhpcy5nZXRWYWx1ZSgpKTtcblxuICAgICAgICAgIGlmIChpICE9PSBmYWxzZSkge1xuXG4gICAgICAgICAgICB2YXIgbWlzbWF0Y2ggPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG1pc21hdGNoIG9uIHRoZSBpbnRlcnByZXRlZCB2YWx1ZS5cblxuICAgICAgICAgICAgY29tbW9uLmVhY2goQ29sb3IuQ09NUE9ORU5UUywgZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgIGlmICghY29tbW9uLmlzVW5kZWZpbmVkKGlbY29tcG9uZW50XSkgJiZcbiAgICAgICAgICAgICAgICAgICFjb21tb24uaXNVbmRlZmluZWQodGhpcy5fX2NvbG9yLl9fc3RhdGVbY29tcG9uZW50XSkgJiZcbiAgICAgICAgICAgICAgICAgIGlbY29tcG9uZW50XSAhPT0gdGhpcy5fX2NvbG9yLl9fc3RhdGVbY29tcG9uZW50XSkge1xuICAgICAgICAgICAgICAgIG1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge307IC8vIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBJZiBub3RoaW5nIGRpdmVyZ2VzLCB3ZSBrZWVwIG91ciBwcmV2aW91cyB2YWx1ZXNcbiAgICAgICAgICAgIC8vIGZvciBzdGF0ZWZ1bG5lc3MsIG90aGVyd2lzZSB3ZSByZWNhbGN1bGF0ZSBmcmVzaFxuICAgICAgICAgICAgaWYgKG1pc21hdGNoKSB7XG4gICAgICAgICAgICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX2NvbG9yLl9fc3RhdGUsIGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tbW9uLmV4dGVuZCh0aGlzLl9fdGVtcC5fX3N0YXRlLCB0aGlzLl9fY29sb3IuX19zdGF0ZSk7XG5cbiAgICAgICAgICB0aGlzLl9fdGVtcC5hID0gMTtcblxuICAgICAgICAgIHZhciBmbGlwID0gKHRoaXMuX19jb2xvci52IDwgLjUgfHwgdGhpcy5fX2NvbG9yLnMgPiAuNSkgPyAyNTUgOiAwO1xuICAgICAgICAgIHZhciBfZmxpcCA9IDI1NSAtIGZsaXA7XG5cbiAgICAgICAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19maWVsZF9rbm9iLnN0eWxlLCB7XG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMDAgKiB0aGlzLl9fY29sb3IucyAtIDcgKyAncHgnLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiAxMDAgKiAoMSAtIHRoaXMuX19jb2xvci52KSAtIDcgKyAncHgnLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLl9fdGVtcC50b1N0cmluZygpLFxuICAgICAgICAgICAgYm9yZGVyOiB0aGlzLl9fZmllbGRfa25vYl9ib3JkZXIgKyAncmdiKCcgKyBmbGlwICsgJywnICsgZmxpcCArICcsJyArIGZsaXAgKycpJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5fX2h1ZV9rbm9iLnN0eWxlLm1hcmdpblRvcCA9ICgxIC0gdGhpcy5fX2NvbG9yLmggLyAzNjApICogMTAwICsgJ3B4J1xuXG4gICAgICAgICAgdGhpcy5fX3RlbXAucyA9IDE7XG4gICAgICAgICAgdGhpcy5fX3RlbXAudiA9IDE7XG5cbiAgICAgICAgICBsaW5lYXJHcmFkaWVudCh0aGlzLl9fc2F0dXJhdGlvbl9maWVsZCwgJ2xlZnQnLCAnI2ZmZicsIHRoaXMuX190ZW1wLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgY29tbW9uLmV4dGVuZCh0aGlzLl9faW5wdXQuc3R5bGUsIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5fX2lucHV0LnZhbHVlID0gdGhpcy5fX2NvbG9yLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBjb2xvcjogJ3JnYignICsgZmxpcCArICcsJyArIGZsaXAgKyAnLCcgKyBmbGlwICsnKScsXG4gICAgICAgICAgICB0ZXh0U2hhZG93OiB0aGlzLl9faW5wdXRfdGV4dFNoYWRvdyArICdyZ2JhKCcgKyBfZmxpcCArICcsJyArIF9mbGlwICsgJywnICsgX2ZsaXAgKycsLjcpJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICk7XG4gIFxuICB2YXIgdmVuZG9ycyA9IFsnLW1vei0nLCctby0nLCctd2Via2l0LScsJy1tcy0nLCcnXTtcbiAgXG4gIGZ1bmN0aW9uIGxpbmVhckdyYWRpZW50KGVsZW0sIHgsIGEsIGIpIHtcbiAgICBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSAnJztcbiAgICBjb21tb24uZWFjaCh2ZW5kb3JzLCBmdW5jdGlvbih2ZW5kb3IpIHtcbiAgICAgIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogJyArIHZlbmRvciArICdsaW5lYXItZ3JhZGllbnQoJyt4KycsICcrYSsnIDAlLCAnICsgYiArICcgMTAwJSk7ICc7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGh1ZUdyYWRpZW50KGVsZW0pIHtcbiAgICBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSAnJztcbiAgICBlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsICNmZjAwZmYgMTclLCAjMDAwMGZmIDM0JSwgIzAwZmZmZiA1MCUsICMwMGZmMDAgNjclLCAjZmZmZjAwIDg0JSwgI2ZmMDAwMCAxMDAlKTsnXG4gICAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCNmZjAwZmYgMTclLCMwMDAwZmYgMzQlLCMwMGZmZmYgNTAlLCMwMGZmMDAgNjclLCNmZmZmMDAgODQlLCNmZjAwMDAgMTAwJSk7J1xuICAgIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnXG4gICAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtbXMtbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnXG4gICAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOydcbiAgfVxuXG5cbiAgcmV0dXJuIENvbG9yQ29udHJvbGxlcjtcblxufSkoZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXIsXG5kYXQuZG9tLmRvbSxcbmRhdC5jb2xvci5Db2xvciA9IChmdW5jdGlvbiAoaW50ZXJwcmV0LCBtYXRoLCB0b1N0cmluZywgY29tbW9uKSB7XG5cbiAgdmFyIENvbG9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLl9fc3RhdGUgPSBpbnRlcnByZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmICh0aGlzLl9fc3RhdGUgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyAnRmFpbGVkIHRvIGludGVycHJldCBjb2xvciBhcmd1bWVudHMnO1xuICAgIH1cblxuICAgIHRoaXMuX19zdGF0ZS5hID0gdGhpcy5fX3N0YXRlLmEgfHwgMTtcblxuXG4gIH07XG5cbiAgQ29sb3IuQ09NUE9ORU5UUyA9IFsncicsJ2cnLCdiJywnaCcsJ3MnLCd2JywnaGV4JywnYSddO1xuXG4gIGNvbW1vbi5leHRlbmQoQ29sb3IucHJvdG90eXBlLCB7XG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcodGhpcyk7XG4gICAgfSxcblxuICAgIHRvT3JpZ2luYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5jb252ZXJzaW9uLndyaXRlKHRoaXMpO1xuICAgIH1cblxuICB9KTtcblxuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAncicsIDIpO1xuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnZycsIDEpO1xuICBkZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnYicsIDApO1xuXG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdoJyk7XG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdzJyk7XG4gIGRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICd2Jyk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbG9yLnByb3RvdHlwZSwgJ2EnLCB7XG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5hO1xuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHRoaXMuX19zdGF0ZS5hID0gdjtcbiAgICB9XG5cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbG9yLnByb3RvdHlwZSwgJ2hleCcsIHtcblxuICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmICghdGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnSEVYJykge1xuICAgICAgICB0aGlzLl9fc3RhdGUuaGV4ID0gbWF0aC5yZ2JfdG9faGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fX3N0YXRlLmhleDtcblxuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcblxuICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ0hFWCc7XG4gICAgICB0aGlzLl9fc3RhdGUuaGV4ID0gdjtcblxuICAgIH1cblxuICB9KTtcblxuICBmdW5jdGlvbiBkZWZpbmVSR0JDb21wb25lbnQodGFyZ2V0LCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb21wb25lbnQsIHtcblxuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5fX3N0YXRlLnNwYWNlID09PSAnUkdCJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY2FsY3VsYXRlUkdCKHRoaXMsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ1JHQicpIHtcbiAgICAgICAgICByZWNhbGN1bGF0ZVJHQih0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KTtcbiAgICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnUkdCJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmluZUhTVkNvbXBvbmVudCh0YXJnZXQsIGNvbXBvbmVudCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG5cbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdO1xuXG4gICAgICAgIHJlY2FsY3VsYXRlSFNWKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ0hTVicpIHtcbiAgICAgICAgICByZWNhbGN1bGF0ZUhTVih0aGlzKTtcbiAgICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnSFNWJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcblxuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2FsY3VsYXRlUkdCKGNvbG9yLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KSB7XG5cbiAgICBpZiAoY29sb3IuX19zdGF0ZS5zcGFjZSA9PT0gJ0hFWCcpIHtcblxuICAgICAgY29sb3IuX19zdGF0ZVtjb21wb25lbnRdID0gbWF0aC5jb21wb25lbnRfZnJvbV9oZXgoY29sb3IuX19zdGF0ZS5oZXgsIGNvbXBvbmVudEhleEluZGV4KTtcblxuICAgIH0gZWxzZSBpZiAoY29sb3IuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicpIHtcblxuICAgICAgY29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLCBtYXRoLmhzdl90b19yZ2IoY29sb3IuX19zdGF0ZS5oLCBjb2xvci5fX3N0YXRlLnMsIGNvbG9yLl9fc3RhdGUudikpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhyb3cgJ0NvcnJ1cHRlZCBjb2xvciBzdGF0ZSc7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2FsY3VsYXRlSFNWKGNvbG9yKSB7XG5cbiAgICB2YXIgcmVzdWx0ID0gbWF0aC5yZ2JfdG9faHN2KGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuXG4gICAgY29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLFxuICAgICAgICB7XG4gICAgICAgICAgczogcmVzdWx0LnMsXG4gICAgICAgICAgdjogcmVzdWx0LnZcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIWNvbW1vbi5pc05hTihyZXN1bHQuaCkpIHtcbiAgICAgIGNvbG9yLl9fc3RhdGUuaCA9IHJlc3VsdC5oO1xuICAgIH0gZWxzZSBpZiAoY29tbW9uLmlzVW5kZWZpbmVkKGNvbG9yLl9fc3RhdGUuaCkpIHtcbiAgICAgIGNvbG9yLl9fc3RhdGUuaCA9IDA7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gQ29sb3I7XG5cbn0pKGRhdC5jb2xvci5pbnRlcnByZXQsXG5kYXQuY29sb3IubWF0aCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHRtcENvbXBvbmVudDtcblxuICByZXR1cm4ge1xuXG4gICAgaHN2X3RvX3JnYjogZnVuY3Rpb24oaCwgcywgdikge1xuXG4gICAgICB2YXIgaGkgPSBNYXRoLmZsb29yKGggLyA2MCkgJSA2O1xuXG4gICAgICB2YXIgZiA9IGggLyA2MCAtIE1hdGguZmxvb3IoaCAvIDYwKTtcbiAgICAgIHZhciBwID0gdiAqICgxLjAgLSBzKTtcbiAgICAgIHZhciBxID0gdiAqICgxLjAgLSAoZiAqIHMpKTtcbiAgICAgIHZhciB0ID0gdiAqICgxLjAgLSAoKDEuMCAtIGYpICogcykpO1xuICAgICAgdmFyIGMgPSBbXG4gICAgICAgIFt2LCB0LCBwXSxcbiAgICAgICAgW3EsIHYsIHBdLFxuICAgICAgICBbcCwgdiwgdF0sXG4gICAgICAgIFtwLCBxLCB2XSxcbiAgICAgICAgW3QsIHAsIHZdLFxuICAgICAgICBbdiwgcCwgcV1cbiAgICAgIF1baGldO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByOiBjWzBdICogMjU1LFxuICAgICAgICBnOiBjWzFdICogMjU1LFxuICAgICAgICBiOiBjWzJdICogMjU1XG4gICAgICB9O1xuXG4gICAgfSxcblxuICAgIHJnYl90b19oc3Y6IGZ1bmN0aW9uKHIsIGcsIGIpIHtcblxuICAgICAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgICAgIGRlbHRhID0gbWF4IC0gbWluLFxuICAgICAgICAgIGgsIHM7XG5cbiAgICAgIGlmIChtYXggIT0gMCkge1xuICAgICAgICBzID0gZGVsdGEgLyBtYXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGg6IE5hTixcbiAgICAgICAgICBzOiAwLFxuICAgICAgICAgIHY6IDBcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHIgPT0gbWF4KSB7XG4gICAgICAgIGggPSAoZyAtIGIpIC8gZGVsdGE7XG4gICAgICB9IGVsc2UgaWYgKGcgPT0gbWF4KSB7XG4gICAgICAgIGggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaCA9IDQgKyAociAtIGcpIC8gZGVsdGE7XG4gICAgICB9XG4gICAgICBoIC89IDY7XG4gICAgICBpZiAoaCA8IDApIHtcbiAgICAgICAgaCArPSAxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoOiBoICogMzYwLFxuICAgICAgICBzOiBzLFxuICAgICAgICB2OiBtYXggLyAyNTVcbiAgICAgIH07XG4gICAgfSxcblxuICAgIHJnYl90b19oZXg6IGZ1bmN0aW9uKHIsIGcsIGIpIHtcbiAgICAgIHZhciBoZXggPSB0aGlzLmhleF93aXRoX2NvbXBvbmVudCgwLCAyLCByKTtcbiAgICAgIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KGhleCwgMSwgZyk7XG4gICAgICBoZXggPSB0aGlzLmhleF93aXRoX2NvbXBvbmVudChoZXgsIDAsIGIpO1xuICAgICAgcmV0dXJuIGhleDtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50X2Zyb21faGV4OiBmdW5jdGlvbihoZXgsIGNvbXBvbmVudEluZGV4KSB7XG4gICAgICByZXR1cm4gKGhleCA+PiAoY29tcG9uZW50SW5kZXggKiA4KSkgJiAweEZGO1xuICAgIH0sXG5cbiAgICBoZXhfd2l0aF9jb21wb25lbnQ6IGZ1bmN0aW9uKGhleCwgY29tcG9uZW50SW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPDwgKHRtcENvbXBvbmVudCA9IGNvbXBvbmVudEluZGV4ICogOCkgfCAoaGV4ICYgfiAoMHhGRiA8PCB0bXBDb21wb25lbnQpKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpLFxuZGF0LmNvbG9yLnRvU3RyaW5nLFxuZGF0LnV0aWxzLmNvbW1vbiksXG5kYXQuY29sb3IuaW50ZXJwcmV0LFxuZGF0LnV0aWxzLmNvbW1vbiksXG5kYXQudXRpbHMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bmN0aW9uICgpIHtcblxuICAvKipcbiAgICogcmVxdWlyZWpzIHZlcnNpb24gb2YgUGF1bCBJcmlzaCdzIFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgKiBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuICAgKi9cblxuICByZXR1cm4gd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblxuICAgICAgfTtcbn0pKCksXG5kYXQuZG9tLkNlbnRlcmVkRGl2ID0gKGZ1bmN0aW9uIChkb20sIGNvbW1vbikge1xuXG5cbiAgdmFyIENlbnRlcmVkRGl2ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLCB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDAuOCknLFxuICAgICAgdG9wOiAwLFxuICAgICAgbGVmdDogMCxcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgIHpJbmRleDogJzEwMDAnLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIFdlYmtpdFRyYW5zaXRpb246ICdvcGFjaXR5IDAuMnMgbGluZWFyJ1xuICAgIH0pO1xuXG4gICAgZG9tLm1ha2VGdWxsc2NyZWVuKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQpO1xuICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuXG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgekluZGV4OiAnMTAwMScsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgV2Via2l0VHJhbnNpdGlvbjogJy13ZWJraXQtdHJhbnNmb3JtIDAuMnMgZWFzZS1vdXQsIG9wYWNpdHkgMC4ycyBsaW5lYXInXG4gICAgfSk7XG5cblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBkb20uYmluZCh0aGlzLmJhY2tncm91bmRFbGVtZW50LCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLmhpZGUoKTtcbiAgICB9KTtcblxuXG4gIH07XG5cbiAgQ2VudGVyZWREaXYucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgXG5cblxuICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuLy8gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICc1MiUnO1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMS4xKSc7XG5cbiAgICB0aGlzLmxheW91dCgpO1xuXG4gICAgY29tbW9uLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICBfdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgX3RoaXMuZG9tRWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xuICAgIH0pO1xuXG4gIH07XG5cbiAgQ2VudGVyZWREaXYucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgaGlkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICBfdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBfdGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICBkb20udW5iaW5kKF90aGlzLmRvbUVsZW1lbnQsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgaGlkZSk7XG4gICAgICBkb20udW5iaW5kKF90aGlzLmRvbUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJywgaGlkZSk7XG4gICAgICBkb20udW5iaW5kKF90aGlzLmRvbUVsZW1lbnQsICdvVHJhbnNpdGlvbkVuZCcsIGhpZGUpO1xuXG4gICAgfTtcblxuICAgIGRvbS5iaW5kKHRoaXMuZG9tRWxlbWVudCwgJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBoaWRlKTtcbiAgICBkb20uYmluZCh0aGlzLmRvbUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJywgaGlkZSk7XG4gICAgZG9tLmJpbmQodGhpcy5kb21FbGVtZW50LCAnb1RyYW5zaXRpb25FbmQnLCBoaWRlKTtcblxuICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4vLyAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzQ4JSc7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMS4xKSc7XG5cbiAgfTtcblxuICBDZW50ZXJlZERpdi5wcm90b3R5cGUubGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aC8yIC0gZG9tLmdldFdpZHRoKHRoaXMuZG9tRWxlbWVudCkgLyAyICsgJ3B4JztcbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0LzIgLSBkb20uZ2V0SGVpZ2h0KHRoaXMuZG9tRWxlbWVudCkgLyAyICsgJ3B4JztcbiAgfTtcbiAgXG4gIGZ1bmN0aW9uIGxvY2tTY3JvbGwoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICB9XG5cbiAgcmV0dXJuIENlbnRlcmVkRGl2O1xuXG59KShkYXQuZG9tLmRvbSxcbmRhdC51dGlscy5jb21tb24pLFxuZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKTsiLCIoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICB2YXIgJGNyZWF0ZSA9ICRPYmplY3QuY3JlYXRlO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gIHZhciAkZGVmaW5lUHJvcGVydHkgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGZyZWV6ZSA9ICRPYmplY3QuZnJlZXplO1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICB2YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gIHZhciAka2V5cyA9ICRPYmplY3Qua2V5cztcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9ICRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgJHRvU3RyaW5nID0gJE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkcHJldmVudEV4dGVuc2lvbnMgPSBPYmplY3QucHJldmVudEV4dGVuc2lvbnM7XG4gIHZhciAkc2VhbCA9IE9iamVjdC5zZWFsO1xuICB2YXIgJGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGU7XG4gIGZ1bmN0aW9uIG5vbkVudW0odmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgdmFyIG1ldGhvZCA9IG5vbkVudW07XG4gIHZhciBjb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gbmV3VW5pcXVlU3RyaW5nKCkge1xuICAgIHJldHVybiAnX18kJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDFlOSkgKyAnJCcgKyArK2NvdW50ZXIgKyAnJF9fJztcbiAgfVxuICB2YXIgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGF0YVByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xWYWx1ZXMgPSAkY3JlYXRlKG51bGwpO1xuICB2YXIgcHJpdmF0ZU5hbWVzID0gJGNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gaXNQcml2YXRlTmFtZShzKSB7XG4gICAgcmV0dXJuIHByaXZhdGVOYW1lc1tzXTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVQcml2YXRlTmFtZSgpIHtcbiAgICB2YXIgcyA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgIHByaXZhdGVOYW1lc1tzXSA9IHRydWU7XG4gICAgcmV0dXJuIHM7XG4gIH1cbiAgZnVuY3Rpb24gaXNTaGltU3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ltYm9sID09PSAnb2JqZWN0JyAmJiBzeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xWYWx1ZTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlT2Yodikge1xuICAgIGlmIChpc1NoaW1TeW1ib2wodikpXG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgcmV0dXJuIHR5cGVvZiB2O1xuICB9XG4gIGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgIHZhciB2YWx1ZSA9IG5ldyBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbik7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3ltYm9sIGNhbm5vdCBiZSBuZXdcXCdlZCcpO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgdmFyIGRlc2MgPSBzeW1ib2xWYWx1ZVtzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5XTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKVxuICAgICAgZGVzYyA9ICcnO1xuICAgIHJldHVybiAnU3ltYm9sKCcgKyBkZXNjICsgJyknO1xuICB9KSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndmFsdWVPZicsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBzeW1ib2xWYWx1ZTtcbiAgfSkpO1xuICBmdW5jdGlvbiBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbikge1xuICAgIHZhciBrZXkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGF0YVByb3BlcnR5LCB7dmFsdWU6IHRoaXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSwge3ZhbHVlOiBrZXl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSwge3ZhbHVlOiBkZXNjcmlwdGlvbn0pO1xuICAgIGZyZWV6ZSh0aGlzKTtcbiAgICBzeW1ib2xWYWx1ZXNba2V5XSA9IHRoaXM7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndmFsdWVPZicsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS52YWx1ZU9mLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICB2YXIgaGFzaFByb3BlcnR5ID0gY3JlYXRlUHJpdmF0ZU5hbWUoKTtcbiAgdmFyIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IgPSB7dmFsdWU6IHVuZGVmaW5lZH07XG4gIHZhciBoYXNoT2JqZWN0UHJvcGVydGllcyA9IHtcbiAgICBoYXNoOiB7dmFsdWU6IHVuZGVmaW5lZH0sXG4gICAgc2VsZjoge3ZhbHVlOiB1bmRlZmluZWR9XG4gIH07XG4gIHZhciBoYXNoQ291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KSB7XG4gICAgdmFyIGhhc2hPYmplY3QgPSBvYmplY3RbaGFzaFByb3BlcnR5XTtcbiAgICBpZiAoaGFzaE9iamVjdCAmJiBoYXNoT2JqZWN0LnNlbGYgPT09IG9iamVjdClcbiAgICAgIHJldHVybiBoYXNoT2JqZWN0O1xuICAgIGlmICgkaXNFeHRlbnNpYmxlKG9iamVjdCkpIHtcbiAgICAgIGhhc2hPYmplY3RQcm9wZXJ0aWVzLmhhc2gudmFsdWUgPSBoYXNoQ291bnRlcisrO1xuICAgICAgaGFzaE9iamVjdFByb3BlcnRpZXMuc2VsZi52YWx1ZSA9IG9iamVjdDtcbiAgICAgIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUgPSAkY3JlYXRlKG51bGwsIGhhc2hPYmplY3RQcm9wZXJ0aWVzKTtcbiAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGhhc2hQcm9wZXJ0eSwgaGFzaFByb3BlcnR5RGVzY3JpcHRvcik7XG4gICAgICByZXR1cm4gaGFzaFByb3BlcnR5RGVzY3JpcHRvci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBmcmVlemUob2JqZWN0KSB7XG4gICAgZ2V0T3duSGFzaE9iamVjdChvYmplY3QpO1xuICAgIHJldHVybiAkZnJlZXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMob2JqZWN0KSB7XG4gICAgZ2V0T3duSGFzaE9iamVjdChvYmplY3QpO1xuICAgIHJldHVybiAkcHJldmVudEV4dGVuc2lvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICBmdW5jdGlvbiBzZWFsKG9iamVjdCkge1xuICAgIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KTtcbiAgICByZXR1cm4gJHNlYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICBmcmVlemUoU3ltYm9sVmFsdWUucHJvdG90eXBlKTtcbiAgZnVuY3Rpb24gaXNTeW1ib2xTdHJpbmcocykge1xuICAgIHJldHVybiBzeW1ib2xWYWx1ZXNbc10gfHwgcHJpdmF0ZU5hbWVzW3NdO1xuICB9XG4gIGZ1bmN0aW9uIHRvUHJvcGVydHkobmFtZSkge1xuICAgIGlmIChpc1NoaW1TeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVTeW1ib2xLZXlzKGFycmF5KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1N5bWJvbFN0cmluZyhhcnJheVtpXSkpIHtcbiAgICAgICAgcnYucHVzaChhcnJheVtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHJldHVybiByZW1vdmVTeW1ib2xLZXlzKCRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbW92ZVN5bWJvbEtleXMoJGtleXMob2JqZWN0KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbFZhbHVlc1tuYW1lc1tpXV07XG4gICAgICBpZiAoc3ltYm9sKSB7XG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoaXNTaGltU3ltYm9sKG5hbWUpKSB7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChPYmplY3QpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknLCB7dmFsdWU6IGRlZmluZVByb3BlcnR5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5TmFtZXMnLCB7dmFsdWU6IGdldE93blByb3BlcnR5TmFtZXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3J9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ2hhc093blByb3BlcnR5Jywge3ZhbHVlOiBoYXNPd25Qcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdmcmVlemUnLCB7dmFsdWU6IGZyZWV6ZX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdwcmV2ZW50RXh0ZW5zaW9ucycsIHt2YWx1ZTogcHJldmVudEV4dGVuc2lvbnN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnc2VhbCcsIHt2YWx1ZTogc2VhbH0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdrZXlzJywge3ZhbHVlOiBrZXlzfSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0U3RhcihvYmplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBuYW1lc1tqXTtcbiAgICAgICAgaWYgKGlzU3ltYm9sU3RyaW5nKG5hbWUpKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAoZnVuY3Rpb24obW9kLCBuYW1lKSB7XG4gICAgICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vZFtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKGFyZ3VtZW50c1tpXSwgbmFtZXNbal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgICByZXR1cm4geCAhPSBudWxsICYmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbicpO1xuICB9XG4gIGZ1bmN0aW9uIHRvT2JqZWN0KHgpIHtcbiAgICBpZiAoeCA9PSBudWxsKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAkT2JqZWN0KHgpO1xuICB9XG4gIGZ1bmN0aW9uIGNoZWNrT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSB7XG4gICAgaWYgKGFyZ3VtZW50ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYW4gT2JqZWN0Jyk7XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN5bWJvbChnbG9iYWwsIFN5bWJvbCkge1xuICAgIGlmICghZ2xvYmFsLlN5bWJvbCkge1xuICAgICAgZ2xvYmFsLlN5bWJvbCA9IFN5bWJvbDtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgfVxuICAgIGlmICghZ2xvYmFsLlN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgZ2xvYmFsLlN5bWJvbC5pdGVyYXRvciA9IFN5bWJvbCgnU3ltYm9sLml0ZXJhdG9yJyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFN5bWJvbChnbG9iYWwsIFN5bWJvbCk7XG4gICAgZ2xvYmFsLlJlZmxlY3QgPSBnbG9iYWwuUmVmbGVjdCB8fCB7fTtcbiAgICBnbG9iYWwuUmVmbGVjdC5nbG9iYWwgPSBnbG9iYWwuUmVmbGVjdC5nbG9iYWwgfHwgZ2xvYmFsO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICB9XG4gIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICBnbG9iYWwuJHRyYWNldXJSdW50aW1lID0ge1xuICAgIGNoZWNrT2JqZWN0Q29lcmNpYmxlOiBjaGVja09iamVjdENvZXJjaWJsZSxcbiAgICBjcmVhdGVQcml2YXRlTmFtZTogY3JlYXRlUHJpdmF0ZU5hbWUsXG4gICAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gICAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgICBleHBvcnRTdGFyOiBleHBvcnRTdGFyLFxuICAgIGdldE93bkhhc2hPYmplY3Q6IGdldE93bkhhc2hPYmplY3QsXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAgIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc1ByaXZhdGVOYW1lOiBpc1ByaXZhdGVOYW1lLFxuICAgIGlzU3ltYm9sU3RyaW5nOiBpc1N5bWJvbFN0cmluZyxcbiAgICBrZXlzOiAka2V5cyxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgdG9Qcm9wZXJ0eTogdG9Qcm9wZXJ0eSxcbiAgICB0eXBlb2Y6IHR5cGVPZlxuICB9O1xufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgcGF0aDtcbiAgZnVuY3Rpb24gcmVsYXRpdmVSZXF1aXJlKGNhbGxlclBhdGgsIHJlcXVpcmVkUGF0aCkge1xuICAgIHBhdGggPSBwYXRoIHx8IHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJyAmJiByZXF1aXJlKCdwYXRoJyk7XG4gICAgZnVuY3Rpb24gaXNEaXJlY3RvcnkocGF0aCkge1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2UoLTEpID09PSAnLyc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzQWJzb2x1dGUocGF0aCkge1xuICAgICAgcmV0dXJuIHBhdGhbMF0gPT09ICcvJztcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNSZWxhdGl2ZShwYXRoKSB7XG4gICAgICByZXR1cm4gcGF0aFswXSA9PT0gJy4nO1xuICAgIH1cbiAgICBpZiAoaXNEaXJlY3RvcnkocmVxdWlyZWRQYXRoKSB8fCBpc0Fic29sdXRlKHJlcXVpcmVkUGF0aCkpXG4gICAgICByZXR1cm47XG4gICAgcmV0dXJuIGlzUmVsYXRpdmUocmVxdWlyZWRQYXRoKSA/IHJlcXVpcmUocGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShjYWxsZXJQYXRoKSwgcmVxdWlyZWRQYXRoKSkgOiByZXF1aXJlKHJlcXVpcmVkUGF0aCk7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLnJlcXVpcmUgPSByZWxhdGl2ZVJlcXVpcmU7XG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGZ1bmN0aW9uIHNwcmVhZCgpIHtcbiAgICB2YXIgcnYgPSBbXSxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGl0ZXJSZXN1bHQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZVRvU3ByZWFkID0gJHRyYWNldXJSdW50aW1lLmNoZWNrT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50c1tpXSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlVG9TcHJlYWRbJHRyYWNldXJSdW50aW1lLnRvUHJvcGVydHkoU3ltYm9sLml0ZXJhdG9yKV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IHNwcmVhZCBub24taXRlcmFibGUgb2JqZWN0LicpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXIgPSB2YWx1ZVRvU3ByZWFkWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KFN5bWJvbC5pdGVyYXRvcildKCk7XG4gICAgICB3aGlsZSAoIShpdGVyUmVzdWx0ID0gaXRlci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgcnZbaisrXSA9IGl0ZXJSZXN1bHQudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuc3ByZWFkID0gc3ByZWFkO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJHRyYWNldXJSdW50aW1lLmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgJF9fMCA9IE9iamVjdCxcbiAgICAgIGdldE93blByb3BlcnR5TmFtZXMgPSAkX18wLmdldE93blByb3BlcnR5TmFtZXMsXG4gICAgICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSAkX18wLmdldE93blByb3BlcnR5U3ltYm9scztcbiAgZnVuY3Rpb24gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCk7XG4gICAgZG8ge1xuICAgICAgdmFyIHJlc3VsdCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHByb3RvID0gJGdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9IHdoaWxlIChwcm90byk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckNvbnN0cnVjdG9yKGN0b3IpIHtcbiAgICByZXR1cm4gY3Rvci5fX3Byb3RvX187XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIGFyZ3MpIHtcbiAgICByZXR1cm4gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkuYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoIWRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyU2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwoc2VsZiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKChcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIikpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9O1xuICAgIHZhciBuYW1lcyA9IGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHZhciBzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KHN5bWJvbCldID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsICR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KHN5bWJvbCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvcnM7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgb2JqZWN0LCBzdGF0aWNPYmplY3QsIHN1cGVyQ2xhc3MpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY29uc3RydWN0b3InLCB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY3Rvci5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSAkY3JlYXRlKGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpLCBnZXREZXNjcmlwdG9ycyhvYmplY3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBvYmplY3Q7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShjdG9yLCAncHJvdG90eXBlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydGllcyhjdG9yLCBnZXREZXNjcmlwdG9ycyhzdGF0aWNPYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICBpZiAoJE9iamVjdChwcm90b3R5cGUpID09PSBwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICB0aHJvdyBuZXcgJFR5cGVFcnJvcignc3VwZXIgcHJvdG90eXBlIG11c3QgYmUgYW4gT2JqZWN0IG9yIG51bGwnKTtcbiAgICB9XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB0aHJvdyBuZXcgJFR5cGVFcnJvcigoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MgKyBcIi5cIikpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzID0gY3JlYXRlQ2xhc3M7XG4gICR0cmFjZXVyUnVudGltZS5kZWZhdWx0U3VwZXJDYWxsID0gZGVmYXVsdFN1cGVyQ2FsbDtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCA9IHN1cGVyQ2FsbDtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ29uc3RydWN0b3IgPSBzdXBlckNvbnN0cnVjdG9yO1xuICAkdHJhY2V1clJ1bnRpbWUuc3VwZXJHZXQgPSBzdXBlckdldDtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyU2V0ID0gc3VwZXJTZXQ7XG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmICh0eXBlb2YgJHRyYWNldXJSdW50aW1lICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcigndHJhY2V1ciBydW50aW1lIG5vdCBmb3VuZC4nKTtcbiAgfVxuICB2YXIgY3JlYXRlUHJpdmF0ZU5hbWUgPSAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlUHJpdmF0ZU5hbWU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJHRyYWNldXJSdW50aW1lLmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciBTVF9ORVdCT1JOID0gMDtcbiAgdmFyIFNUX0VYRUNVVElORyA9IDE7XG4gIHZhciBTVF9TVVNQRU5ERUQgPSAyO1xuICB2YXIgU1RfQ0xPU0VEID0gMztcbiAgdmFyIEVORF9TVEFURSA9IC0yO1xuICB2YXIgUkVUSFJPV19TVEFURSA9IC0zO1xuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVFeGNlcHRpb246IGZ1bmN0aW9uKGV4KSB7XG4gICAgICB0aGlzLkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgIHRoaXMuc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICB0aHJvdyBleDtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIG5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbiwgeCkge1xuICAgIHN3aXRjaCAoY3R4LkdTdGF0ZSkge1xuICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICBjYXNlIFNUX0NMT1NFRDpcbiAgICAgICAgaWYgKGFjdGlvbiA9PSAnbmV4dCcpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRocm93IHg7XG4gICAgICBjYXNlIFNUX05FV0JPUk46XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgIHRocm93IHg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aHJvdyAkVHlwZUVycm9yKCdTZW50IHZhbHVlIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yJyk7XG4gICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgY3R4LmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09PSBjdHg7XG4gICAgICAgIGlmIChkb25lKVxuICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICBjdHguR1N0YXRlID0gZG9uZSA/IFNUX0NMT1NFRCA6IFNUX1NVU1BFTkRFRDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICB9O1xuICAgIH1cbiAgfVxuICB2YXIgY3R4TmFtZSA9IGNyZWF0ZVByaXZhdGVOYW1lKCk7XG4gIHZhciBtb3ZlTmV4dE5hbWUgPSBjcmVhdGVQcml2YXRlTmFtZSgpO1xuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICRkZWZpbmVQcm9wZXJ0eShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShHZW5lcmF0b3JGdW5jdGlvbikpO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIG5leHQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHJldHVybiBuZXh0T3JUaHJvdyh0aGlzW2N0eE5hbWVdLCB0aGlzW21vdmVOZXh0TmFtZV0sICduZXh0Jywgdik7XG4gICAgfSxcbiAgICB0aHJvdzogZnVuY3Rpb24odikge1xuICAgICAgcmV0dXJuIG5leHRPclRocm93KHRoaXNbY3R4TmFtZV0sIHRoaXNbbW92ZU5leHROYW1lXSwgJ3Rocm93Jywgdik7XG4gICAgfVxuICB9O1xuICAkZGVmaW5lUHJvcGVydGllcyhHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge2VudW1lcmFibGU6IGZhbHNlfSxcbiAgICBuZXh0OiB7ZW51bWVyYWJsZTogZmFsc2V9LFxuICAgIHRocm93OiB7ZW51bWVyYWJsZTogZmFsc2V9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIG5vbkVudW0oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pKTtcbiAgZnVuY3Rpb24gY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoaW5uZXJGdW5jdGlvbiwgZnVuY3Rpb25PYmplY3QsIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEdlbmVyYXRvckNvbnRleHQoKTtcbiAgICB2YXIgb2JqZWN0ID0gJGNyZWF0ZShmdW5jdGlvbk9iamVjdC5wcm90b3R5cGUpO1xuICAgIG9iamVjdFtjdHhOYW1lXSA9IGN0eDtcbiAgICBvYmplY3RbbW92ZU5leHROYW1lXSA9IG1vdmVOZXh0O1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uT2JqZWN0KSB7XG4gICAgZnVuY3Rpb25PYmplY3QucHJvdG90eXBlID0gJGNyZWF0ZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUpO1xuICAgIGZ1bmN0aW9uT2JqZWN0Ll9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIHJldHVybiBmdW5jdGlvbk9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSAkY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHRoaXMucmVzb2x2ZSh0aGlzLnJldHVyblZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnJlamVjdChnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpKTtcbiAgICB9XG4gIH07XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5oYW5kbGVFeGNlcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXRlID0gUkVUSFJPV19TVEFURTtcbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmVycmJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGhhbmRsZUNhdGNoKGN0eCwgZXJyKTtcbiAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBoYW5kbGVDYXRjaChjdHgsIGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2F0Y2goY3R4LCBleCkge1xuICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICBpZiAoIWxhc3QpIHtcbiAgICAgIGN0eC5oYW5kbGVFeGNlcHRpb24oZXgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjdHguc3RhdGUgPSBsYXN0LmNhdGNoICE9PSB1bmRlZmluZWQgPyBsYXN0LmNhdGNoIDogbGFzdC5maW5hbGx5O1xuICAgIGlmIChsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgY3R4LmZpbmFsbHlGYWxsVGhyb3VnaCA9IGxhc3QuZmluYWxseUZhbGxUaHJvdWdoO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5hc3luY1dyYXAgPSBhc3luY1dyYXA7XG4gICR0cmFjZXVyUnVudGltZS5pbml0R2VuZXJhdG9yRnVuY3Rpb24gPSBpbml0R2VuZXJhdG9yRnVuY3Rpb247XG4gICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZSA9IGNyZWF0ZUdlbmVyYXRvckluc3RhbmNlO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgdHlwZXMgPSB7XG4gICAgYW55OiB7bmFtZTogJ2FueSd9LFxuICAgIGJvb2xlYW46IHtuYW1lOiAnYm9vbGVhbid9LFxuICAgIG51bWJlcjoge25hbWU6ICdudW1iZXInfSxcbiAgICBzdHJpbmc6IHtuYW1lOiAnc3RyaW5nJ30sXG4gICAgc3ltYm9sOiB7bmFtZTogJ3N5bWJvbCd9LFxuICAgIHZvaWQ6IHtuYW1lOiAndm9pZCd9XG4gIH07XG4gIHZhciBHZW5lcmljVHlwZSA9IGZ1bmN0aW9uIEdlbmVyaWNUeXBlKHR5cGUsIGFyZ3VtZW50VHlwZXMpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuYXJndW1lbnRUeXBlcyA9IGFyZ3VtZW50VHlwZXM7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEdlbmVyaWNUeXBlLCB7fSwge30pO1xuICB2YXIgdHlwZVJlZ2lzdGVyID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gZ2VuZXJpY1R5cGUodHlwZSkge1xuICAgIGZvciAodmFyIGFyZ3VtZW50VHlwZXMgPSBbXSxcbiAgICAgICAgJF9fMSA9IDE7ICRfXzEgPCBhcmd1bWVudHMubGVuZ3RoOyAkX18xKyspXG4gICAgICBhcmd1bWVudFR5cGVzWyRfXzEgLSAxXSA9IGFyZ3VtZW50c1skX18xXTtcbiAgICB2YXIgdHlwZU1hcCA9IHR5cGVSZWdpc3RlcjtcbiAgICB2YXIga2V5ID0gJHRyYWNldXJSdW50aW1lLmdldE93bkhhc2hPYmplY3QodHlwZSkuaGFzaDtcbiAgICBpZiAoIXR5cGVNYXBba2V5XSkge1xuICAgICAgdHlwZU1hcFtrZXldID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG4gICAgdHlwZU1hcCA9IHR5cGVNYXBba2V5XTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50VHlwZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBrZXkgPSAkdHJhY2V1clJ1bnRpbWUuZ2V0T3duSGFzaE9iamVjdChhcmd1bWVudFR5cGVzW2ldKS5oYXNoO1xuICAgICAgaWYgKCF0eXBlTWFwW2tleV0pIHtcbiAgICAgICAgdHlwZU1hcFtrZXldID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIH1cbiAgICAgIHR5cGVNYXAgPSB0eXBlTWFwW2tleV07XG4gICAgfVxuICAgIHZhciB0YWlsID0gYXJndW1lbnRUeXBlc1thcmd1bWVudFR5cGVzLmxlbmd0aCAtIDFdO1xuICAgIGtleSA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25IYXNoT2JqZWN0KHRhaWwpLmhhc2g7XG4gICAgaWYgKCF0eXBlTWFwW2tleV0pIHtcbiAgICAgIHR5cGVNYXBba2V5XSA9IG5ldyBHZW5lcmljVHlwZSh0eXBlLCBhcmd1bWVudFR5cGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVNYXBba2V5XTtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuR2VuZXJpY1R5cGUgPSBHZW5lcmljVHlwZTtcbiAgJHRyYWNldXJSdW50aW1lLmdlbmVyaWNUeXBlID0gZ2VuZXJpY1R5cGU7XG4gICR0cmFjZXVyUnVudGltZS50eXBlID0gdHlwZXM7XG59KSgpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciAkX18yID0gJHRyYWNldXJSdW50aW1lLFxuICAgICAgY2Fub25pY2FsaXplVXJsID0gJF9fMi5jYW5vbmljYWxpemVVcmwsXG4gICAgICByZXNvbHZlVXJsID0gJF9fMi5yZXNvbHZlVXJsLFxuICAgICAgaXNBYnNvbHV0ZSA9ICRfXzIuaXNBYnNvbHV0ZTtcbiAgdmFyIG1vZHVsZUluc3RhbnRpYXRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgYmFzZVVSTDtcbiAgaWYgKGdsb2JhbC5sb2NhdGlvbiAmJiBnbG9iYWwubG9jYXRpb24uaHJlZilcbiAgICBiYXNlVVJMID0gcmVzb2x2ZVVybChnbG9iYWwubG9jYXRpb24uaHJlZiwgJy4vJyk7XG4gIGVsc2VcbiAgICBiYXNlVVJMID0gJyc7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUVudHJ5ID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVFbnRyeSh1cmwsIHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy52YWx1ZV8gPSB1bmNvYXRlZE1vZHVsZTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVFbnRyeSwge30sIHt9KTtcbiAgdmFyIE1vZHVsZUV2YWx1YXRpb25FcnJvciA9IGZ1bmN0aW9uIE1vZHVsZUV2YWx1YXRpb25FcnJvcihlcnJvbmVvdXNNb2R1bGVOYW1lLCBjYXVzZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZSArICc6ICcgKyB0aGlzLnN0cmlwQ2F1c2UoY2F1c2UpICsgJyBpbiAnICsgZXJyb25lb3VzTW9kdWxlTmFtZTtcbiAgICBpZiAoIShjYXVzZSBpbnN0YW5jZW9mICRNb2R1bGVFdmFsdWF0aW9uRXJyb3IpICYmIGNhdXNlLnN0YWNrKVxuICAgICAgdGhpcy5zdGFjayA9IHRoaXMuc3RyaXBTdGFjayhjYXVzZS5zdGFjayk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdGFjayA9ICcnO1xuICB9O1xuICB2YXIgJE1vZHVsZUV2YWx1YXRpb25FcnJvciA9IE1vZHVsZUV2YWx1YXRpb25FcnJvcjtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoTW9kdWxlRXZhbHVhdGlvbkVycm9yLCB7XG4gICAgc3RyaXBFcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZSgvLipFcnJvcjovLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnOicpO1xuICAgIH0sXG4gICAgc3RyaXBDYXVzZTogZnVuY3Rpb24oY2F1c2UpIHtcbiAgICAgIGlmICghY2F1c2UpXG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIGlmICghY2F1c2UubWVzc2FnZSlcbiAgICAgICAgcmV0dXJuIGNhdXNlICsgJyc7XG4gICAgICByZXR1cm4gdGhpcy5zdHJpcEVycm9yKGNhdXNlLm1lc3NhZ2UpO1xuICAgIH0sXG4gICAgbG9hZGVkQnk6IGZ1bmN0aW9uKG1vZHVsZU5hbWUpIHtcbiAgICAgIHRoaXMuc3RhY2sgKz0gJ1xcbiBsb2FkZWQgYnkgJyArIG1vZHVsZU5hbWU7XG4gICAgfSxcbiAgICBzdHJpcFN0YWNrOiBmdW5jdGlvbihjYXVzZVN0YWNrKSB7XG4gICAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICAgIGNhdXNlU3RhY2suc3BsaXQoJ1xcbicpLnNvbWUoKGZ1bmN0aW9uKGZyYW1lKSB7XG4gICAgICAgIGlmICgvVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IvLnRlc3QoZnJhbWUpKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBzdGFjay5wdXNoKGZyYW1lKTtcbiAgICAgIH0pKTtcbiAgICAgIHN0YWNrWzBdID0gdGhpcy5zdHJpcEVycm9yKHN0YWNrWzBdKTtcbiAgICAgIHJldHVybiBzdGFjay5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH0sIHt9LCBFcnJvcik7XG4gIGZ1bmN0aW9uIGJlZm9yZUxpbmVzKGxpbmVzLCBudW1iZXIpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGZpcnN0ID0gbnVtYmVyIC0gMztcbiAgICBpZiAoZmlyc3QgPCAwKVxuICAgICAgZmlyc3QgPSAwO1xuICAgIGZvciAodmFyIGkgPSBmaXJzdDsgaSA8IG51bWJlcjsgaSsrKSB7XG4gICAgICByZXN1bHQucHVzaChsaW5lc1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gYWZ0ZXJMaW5lcyhsaW5lcywgbnVtYmVyKSB7XG4gICAgdmFyIGxhc3QgPSBudW1iZXIgKyAxO1xuICAgIGlmIChsYXN0ID4gbGluZXMubGVuZ3RoIC0gMSlcbiAgICAgIGxhc3QgPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gbnVtYmVyOyBpIDw9IGxhc3Q7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2gobGluZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbHVtblNwYWNpbmcoY29sdW1ucykge1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbHVtbnMgLSAxOyBpKyspIHtcbiAgICAgIHJlc3VsdCArPSAnLSc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IodXJsLCBmdW5jKSB7XG4gICAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ29uc3RydWN0b3IoJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKS5jYWxsKHRoaXMsIHVybCwgbnVsbCk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlbGF0aXZlUmVxdWlyZTtcbiAgICAgICAgaWYgKHR5cGVvZiAkdHJhY2V1clJ1bnRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlbGF0aXZlUmVxdWlyZSA9ICR0cmFjZXVyUnVudGltZS5yZXF1aXJlLmJpbmQobnVsbCwgdGhpcy51cmwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXyA9IHRoaXMuZnVuYy5jYWxsKGdsb2JhbCwgcmVsYXRpdmVSZXF1aXJlKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmIChleCBpbnN0YW5jZW9mIE1vZHVsZUV2YWx1YXRpb25FcnJvcikge1xuICAgICAgICAgIGV4LmxvYWRlZEJ5KHRoaXMudXJsKTtcbiAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXguc3RhY2spIHtcbiAgICAgICAgICB2YXIgbGluZXMgPSB0aGlzLmZ1bmMudG9TdHJpbmcoKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgdmFyIGV2YWxlZCA9IFtdO1xuICAgICAgICAgIGV4LnN0YWNrLnNwbGl0KCdcXG4nKS5zb21lKGZ1bmN0aW9uKGZyYW1lKSB7XG4gICAgICAgICAgICBpZiAoZnJhbWUuaW5kZXhPZignVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IuZ2V0VW5jb2F0ZWRNb2R1bGUnKSA+IDApXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgdmFyIG0gPSAvKGF0XFxzW15cXHNdKlxccykuKj46KFxcZCopOihcXGQqKVxcKS8uZXhlYyhmcmFtZSk7XG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICB2YXIgbGluZSA9IHBhcnNlSW50KG1bMl0sIDEwKTtcbiAgICAgICAgICAgICAgZXZhbGVkID0gZXZhbGVkLmNvbmNhdChiZWZvcmVMaW5lcyhsaW5lcywgbGluZSkpO1xuICAgICAgICAgICAgICBldmFsZWQucHVzaChjb2x1bW5TcGFjaW5nKG1bM10pICsgJ14nKTtcbiAgICAgICAgICAgICAgZXZhbGVkID0gZXZhbGVkLmNvbmNhdChhZnRlckxpbmVzKGxpbmVzLCBsaW5lKSk7XG4gICAgICAgICAgICAgIGV2YWxlZC5wdXNoKCc9ID0gPSA9ID0gPSA9ID0gPScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXZhbGVkLnB1c2goZnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGV4LnN0YWNrID0gZXZhbGVkLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBNb2R1bGVFdmFsdWF0aW9uRXJyb3IodGhpcy51cmwsIGV4KTtcbiAgICAgIH1cbiAgICB9fSwge30sIFVuY29hdGVkTW9kdWxlRW50cnkpO1xuICBmdW5jdGlvbiBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZUluc3RhbnRpYXRvcnNbdXJsXTtcbiAgfVxuICA7XG4gIHZhciBtb2R1bGVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbGl2ZU1vZHVsZVNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIE1vZHVsZSh1bmNvYXRlZE1vZHVsZSkge1xuICAgIHZhciBpc0xpdmUgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGNvYXRlZE1vZHVsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModW5jb2F0ZWRNb2R1bGUpLmZvckVhY2goKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBnZXR0ZXIsXG4gICAgICAgICAgdmFsdWU7XG4gICAgICBpZiAoaXNMaXZlID09PSBsaXZlTW9kdWxlU2VudGluZWwpIHtcbiAgICAgICAgdmFyIGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih1bmNvYXRlZE1vZHVsZSwgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjci5nZXQpXG4gICAgICAgICAgZ2V0dGVyID0gZGVzY3IuZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB1bmNvYXRlZE1vZHVsZVtuYW1lXTtcbiAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvYXRlZE1vZHVsZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhjb2F0ZWRNb2R1bGUpO1xuICAgIHJldHVybiBjb2F0ZWRNb2R1bGU7XG4gIH1cbiAgdmFyIE1vZHVsZVN0b3JlID0ge1xuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24obmFtZSwgcmVmZXJlck5hbWUsIHJlZmVyZXJBZGRyZXNzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtb2R1bGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLCBub3QgJyArIHR5cGVvZiBuYW1lKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKG5hbWUpKVxuICAgICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgICAgaWYgKC9bXlxcLl1cXC9cXC5cXC5cXC8vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtb2R1bGUgbmFtZSBlbWJlZHMgLy4uLzogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWVbMF0gPT09ICcuJyAmJiByZWZlcmVyTmFtZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVVcmwocmVmZXJlck5hbWUsIG5hbWUpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHZhciBtID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUpO1xuICAgICAgaWYgKCFtKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgdmFyIG1vZHVsZUluc3RhbmNlID0gbW9kdWxlSW5zdGFuY2VzW20udXJsXTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW5jZSlcbiAgICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlO1xuICAgICAgbW9kdWxlSW5zdGFuY2UgPSBNb2R1bGUobS5nZXRVbmNvYXRlZE1vZHVsZSgpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlc1ttLnVybF0gPSBtb2R1bGVJbnN0YW5jZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUsIG1vZHVsZSkge1xuICAgICAgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgIH0pKTtcbiAgICAgIG1vZHVsZUluc3RhbmNlc1tub3JtYWxpemVkTmFtZV0gPSBtb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgYmFzZVVSTCgpIHtcbiAgICAgIHJldHVybiBiYXNlVVJMO1xuICAgIH0sXG4gICAgc2V0IGJhc2VVUkwodikge1xuICAgICAgYmFzZVVSTCA9IFN0cmluZyh2KTtcbiAgICB9LFxuICAgIHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgICBpZiAobW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZHVwbGljYXRlIG1vZHVsZSBuYW1lZCAnICsgbm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIGZ1bmMpO1xuICAgIH0sXG4gICAgYnVuZGxlU3RvcmU6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGRlcHMsIGZ1bmMpIHtcbiAgICAgIGlmICghZGVwcyB8fCAhZGVwcy5sZW5ndGggJiYgIWZ1bmMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmFtZSwgZGVwcywgZnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1bmRsZVN0b3JlW25hbWVdID0ge1xuICAgICAgICAgIGRlcHM6IGRlcHMsXG4gICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJF9fMCA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHZhciBkZXBNYXAgPSB7fTtcbiAgICAgICAgICAgIGRlcHMuZm9yRWFjaCgoZnVuY3Rpb24oZGVwLCBpbmRleCkge1xuICAgICAgICAgICAgICByZXR1cm4gZGVwTWFwW2RlcF0gPSAkX18wW2luZGV4XTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHZhciByZWdpc3RyeUVudHJ5ID0gZnVuYy5jYWxsKHRoaXMsIGRlcE1hcCk7XG4gICAgICAgICAgICByZWdpc3RyeUVudHJ5LmV4ZWN1dGUuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiByZWdpc3RyeUVudHJ5LmV4cG9ydHM7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QW5vbnltb3VzTW9kdWxlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZHVsZShmdW5jLmNhbGwoZ2xvYmFsKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICB9LFxuICAgIGdldEZvclRlc3Rpbmc6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciAkX18wID0gdGhpcztcbiAgICAgIGlmICghdGhpcy50ZXN0aW5nUHJlZml4Xykge1xuICAgICAgICBPYmplY3Qua2V5cyhtb2R1bGVJbnN0YW5jZXMpLnNvbWUoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHZhciBtID0gLyh0cmFjZXVyQFteXFwvXSpcXC8pLy5leGVjKGtleSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICRfXzAudGVzdGluZ1ByZWZpeF8gPSBtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy50ZXN0aW5nUHJlZml4XyArIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgdmFyIG1vZHVsZVN0b3JlTW9kdWxlID0gbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSk7XG4gIE1vZHVsZVN0b3JlLnNldCgnQHRyYWNldXIvc3JjL3J1bnRpbWUvTW9kdWxlU3RvcmUnLCBtb2R1bGVTdG9yZU1vZHVsZSk7XG4gIE1vZHVsZVN0b3JlLnNldCgnQHRyYWNldXIvc3JjL3J1bnRpbWUvTW9kdWxlU3RvcmUuanMnLCBtb2R1bGVTdG9yZU1vZHVsZSk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5Nb2R1bGVTdG9yZSA9IE1vZHVsZVN0b3JlO1xuICBnbG9iYWwuU3lzdGVtID0ge1xuICAgIHJlZ2lzdGVyOiBNb2R1bGVTdG9yZS5yZWdpc3Rlci5iaW5kKE1vZHVsZVN0b3JlKSxcbiAgICByZWdpc3Rlck1vZHVsZTogTW9kdWxlU3RvcmUucmVnaXN0ZXJNb2R1bGUuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIjtcbiAgdmFyICRjZWlsID0gTWF0aC5jZWlsO1xuICB2YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbiAgdmFyICRpc0Zpbml0ZSA9IGlzRmluaXRlO1xuICB2YXIgJGlzTmFOID0gaXNOYU47XG4gIHZhciAkcG93ID0gTWF0aC5wb3c7XG4gIHZhciAkbWluID0gTWF0aC5taW47XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4ID4+PiAwO1xuICB9XG4gIGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgICByZXR1cm4geCAmJiAodHlwZW9mIHggPT09ICdvYmplY3QnIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKTtcbiAgfVxuICBmdW5jdGlvbiBpc0NhbGxhYmxlKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gIH1cbiAgZnVuY3Rpb24gaXNOdW1iZXIoeCkge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ251bWJlcic7XG4gIH1cbiAgZnVuY3Rpb24gdG9JbnRlZ2VyKHgpIHtcbiAgICB4ID0gK3g7XG4gICAgaWYgKCRpc05hTih4KSlcbiAgICAgIHJldHVybiAwO1xuICAgIGlmICh4ID09PSAwIHx8ICEkaXNGaW5pdGUoeCkpXG4gICAgICByZXR1cm4geDtcbiAgICByZXR1cm4geCA+IDAgPyAkZmxvb3IoeCkgOiAkY2VpbCh4KTtcbiAgfVxuICB2YXIgTUFYX1NBRkVfTEVOR1RIID0gJHBvdygyLCA1MykgLSAxO1xuICBmdW5jdGlvbiB0b0xlbmd0aCh4KSB7XG4gICAgdmFyIGxlbiA9IHRvSW50ZWdlcih4KTtcbiAgICByZXR1cm4gbGVuIDwgMCA/IDAgOiAkbWluKGxlbiwgTUFYX1NBRkVfTEVOR1RIKTtcbiAgfVxuICBmdW5jdGlvbiBjaGVja0l0ZXJhYmxlKHgpIHtcbiAgICByZXR1cm4gIWlzT2JqZWN0KHgpID8gdW5kZWZpbmVkIDogeFtTeW1ib2wuaXRlcmF0b3JdO1xuICB9XG4gIGZ1bmN0aW9uIGlzQ29uc3RydWN0b3IoeCkge1xuICAgIHJldHVybiBpc0NhbGxhYmxlKHgpO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHZhbHVlLCBkb25lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRvbmU6IGRvbmVcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwgZGVzY3IpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lQ29uc3Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIG1heWJlRGVmaW5lKG9iamVjdCwgbmFtZSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkQ29uc3RzKG9iamVjdCwgY29uc3RzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25zdHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gY29uc3RzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gY29uc3RzW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lQ29uc3Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkSXRlcmF0b3Iob2JqZWN0LCBmdW5jLCBTeW1ib2wpIHtcbiAgICBpZiAoIVN5bWJvbCB8fCAhU3ltYm9sLml0ZXJhdG9yIHx8IG9iamVjdFtTeW1ib2wuaXRlcmF0b3JdKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChvYmplY3RbJ0BAaXRlcmF0b3InXSlcbiAgICAgIGZ1bmMgPSBvYmplY3RbJ0BAaXRlcmF0b3InXTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgIHZhbHVlOiBmdW5jLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIHZhciBwb2x5ZmlsbHMgPSBbXTtcbiAgZnVuY3Rpb24gcmVnaXN0ZXJQb2x5ZmlsbChmdW5jKSB7XG4gICAgcG9seWZpbGxzLnB1c2goZnVuYyk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxBbGwoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxzLmZvckVhY2goKGZ1bmN0aW9uKGYpIHtcbiAgICAgIHJldHVybiBmKGdsb2JhbCk7XG4gICAgfSkpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH0sXG4gICAgZ2V0IGlzT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIGlzT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IGlzQ2FsbGFibGUoKSB7XG4gICAgICByZXR1cm4gaXNDYWxsYWJsZTtcbiAgICB9LFxuICAgIGdldCBpc051bWJlcigpIHtcbiAgICAgIHJldHVybiBpc051bWJlcjtcbiAgICB9LFxuICAgIGdldCB0b0ludGVnZXIoKSB7XG4gICAgICByZXR1cm4gdG9JbnRlZ2VyO1xuICAgIH0sXG4gICAgZ2V0IHRvTGVuZ3RoKCkge1xuICAgICAgcmV0dXJuIHRvTGVuZ3RoO1xuICAgIH0sXG4gICAgZ2V0IGNoZWNrSXRlcmFibGUoKSB7XG4gICAgICByZXR1cm4gY2hlY2tJdGVyYWJsZTtcbiAgICB9LFxuICAgIGdldCBpc0NvbnN0cnVjdG9yKCkge1xuICAgICAgcmV0dXJuIGlzQ29uc3RydWN0b3I7XG4gICAgfSxcbiAgICBnZXQgY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoKSB7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3Q7XG4gICAgfSxcbiAgICBnZXQgbWF5YmVEZWZpbmUoKSB7XG4gICAgICByZXR1cm4gbWF5YmVEZWZpbmU7XG4gICAgfSxcbiAgICBnZXQgbWF5YmVEZWZpbmVNZXRob2QoKSB7XG4gICAgICByZXR1cm4gbWF5YmVEZWZpbmVNZXRob2Q7XG4gICAgfSxcbiAgICBnZXQgbWF5YmVEZWZpbmVDb25zdCgpIHtcbiAgICAgIHJldHVybiBtYXliZURlZmluZUNvbnN0O1xuICAgIH0sXG4gICAgZ2V0IG1heWJlQWRkRnVuY3Rpb25zKCkge1xuICAgICAgcmV0dXJuIG1heWJlQWRkRnVuY3Rpb25zO1xuICAgIH0sXG4gICAgZ2V0IG1heWJlQWRkQ29uc3RzKCkge1xuICAgICAgcmV0dXJuIG1heWJlQWRkQ29uc3RzO1xuICAgIH0sXG4gICAgZ2V0IG1heWJlQWRkSXRlcmF0b3IoKSB7XG4gICAgICByZXR1cm4gbWF5YmVBZGRJdGVyYXRvcjtcbiAgICB9LFxuICAgIGdldCByZWdpc3RlclBvbHlmaWxsKCkge1xuICAgICAgcmV0dXJuIHJlZ2lzdGVyUG9seWZpbGw7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxBbGwoKSB7XG4gICAgICByZXR1cm4gcG9seWZpbGxBbGw7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9NYXAuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvTWFwLmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgaXNPYmplY3QgPSAkX18wLmlzT2JqZWN0LFxuICAgICAgbWF5YmVBZGRJdGVyYXRvciA9ICRfXzAubWF5YmVBZGRJdGVyYXRvcixcbiAgICAgIHJlZ2lzdGVyUG9seWZpbGwgPSAkX18wLnJlZ2lzdGVyUG9seWZpbGw7XG4gIHZhciBnZXRPd25IYXNoT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLmdldE93bkhhc2hPYmplY3Q7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgZGVsZXRlZFNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIGxvb2t1cEluZGV4KG1hcCwga2V5KSB7XG4gICAgaWYgKGlzT2JqZWN0KGtleSkpIHtcbiAgICAgIHZhciBoYXNoT2JqZWN0ID0gZ2V0T3duSGFzaE9iamVjdChrZXkpO1xuICAgICAgcmV0dXJuIGhhc2hPYmplY3QgJiYgbWFwLm9iamVjdEluZGV4X1toYXNoT2JqZWN0Lmhhc2hdO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpXG4gICAgICByZXR1cm4gbWFwLnN0cmluZ0luZGV4X1trZXldO1xuICAgIHJldHVybiBtYXAucHJpbWl0aXZlSW5kZXhfW2tleV07XG4gIH1cbiAgZnVuY3Rpb24gaW5pdE1hcChtYXApIHtcbiAgICBtYXAuZW50cmllc18gPSBbXTtcbiAgICBtYXAub2JqZWN0SW5kZXhfID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBtYXAuc3RyaW5nSW5kZXhfID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBtYXAucHJpbWl0aXZlSW5kZXhfID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBtYXAuZGVsZXRlZENvdW50XyA9IDA7XG4gIH1cbiAgdmFyIE1hcCA9IGZ1bmN0aW9uIE1hcCgpIHtcbiAgICB2YXIgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XG4gICAgaWYgKCFpc09iamVjdCh0aGlzKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01hcCBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHR5cGUnKTtcbiAgICBpZiAoJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgJ2VudHJpZXNfJykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01hcCBjYW4gbm90IGJlIHJlZW50cmFudGx5IGluaXRpYWxpc2VkJyk7XG4gICAgfVxuICAgIGluaXRNYXAodGhpcyk7XG4gICAgaWYgKGl0ZXJhYmxlICE9PSBudWxsICYmIGl0ZXJhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyICRfXzIgPSBpdGVyYWJsZVskdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShTeW1ib2wuaXRlcmF0b3IpXSgpLFxuICAgICAgICAgICRfXzM7ICEoJF9fMyA9ICRfXzIubmV4dCgpKS5kb25lOyApIHtcbiAgICAgICAgdmFyICRfXzQgPSAkX18zLnZhbHVlLFxuICAgICAgICAgICAga2V5ID0gJF9fNFswXSxcbiAgICAgICAgICAgIHZhbHVlID0gJF9fNFsxXTtcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShNYXAsIHtcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVudHJpZXNfLmxlbmd0aCAvIDIgLSB0aGlzLmRlbGV0ZWRDb3VudF87XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGluZGV4ID0gbG9va3VwSW5kZXgodGhpcywga2V5KTtcbiAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcy5lbnRyaWVzX1tpbmRleCArIDFdO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB2YXIgb2JqZWN0TW9kZSA9IGlzT2JqZWN0KGtleSk7XG4gICAgICB2YXIgc3RyaW5nTW9kZSA9IHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnO1xuICAgICAgdmFyIGluZGV4ID0gbG9va3VwSW5kZXgodGhpcywga2V5KTtcbiAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW50cmllc19baW5kZXggKyAxXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLmVudHJpZXNfLmxlbmd0aDtcbiAgICAgICAgdGhpcy5lbnRyaWVzX1tpbmRleF0gPSBrZXk7XG4gICAgICAgIHRoaXMuZW50cmllc19baW5kZXggKyAxXSA9IHZhbHVlO1xuICAgICAgICBpZiAob2JqZWN0TW9kZSkge1xuICAgICAgICAgIHZhciBoYXNoT2JqZWN0ID0gZ2V0T3duSGFzaE9iamVjdChrZXkpO1xuICAgICAgICAgIHZhciBoYXNoID0gaGFzaE9iamVjdC5oYXNoO1xuICAgICAgICAgIHRoaXMub2JqZWN0SW5kZXhfW2hhc2hdID0gaW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaW5nTW9kZSkge1xuICAgICAgICAgIHRoaXMuc3RyaW5nSW5kZXhfW2tleV0gPSBpbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByaW1pdGl2ZUluZGV4X1trZXldID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBsb29rdXBJbmRleCh0aGlzLCBrZXkpICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIG9iamVjdE1vZGUgPSBpc09iamVjdChrZXkpO1xuICAgICAgdmFyIHN0cmluZ01vZGUgPSB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJztcbiAgICAgIHZhciBpbmRleDtcbiAgICAgIHZhciBoYXNoO1xuICAgICAgaWYgKG9iamVjdE1vZGUpIHtcbiAgICAgICAgdmFyIGhhc2hPYmplY3QgPSBnZXRPd25IYXNoT2JqZWN0KGtleSk7XG4gICAgICAgIGlmIChoYXNoT2JqZWN0KSB7XG4gICAgICAgICAgaW5kZXggPSB0aGlzLm9iamVjdEluZGV4X1toYXNoID0gaGFzaE9iamVjdC5oYXNoXTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5vYmplY3RJbmRleF9baGFzaF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nTW9kZSkge1xuICAgICAgICBpbmRleCA9IHRoaXMuc3RyaW5nSW5kZXhfW2tleV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLnN0cmluZ0luZGV4X1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLnByaW1pdGl2ZUluZGV4X1trZXldO1xuICAgICAgICBkZWxldGUgdGhpcy5wcmltaXRpdmVJbmRleF9ba2V5XTtcbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW50cmllc19baW5kZXhdID0gZGVsZXRlZFNlbnRpbmVsO1xuICAgICAgICB0aGlzLmVudHJpZXNfW2luZGV4ICsgMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGVsZXRlZENvdW50XysrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIGluaXRNYXAodGhpcyk7XG4gICAgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFja0ZuKSB7XG4gICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRyaWVzXy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5lbnRyaWVzX1tpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5lbnRyaWVzX1tpICsgMV07XG4gICAgICAgIGlmIChrZXkgPT09IGRlbGV0ZWRTZW50aW5lbClcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY2FsbGJhY2tGbi5jYWxsKHRoaXNBcmcsIHZhbHVlLCBrZXksIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW50cmllczogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX181KCkge1xuICAgICAgdmFyIGksXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoaSA8IHRoaXMuZW50cmllc18ubGVuZ3RoKSA/IDggOiAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAga2V5ID0gdGhpcy5lbnRyaWVzX1tpXTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmVudHJpZXNfW2kgKyAxXTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGtleSA9PT0gZGVsZXRlZFNlbnRpbmVsKSA/IDQgOiA2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWx1ZV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHgubWF5YmVUaHJvdygpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gNDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX181LCB0aGlzKTtcbiAgICB9KSxcbiAgICBrZXlzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzYoKSB7XG4gICAgICB2YXIgaSxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdmFsdWU7XG4gICAgICByZXR1cm4gJHRyYWNldXJSdW50aW1lLmNyZWF0ZUdlbmVyYXRvckluc3RhbmNlKGZ1bmN0aW9uKCRjdHgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgICAgc3dpdGNoICgkY3R4LnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChpIDwgdGhpcy5lbnRyaWVzXy5sZW5ndGgpID8gOCA6IC0yO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICBrZXkgPSB0aGlzLmVudHJpZXNfW2ldO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZW50cmllc19baSArIDFdO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gOTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoa2V5ID09PSBkZWxldGVkU2VudGluZWwpID8gNCA6IDY7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMjtcbiAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgJGN0eC5tYXliZVRocm93KCk7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzYsIHRoaXMpO1xuICAgIH0pLFxuICAgIHZhbHVlczogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX183KCkge1xuICAgICAgdmFyIGksXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoaSA8IHRoaXMuZW50cmllc18ubGVuZ3RoKSA/IDggOiAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAga2V5ID0gdGhpcy5lbnRyaWVzX1tpXTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmVudHJpZXNfW2kgKyAxXTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGtleSA9PT0gZGVsZXRlZFNlbnRpbmVsKSA/IDQgOiA2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgJGN0eC5tYXliZVRocm93KCk7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzcsIHRoaXMpO1xuICAgIH0pXG4gIH0sIHt9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogTWFwLnByb3RvdHlwZS5lbnRyaWVzXG4gIH0pO1xuICBmdW5jdGlvbiBwb2x5ZmlsbE1hcChnbG9iYWwpIHtcbiAgICB2YXIgJF9fNCA9IGdsb2JhbCxcbiAgICAgICAgT2JqZWN0ID0gJF9fNC5PYmplY3QsXG4gICAgICAgIFN5bWJvbCA9ICRfXzQuU3ltYm9sO1xuICAgIGlmICghZ2xvYmFsLk1hcClcbiAgICAgIGdsb2JhbC5NYXAgPSBNYXA7XG4gICAgdmFyIG1hcFByb3RvdHlwZSA9IGdsb2JhbC5NYXAucHJvdG90eXBlO1xuICAgIGlmIChtYXBQcm90b3R5cGUuZW50cmllcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgZ2xvYmFsLk1hcCA9IE1hcDtcbiAgICBpZiAobWFwUHJvdG90eXBlLmVudHJpZXMpIHtcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IobWFwUHJvdG90eXBlLCBtYXBQcm90b3R5cGUuZW50cmllcywgU3ltYm9sKTtcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IoT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyBnbG9iYWwuTWFwKCkuZW50cmllcygpKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSwgU3ltYm9sKTtcbiAgICB9XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbE1hcCk7XG4gIHJldHVybiB7XG4gICAgZ2V0IE1hcCgpIHtcbiAgICAgIHJldHVybiBNYXA7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxNYXAoKSB7XG4gICAgICByZXR1cm4gcG9seWZpbGxNYXA7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvTWFwLmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TZXQuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU2V0LmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgaXNPYmplY3QgPSAkX18wLmlzT2JqZWN0LFxuICAgICAgbWF5YmVBZGRJdGVyYXRvciA9ICRfXzAubWF5YmVBZGRJdGVyYXRvcixcbiAgICAgIHJlZ2lzdGVyUG9seWZpbGwgPSAkX18wLnJlZ2lzdGVyUG9seWZpbGw7XG4gIHZhciBNYXAgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvTWFwLmpzXCIpLk1hcDtcbiAgdmFyIGdldE93bkhhc2hPYmplY3QgPSAkdHJhY2V1clJ1bnRpbWUuZ2V0T3duSGFzaE9iamVjdDtcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIGZ1bmN0aW9uIGluaXRTZXQoc2V0KSB7XG4gICAgc2V0Lm1hcF8gPSBuZXcgTWFwKCk7XG4gIH1cbiAgdmFyIFNldCA9IGZ1bmN0aW9uIFNldCgpIHtcbiAgICB2YXIgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XG4gICAgaWYgKCFpc09iamVjdCh0aGlzKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NldCBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHR5cGUnKTtcbiAgICBpZiAoJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgJ21hcF8nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2V0IGNhbiBub3QgYmUgcmVlbnRyYW50bHkgaW5pdGlhbGlzZWQnKTtcbiAgICB9XG4gICAgaW5pdFNldCh0aGlzKTtcbiAgICBpZiAoaXRlcmFibGUgIT09IG51bGwgJiYgaXRlcmFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICh2YXIgJF9fNCA9IGl0ZXJhYmxlWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KFN5bWJvbC5pdGVyYXRvcildKCksXG4gICAgICAgICAgJF9fNTsgISgkX181ID0gJF9fNC5uZXh0KCkpLmRvbmU7ICkge1xuICAgICAgICB2YXIgaXRlbSA9ICRfXzUudmFsdWU7XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLmFkZChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoU2V0LCB7XG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLnNpemU7XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwXy5oYXMoa2V5KTtcbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLm1hcF8uc2V0KGtleSwga2V5KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcF8uZGVsZXRlKGtleSk7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLmNsZWFyKCk7XG4gICAgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFja0ZuKSB7XG4gICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIHZhciAkX18yID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLm1hcF8uZm9yRWFjaCgoZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBjYWxsYmFja0ZuLmNhbGwodGhpc0FyZywga2V5LCBrZXksICRfXzIpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgdmFsdWVzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzcoKSB7XG4gICAgICB2YXIgJF9fOCxcbiAgICAgICAgICAkX185O1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAkX184ID0gdGhpcy5tYXBfLmtleXMoKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgICAgICAgICRjdHguc2VudCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgJGN0eC5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAkX185ID0gJF9fOFskY3R4LmFjdGlvbl0oJGN0eC5zZW50SWdub3JlVGhyb3cpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gOTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoJF9fOS5kb25lKSA/IDMgOiAyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgJGN0eC5zZW50ID0gJF9fOS52YWx1ZTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IC0yO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICByZXR1cm4gJF9fOS52YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzcsIHRoaXMpO1xuICAgIH0pLFxuICAgIGVudHJpZXM6ICR0cmFjZXVyUnVudGltZS5pbml0R2VuZXJhdG9yRnVuY3Rpb24oZnVuY3Rpb24gJF9fMTAoKSB7XG4gICAgICB2YXIgJF9fMTEsXG4gICAgICAgICAgJF9fMTI7XG4gICAgICByZXR1cm4gJHRyYWNldXJSdW50aW1lLmNyZWF0ZUdlbmVyYXRvckluc3RhbmNlKGZ1bmN0aW9uKCRjdHgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgICAgc3dpdGNoICgkY3R4LnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICRfXzExID0gdGhpcy5tYXBfLmVudHJpZXMoKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgICAgICAgICRjdHguc2VudCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgJGN0eC5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAkX18xMiA9ICRfXzExWyRjdHguYWN0aW9uXSgkY3R4LnNlbnRJZ25vcmVUaHJvdyk7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9ICgkX18xMi5kb25lKSA/IDMgOiAyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgJGN0eC5zZW50ID0gJF9fMTIudmFsdWU7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgcmV0dXJuICRfXzEyLnZhbHVlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuICRjdHguZW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgfSwgJF9fMTAsIHRoaXMpO1xuICAgIH0pXG4gIH0sIHt9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNldC5wcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogU2V0LnByb3RvdHlwZS52YWx1ZXNcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCAna2V5cycsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IFNldC5wcm90b3R5cGUudmFsdWVzXG4gIH0pO1xuICBmdW5jdGlvbiBwb2x5ZmlsbFNldChnbG9iYWwpIHtcbiAgICB2YXIgJF9fNiA9IGdsb2JhbCxcbiAgICAgICAgT2JqZWN0ID0gJF9fNi5PYmplY3QsXG4gICAgICAgIFN5bWJvbCA9ICRfXzYuU3ltYm9sO1xuICAgIGlmICghZ2xvYmFsLlNldClcbiAgICAgIGdsb2JhbC5TZXQgPSBTZXQ7XG4gICAgdmFyIHNldFByb3RvdHlwZSA9IGdsb2JhbC5TZXQucHJvdG90eXBlO1xuICAgIGlmIChzZXRQcm90b3R5cGUudmFsdWVzKSB7XG4gICAgICBtYXliZUFkZEl0ZXJhdG9yKHNldFByb3RvdHlwZSwgc2V0UHJvdG90eXBlLnZhbHVlcywgU3ltYm9sKTtcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IoT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyBnbG9iYWwuU2V0KCkudmFsdWVzKCkpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LCBTeW1ib2wpO1xuICAgIH1cbiAgfVxuICByZWdpc3RlclBvbHlmaWxsKHBvbHlmaWxsU2V0KTtcbiAgcmV0dXJuIHtcbiAgICBnZXQgU2V0KCkge1xuICAgICAgcmV0dXJuIFNldDtcbiAgICB9LFxuICAgIGdldCBwb2x5ZmlsbFNldCgpIHtcbiAgICAgIHJldHVybiBwb2x5ZmlsbFNldDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TZXQuanNcIiArICcnKTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcC5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXAuanNcIjtcbiAgdmFyIGxlbiA9IDA7XG4gIGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgICBsZW4gKz0gMjtcbiAgICBpZiAobGVuID09PSAyKSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG4gIHZhciAkX19kZWZhdWx0ID0gYXNhcDtcbiAgdmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG4gIHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIHZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG4gIGZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgICB9O1xuICB9XG4gIHZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuICAgICAgY2FsbGJhY2soYXJnKTtcbiAgICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBsZW4gPSAwO1xuICB9XG4gIHZhciBzY2hlZHVsZUZsdXNoO1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xuICB9IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfSBlbHNlIGlmIChpc1dvcmtlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbiAgcmV0dXJuIHtnZXQgZGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiAkX19kZWZhdWx0O1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlLmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2UuanNcIjtcbiAgdmFyIGFzeW5jID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcC5qc1wiKS5kZWZhdWx0O1xuICB2YXIgcmVnaXN0ZXJQb2x5ZmlsbCA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlscy5qc1wiKS5yZWdpc3RlclBvbHlmaWxsO1xuICB2YXIgcHJvbWlzZVJhdyA9IHt9O1xuICBmdW5jdGlvbiBpc1Byb21pc2UoeCkge1xuICAgIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4LnN0YXR1c18gIT09IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBpZFJlc29sdmVIYW5kbGVyKHgpIHtcbiAgICByZXR1cm4geDtcbiAgfVxuICBmdW5jdGlvbiBpZFJlamVjdEhhbmRsZXIoeCkge1xuICAgIHRocm93IHg7XG4gIH1cbiAgZnVuY3Rpb24gY2hhaW4ocHJvbWlzZSkge1xuICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMV0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzFdIDogaWRSZXNvbHZlSGFuZGxlcjtcbiAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMl0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzJdIDogaWRSZWplY3RIYW5kbGVyO1xuICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHByb21pc2UuY29uc3RydWN0b3IpO1xuICAgIHN3aXRjaCAocHJvbWlzZS5zdGF0dXNfKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgY2FzZSAwOlxuICAgICAgICBwcm9taXNlLm9uUmVzb2x2ZV8ucHVzaChvblJlc29sdmUsIGRlZmVycmVkKTtcbiAgICAgICAgcHJvbWlzZS5vblJlamVjdF8ucHVzaChvblJlamVjdCwgZGVmZXJyZWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgKzE6XG4gICAgICAgIHByb21pc2VFbnF1ZXVlKHByb21pc2UudmFsdWVfLCBbb25SZXNvbHZlLCBkZWZlcnJlZF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgLTE6XG4gICAgICAgIHByb21pc2VFbnF1ZXVlKHByb21pc2UudmFsdWVfLCBbb25SZWplY3QsIGRlZmVycmVkXSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZWZlcnJlZChDKSB7XG4gICAgaWYgKHRoaXMgPT09ICRQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IHByb21pc2VJbml0KG5ldyAkUHJvbWlzZShwcm9taXNlUmF3KSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlOiBwcm9taXNlLFxuICAgICAgICByZXNvbHZlOiAoZnVuY3Rpb24oeCkge1xuICAgICAgICAgIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpO1xuICAgICAgICB9KSxcbiAgICAgICAgcmVqZWN0OiAoZnVuY3Rpb24ocikge1xuICAgICAgICAgIHByb21pc2VSZWplY3QocHJvbWlzZSwgcik7XG4gICAgICAgIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBDKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICByZXN1bHQucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVNldChwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCBvblJlc29sdmUsIG9uUmVqZWN0KSB7XG4gICAgcHJvbWlzZS5zdGF0dXNfID0gc3RhdHVzO1xuICAgIHByb21pc2UudmFsdWVfID0gdmFsdWU7XG4gICAgcHJvbWlzZS5vblJlc29sdmVfID0gb25SZXNvbHZlO1xuICAgIHByb21pc2Uub25SZWplY3RfID0gb25SZWplY3Q7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZUluaXQocHJvbWlzZSkge1xuICAgIHJldHVybiBwcm9taXNlU2V0KHByb21pc2UsIDAsIHVuZGVmaW5lZCwgW10sIFtdKTtcbiAgfVxuICB2YXIgUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICBpZiAocmVzb2x2ZXIgPT09IHByb21pc2VSYXcpXG4gICAgICByZXR1cm47XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgdmFyIHByb21pc2UgPSBwcm9taXNlSW5pdCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgcmVzb2x2ZXIoKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCk7XG4gICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgcHJvbWlzZVJlamVjdChwcm9taXNlLCByKTtcbiAgICAgIH0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KHByb21pc2UsIGUpO1xuICAgIH1cbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoUHJvbWlzZSwge1xuICAgIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0KTtcbiAgICB9LFxuICAgIHRoZW46IGZ1bmN0aW9uKG9uUmVzb2x2ZSwgb25SZWplY3QpIHtcbiAgICAgIGlmICh0eXBlb2Ygb25SZXNvbHZlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICBvblJlc29sdmUgPSBpZFJlc29sdmVIYW5kbGVyO1xuICAgICAgaWYgKHR5cGVvZiBvblJlamVjdCAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgb25SZWplY3QgPSBpZFJlamVjdEhhbmRsZXI7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIGNoYWluKHRoaXMsIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgeCA9IHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpO1xuICAgICAgICByZXR1cm4geCA9PT0gdGhhdCA/IG9uUmVqZWN0KG5ldyBUeXBlRXJyb3IpIDogaXNQcm9taXNlKHgpID8geC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIDogb25SZXNvbHZlKHgpO1xuICAgICAgfSwgb25SZWplY3QpO1xuICAgIH1cbiAgfSwge1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh0aGlzID09PSAkUHJvbWlzZSkge1xuICAgICAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2VTZXQobmV3ICRQcm9taXNlKHByb21pc2VSYXcpLCArMSwgeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIGlmICh0aGlzID09PSAkUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVNldChuZXcgJFByb21pc2UocHJvbWlzZVJhdyksIC0xLCByKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhbGw6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB2YXIgcmVzb2x1dGlvbnMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBjb3VudCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUodmFsdWVzW2ldKS50aGVuKGZ1bmN0aW9uKGksIHgpIHtcbiAgICAgICAgICAgICAgcmVzb2x1dGlvbnNbaV0gPSB4O1xuICAgICAgICAgICAgICBpZiAoLS1jb3VudCA9PT0gMClcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgICAgIH0uYmluZCh1bmRlZmluZWQsIGkpLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgcmFjZTogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5yZXNvbHZlKHZhbHVlc1tpXSkudGhlbigoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4KTtcbiAgICAgICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9KTtcbiAgdmFyICRQcm9taXNlID0gUHJvbWlzZTtcbiAgdmFyICRQcm9taXNlUmVqZWN0ID0gJFByb21pc2UucmVqZWN0O1xuICBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgKzEsIHgsIHByb21pc2Uub25SZXNvbHZlXyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlamVjdChwcm9taXNlLCByKSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgLTEsIHIsIHByb21pc2Uub25SZWplY3RfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRG9uZShwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCByZWFjdGlvbnMpIHtcbiAgICBpZiAocHJvbWlzZS5zdGF0dXNfICE9PSAwKVxuICAgICAgcmV0dXJuO1xuICAgIHByb21pc2VFbnF1ZXVlKHZhbHVlLCByZWFjdGlvbnMpO1xuICAgIHByb21pc2VTZXQocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZUVucXVldWUodmFsdWUsIHRhc2tzKSB7XG4gICAgYXN5bmMoKGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBwcm9taXNlSGFuZGxlKHZhbHVlLCB0YXNrc1tpXSwgdGFza3NbaSArIDFdKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZUhhbmRsZSh2YWx1ZSwgaGFuZGxlciwgZGVmZXJyZWQpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZGVmZXJyZWQucHJvbWlzZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIGVsc2UgaWYgKGlzUHJvbWlzZShyZXN1bHQpKVxuICAgICAgICBjaGFpbihyZXN1bHQsIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICBlbHNlXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgfVxuICB2YXIgdGhlbmFibGVTeW1ib2wgPSAnQEB0aGVuYWJsZSc7XG4gIGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgICByZXR1cm4geCAmJiAodHlwZW9mIHggPT09ICdvYmplY3QnIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KSB7XG4gICAgaWYgKCFpc1Byb21pc2UoeCkgJiYgaXNPYmplY3QoeCkpIHtcbiAgICAgIHZhciB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhlbiA9IHgudGhlbjtcbiAgICAgIH0gY2F0Y2ggKHIpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZVJlamVjdC5jYWxsKGNvbnN0cnVjdG9yLCByKTtcbiAgICAgICAgeFt0aGVuYWJsZVN5bWJvbF0gPSBwcm9taXNlO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcCA9IHhbdGhlbmFibGVTeW1ib2xdO1xuICAgICAgICBpZiAocCkge1xuICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoZW4uY2FsbCh4LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICAgIH0gY2F0Y2ggKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKGdsb2JhbCkge1xuICAgIGlmICghZ2xvYmFsLlByb21pc2UpXG4gICAgICBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbFByb21pc2UpO1xuICByZXR1cm4ge1xuICAgIGdldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsUHJvbWlzZTtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlLmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdJdGVyYXRvci5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fMjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nSXRlcmF0b3IuanNcIjtcbiAgdmFyICRfXzAgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiksXG4gICAgICBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCA9ICRfXzAuY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QsXG4gICAgICBpc09iamVjdCA9ICRfXzAuaXNPYmplY3Q7XG4gIHZhciB0b1Byb3BlcnR5ID0gJHRyYWNldXJSdW50aW1lLnRvUHJvcGVydHk7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciBpdGVyYXRlZFN0cmluZyA9IFN5bWJvbCgnaXRlcmF0ZWRTdHJpbmcnKTtcbiAgdmFyIHN0cmluZ0l0ZXJhdG9yTmV4dEluZGV4ID0gU3ltYm9sKCdzdHJpbmdJdGVyYXRvck5leHRJbmRleCcpO1xuICB2YXIgU3RyaW5nSXRlcmF0b3IgPSBmdW5jdGlvbiBTdHJpbmdJdGVyYXRvcigpIHt9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShTdHJpbmdJdGVyYXRvciwgKCRfXzIgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzIsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG8gPSB0aGlzO1xuICAgICAgaWYgKCFpc09iamVjdChvKSB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvLCBpdGVyYXRlZFN0cmluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBtdXN0IGJlIGEgU3RyaW5nSXRlcmF0b3Igb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICB2YXIgcyA9IG9bdG9Qcm9wZXJ0eShpdGVyYXRlZFN0cmluZyldO1xuICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHZhciBwb3NpdGlvbiA9IG9bdG9Qcm9wZXJ0eShzdHJpbmdJdGVyYXRvck5leHRJbmRleCldO1xuICAgICAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICAgICAgaWYgKHBvc2l0aW9uID49IGxlbikge1xuICAgICAgICBvW3RvUHJvcGVydHkoaXRlcmF0ZWRTdHJpbmcpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgZmlyc3QgPSBzLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgICAgdmFyIHJlc3VsdFN0cmluZztcbiAgICAgIGlmIChmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBwb3NpdGlvbiArIDEgPT09IGxlbikge1xuICAgICAgICByZXN1bHRTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGZpcnN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBzZWNvbmQgPSBzLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKTtcbiAgICAgICAgaWYgKHNlY29uZCA8IDB4REMwMCB8fCBzZWNvbmQgPiAweERGRkYpIHtcbiAgICAgICAgICByZXN1bHRTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGZpcnN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGZpcnN0KSArIFN0cmluZy5mcm9tQ2hhckNvZGUoc2Vjb25kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb1t0b1Byb3BlcnR5KHN0cmluZ0l0ZXJhdG9yTmV4dEluZGV4KV0gPSBwb3NpdGlvbiArIHJlc3VsdFN0cmluZy5sZW5ndGg7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QocmVzdWx0U3RyaW5nLCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzIsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksICRfXzIpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yKHN0cmluZykge1xuICAgIHZhciBzID0gU3RyaW5nKHN0cmluZyk7XG4gICAgdmFyIGl0ZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShTdHJpbmdJdGVyYXRvci5wcm90b3R5cGUpO1xuICAgIGl0ZXJhdG9yW3RvUHJvcGVydHkoaXRlcmF0ZWRTdHJpbmcpXSA9IHM7XG4gICAgaXRlcmF0b3JbdG9Qcm9wZXJ0eShzdHJpbmdJdGVyYXRvck5leHRJbmRleCldID0gMDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHtnZXQgY3JlYXRlU3RyaW5nSXRlcmF0b3IoKSB7XG4gICAgICByZXR1cm4gY3JlYXRlU3RyaW5nSXRlcmF0b3I7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZy5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmcuanNcIjtcbiAgdmFyIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ0l0ZXJhdG9yLmpzXCIpLmNyZWF0ZVN0cmluZ0l0ZXJhdG9yO1xuICB2YXIgJF9fMSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlscy5qc1wiKSxcbiAgICAgIG1heWJlQWRkRnVuY3Rpb25zID0gJF9fMS5tYXliZUFkZEZ1bmN0aW9ucyxcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IgPSAkX18xLm1heWJlQWRkSXRlcmF0b3IsXG4gICAgICByZWdpc3RlclBvbHlmaWxsID0gJF9fMS5yZWdpc3RlclBvbHlmaWxsO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmIChzZWFyY2ggJiYgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAocG9zICE9IHBvcykge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICBpZiAoc2VhcmNoTGVuZ3RoICsgc3RhcnQgPiBzdHJpbmdMZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgIT0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIG4gPSBjb3VudCA/IE51bWJlcihjb3VudCkgOiAwO1xuICAgIGlmIChpc05hTihuKSkge1xuICAgICAgbiA9IDA7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gY29kZVBvaW50QXQocG9zaXRpb24pIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc2l6ZSA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2l6ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgIHZhciBzZWNvbmQ7XG4gICAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgc2l6ZSA+IGluZGV4ICsgMSkge1xuICAgICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcbiAgICAgICAgcmV0dXJuIChmaXJzdCAtIDB4RDgwMCkgKiAweDQwMCArIHNlY29uZCAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuICBmdW5jdGlvbiByYXcoY2FsbHNpdGUpIHtcbiAgICB2YXIgcmF3ID0gY2FsbHNpdGUucmF3O1xuICAgIHZhciBsZW4gPSByYXcubGVuZ3RoID4+PiAwO1xuICAgIGlmIChsZW4gPT09IDApXG4gICAgICByZXR1cm4gJyc7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHMgKz0gcmF3W2ldO1xuICAgICAgaWYgKGkgKyAxID09PSBsZW4pXG4gICAgICAgIHJldHVybiBzO1xuICAgICAgcyArPSBhcmd1bWVudHNbKytpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcbiAgICB2YXIgY29kZVVuaXRzID0gW107XG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgaGlnaFN1cnJvZ2F0ZTtcbiAgICB2YXIgbG93U3Vycm9nYXRlO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgaWYgKCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IGNvZGVQb2ludCA8IDAgfHwgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgZmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQpIHtcbiAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuICAgICAgICBsb3dTdXJyb2dhdGUgPSAoY29kZVBvaW50ICUgMHg0MDApICsgMHhEQzAwO1xuICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yKCkge1xuICAgIHZhciBvID0gJHRyYWNldXJSdW50aW1lLmNoZWNrT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgIHZhciBzID0gU3RyaW5nKG8pO1xuICAgIHJldHVybiBjcmVhdGVTdHJpbmdJdGVyYXRvcihzKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhnbG9iYWwpIHtcbiAgICB2YXIgU3RyaW5nID0gZ2xvYmFsLlN0cmluZztcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdlbmRzV2l0aCcsIGVuZHNXaXRoLCAnaW5jbHVkZXMnLCBpbmNsdWRlcywgJ3JlcGVhdCcsIHJlcGVhdCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoXSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gICAgbWF5YmVBZGRJdGVyYXRvcihTdHJpbmcucHJvdG90eXBlLCBzdHJpbmdQcm90b3R5cGVJdGVyYXRvciwgU3ltYm9sKTtcbiAgfVxuICByZWdpc3RlclBvbHlmaWxsKHBvbHlmaWxsU3RyaW5nKTtcbiAgcmV0dXJuIHtcbiAgICBnZXQgc3RhcnRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBzdGFydHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGVuZHNXaXRoKCkge1xuICAgICAgcmV0dXJuIGVuZHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGluY2x1ZGVzKCkge1xuICAgICAgcmV0dXJuIGluY2x1ZGVzO1xuICAgIH0sXG4gICAgZ2V0IHJlcGVhdCgpIHtcbiAgICAgIHJldHVybiByZXBlYXQ7XG4gICAgfSxcbiAgICBnZXQgY29kZVBvaW50QXQoKSB7XG4gICAgICByZXR1cm4gY29kZVBvaW50QXQ7XG4gICAgfSxcbiAgICBnZXQgcmF3KCkge1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9LFxuICAgIGdldCBmcm9tQ29kZVBvaW50KCkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQ7XG4gICAgfSxcbiAgICBnZXQgc3RyaW5nUHJvdG90eXBlSXRlcmF0b3IoKSB7XG4gICAgICByZXR1cm4gc3RyaW5nUHJvdG90eXBlSXRlcmF0b3I7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxTdHJpbmcoKSB7XG4gICAgICByZXR1cm4gcG9seWZpbGxTdHJpbmc7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nLmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yLmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciAkX18yO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yLmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgdG9PYmplY3QgPSAkX18wLnRvT2JqZWN0LFxuICAgICAgdG9VaW50MzIgPSAkX18wLnRvVWludDMyLFxuICAgICAgY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QgPSAkX18wLmNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0O1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTID0gMTtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTID0gMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyA9IDM7XG4gIHZhciBBcnJheUl0ZXJhdG9yID0gZnVuY3Rpb24gQXJyYXlJdGVyYXRvcigpIHt9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShBcnJheUl0ZXJhdG9yLCAoJF9fMiA9IHt9LCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fMiwgXCJuZXh0XCIsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0b09iamVjdCh0aGlzKTtcbiAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XztcbiAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGlzIG5vdCBhbiBBcnJheUl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XztcbiAgICAgIHZhciBpdGVtS2luZCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF87XG4gICAgICB2YXIgbGVuZ3RoID0gdG9VaW50MzIoYXJyYXkubGVuZ3RoKTtcbiAgICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBJbmZpbml0eTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IGluZGV4ICsgMTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGFycmF5W2luZGV4XSwgZmFsc2UpO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KFtpbmRleCwgYXJyYXlbaW5kZXhdXSwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGluZGV4LCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzIsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksICRfXzIpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5SXRlcmF0b3IoYXJyYXksIGtpbmQpIHtcbiAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoYXJyYXkpO1xuICAgIHZhciBpdGVyYXRvciA9IG5ldyBBcnJheUl0ZXJhdG9yO1xuICAgIGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XyA9IG9iamVjdDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IDA7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXyA9IGtpbmQ7XG4gICAgcmV0dXJuIGl0ZXJhdG9yO1xuICB9XG4gIGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKTtcbiAgfVxuICBmdW5jdGlvbiBrZXlzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyk7XG4gIH1cbiAgZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBlbnRyaWVzKCkge1xuICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgfSxcbiAgICBnZXQga2V5cygpIHtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheS5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheS5qc1wiO1xuICB2YXIgJF9fMCA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yLmpzXCIpLFxuICAgICAgZW50cmllcyA9ICRfXzAuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX18wLmtleXMsXG4gICAgICB2YWx1ZXMgPSAkX18wLnZhbHVlcztcbiAgdmFyICRfXzEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiksXG4gICAgICBjaGVja0l0ZXJhYmxlID0gJF9fMS5jaGVja0l0ZXJhYmxlLFxuICAgICAgaXNDYWxsYWJsZSA9ICRfXzEuaXNDYWxsYWJsZSxcbiAgICAgIGlzQ29uc3RydWN0b3IgPSAkX18xLmlzQ29uc3RydWN0b3IsXG4gICAgICBtYXliZUFkZEZ1bmN0aW9ucyA9ICRfXzEubWF5YmVBZGRGdW5jdGlvbnMsXG4gICAgICBtYXliZUFkZEl0ZXJhdG9yID0gJF9fMS5tYXliZUFkZEl0ZXJhdG9yLFxuICAgICAgcmVnaXN0ZXJQb2x5ZmlsbCA9ICRfXzEucmVnaXN0ZXJQb2x5ZmlsbCxcbiAgICAgIHRvSW50ZWdlciA9ICRfXzEudG9JbnRlZ2VyLFxuICAgICAgdG9MZW5ndGggPSAkX18xLnRvTGVuZ3RoLFxuICAgICAgdG9PYmplY3QgPSAkX18xLnRvT2JqZWN0O1xuICBmdW5jdGlvbiBmcm9tKGFyckxpa2UpIHtcbiAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBpdGVtcyA9IHRvT2JqZWN0KGFyckxpa2UpO1xuICAgIHZhciBtYXBwaW5nID0gbWFwRm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIGFycixcbiAgICAgICAgbGVuO1xuICAgIGlmIChtYXBwaW5nICYmICFpc0NhbGxhYmxlKG1hcEZuKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChjaGVja0l0ZXJhYmxlKGl0ZW1zKSkge1xuICAgICAgYXJyID0gaXNDb25zdHJ1Y3RvcihDKSA/IG5ldyBDKCkgOiBbXTtcbiAgICAgIGZvciAodmFyICRfXzIgPSBpdGVtc1skdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShTeW1ib2wuaXRlcmF0b3IpXSgpLFxuICAgICAgICAgICRfXzM7ICEoJF9fMyA9ICRfXzIubmV4dCgpKS5kb25lOyApIHtcbiAgICAgICAgdmFyIGl0ZW0gPSAkX18zLnZhbHVlO1xuICAgICAgICB7XG4gICAgICAgICAgaWYgKG1hcHBpbmcpIHtcbiAgICAgICAgICAgIGFycltrXSA9IG1hcEZuLmNhbGwodGhpc0FyZywgaXRlbSwgayk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFycltrXSA9IGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXJyLmxlbmd0aCA9IGs7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICBsZW4gPSB0b0xlbmd0aChpdGVtcy5sZW5ndGgpO1xuICAgIGFyciA9IGlzQ29uc3RydWN0b3IoQykgPyBuZXcgQyhsZW4pIDogbmV3IEFycmF5KGxlbik7XG4gICAgZm9yICg7IGsgPCBsZW47IGsrKykge1xuICAgICAgaWYgKG1hcHBpbmcpIHtcbiAgICAgICAgYXJyW2tdID0gdHlwZW9mIHRoaXNBcmcgPT09ICd1bmRlZmluZWQnID8gbWFwRm4oaXRlbXNba10sIGspIDogbWFwRm4uY2FsbCh0aGlzQXJnLCBpdGVtc1trXSwgayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJba10gPSBpdGVtc1trXTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIG9mKCkge1xuICAgIGZvciAodmFyIGl0ZW1zID0gW10sXG4gICAgICAgICRfXzQgPSAwOyAkX180IDwgYXJndW1lbnRzLmxlbmd0aDsgJF9fNCsrKVxuICAgICAgaXRlbXNbJF9fNF0gPSBhcmd1bWVudHNbJF9fNF07XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBpdGVtcy5sZW5ndGg7XG4gICAgdmFyIGFyciA9IGlzQ29uc3RydWN0b3IoQykgPyBuZXcgQyhsZW4pIDogbmV3IEFycmF5KGxlbik7XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBsZW47IGsrKykge1xuICAgICAgYXJyW2tdID0gaXRlbXNba107XG4gICAgfVxuICAgIGFyci5sZW5ndGggPSBsZW47XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBmaWxsKHZhbHVlKSB7XG4gICAgdmFyIHN0YXJ0ID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gICAgdmFyIGVuZCA9IGFyZ3VtZW50c1syXTtcbiAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyk7XG4gICAgdmFyIGxlbiA9IHRvTGVuZ3RoKG9iamVjdC5sZW5ndGgpO1xuICAgIHZhciBmaWxsU3RhcnQgPSB0b0ludGVnZXIoc3RhcnQpO1xuICAgIHZhciBmaWxsRW5kID0gZW5kICE9PSB1bmRlZmluZWQgPyB0b0ludGVnZXIoZW5kKSA6IGxlbjtcbiAgICBmaWxsU3RhcnQgPSBmaWxsU3RhcnQgPCAwID8gTWF0aC5tYXgobGVuICsgZmlsbFN0YXJ0LCAwKSA6IE1hdGgubWluKGZpbGxTdGFydCwgbGVuKTtcbiAgICBmaWxsRW5kID0gZmlsbEVuZCA8IDAgPyBNYXRoLm1heChsZW4gKyBmaWxsRW5kLCAwKSA6IE1hdGgubWluKGZpbGxFbmQsIGxlbik7XG4gICAgd2hpbGUgKGZpbGxTdGFydCA8IGZpbGxFbmQpIHtcbiAgICAgIG9iamVjdFtmaWxsU3RhcnRdID0gdmFsdWU7XG4gICAgICBmaWxsU3RhcnQrKztcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBmaW5kKHByZWRpY2F0ZSkge1xuICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzFdO1xuICAgIHJldHVybiBmaW5kSGVscGVyKHRoaXMsIHByZWRpY2F0ZSwgdGhpc0FyZyk7XG4gIH1cbiAgZnVuY3Rpb24gZmluZEluZGV4KHByZWRpY2F0ZSkge1xuICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzFdO1xuICAgIHJldHVybiBmaW5kSGVscGVyKHRoaXMsIHByZWRpY2F0ZSwgdGhpc0FyZywgdHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gZmluZEhlbHBlcihzZWxmLCBwcmVkaWNhdGUpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1syXTtcbiAgICB2YXIgcmV0dXJuSW5kZXggPSBhcmd1bWVudHNbM10gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzNdIDogZmFsc2U7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHNlbGYpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChvYmplY3QubGVuZ3RoKTtcbiAgICBpZiAoIWlzQ2FsbGFibGUocHJlZGljYXRlKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyBpIDogdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5JbmRleCA/IC0xIDogdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQXJyYXkoZ2xvYmFsKSB7XG4gICAgdmFyICRfXzUgPSBnbG9iYWwsXG4gICAgICAgIEFycmF5ID0gJF9fNS5BcnJheSxcbiAgICAgICAgT2JqZWN0ID0gJF9fNS5PYmplY3QsXG4gICAgICAgIFN5bWJvbCA9ICRfXzUuU3ltYm9sO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKEFycmF5LnByb3RvdHlwZSwgWydlbnRyaWVzJywgZW50cmllcywgJ2tleXMnLCBrZXlzLCAndmFsdWVzJywgdmFsdWVzLCAnZmlsbCcsIGZpbGwsICdmaW5kJywgZmluZCwgJ2ZpbmRJbmRleCcsIGZpbmRJbmRleF0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKEFycmF5LCBbJ2Zyb20nLCBmcm9tLCAnb2YnLCBvZl0pO1xuICAgIG1heWJlQWRkSXRlcmF0b3IoQXJyYXkucHJvdG90eXBlLCB2YWx1ZXMsIFN5bWJvbCk7XG4gICAgbWF5YmVBZGRJdGVyYXRvcihPYmplY3QuZ2V0UHJvdG90eXBlT2YoW10udmFsdWVzKCkpLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIFN5bWJvbCk7XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbEFycmF5KTtcbiAgcmV0dXJuIHtcbiAgICBnZXQgZnJvbSgpIHtcbiAgICAgIHJldHVybiBmcm9tO1xuICAgIH0sXG4gICAgZ2V0IG9mKCkge1xuICAgICAgcmV0dXJuIG9mO1xuICAgIH0sXG4gICAgZ2V0IGZpbGwoKSB7XG4gICAgICByZXR1cm4gZmlsbDtcbiAgICB9LFxuICAgIGdldCBmaW5kKCkge1xuICAgICAgcmV0dXJuIGZpbmQ7XG4gICAgfSxcbiAgICBnZXQgZmluZEluZGV4KCkge1xuICAgICAgcmV0dXJuIGZpbmRJbmRleDtcbiAgICB9LFxuICAgIGdldCBwb2x5ZmlsbEFycmF5KCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsQXJyYXk7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXkuanNcIiArICcnKTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL09iamVjdC5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9PYmplY3QuanNcIjtcbiAgdmFyICRfXzAgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiksXG4gICAgICBtYXliZUFkZEZ1bmN0aW9ucyA9ICRfXzAubWF5YmVBZGRGdW5jdGlvbnMsXG4gICAgICByZWdpc3RlclBvbHlmaWxsID0gJF9fMC5yZWdpc3RlclBvbHlmaWxsO1xuICB2YXIgJF9fMSA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGRlZmluZVByb3BlcnR5ID0gJF9fMS5kZWZpbmVQcm9wZXJ0eSxcbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRfXzEuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAgICAgZ2V0T3duUHJvcGVydHlOYW1lcyA9ICRfXzEuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgICAgIGlzUHJpdmF0ZU5hbWUgPSAkX18xLmlzUHJpdmF0ZU5hbWUsXG4gICAgICBrZXlzID0gJF9fMS5rZXlzO1xuICBmdW5jdGlvbiBpcyhsZWZ0LCByaWdodCkge1xuICAgIGlmIChsZWZ0ID09PSByaWdodClcbiAgICAgIHJldHVybiBsZWZ0ICE9PSAwIHx8IDEgLyBsZWZ0ID09PSAxIC8gcmlnaHQ7XG4gICAgcmV0dXJuIGxlZnQgIT09IGxlZnQgJiYgcmlnaHQgIT09IHJpZ2h0O1xuICB9XG4gIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIHZhciBwcm9wcyA9IHNvdXJjZSA9PSBudWxsID8gW10gOiBrZXlzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBwcm9wc1twXTtcbiAgICAgICAgaWYgKGlzUHJpdmF0ZU5hbWUobmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIHRhcmdldFtuYW1lXSA9IHNvdXJjZVtuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBwcm9wcyA9IGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICB2YXIgcCxcbiAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5hbWUgPSBwcm9wc1twXTtcbiAgICAgIGlmIChpc1ByaXZhdGVOYW1lKG5hbWUpKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wc1twXSk7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BzW3BdLCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChnbG9iYWwpIHtcbiAgICB2YXIgT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhPYmplY3QsIFsnYXNzaWduJywgYXNzaWduLCAnaXMnLCBpcywgJ21peGluJywgbWl4aW5dKTtcbiAgfVxuICByZWdpc3RlclBvbHlmaWxsKHBvbHlmaWxsT2JqZWN0KTtcbiAgcmV0dXJuIHtcbiAgICBnZXQgaXMoKSB7XG4gICAgICByZXR1cm4gaXM7XG4gICAgfSxcbiAgICBnZXQgYXNzaWduKCkge1xuICAgICAgcmV0dXJuIGFzc2lnbjtcbiAgICB9LFxuICAgIGdldCBtaXhpbigpIHtcbiAgICAgIHJldHVybiBtaXhpbjtcbiAgICB9LFxuICAgIGdldCBwb2x5ZmlsbE9iamVjdCgpIHtcbiAgICAgIHJldHVybiBwb2x5ZmlsbE9iamVjdDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9PYmplY3QuanNcIiArICcnKTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL051bWJlci5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9OdW1iZXIuanNcIjtcbiAgdmFyICRfXzAgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiksXG4gICAgICBpc051bWJlciA9ICRfXzAuaXNOdW1iZXIsXG4gICAgICBtYXliZUFkZENvbnN0cyA9ICRfXzAubWF5YmVBZGRDb25zdHMsXG4gICAgICBtYXliZUFkZEZ1bmN0aW9ucyA9ICRfXzAubWF5YmVBZGRGdW5jdGlvbnMsXG4gICAgICByZWdpc3RlclBvbHlmaWxsID0gJF9fMC5yZWdpc3RlclBvbHlmaWxsLFxuICAgICAgdG9JbnRlZ2VyID0gJF9fMC50b0ludGVnZXI7XG4gIHZhciAkYWJzID0gTWF0aC5hYnM7XG4gIHZhciAkaXNGaW5pdGUgPSBpc0Zpbml0ZTtcbiAgdmFyICRpc05hTiA9IGlzTmFOO1xuICB2YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBNSU5fU0FGRV9JTlRFR0VSID0gLU1hdGgucG93KDIsIDUzKSArIDE7XG4gIHZhciBFUFNJTE9OID0gTWF0aC5wb3coMiwgLTUyKTtcbiAgZnVuY3Rpb24gTnVtYmVySXNGaW5pdGUobnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKG51bWJlcikgJiYgJGlzRmluaXRlKG51bWJlcik7XG4gIH1cbiAgO1xuICBmdW5jdGlvbiBpc0ludGVnZXIobnVtYmVyKSB7XG4gICAgcmV0dXJuIE51bWJlcklzRmluaXRlKG51bWJlcikgJiYgdG9JbnRlZ2VyKG51bWJlcikgPT09IG51bWJlcjtcbiAgfVxuICBmdW5jdGlvbiBOdW1iZXJJc05hTihudW1iZXIpIHtcbiAgICByZXR1cm4gaXNOdW1iZXIobnVtYmVyKSAmJiAkaXNOYU4obnVtYmVyKTtcbiAgfVxuICA7XG4gIGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKSB7XG4gICAgaWYgKE51bWJlcklzRmluaXRlKG51bWJlcikpIHtcbiAgICAgIHZhciBpbnRlZ3JhbCA9IHRvSW50ZWdlcihudW1iZXIpO1xuICAgICAgaWYgKGludGVncmFsID09PSBudW1iZXIpXG4gICAgICAgIHJldHVybiAkYWJzKGludGVncmFsKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxOdW1iZXIoZ2xvYmFsKSB7XG4gICAgdmFyIE51bWJlciA9IGdsb2JhbC5OdW1iZXI7XG4gICAgbWF5YmVBZGRDb25zdHMoTnVtYmVyLCBbJ01BWF9TQUZFX0lOVEVHRVInLCBNQVhfU0FGRV9JTlRFR0VSLCAnTUlOX1NBRkVfSU5URUdFUicsIE1JTl9TQUZFX0lOVEVHRVIsICdFUFNJTE9OJywgRVBTSUxPTl0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKE51bWJlciwgWydpc0Zpbml0ZScsIE51bWJlcklzRmluaXRlLCAnaXNJbnRlZ2VyJywgaXNJbnRlZ2VyLCAnaXNOYU4nLCBOdW1iZXJJc05hTiwgJ2lzU2FmZUludGVnZXInLCBpc1NhZmVJbnRlZ2VyXSk7XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbE51bWJlcik7XG4gIHJldHVybiB7XG4gICAgZ2V0IE1BWF9TQUZFX0lOVEVHRVIoKSB7XG4gICAgICByZXR1cm4gTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9LFxuICAgIGdldCBNSU5fU0FGRV9JTlRFR0VSKCkge1xuICAgICAgcmV0dXJuIE1JTl9TQUZFX0lOVEVHRVI7XG4gICAgfSxcbiAgICBnZXQgRVBTSUxPTigpIHtcbiAgICAgIHJldHVybiBFUFNJTE9OO1xuICAgIH0sXG4gICAgZ2V0IGlzRmluaXRlKCkge1xuICAgICAgcmV0dXJuIE51bWJlcklzRmluaXRlO1xuICAgIH0sXG4gICAgZ2V0IGlzSW50ZWdlcigpIHtcbiAgICAgIHJldHVybiBpc0ludGVnZXI7XG4gICAgfSxcbiAgICBnZXQgaXNOYU4oKSB7XG4gICAgICByZXR1cm4gTnVtYmVySXNOYU47XG4gICAgfSxcbiAgICBnZXQgaXNTYWZlSW50ZWdlcigpIHtcbiAgICAgIHJldHVybiBpc1NhZmVJbnRlZ2VyO1xuICAgIH0sXG4gICAgZ2V0IHBvbHlmaWxsTnVtYmVyKCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsTnVtYmVyO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL051bWJlci5qc1wiICsgJycpO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzLmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxscy5qc1wiO1xuICB2YXIgcG9seWZpbGxBbGwgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIikucG9seWZpbGxBbGw7XG4gIHBvbHlmaWxsQWxsKFJlZmxlY3QuZ2xvYmFsKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbEFsbChnbG9iYWwpO1xuICB9O1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHMuanNcIiArICcnKTtcbiIsIi8vIDJkIHZlY3RvcnNcbnZhciBWZWN0b3IgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy54ID0gIWlzTmFOKHgpID8geCA6IDA7XG4gICAgdGhpcy55ID0gIWlzTmFOKHkpID8geSA6IDA7XG59O1xuXG4vLyBzdGF0aWMgZnVuY3Rpb24gLSByZXR1cm5zIG5ldyB2ZWN0b3JzXG5WZWN0b3IuYWRkID0gZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHYxLnggKyB2Mi54LCB2MS55ICsgdjIueSk7XG59XG5WZWN0b3Iuc3Vic3RyYWN0ID0gZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHYxLnggLSB2Mi54LCB2MS55IC0gdjIueSk7XG59XG5WZWN0b3IubXVsdGlwbHkgPSBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICByZXR1cm4gbmV3IHRoaXModjEueCAqIHYyLngsIHYxLnkgKiB2Mi55KTtcbn1cblZlY3Rvci5kaXN0YW5jZSA9IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgIHZhciB2ID0gdGhpcy5zdWJzdHJhY3QodjIsIHYxKTtcbiAgICByZXR1cm4gdi5tYWduaXR1ZGUoKTtcbn1cblZlY3Rvci5jbG9uZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gbmV3IHRoaXModi54LCB2LnkpO1xufVxuXG4vLyBpbnN0YW5jZSBtZXRob2RzXG5WZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHYpIHtcbiAgICB0aGlzLnggKz0gdi54O1xuICAgIHRoaXMueSArPSB2Lnk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5WZWN0b3IucHJvdG90eXBlLnN1YnN0cmFjdCA9IGZ1bmN0aW9uKHYpIHtcbiAgICB0aGlzLnggLT0gdi54O1xuICAgIHRoaXMueSAtPSB2Lnk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5WZWN0b3IucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLnggKj0gdmFsdWU7XG4gICAgdGhpcy55ICo9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xufVxuVmVjdG9yLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KDEvdmFsdWUpO1xufVxuVmVjdG9yLnByb3RvdHlwZS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubWFnbml0dWRlKCkgPiB2YWx1ZSkge1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZSh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuVmVjdG9yLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbihtdWx0aXBsaWVyKSB7XG4gICAgdmFyIG11bHRpcGxpZXIgPSBtdWx0aXBsaWVyID8gbXVsdGlwbGllciA6IDE7XG4gICAgdmFyIG1hZyA9IHRoaXMubWFnbml0dWRlKCk7XG4gICAgaWYgKG1hZyA9PT0gMCkgeyByZXR1cm4gdGhpczsgfVxuXG4gICAgdGhpcy54ID0gKHRoaXMueCAvIG1hZyk7XG4gICAgdGhpcy55ID0gKHRoaXMueSAvIG1hZyk7XG4gICAgdGhpcy5tdWx0aXBseShtdWx0aXBsaWVyKTtcbiAgICByZXR1cm4gdGhpcztcbn1cblZlY3Rvci5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24odGhldGEpIHtcbiAgICB2YXIgZmluYWxUaGV0YSA9IHRoaXMuZGlyZWN0aW9uKCkgKyB0aGV0YTtcbiAgICB0aGlzLnNldEFuZ2xlKGZpbmFsVGhldGEpO1xufVxuVmVjdG9yLnByb3RvdHlwZS5zZXRBbmdsZSA9IGZ1bmN0aW9uKHRoZXRhKSB7XG4gICAgdmFyIG1hZ25pdHVkZSA9IHRoaXMubWFnbml0dWRlKCk7XG4gICAgdGhpcy5ub3JtYWxpemUoKTtcbiAgICB0aGlzLnggPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdGhpcy55ID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHRoaXMubXVsdGlwbHkobWFnbml0dWRlKTtcbiAgICByZXR1cm4gdGhpcztcbn1cblZlY3Rvci5wcm90b3R5cGUubWFnbml0dWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGh5cCA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsIDIpICsgTWF0aC5wb3codGhpcy55LCAyKSk7XG4gICAgcmV0dXJuIE1hdGguYWJzKGh5cCk7XG59XG5WZWN0b3IucHJvdG90eXBlLmRpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL2F0YW4yXG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xufVxuVmVjdG9yLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLngsIHRoaXMueSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xuIl19
