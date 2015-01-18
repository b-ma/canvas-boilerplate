(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var $__0 = require('./globals'),
    w = $__0.w,
    h = $__0.h;
var Class = require('./lib/class');
var Shape = Class.extend({init: function() {
    this.distance = 100;
    this.angle = 0;
    this.angularVelocity = (Math.PI / 2);
    this.radius = 5;
  }});
var shape;
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
    ctx.translate(w / 2, h / 2);
    ctx.rotate(shape.angle);
    ctx.translate(shape.distance, 0);
    ctx.beginPath();
    ctx.fillStyle = '#ff530d';
    ctx.arc(0, 0, shape.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
};
module.exports = App;


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/app.js
},{"./globals":3,"./lib/class":5}],2:[function(require,module,exports){
"use strict";
var GLOBALS = require('./globals');
var app = require('./app');
var loop = require('./lib/loop');
var gui = require('./helpers/gui');
var $canvas = document.querySelector('#scene');
var ctx = $canvas.getContext('2d');
ctx.canvas.width = GLOBALS.w;
ctx.canvas.height = GLOBALS.h;
app.init();
var options = {
  ctx: ctx,
  buffers: [],
  update: app.update,
  render: app.render,
  fps: GLOBALS.fps,
  gui: gui.model
};
gui.controllers.pause.onChange(function(value) {
  value ? loop.quit() : loop.run(options);
});
loop.run(options);


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/bootstrap.js
},{"./app":1,"./globals":3,"./helpers/gui":4,"./lib/loop":6}],3:[function(require,module,exports){
"use strict";
var GLOBALS = {
  fps: 60,
  w: window.innerWidth,
  h: window.innerHeight
};
module.exports = GLOBALS;


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/globals.js
},{}],4:[function(require,module,exports){
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


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/app/helpers/gui.js
},{"dat-gui":9}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

},{"_process":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
module.exports = require('./vendor/dat.gui');
module.exports.color = require('./vendor/dat.color');


//# sourceURL=/Users/ben/Sites/js/_canvas-boilerplate/node_modules/dat-gui/index.js
},{"./vendor/dat.color":10,"./vendor/dat.gui":11}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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

},{"_process":8,"path":7}]},{},[12,2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmVuL1NpdGVzL2pzL19jYW52YXMtYm9pbGVycGxhdGUvYXBwL2FwcC5qcyIsIi9Vc2Vycy9iZW4vU2l0ZXMvanMvX2NhbnZhcy1ib2lsZXJwbGF0ZS9hcHAvYm9vdHN0cmFwLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL2FwcC9nbG9iYWxzLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL2FwcC9oZWxwZXJzL2d1aS5qcyIsIi9Vc2Vycy9iZW4vU2l0ZXMvanMvX2NhbnZhcy1ib2lsZXJwbGF0ZS9hcHAvbGliL2NsYXNzLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL2FwcC9saWIvbG9vcC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL25vZGVfbW9kdWxlcy9kYXQtZ3VpL2luZGV4LmpzIiwiL1VzZXJzL2Jlbi9TaXRlcy9qcy9fY2FudmFzLWJvaWxlcnBsYXRlL25vZGVfbW9kdWxlcy9kYXQtZ3VpL3ZlbmRvci9kYXQuY29sb3IuanMiLCIvVXNlcnMvYmVuL1NpdGVzL2pzL19jYW52YXMtYm9pbGVycGxhdGUvbm9kZV9tb2R1bGVzL2RhdC1ndWkvdmVuZG9yL2RhdC5ndWkuanMiLCJub2RlX21vZHVsZXMvZXM2aWZ5L25vZGVfbW9kdWxlcy90cmFjZXVyL2Jpbi90cmFjZXVyLXJ1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBLFNB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QUFDO0FBQ1YsV0FBRyxNQUFNLEVBQUksQ0FBQSxxQkFBb0IsQUFBQyxDQUFDLElBQUcsQ0FBQyxDQUFDO01BQzVDO0FBQUEsQUFFQSxTQUFHLE1BQU0sRUFBSSxDQUFBLHFCQUFvQixBQUFDLENBQUMsSUFBRyxDQUFDLENBQUM7SUFDNUMsQUFBQyxDQUFDLElBQUcsQ0FBQyxDQUFDLENBQUM7RUFDWjtBQUVBLEtBQUcsQ0FBRyxVQUFRLEFBQUMsQ0FBRTtBQUNiLHVCQUFtQixBQUFDLENBQUMsSUFBRyxNQUFNLENBQUMsQ0FBQztFQUNwQztBQUFBLEFBQ0osQ0FBQztBQUVELEtBQUssUUFBUSxFQUFJLENBQUEsT0FBTSxFQUFJLEtBQUcsQ0FBQztBQUMvQjs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUFBLEtBQUssUUFBUSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsa0JBQWlCLENBQUMsQ0FB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QUFJLENBQUEsQ0FBQyxTQUFTLEFBQUMsQ0FBRTtBQUU1QixBQUFJLElBQUEsQ0FBQSxZQUFXLENBQUM7QUFFaEIsT0FBTztBQUVMLGFBQVMsQ0FBRyxVQUFTLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRztBQUU1QixBQUFJLFFBQUEsQ0FBQSxFQUFDLEVBQUksQ0FBQSxJQUFHLE1BQU0sQUFBQyxDQUFDLENBQUEsRUFBSSxHQUFDLENBQUMsQ0FBQSxDQUFJLEVBQUEsQ0FBQztBQUUvQixBQUFJLFFBQUEsQ0FBQSxDQUFBLEVBQUksQ0FBQSxDQUFBLEVBQUksR0FBQyxDQUFBLENBQUksQ0FBQSxJQUFHLE1BQU0sQUFBQyxDQUFDLENBQUEsRUFBSSxHQUFDLENBQUMsQ0FBQztBQUNuQyxBQUFJLFFBQUEsQ0FBQSxDQUFBLEVBQUksQ0FBQSxDQUFBLEVBQUksRUFBQyxHQUFFLEVBQUksRUFBQSxDQUFDLENBQUM7QUFDckIsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsQ0FBQSxFQUFJLEVBQUMsR0FBRSxFQUFJLEVBQUMsQ0FBQSxFQUFJLEVBQUEsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsQ0FBQSxFQUFJLEVBQUMsR0FBRSxFQUFJLEVBQUMsQ0FBQyxHQUFFLEVBQUksRUFBQSxDQUFDLEVBQUksRUFBQSxDQUFDLENBQUMsQ0FBQztBQUNuQyxBQUFJLFFBQUEsQ0FBQSxDQUFBLEVBQUksQ0FBQSxDQUNOLENBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDUixFQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUNSLEVBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FDUixFQUFDLENBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDLENBQ1IsRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB7IHcsIGggfSA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xudmFyIENsYXNzID0gcmVxdWlyZSgnLi9saWIvY2xhc3MnKTtcbi8vIHRlc3Qgc2hhcGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBTaGFwZSA9IENsYXNzLmV4dGVuZCh7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGlzdGFuY2UgPSAxMDA7XG4gICAgdGhpcy5hbmdsZSA9IDA7XG4gICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkgPSAoTWF0aC5QSSAvIDIpOyAvLyByYWQvc1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgfVxufSk7XG5cbnZhciBzaGFwZTtcbi8vIEFwcFxudmFyIEFwcCA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgc2hhcGUgPSBuZXcgU2hhcGUoKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uKGR0KSB7XG4gICAgc2hhcGUuYW5nbGUgPSAoc2hhcGUuYW5nbGUgKyBzaGFwZS5hbmd1bGFyVmVsb2NpdHkgKiBkdCkgJSAoTWF0aC5QSSAqIDIpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oY3R4LCBidWZmZXJzLCBkdCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUody8yLCBoLzIpO1xuXG4gICAgY3R4LnJvdGF0ZShzaGFwZS5hbmdsZSk7XG4gICAgY3R4LnRyYW5zbGF0ZShzaGFwZS5kaXN0YW5jZSwgMCk7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjZmY1MzBkJztcbiAgICBjdHguYXJjKDAsIDAsIHNoYXBlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBjdHguZmlsbCgpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiIsInZhciBHTE9CQUxTID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG52YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcbnZhciBsb29wID0gcmVxdWlyZSgnLi9saWIvbG9vcCcpO1xudmFyIGd1aSA9IHJlcXVpcmUoJy4vaGVscGVycy9ndWknKTtcbi8vIGNyZWF0ZSBzY2VuZVxudmFyICRjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2NlbmUnKTtcbnZhciBjdHggPSAkY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmN0eC5jYW52YXMud2lkdGggPSBHTE9CQUxTLnc7XG5jdHguY2FudmFzLmhlaWdodCA9IEdMT0JBTFMuaDtcblxuLy8gY3JlYXRlIGJ1ZmZlcnNcblxuLy8gaW5pdCBhcHBsaWNhdGlvblxuYXBwLmluaXQoKTtcbi8vIGxhdW5jaCBsb29wXG52YXIgb3B0aW9ucyA9IHtcbiAgICBjdHg6IGN0eCxcbiAgICBidWZmZXJzOiBbXSxcbiAgICB1cGRhdGU6IGFwcC51cGRhdGUsXG4gICAgcmVuZGVyOiBhcHAucmVuZGVyLFxuICAgIGZwczogR0xPQkFMUy5mcHMsXG4gICAgZ3VpOiBndWkubW9kZWxcbn07XG5cbmd1aS5jb250cm9sbGVycy5wYXVzZS5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhbHVlID8gbG9vcC5xdWl0KCkgOiBsb29wLnJ1bihvcHRpb25zKTtcbn0pO1xuXG5sb29wLnJ1bihvcHRpb25zKTtcbiIsInZhciBHTE9CQUxTID0ge1xuICBmcHM6IDYwLFxuICB3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgaDogd2luZG93LmlubmVySGVpZ2h0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdMT0JBTFM7XG4iLCJ2YXIgZGF0ID0gcmVxdWlyZSgnZGF0LWd1aScpO1xudmFyIGd1aSA9IG5ldyBkYXQuR1VJKCk7XG5cbi8vIG1vZGVsXG52YXIgbW9kZWwgPSB7XG4gIHBhdXNlOiBmYWxzZSxcbiAgc2xvdzogMVxufTtcblxuLy8gY29udHJvbGxlcnNcbnZhciBwYXVzZUNvbnRyb2xsZXIgPSBndWkuYWRkKG1vZGVsLCAncGF1c2UnKTtcbmd1aS5hZGQobW9kZWwsICdzbG93JywgMSwgMTApLnN0ZXAoMSk7XG5cbi8vIGV4cG9ydFxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1vZGVsOiBtb2RlbCxcbiAgY29udHJvbGxlcnM6IHtcbiAgICBwYXVzZTogcGF1c2VDb250cm9sbGVyXG4gIH1cbn1cblxuIiwiLyogU2ltcGxlIEphdmFTY3JpcHQgSW5oZXJpdGFuY2VcbiAqIEJ5IEpvaG4gUmVzaWcgaHR0cDovL2Vqb2huLm9yZy9cbiAqIE1JVCBMaWNlbnNlZC5cbiAqL1xuLy8gSW5zcGlyZWQgYnkgYmFzZTIgYW5kIFByb3RvdHlwZVxudmFyIGluaXRpYWxpemluZyA9IGZhbHNlLCBmblRlc3QgPSAveHl6Ly50ZXN0KGZ1bmN0aW9uKCl7eHl6O30pID8gL1xcYl9zdXBlclxcYi8gOiAvLiovO1xuXG4vLyBUaGUgYmFzZSBDbGFzcyBpbXBsZW1lbnRhdGlvbiAoZG9lcyBub3RoaW5nKVxuLy8gdGhpcy5DbGFzcyA9IGZ1bmN0aW9uKCl7fTtcbnZhciBDbGFzcyA9IGZ1bmN0aW9uICgpe307XG5cbi8vIENyZWF0ZSBhIG5ldyBDbGFzcyB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBjbGFzc1xuQ2xhc3MuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKHByb3ApIHtcbiAgdmFyIF9zdXBlciA9IHRoaXMucHJvdG90eXBlO1xuXG4gIC8vIEluc3RhbnRpYXRlIGEgYmFzZSBjbGFzcyAoYnV0IG9ubHkgY3JlYXRlIHRoZSBpbnN0YW5jZSxcbiAgLy8gZG9uJ3QgcnVuIHRoZSBpbml0IGNvbnN0cnVjdG9yKVxuICBpbml0aWFsaXppbmcgPSB0cnVlO1xuICB2YXIgcHJvdG90eXBlID0gbmV3IHRoaXMoKTtcbiAgaW5pdGlhbGl6aW5nID0gZmFsc2U7XG5cbiAgLy8gQ29weSB0aGUgcHJvcGVydGllcyBvdmVyIG9udG8gdGhlIG5ldyBwcm90b3R5cGVcbiAgZm9yICh2YXIgbmFtZSBpbiBwcm9wKSB7XG4gICAgLy8gQ2hlY2sgaWYgd2UncmUgb3ZlcndyaXRpbmcgYW4gZXhpc3RpbmcgZnVuY3Rpb25cbiAgICBwcm90b3R5cGVbbmFtZV0gPSB0eXBlb2YgcHJvcFtuYW1lXSA9PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgIHR5cGVvZiBfc3VwZXJbbmFtZV0gPT0gXCJmdW5jdGlvblwiICYmIGZuVGVzdC50ZXN0KHByb3BbbmFtZV0pID9cbiAgICAgIChmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG1wID0gdGhpcy5fc3VwZXI7XG5cbiAgICAgICAgICAvLyBBZGQgYSBuZXcgLl9zdXBlcigpIG1ldGhvZCB0aGF0IGlzIHRoZSBzYW1lIG1ldGhvZFxuICAgICAgICAgIC8vIGJ1dCBvbiB0aGUgc3VwZXItY2xhc3NcbiAgICAgICAgICB0aGlzLl9zdXBlciA9IF9zdXBlcltuYW1lXTtcblxuICAgICAgICAgIC8vIFRoZSBtZXRob2Qgb25seSBuZWVkIHRvIGJlIGJvdW5kIHRlbXBvcmFyaWx5LCBzbyB3ZVxuICAgICAgICAgIC8vIHJlbW92ZSBpdCB3aGVuIHdlJ3JlIGRvbmUgZXhlY3V0aW5nXG4gICAgICAgICAgdmFyIHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgdGhpcy5fc3VwZXIgPSB0bXA7XG5cbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuICAgICAgfSkobmFtZSwgcHJvcFtuYW1lXSkgOlxuICAgICAgcHJvcFtuYW1lXTtcbiAgfVxuXG4gIC8vIFRoZSBkdW1teSBjbGFzcyBjb25zdHJ1Y3RvclxuICBmdW5jdGlvbiBDbGFzcygpIHtcbiAgICAvLyBBbGwgY29uc3RydWN0aW9uIGlzIGFjdHVhbGx5IGRvbmUgaW4gdGhlIGluaXQgbWV0aG9kXG4gICAgaWYgKCAhaW5pdGlhbGl6aW5nICYmIHRoaXMuaW5pdCApXG4gICAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIC8vIFBvcHVsYXRlIG91ciBjb25zdHJ1Y3RlZCBwcm90b3R5cGUgb2JqZWN0XG4gIENsYXNzLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcblxuICAvLyBFbmZvcmNlIHRoZSBjb25zdHJ1Y3RvciB0byBiZSB3aGF0IHdlIGV4cGVjdFxuICBDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDbGFzcztcblxuICAvLyBBbmQgbWFrZSB0aGlzIGNsYXNzIGV4dGVuZGFibGVcbiAgQ2xhc3MuZXh0ZW5kID0gZXh0ZW5kO1xuXG4gIHJldHVybiBDbGFzcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3M7XG4iLCIvLyBodHRwOi8vY29kZWluY29tcGxldGUuY29tL3Bvc3RzLzIwMTMvMTIvNC9qYXZhc2NyaXB0X2dhbWVfZm91bmRhdGlvbnNfdGhlX2dhbWVfbG9vcC9cbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPyB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn1cblxudmFyIGxvb3AgPSB7XG4gICAgcnVuOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIG5vdyxcbiAgICAgICAgICAgIGR0ICAgICAgID0gMCxcbiAgICAgICAgICAgIGxhc3QgICAgID0gdGltZXN0YW1wKCksXG4gICAgICAgICAgICBzdGVwICAgICA9IDEgLyBvcHRpb25zLmZwcyxcbiAgICAgICAgICAgIGN0eCAgICAgID0gb3B0aW9ucy5jdHgsXG4gICAgICAgICAgICBidWZmZXJzICA9IG9wdGlvbnMuYnVmZmVycyxcbiAgICAgICAgICAgIHVwZGF0ZSAgID0gb3B0aW9ucy51cGRhdGUsXG4gICAgICAgICAgICByZW5kZXIgICA9IG9wdGlvbnMucmVuZGVyLFxuICAgICAgICAgICAgZ3VpICAgICAgPSBvcHRpb25zLmd1aTtcblxuICAgICAgICAoZnVuY3Rpb24odGhhdCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2xvdyAgICAgPSBndWkuc2xvdzsgLy8gc2xvdyBtb3Rpb24gc2NhbGluZyBmYWN0b3JcbiAgICAgICAgICAgICAgICB2YXIgc2xvd1N0ZXAgPSBzbG93ICogc3RlcDtcblxuICAgICAgICAgICAgICAgIG5vdyA9IHRpbWVzdGFtcCgpO1xuICAgICAgICAgICAgICAgIGR0ID0gZHQgKyBNYXRoLm1pbigxLCAobm93IC0gbGFzdCkgLyAxMDAwKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGR0ID4gc2xvd1N0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgZHQgPSBkdCAtIHNsb3dTdGVwO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGUoc3RlcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVuZGVyKGN0eCwgYnVmZmVycywgZHQvc2xvdyk7XG5cbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xuICAgICAgICAgICAgICAgIHRoYXQuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoYXQuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH0odGhpcykpO1xuICAgIH0sXG5cbiAgICBxdWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gbG9vcDtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi92ZW5kb3IvZGF0Lmd1aScpXG5tb2R1bGUuZXhwb3J0cy5jb2xvciA9IHJlcXVpcmUoJy4vdmVuZG9yL2RhdC5jb2xvcicpIiwiLyoqXG4gKiBkYXQtZ3VpIEphdmFTY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5XG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvZGF0LWd1aVxuICpcbiAqIENvcHlyaWdodCAyMDExIERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgQ3JlYXRpdmUgTGFiXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICovXG5cbi8qKiBAbmFtZXNwYWNlICovXG52YXIgZGF0ID0gbW9kdWxlLmV4cG9ydHMgPSBkYXQgfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQuY29sb3IgPSBkYXQuY29sb3IgfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQudXRpbHMgPSBkYXQudXRpbHMgfHwge307XG5cbmRhdC51dGlscy5jb21tb24gPSAoZnVuY3Rpb24gKCkge1xuICBcbiAgdmFyIEFSUl9FQUNIID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG4gIHZhciBBUlJfU0xJQ0UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLyoqXG4gICAqIEJhbmQtYWlkIG1ldGhvZHMgZm9yIHRoaW5ncyB0aGF0IHNob3VsZCBiZSBhIGxvdCBlYXNpZXIgaW4gSmF2YVNjcmlwdC5cbiAgICogSW1wbGVtZW50YXRpb24gYW5kIHN0cnVjdHVyZSBpbnNwaXJlZCBieSB1bmRlcnNjb3JlLmpzXG4gICAqIGh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vdW5kZXJzY29yZS9cbiAgICovXG5cbiAgcmV0dXJuIHsgXG4gICAgXG4gICAgQlJFQUs6IHt9LFxuICBcbiAgICBleHRlbmQ6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgXG4gICAgICB0aGlzLmVhY2goQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICAgIGlmICghdGhpcy5pc1VuZGVmaW5lZChvYmpba2V5XSkpIFxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgXG4gICAgICB9LCB0aGlzKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgIFxuICAgIH0sXG4gICAgXG4gICAgZGVmYXVsdHM6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgXG4gICAgICB0aGlzLmVhY2goQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICAgIGlmICh0aGlzLmlzVW5kZWZpbmVkKHRhcmdldFtrZXldKSkgXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICBcbiAgICAgIH0sIHRoaXMpO1xuICAgICAgXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIFxuICAgIH0sXG4gICAgXG4gICAgY29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9DYWxsID0gQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdG9DYWxsLmxlbmd0aCAtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gW3RvQ2FsbFtpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBlYWNoOiBmdW5jdGlvbihvYmosIGl0ciwgc2NvcGUpIHtcblxuICAgICAgXG4gICAgICBpZiAoQVJSX0VBQ0ggJiYgb2JqLmZvckVhY2ggPT09IEFSUl9FQUNIKSB7IFxuICAgICAgICBcbiAgICAgICAgb2JqLmZvckVhY2goaXRyLCBzY29wZSk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSBvYmoubGVuZ3RoICsgMCkgeyAvLyBJcyBudW1iZXIgYnV0IG5vdCBOYU5cbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBrZXkgPCBsOyBrZXkrKylcbiAgICAgICAgICBpZiAoa2V5IGluIG9iaiAmJiBpdHIuY2FsbChzY29wZSwgb2JqW2tleV0sIGtleSkgPT09IHRoaXMuQlJFQUspIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIFxuICAgICAgICAgIGlmIChpdHIuY2FsbChzY29wZSwgb2JqW2tleV0sIGtleSkgPT09IHRoaXMuQlJFQUspXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgIH0sXG4gICAgXG4gICAgZGVmZXI6IGZ1bmN0aW9uKGZuYykge1xuICAgICAgc2V0VGltZW91dChmbmMsIDApO1xuICAgIH0sXG4gICAgXG4gICAgdG9BcnJheTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqLnRvQXJyYXkpIHJldHVybiBvYmoudG9BcnJheSgpO1xuICAgICAgcmV0dXJuIEFSUl9TTElDRS5jYWxsKG9iaik7XG4gICAgfSxcblxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIFxuICAgIGlzTnVsbDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICAgIH0sXG4gICAgXG4gICAgaXNOYU46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gb2JqO1xuICAgIH0sXG4gICAgXG4gICAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmouY29uc3RydWN0b3IgPT09IEFycmF5O1xuICAgIH0sXG4gICAgXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcbiAgICBcbiAgICBpc051bWJlcjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBvYmorMDtcbiAgICB9LFxuICAgIFxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG9iaisnJztcbiAgICB9LFxuICAgIFxuICAgIGlzQm9vbGVhbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBmYWxzZSB8fCBvYmogPT09IHRydWU7XG4gICAgfSxcbiAgICBcbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG4gIFxuICB9O1xuICAgIFxufSkoKTtcblxuXG5kYXQuY29sb3IudG9TdHJpbmcgPSAoZnVuY3Rpb24gKGNvbW1vbikge1xuXG4gIHJldHVybiBmdW5jdGlvbihjb2xvcikge1xuXG4gICAgaWYgKGNvbG9yLmEgPT0gMSB8fCBjb21tb24uaXNVbmRlZmluZWQoY29sb3IuYSkpIHtcblxuICAgICAgdmFyIHMgPSBjb2xvci5oZXgudG9TdHJpbmcoMTYpO1xuICAgICAgd2hpbGUgKHMubGVuZ3RoIDwgNikge1xuICAgICAgICBzID0gJzAnICsgcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcjJyArIHM7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByZXR1cm4gJ3JnYmEoJyArIE1hdGgucm91bmQoY29sb3IucikgKyAnLCcgKyBNYXRoLnJvdW5kKGNvbG9yLmcpICsgJywnICsgTWF0aC5yb3VuZChjb2xvci5iKSArICcsJyArIGNvbG9yLmEgKyAnKSc7XG5cbiAgICB9XG5cbiAgfVxuXG59KShkYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuQ29sb3IgPSBkYXQuY29sb3IuQ29sb3IgPSAoZnVuY3Rpb24gKGludGVycHJldCwgbWF0aCwgdG9TdHJpbmcsIGNvbW1vbikge1xuXG4gIHZhciBDb2xvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5fX3N0YXRlID0gaW50ZXJwcmV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBpZiAodGhpcy5fX3N0YXRlID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgJ0ZhaWxlZCB0byBpbnRlcnByZXQgY29sb3IgYXJndW1lbnRzJztcbiAgICB9XG5cbiAgICB0aGlzLl9fc3RhdGUuYSA9IHRoaXMuX19zdGF0ZS5hIHx8IDE7XG5cblxuICB9O1xuXG4gIENvbG9yLkNPTVBPTkVOVFMgPSBbJ3InLCdnJywnYicsJ2gnLCdzJywndicsJ2hleCcsJ2EnXTtcblxuICBjb21tb24uZXh0ZW5kKENvbG9yLnByb3RvdHlwZSwge1xuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b09yaWdpbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGUuY29udmVyc2lvbi53cml0ZSh0aGlzKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ3InLCAyKTtcbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2cnLCAxKTtcbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2InLCAwKTtcblxuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnaCcpO1xuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAncycpO1xuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAndicpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb2xvci5wcm90b3R5cGUsICdhJywge1xuXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGUuYTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbih2KSB7XG4gICAgICB0aGlzLl9fc3RhdGUuYSA9IHY7XG4gICAgfVxuXG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb2xvci5wcm90b3R5cGUsICdoZXgnLCB7XG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiAoIXRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ0hFWCcpIHtcbiAgICAgICAgdGhpcy5fX3N0YXRlLmhleCA9IG1hdGgucmdiX3RvX2hleCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5oZXg7XG5cbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgIHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdIRVgnO1xuICAgICAgdGhpcy5fX3N0YXRlLmhleCA9IHY7XG5cbiAgICB9XG5cbiAgfSk7XG5cbiAgZnVuY3Rpb24gZGVmaW5lUkdCQ29tcG9uZW50KHRhcmdldCwgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG5cbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ1JHQicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG4gICAgICAgIH1cblxuICAgICAgICByZWNhbGN1bGF0ZVJHQih0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG5cbiAgICAgIH0sXG5cbiAgICAgIHNldDogZnVuY3Rpb24odikge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdSR0InKSB7XG4gICAgICAgICAgcmVjYWxjdWxhdGVSR0IodGhpcywgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCk7XG4gICAgICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ1JHQic7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc3RhdGVbY29tcG9uZW50XSA9IHY7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVIU1ZDb21wb25lbnQodGFyZ2V0LCBjb21wb25lbnQpIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbXBvbmVudCwge1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgPT09ICdIU1YnKVxuICAgICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgICByZWNhbGN1bGF0ZUhTVih0aGlzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG5cbiAgICAgIH0sXG5cbiAgICAgIHNldDogZnVuY3Rpb24odikge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdIU1YnKSB7XG4gICAgICAgICAgcmVjYWxjdWxhdGVIU1YodGhpcyk7XG4gICAgICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ0hTVic7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc3RhdGVbY29tcG9uZW50XSA9IHY7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiByZWNhbGN1bGF0ZVJHQihjb2xvciwgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCkge1xuXG4gICAgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIRVgnKSB7XG5cbiAgICAgIGNvbG9yLl9fc3RhdGVbY29tcG9uZW50XSA9IG1hdGguY29tcG9uZW50X2Zyb21faGV4KGNvbG9yLl9fc3RhdGUuaGV4LCBjb21wb25lbnRIZXhJbmRleCk7XG5cbiAgICB9IGVsc2UgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIU1YnKSB7XG5cbiAgICAgIGNvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSwgbWF0aC5oc3ZfdG9fcmdiKGNvbG9yLl9fc3RhdGUuaCwgY29sb3IuX19zdGF0ZS5zLCBjb2xvci5fX3N0YXRlLnYpKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRocm93ICdDb3JydXB0ZWQgY29sb3Igc3RhdGUnO1xuXG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiByZWNhbGN1bGF0ZUhTVihjb2xvcikge1xuXG4gICAgdmFyIHJlc3VsdCA9IG1hdGgucmdiX3RvX2hzdihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcblxuICAgIGNvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSxcbiAgICAgICAge1xuICAgICAgICAgIHM6IHJlc3VsdC5zLFxuICAgICAgICAgIHY6IHJlc3VsdC52XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCFjb21tb24uaXNOYU4ocmVzdWx0LmgpKSB7XG4gICAgICBjb2xvci5fX3N0YXRlLmggPSByZXN1bHQuaDtcbiAgICB9IGVsc2UgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChjb2xvci5fX3N0YXRlLmgpKSB7XG4gICAgICBjb2xvci5fX3N0YXRlLmggPSAwO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIENvbG9yO1xuXG59KShkYXQuY29sb3IuaW50ZXJwcmV0ID0gKGZ1bmN0aW9uICh0b1N0cmluZywgY29tbW9uKSB7XG5cbiAgdmFyIHJlc3VsdCwgdG9SZXR1cm47XG5cbiAgdmFyIGludGVycHJldCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdG9SZXR1cm4gPSBmYWxzZTtcblxuICAgIHZhciBvcmlnaW5hbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gY29tbW9uLnRvQXJyYXkoYXJndW1lbnRzKSA6IGFyZ3VtZW50c1swXTtcblxuICAgIGNvbW1vbi5lYWNoKElOVEVSUFJFVEFUSU9OUywgZnVuY3Rpb24oZmFtaWx5KSB7XG5cbiAgICAgIGlmIChmYW1pbHkubGl0bXVzKG9yaWdpbmFsKSkge1xuXG4gICAgICAgIGNvbW1vbi5lYWNoKGZhbWlseS5jb252ZXJzaW9ucywgZnVuY3Rpb24oY29udmVyc2lvbiwgY29udmVyc2lvbk5hbWUpIHtcblxuICAgICAgICAgIHJlc3VsdCA9IGNvbnZlcnNpb24ucmVhZChvcmlnaW5hbCk7XG5cbiAgICAgICAgICBpZiAodG9SZXR1cm4gPT09IGZhbHNlICYmIHJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRvUmV0dXJuID0gcmVzdWx0O1xuICAgICAgICAgICAgcmVzdWx0LmNvbnZlcnNpb25OYW1lID0gY29udmVyc2lvbk5hbWU7XG4gICAgICAgICAgICByZXN1bHQuY29udmVyc2lvbiA9IGNvbnZlcnNpb247XG4gICAgICAgICAgICByZXR1cm4gY29tbW9uLkJSRUFLO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb21tb24uQlJFQUs7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuXG4gIH07XG5cbiAgdmFyIElOVEVSUFJFVEFUSU9OUyA9IFtcblxuICAgIC8vIFN0cmluZ3NcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzU3RyaW5nLFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFRIUkVFX0NIQVJfSEVYOiB7XG5cbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuXG4gICAgICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9eIyhbQS1GMC05XSkoW0EtRjAtOV0pKFtBLUYwLTldKSQvaSk7XG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgICAgIGhleDogcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAnMHgnICtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0WzFdLnRvU3RyaW5nKCkgKyB0ZXN0WzFdLnRvU3RyaW5nKCkgK1xuICAgICAgICAgICAgICAgICAgICAgIHRlc3RbMl0udG9TdHJpbmcoKSArIHRlc3RbMl0udG9TdHJpbmcoKSArXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdFszXS50b1N0cmluZygpICsgdGVzdFszXS50b1N0cmluZygpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9LFxuXG4gICAgICAgIFNJWF9DSEFSX0hFWDoge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXiMoW0EtRjAtOV17Nn0pJC9pKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICAgICAgaGV4OiBwYXJzZUludCgnMHgnICsgdGVzdFsxXS50b1N0cmluZygpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9LFxuXG4gICAgICAgIENTU19SR0I6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgICAgICBnOiBwYXJzZUZsb2F0KHRlc3RbMl0pLFxuICAgICAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgQ1NTX1JHQkE6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JhXFwoXFxzKiguKylcXHMqLFxccyooLispXFxzKixcXHMqKC4rKVxccypcXCxcXHMqKC4rKVxccypcXCkvKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogcGFyc2VGbG9hdCh0ZXN0WzFdKSxcbiAgICAgICAgICAgICAgZzogcGFyc2VGbG9hdCh0ZXN0WzJdKSxcbiAgICAgICAgICAgICAgYjogcGFyc2VGbG9hdCh0ZXN0WzNdKSxcbiAgICAgICAgICAgICAgYTogcGFyc2VGbG9hdCh0ZXN0WzRdKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBOdW1iZXJzXG4gICAge1xuXG4gICAgICBsaXRtdXM6IGNvbW1vbi5pc051bWJlcixcblxuICAgICAgY29udmVyc2lvbnM6IHtcblxuICAgICAgICBIRVg6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdIRVgnLFxuICAgICAgICAgICAgICBoZXg6IG9yaWdpbmFsLFxuICAgICAgICAgICAgICBjb252ZXJzaW9uTmFtZTogJ0hFWCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sb3IuaGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gQXJyYXlzXG4gICAge1xuXG4gICAgICBsaXRtdXM6IGNvbW1vbi5pc0FycmF5LFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFJHQl9BUlJBWToge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9IDMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogb3JpZ2luYWxbMF0sXG4gICAgICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgICAgICBiOiBvcmlnaW5hbFsyXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmJdO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIFJHQkFfQVJSQVk6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCAhPSA0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgIHI6IG9yaWdpbmFsWzBdLFxuICAgICAgICAgICAgICBnOiBvcmlnaW5hbFsxXSxcbiAgICAgICAgICAgICAgYjogb3JpZ2luYWxbMl0sXG4gICAgICAgICAgICAgIGE6IG9yaWdpbmFsWzNdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYV07XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIE9iamVjdHNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzT2JqZWN0LFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFJHQkFfT0JKOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuZykgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgICAgcjogb3JpZ2luYWwucixcbiAgICAgICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgICAgIGI6IG9yaWdpbmFsLmIsXG4gICAgICAgICAgICAgICAgYTogb3JpZ2luYWwuYVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcjogY29sb3IucixcbiAgICAgICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICAgICAgYjogY29sb3IuYixcbiAgICAgICAgICAgICAgYTogY29sb3IuYVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBSR0JfT0JKOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuZykgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgICAgcjogb3JpZ2luYWwucixcbiAgICAgICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgICAgIGI6IG9yaWdpbmFsLmJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHI6IGNvbG9yLnIsXG4gICAgICAgICAgICAgIGc6IGNvbG9yLmcsXG4gICAgICAgICAgICAgIGI6IGNvbG9yLmJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgSFNWQV9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5oKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC52KSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5hKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnSFNWJyxcbiAgICAgICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgICAgIHM6IG9yaWdpbmFsLnMsXG4gICAgICAgICAgICAgICAgdjogb3JpZ2luYWwudixcbiAgICAgICAgICAgICAgICBhOiBvcmlnaW5hbC5hXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgICAgICB2OiBjb2xvci52LFxuICAgICAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIEhTVl9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5oKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC52KSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnSFNWJyxcbiAgICAgICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgICAgIHM6IG9yaWdpbmFsLnMsXG4gICAgICAgICAgICAgICAgdjogb3JpZ2luYWwudlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaDogY29sb3IuaCxcbiAgICAgICAgICAgICAgczogY29sb3IucyxcbiAgICAgICAgICAgICAgdjogY29sb3IudlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuXG4gIF07XG5cbiAgcmV0dXJuIGludGVycHJldDtcblxuXG59KShkYXQuY29sb3IudG9TdHJpbmcsXG5kYXQudXRpbHMuY29tbW9uKSxcbmRhdC5jb2xvci5tYXRoID0gKGZ1bmN0aW9uICgpIHtcblxuICB2YXIgdG1wQ29tcG9uZW50O1xuXG4gIHJldHVybiB7XG5cbiAgICBoc3ZfdG9fcmdiOiBmdW5jdGlvbihoLCBzLCB2KSB7XG5cbiAgICAgIHZhciBoaSA9IE1hdGguZmxvb3IoaCAvIDYwKSAlIDY7XG5cbiAgICAgIHZhciBmID0gaCAvIDYwIC0gTWF0aC5mbG9vcihoIC8gNjApO1xuICAgICAgdmFyIHAgPSB2ICogKDEuMCAtIHMpO1xuICAgICAgdmFyIHEgPSB2ICogKDEuMCAtIChmICogcykpO1xuICAgICAgdmFyIHQgPSB2ICogKDEuMCAtICgoMS4wIC0gZikgKiBzKSk7XG4gICAgICB2YXIgYyA9IFtcbiAgICAgICAgW3YsIHQsIHBdLFxuICAgICAgICBbcSwgdiwgcF0sXG4gICAgICAgIFtwLCB2LCB0XSxcbiAgICAgICAgW3AsIHEsIHZdLFxuICAgICAgICBbdCwgcCwgdl0sXG4gICAgICAgIFt2LCBwLCBxXVxuICAgICAgXVtoaV07XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHI6IGNbMF0gKiAyNTUsXG4gICAgICAgIGc6IGNbMV0gKiAyNTUsXG4gICAgICAgIGI6IGNbMl0gKiAyNTVcbiAgICAgIH07XG5cbiAgICB9LFxuXG4gICAgcmdiX3RvX2hzdjogZnVuY3Rpb24ociwgZywgYikge1xuXG4gICAgICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICAgICAgZGVsdGEgPSBtYXggLSBtaW4sXG4gICAgICAgICAgaCwgcztcblxuICAgICAgaWYgKG1heCAhPSAwKSB7XG4gICAgICAgIHMgPSBkZWx0YSAvIG1heDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaDogTmFOLFxuICAgICAgICAgIHM6IDAsXG4gICAgICAgICAgdjogMFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAociA9PSBtYXgpIHtcbiAgICAgICAgaCA9IChnIC0gYikgLyBkZWx0YTtcbiAgICAgIH0gZWxzZSBpZiAoZyA9PSBtYXgpIHtcbiAgICAgICAgaCA9IDIgKyAoYiAtIHIpIC8gZGVsdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoID0gNCArIChyIC0gZykgLyBkZWx0YTtcbiAgICAgIH1cbiAgICAgIGggLz0gNjtcbiAgICAgIGlmIChoIDwgMCkge1xuICAgICAgICBoICs9IDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGg6IGggKiAzNjAsXG4gICAgICAgIHM6IHMsXG4gICAgICAgIHY6IG1heCAvIDI1NVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgcmdiX3RvX2hleDogZnVuY3Rpb24ociwgZywgYikge1xuICAgICAgdmFyIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KDAsIDIsIHIpO1xuICAgICAgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoaGV4LCAxLCBnKTtcbiAgICAgIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KGhleCwgMCwgYik7XG4gICAgICByZXR1cm4gaGV4O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRfZnJvbV9oZXg6IGZ1bmN0aW9uKGhleCwgY29tcG9uZW50SW5kZXgpIHtcbiAgICAgIHJldHVybiAoaGV4ID4+IChjb21wb25lbnRJbmRleCAqIDgpKSAmIDB4RkY7XG4gICAgfSxcblxuICAgIGhleF93aXRoX2NvbXBvbmVudDogZnVuY3Rpb24oaGV4LCBjb21wb25lbnRJbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA8PCAodG1wQ29tcG9uZW50ID0gY29tcG9uZW50SW5kZXggKiA4KSB8IChoZXggJiB+ICgweEZGIDw8IHRtcENvbXBvbmVudCkpO1xuICAgIH1cblxuICB9XG5cbn0pKCksXG5kYXQuY29sb3IudG9TdHJpbmcsXG5kYXQudXRpbHMuY29tbW9uKTsiLCIvKipcbiAqIGRhdC1ndWkgSmF2YVNjcmlwdCBDb250cm9sbGVyIExpYnJhcnlcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9kYXQtZ3VpXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBDcmVhdGl2ZSBMYWJcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKi9cblxuLyoqIEBuYW1lc3BhY2UgKi9cbnZhciBkYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGRhdCB8fCB7fTtcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmRhdC5ndWkgPSBkYXQuZ3VpIHx8IHt9O1xuXG4vKiogQG5hbWVzcGFjZSAqL1xuZGF0LnV0aWxzID0gZGF0LnV0aWxzIHx8IHt9O1xuXG4vKiogQG5hbWVzcGFjZSAqL1xuZGF0LmNvbnRyb2xsZXJzID0gZGF0LmNvbnRyb2xsZXJzIHx8IHt9O1xuXG4vKiogQG5hbWVzcGFjZSAqL1xuZGF0LmRvbSA9IGRhdC5kb20gfHwge307XG5cbi8qKiBAbmFtZXNwYWNlICovXG5kYXQuY29sb3IgPSBkYXQuY29sb3IgfHwge307XG5cbmRhdC51dGlscy5jc3MgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIGxvYWQ6IGZ1bmN0aW9uICh1cmwsIGRvYykge1xuICAgICAgZG9jID0gZG9jIHx8IGRvY3VtZW50O1xuICAgICAgdmFyIGxpbmsgPSBkb2MuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgbGluay50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuICAgICAgbGluay5ocmVmID0gdXJsO1xuICAgICAgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICBpbmplY3Q6IGZ1bmN0aW9uKGNzcywgZG9jKSB7XG4gICAgICBkb2MgPSBkb2MgfHwgZG9jdW1lbnQ7XG4gICAgICB2YXIgaW5qZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgaW5qZWN0ZWQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBpbmplY3RlZC5pbm5lckhUTUwgPSBjc3M7XG4gICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChpbmplY3RlZCk7XG4gICAgfVxuICB9XG59KSgpO1xuXG5cbmRhdC51dGlscy5jb21tb24gPSAoZnVuY3Rpb24gKCkge1xuICBcbiAgdmFyIEFSUl9FQUNIID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG4gIHZhciBBUlJfU0xJQ0UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLyoqXG4gICAqIEJhbmQtYWlkIG1ldGhvZHMgZm9yIHRoaW5ncyB0aGF0IHNob3VsZCBiZSBhIGxvdCBlYXNpZXIgaW4gSmF2YVNjcmlwdC5cbiAgICogSW1wbGVtZW50YXRpb24gYW5kIHN0cnVjdHVyZSBpbnNwaXJlZCBieSB1bmRlcnNjb3JlLmpzXG4gICAqIGh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vdW5kZXJzY29yZS9cbiAgICovXG5cbiAgcmV0dXJuIHsgXG4gICAgXG4gICAgQlJFQUs6IHt9LFxuICBcbiAgICBleHRlbmQ6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgXG4gICAgICB0aGlzLmVhY2goQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICAgIGlmICghdGhpcy5pc1VuZGVmaW5lZChvYmpba2V5XSkpIFxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgXG4gICAgICB9LCB0aGlzKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgIFxuICAgIH0sXG4gICAgXG4gICAgZGVmYXVsdHM6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgXG4gICAgICB0aGlzLmVhY2goQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICAgIGlmICh0aGlzLmlzVW5kZWZpbmVkKHRhcmdldFtrZXldKSkgXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICBcbiAgICAgIH0sIHRoaXMpO1xuICAgICAgXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIFxuICAgIH0sXG4gICAgXG4gICAgY29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9DYWxsID0gQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdG9DYWxsLmxlbmd0aCAtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gW3RvQ2FsbFtpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBlYWNoOiBmdW5jdGlvbihvYmosIGl0ciwgc2NvcGUpIHtcblxuICAgICAgXG4gICAgICBpZiAoQVJSX0VBQ0ggJiYgb2JqLmZvckVhY2ggPT09IEFSUl9FQUNIKSB7IFxuICAgICAgICBcbiAgICAgICAgb2JqLmZvckVhY2goaXRyLCBzY29wZSk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSBvYmoubGVuZ3RoICsgMCkgeyAvLyBJcyBudW1iZXIgYnV0IG5vdCBOYU5cbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGtleSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBrZXkgPCBsOyBrZXkrKylcbiAgICAgICAgICBpZiAoa2V5IGluIG9iaiAmJiBpdHIuY2FsbChzY29wZSwgb2JqW2tleV0sIGtleSkgPT09IHRoaXMuQlJFQUspIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIFxuICAgICAgICAgIGlmIChpdHIuY2FsbChzY29wZSwgb2JqW2tleV0sIGtleSkgPT09IHRoaXMuQlJFQUspXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgIH1cbiAgICAgICAgICAgIFxuICAgIH0sXG4gICAgXG4gICAgZGVmZXI6IGZ1bmN0aW9uKGZuYykge1xuICAgICAgc2V0VGltZW91dChmbmMsIDApO1xuICAgIH0sXG4gICAgXG4gICAgdG9BcnJheTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqLnRvQXJyYXkpIHJldHVybiBvYmoudG9BcnJheSgpO1xuICAgICAgcmV0dXJuIEFSUl9TTElDRS5jYWxsKG9iaik7XG4gICAgfSxcblxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIFxuICAgIGlzTnVsbDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICAgIH0sXG4gICAgXG4gICAgaXNOYU46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gb2JqO1xuICAgIH0sXG4gICAgXG4gICAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmouY29uc3RydWN0b3IgPT09IEFycmF5O1xuICAgIH0sXG4gICAgXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcbiAgICBcbiAgICBpc051bWJlcjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBvYmorMDtcbiAgICB9LFxuICAgIFxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IG9iaisnJztcbiAgICB9LFxuICAgIFxuICAgIGlzQm9vbGVhbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBmYWxzZSB8fCBvYmogPT09IHRydWU7XG4gICAgfSxcbiAgICBcbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG4gIFxuICB9O1xuICAgIFxufSkoKTtcblxuXG5kYXQuY29udHJvbGxlcnMuQ29udHJvbGxlciA9IChmdW5jdGlvbiAoY29tbW9uKSB7XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBBbiBcImFic3RyYWN0XCIgY2xhc3MgdGhhdCByZXByZXNlbnRzIGEgZ2l2ZW4gcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBtYW5pcHVsYXRlZFxuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5jb250cm9sbGVyc1xuICAgKi9cbiAgdmFyIENvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG5cbiAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG5cbiAgICAvKipcbiAgICAgKiBUaG9zZSB3aG8gZXh0ZW5kIHRoaXMgY2xhc3Mgd2lsbCBwdXQgdGhlaXIgRE9NIGVsZW1lbnRzIGluIGhlcmUuXG4gICAgICogQHR5cGUge0RPTUVsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb2JqZWN0IHRvIG1hbmlwdWxhdGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIG1hbmlwdWxhdGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gY2hhbmdlLlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdGhpcy5fX29uQ2hhbmdlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBmaW5pc2hpbmcgY2hhbmdlLlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlID0gdW5kZWZpbmVkO1xuXG4gIH07XG5cbiAgY29tbW9uLmV4dGVuZChcblxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIC8qKiBAbGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXIucHJvdG90eXBlICovXG4gICAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZnkgdGhhdCBhIGZ1bmN0aW9uIGZpcmUgZXZlcnkgdGltZSBzb21lb25lIGNoYW5nZXMgdGhlIHZhbHVlIHdpdGhcbiAgICAgICAgICogdGhpcyBDb250cm9sbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbmMgVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciB0aGUgdmFsdWVcbiAgICAgICAgICogaXMgbW9kaWZpZWQgdmlhIHRoaXMgQ29udHJvbGxlci5cbiAgICAgICAgICogQHJldHVybnMge2RhdC5jb250cm9sbGVycy5Db250cm9sbGVyfSB0aGlzXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24oZm5jKSB7XG4gICAgICAgICAgdGhpcy5fX29uQ2hhbmdlID0gZm5jO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZ5IHRoYXQgYSBmdW5jdGlvbiBmaXJlIGV2ZXJ5IHRpbWUgc29tZW9uZSBcImZpbmlzaGVzXCIgY2hhbmdpbmdcbiAgICAgICAgICogdGhlIHZhbHVlIHdpaCB0aGlzIENvbnRyb2xsZXIuIFVzZWZ1bCBmb3IgdmFsdWVzIHRoYXQgY2hhbmdlXG4gICAgICAgICAqIGluY3JlbWVudGFsbHkgbGlrZSBudW1iZXJzIG9yIHN0cmluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuYyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyXG4gICAgICAgICAqIHNvbWVvbmUgXCJmaW5pc2hlc1wiIGNoYW5naW5nIHRoZSB2YWx1ZSB2aWEgdGhpcyBDb250cm9sbGVyLlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJ9IHRoaXNcbiAgICAgICAgICovXG4gICAgICAgIG9uRmluaXNoQ2hhbmdlOiBmdW5jdGlvbihmbmMpIHtcbiAgICAgICAgICB0aGlzLl9fb25GaW5pc2hDaGFuZ2UgPSBmbmM7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nZSB0aGUgdmFsdWUgb2YgPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT5cbiAgICAgICAgICovXG4gICAgICAgIHNldFZhbHVlOiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgIHRoaXMub2JqZWN0W3RoaXMucHJvcGVydHldID0gbmV3VmFsdWU7XG4gICAgICAgICAgaWYgKHRoaXMuX19vbkNoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5fX29uQ2hhbmdlLmNhbGwodGhpcywgbmV3VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgdmFsdWUgb2YgPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGN1cnJlbnQgdmFsdWUgb2YgPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT5cbiAgICAgICAgICovXG4gICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5wcm9wZXJ0eV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2hlcyB0aGUgdmlzdWFsIGRpc3BsYXkgb2YgYSBDb250cm9sbGVyIGluIG9yZGVyIHRvIGtlZXAgc3luY1xuICAgICAgICAgKiB3aXRoIHRoZSBvYmplY3QncyBjdXJyZW50IHZhbHVlLlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJ9IHRoaXNcbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZURpc3BsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgdmFsdWUgaGFzIGRldmlhdGVkIGZyb20gaW5pdGlhbFZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBpc01vZGlmaWVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMuZ2V0VmFsdWUoKVxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIHJldHVybiBDb250cm9sbGVyO1xuXG5cbn0pKGRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5kb20uZG9tID0gKGZ1bmN0aW9uIChjb21tb24pIHtcblxuICB2YXIgRVZFTlRfTUFQID0ge1xuICAgICdIVE1MRXZlbnRzJzogWydjaGFuZ2UnXSxcbiAgICAnTW91c2VFdmVudHMnOiBbJ2NsaWNrJywnbW91c2Vtb3ZlJywnbW91c2Vkb3duJywnbW91c2V1cCcsICdtb3VzZW92ZXInXSxcbiAgICAnS2V5Ym9hcmRFdmVudHMnOiBbJ2tleWRvd24nXVxuICB9O1xuXG4gIHZhciBFVkVOVF9NQVBfSU5WID0ge307XG4gIGNvbW1vbi5lYWNoKEVWRU5UX01BUCwgZnVuY3Rpb24odiwgaykge1xuICAgIGNvbW1vbi5lYWNoKHYsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIEVWRU5UX01BUF9JTlZbZV0gPSBrO1xuICAgIH0pO1xuICB9KTtcblxuICB2YXIgQ1NTX1ZBTFVFX1BJWEVMUyA9IC8oXFxkKyhcXC5cXGQrKT8pcHgvO1xuXG4gIGZ1bmN0aW9uIGNzc1ZhbHVlVG9QaXhlbHModmFsKSB7XG5cbiAgICBpZiAodmFsID09PSAnMCcgfHwgY29tbW9uLmlzVW5kZWZpbmVkKHZhbCkpIHJldHVybiAwO1xuXG4gICAgdmFyIG1hdGNoID0gdmFsLm1hdGNoKENTU19WQUxVRV9QSVhFTFMpO1xuXG4gICAgaWYgKCFjb21tb24uaXNOdWxsKG1hdGNoKSkge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgIH1cblxuICAgIC8vIFRPRE8gLi4uZW1zPyAlP1xuXG4gICAgcmV0dXJuIDA7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZXNwYWNlXG4gICAqIEBtZW1iZXIgZGF0LmRvbVxuICAgKi9cbiAgdmFyIGRvbSA9IHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICogQHBhcmFtIHNlbGVjdGFibGVcbiAgICAgKi9cbiAgICBtYWtlU2VsZWN0YWJsZTogZnVuY3Rpb24oZWxlbSwgc2VsZWN0YWJsZSkge1xuXG4gICAgICBpZiAoZWxlbSA9PT0gdW5kZWZpbmVkIHx8IGVsZW0uc3R5bGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICBlbGVtLm9uc2VsZWN0c3RhcnQgPSBzZWxlY3RhYmxlID8gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gOiBmdW5jdGlvbigpIHtcbiAgICAgIH07XG5cbiAgICAgIGVsZW0uc3R5bGUuTW96VXNlclNlbGVjdCA9IHNlbGVjdGFibGUgPyAnYXV0bycgOiAnbm9uZSc7XG4gICAgICBlbGVtLnN0eWxlLktodG1sVXNlclNlbGVjdCA9IHNlbGVjdGFibGUgPyAnYXV0bycgOiAnbm9uZSc7XG4gICAgICBlbGVtLnVuc2VsZWN0YWJsZSA9IHNlbGVjdGFibGUgPyAnb24nIDogJ29mZic7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEBwYXJhbSBob3Jpem9udGFsXG4gICAgICogQHBhcmFtIHZlcnRpY2FsXG4gICAgICovXG4gICAgbWFrZUZ1bGxzY3JlZW46IGZ1bmN0aW9uKGVsZW0sIGhvcml6b250YWwsIHZlcnRpY2FsKSB7XG5cbiAgICAgIGlmIChjb21tb24uaXNVbmRlZmluZWQoaG9yaXpvbnRhbCkpIGhvcml6b250YWwgPSB0cnVlO1xuICAgICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZCh2ZXJ0aWNhbCkpIHZlcnRpY2FsID0gdHJ1ZTtcblxuICAgICAgZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cbiAgICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9IDA7XG4gICAgICAgIGVsZW0uc3R5bGUucmlnaHQgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICAgIGVsZW0uc3R5bGUudG9wID0gMDtcbiAgICAgICAgZWxlbS5zdHlsZS5ib3R0b20gPSAwO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKiBAcGFyYW0gZXZlbnRUeXBlXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIGZha2VFdmVudDogZnVuY3Rpb24oZWxlbSwgZXZlbnRUeXBlLCBwYXJhbXMsIGF1eCkge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgdmFyIGNsYXNzTmFtZSA9IEVWRU5UX01BUF9JTlZbZXZlbnRUeXBlXTtcbiAgICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgdHlwZSAnICsgZXZlbnRUeXBlICsgJyBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgfVxuICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KGNsYXNzTmFtZSk7XG4gICAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgICBjYXNlICdNb3VzZUV2ZW50cyc6XG4gICAgICAgICAgdmFyIGNsaWVudFggPSBwYXJhbXMueCB8fCBwYXJhbXMuY2xpZW50WCB8fCAwO1xuICAgICAgICAgIHZhciBjbGllbnRZID0gcGFyYW1zLnkgfHwgcGFyYW1zLmNsaWVudFkgfHwgMDtcbiAgICAgICAgICBldnQuaW5pdE1vdXNlRXZlbnQoZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgcGFyYW1zLmNhbmNlbGFibGUgfHwgdHJ1ZSwgd2luZG93LCBwYXJhbXMuY2xpY2tDb3VudCB8fCAxLFxuICAgICAgICAgICAgICAwLCAvL3NjcmVlbiBYXG4gICAgICAgICAgICAgIDAsIC8vc2NyZWVuIFlcbiAgICAgICAgICAgICAgY2xpZW50WCwgLy9jbGllbnQgWFxuICAgICAgICAgICAgICBjbGllbnRZLCAvL2NsaWVudCBZXG4gICAgICAgICAgICAgIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnS2V5Ym9hcmRFdmVudHMnOlxuICAgICAgICAgIHZhciBpbml0ID0gZXZ0LmluaXRLZXlib2FyZEV2ZW50IHx8IGV2dC5pbml0S2V5RXZlbnQ7IC8vIHdlYmtpdCB8fCBtb3pcbiAgICAgICAgICBjb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY3RybEtleTogZmFsc2UsXG4gICAgICAgICAgICBhbHRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgbWV0YUtleTogZmFsc2UsXG4gICAgICAgICAgICBrZXlDb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjaGFyQ29kZTogdW5kZWZpbmVkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaW5pdChldmVudFR5cGUsIHBhcmFtcy5idWJibGVzIHx8IGZhbHNlLFxuICAgICAgICAgICAgICBwYXJhbXMuY2FuY2VsYWJsZSwgd2luZG93LFxuICAgICAgICAgICAgICBwYXJhbXMuY3RybEtleSwgcGFyYW1zLmFsdEtleSxcbiAgICAgICAgICAgICAgcGFyYW1zLnNoaWZ0S2V5LCBwYXJhbXMubWV0YUtleSxcbiAgICAgICAgICAgICAgcGFyYW1zLmtleUNvZGUsIHBhcmFtcy5jaGFyQ29kZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZXZ0LmluaXRFdmVudChldmVudFR5cGUsIHBhcmFtcy5idWJibGVzIHx8IGZhbHNlLFxuICAgICAgICAgICAgICBwYXJhbXMuY2FuY2VsYWJsZSB8fCB0cnVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbW1vbi5kZWZhdWx0cyhldnQsIGF1eCk7XG4gICAgICBlbGVtLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBmdW5jXG4gICAgICogQHBhcmFtIGJvb2xcbiAgICAgKi9cbiAgICBiaW5kOiBmdW5jdGlvbihlbGVtLCBldmVudCwgZnVuYywgYm9vbCkge1xuICAgICAgYm9vbCA9IGJvb2wgfHwgZmFsc2U7XG4gICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmMsIGJvb2wpO1xuICAgICAgZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudClcbiAgICAgICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGZ1bmMpO1xuICAgICAgcmV0dXJuIGRvbTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBmdW5jXG4gICAgICogQHBhcmFtIGJvb2xcbiAgICAgKi9cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsZW0sIGV2ZW50LCBmdW5jLCBib29sKSB7XG4gICAgICBib29sID0gYm9vbCB8fCBmYWxzZTtcbiAgICAgIGlmIChlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuYywgYm9vbCk7XG4gICAgICBlbHNlIGlmIChlbGVtLmRldGFjaEV2ZW50KVxuICAgICAgICBlbGVtLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgZnVuYyk7XG4gICAgICByZXR1cm4gZG9tO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgICAqL1xuICAgIGFkZENsYXNzOiBmdW5jdGlvbihlbGVtLCBjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbGVtLmNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgfSBlbHNlIGlmIChlbGVtLmNsYXNzTmFtZSAhPT0gY2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gZWxlbS5jbGFzc05hbWUuc3BsaXQoLyArLyk7XG4gICAgICAgIGlmIChjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKSA9PSAtMSkge1xuICAgICAgICAgIGNsYXNzZXMucHVzaChjbGFzc05hbWUpO1xuICAgICAgICAgIGVsZW0uY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJykucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkb207XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoZWxlbS5jbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIGVsZW0uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW0uY2xhc3NOYW1lID09PSBjbGFzc05hbWUpIHtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY2xhc3NlcyA9IGVsZW0uY2xhc3NOYW1lLnNwbGl0KC8gKy8pO1xuICAgICAgICAgIHZhciBpbmRleCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuICAgICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgY2xhc3Nlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRvbTtcbiAgICB9LFxuXG4gICAgaGFzQ2xhc3M6IGZ1bmN0aW9uKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMrKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHMrfCQpJykudGVzdChlbGVtLmNsYXNzTmFtZSkgfHwgZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBnZXRXaWR0aDogZnVuY3Rpb24oZWxlbSkge1xuXG4gICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuXG4gICAgICByZXR1cm4gY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLWxlZnQtd2lkdGgnXSkgK1xuICAgICAgICAgIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ2JvcmRlci1yaWdodC13aWR0aCddKSArXG4gICAgICAgICAgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy1sZWZ0J10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLXJpZ2h0J10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWyd3aWR0aCddKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIGdldEhlaWdodDogZnVuY3Rpb24oZWxlbSkge1xuXG4gICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuXG4gICAgICByZXR1cm4gY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLXRvcC13aWR0aCddKSArXG4gICAgICAgICAgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLWJvdHRvbS13aWR0aCddKSArXG4gICAgICAgICAgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy10b3AnXSkgK1xuICAgICAgICAgIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ3BhZGRpbmctYm90dG9tJ10pICtcbiAgICAgICAgICBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydoZWlnaHQnXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBnZXRPZmZzZXQ6IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIHZhciBvZmZzZXQgPSB7bGVmdDogMCwgdG9wOjB9O1xuICAgICAgaWYgKGVsZW0ub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBvZmZzZXQubGVmdCArPSBlbGVtLm9mZnNldExlZnQ7XG4gICAgICAgICAgb2Zmc2V0LnRvcCArPSBlbGVtLm9mZnNldFRvcDtcbiAgICAgICAgfSB3aGlsZSAoZWxlbSA9IGVsZW0ub2Zmc2V0UGFyZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSxcblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9wb3N0cy8yNjg0NTYxL3JldmlzaW9uc1xuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgaXNBY3RpdmU6IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmICggZWxlbS50eXBlIHx8IGVsZW0uaHJlZiApO1xuICAgIH1cblxuICB9O1xuXG4gIHJldHVybiBkb207XG5cbn0pKGRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5jb250cm9sbGVycy5PcHRpb25Db250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBkb20sIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUHJvdmlkZXMgYSBzZWxlY3QgaW5wdXQgdG8gYWx0ZXIgdGhlIHByb3BlcnR5IG9mIGFuIG9iamVjdCwgdXNpbmcgYVxuICAgKiBsaXN0IG9mIGFjY2VwdGVkIHZhbHVlcy5cbiAgICpcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nW119IG9wdGlvbnMgQSBtYXAgb2YgbGFiZWxzIHRvIGFjY2VwdGFibGUgdmFsdWVzLCBvclxuICAgKiBhIGxpc3Qgb2YgYWNjZXB0YWJsZSBzdHJpbmcgdmFsdWVzLlxuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5jb250cm9sbGVyc1xuICAgKi9cbiAgdmFyIE9wdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBvcHRpb25zKSB7XG5cbiAgICBPcHRpb25Db250cm9sbGVyLnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZHJvcCBkb3duIG1lbnVcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdGhpcy5fX3NlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuXG4gICAgaWYgKGNvbW1vbi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICB2YXIgbWFwID0ge307XG4gICAgICBjb21tb24uZWFjaChvcHRpb25zLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIG1hcFtlbGVtZW50XSA9IGVsZW1lbnQ7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbnMgPSBtYXA7XG4gICAgfVxuXG4gICAgY29tbW9uLmVhY2gob3B0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuXG4gICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgb3B0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2YWx1ZSk7XG4gICAgICBfdGhpcy5fX3NlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuXG4gICAgfSk7XG5cbiAgICAvLyBBY2tub3dsZWRnZSBvcmlnaW5hbCB2YWx1ZVxuICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgZG9tLmJpbmQodGhpcy5fX3NlbGVjdCwgJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlc2lyZWRWYWx1ZSA9IHRoaXMub3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgX3RoaXMuc2V0VmFsdWUoZGVzaXJlZFZhbHVlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fc2VsZWN0KTtcblxuICB9O1xuXG4gIE9wdGlvbkNvbnRyb2xsZXIuc3VwZXJjbGFzcyA9IENvbnRyb2xsZXI7XG5cbiAgY29tbW9uLmV4dGVuZChcblxuICAgICAgT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUsXG4gICAgICBDb250cm9sbGVyLnByb3RvdHlwZSxcblxuICAgICAge1xuXG4gICAgICAgIHNldFZhbHVlOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgdmFyIHRvUmV0dXJuID0gT3B0aW9uQ29udHJvbGxlci5zdXBlcmNsYXNzLnByb3RvdHlwZS5zZXRWYWx1ZS5jYWxsKHRoaXMsIHYpO1xuICAgICAgICAgIGlmICh0aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKHRoaXMsIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLl9fc2VsZWN0LnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIHJldHVybiBPcHRpb25Db250cm9sbGVyLnN1cGVyY2xhc3MucHJvdG90eXBlLnVwZGF0ZURpc3BsYXkuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgKTtcblxuICByZXR1cm4gT3B0aW9uQ29udHJvbGxlcjtcblxufSkoZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXIsXG5kYXQuZG9tLmRvbSxcbmRhdC51dGlscy5jb21tb24pO1xuXG5cbmRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBjb21tb24pIHtcblxuICAvKipcbiAgICogQGNsYXNzIFJlcHJlc2VudHMgYSBnaXZlbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgdGhhdCBpcyBhIG51bWJlci5cbiAgICpcbiAgICogQGV4dGVuZHMgZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdIE9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMubWluXSBNaW5pbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMubWF4XSBNYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbXMuc3RlcF0gSW5jcmVtZW50IGJ5IHdoaWNoIHRvIGNoYW5nZSB2YWx1ZVxuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5jb250cm9sbGVyc1xuICAgKi9cbiAgdmFyIE51bWJlckNvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcblxuICAgIE51bWJlckNvbnRyb2xsZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgdGhpcy5fX21pbiA9IHBhcmFtcy5taW47XG4gICAgdGhpcy5fX21heCA9IHBhcmFtcy5tYXg7XG4gICAgdGhpcy5fX3N0ZXAgPSBwYXJhbXMuc3RlcDtcblxuICAgIGlmIChjb21tb24uaXNVbmRlZmluZWQodGhpcy5fX3N0ZXApKSB7XG5cbiAgICAgIGlmICh0aGlzLmluaXRpYWxWYWx1ZSA9PSAwKSB7XG4gICAgICAgIHRoaXMuX19pbXBsaWVkU3RlcCA9IDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhleSBEb3VnLCBjaGVjayB0aGlzIG91dC5cbiAgICAgICAgdGhpcy5fX2ltcGxpZWRTdGVwID0gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2codGhpcy5pbml0aWFsVmFsdWUpL01hdGguTE4xMCkpLzEwO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5fX2ltcGxpZWRTdGVwID0gdGhpcy5fX3N0ZXA7XG5cbiAgICB9XG5cbiAgICB0aGlzLl9fcHJlY2lzaW9uID0gbnVtRGVjaW1hbHModGhpcy5fX2ltcGxpZWRTdGVwKTtcblxuXG4gIH07XG5cbiAgTnVtYmVyQ29udHJvbGxlci5zdXBlcmNsYXNzID0gQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBOdW1iZXJDb250cm9sbGVyLnByb3RvdHlwZSxcbiAgICAgIENvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICAvKiogQGxlbmRzIGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyLnByb3RvdHlwZSAqL1xuICAgICAge1xuXG4gICAgICAgIHNldFZhbHVlOiBmdW5jdGlvbih2KSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX21pbiAhPT0gdW5kZWZpbmVkICYmIHYgPCB0aGlzLl9fbWluKSB7XG4gICAgICAgICAgICB2ID0gdGhpcy5fX21pbjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX19tYXggIT09IHVuZGVmaW5lZCAmJiB2ID4gdGhpcy5fX21heCkge1xuICAgICAgICAgICAgdiA9IHRoaXMuX19tYXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuX19zdGVwICE9PSB1bmRlZmluZWQgJiYgdiAlIHRoaXMuX19zdGVwICE9IDApIHtcbiAgICAgICAgICAgIHYgPSBNYXRoLnJvdW5kKHYgLyB0aGlzLl9fc3RlcCkgKiB0aGlzLl9fc3RlcDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gTnVtYmVyQ29udHJvbGxlci5zdXBlcmNsYXNzLnByb3RvdHlwZS5zZXRWYWx1ZS5jYWxsKHRoaXMsIHYpO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZnkgYSBtaW5pbXVtIHZhbHVlIGZvciA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG1pblZhbHVlIFRoZSBtaW5pbXVtIHZhbHVlIGZvclxuICAgICAgICAgKiA8Y29kZT5vYmplY3RbcHJvcGVydHldPC9jb2RlPlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJ9IHRoaXNcbiAgICAgICAgICovXG4gICAgICAgIG1pbjogZnVuY3Rpb24odikge1xuICAgICAgICAgIHRoaXMuX19taW4gPSB2O1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZ5IGEgbWF4aW11bSB2YWx1ZSBmb3IgPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhWYWx1ZSBUaGUgbWF4aW11bSB2YWx1ZSBmb3JcbiAgICAgICAgICogPGNvZGU+b2JqZWN0W3Byb3BlcnR5XTwvY29kZT5cbiAgICAgICAgICogQHJldHVybnMge2RhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyfSB0aGlzXG4gICAgICAgICAqL1xuICAgICAgICBtYXg6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICB0aGlzLl9fbWF4ID0gdjtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3BlY2lmeSBhIHN0ZXAgdmFsdWUgdGhhdCBkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlclxuICAgICAgICAgKiBpbmNyZW1lbnRzIGJ5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RlcFZhbHVlIFRoZSBzdGVwIHZhbHVlIGZvclxuICAgICAgICAgKiBkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlclxuICAgICAgICAgKiBAZGVmYXVsdCBpZiBtaW5pbXVtIGFuZCBtYXhpbXVtIHNwZWNpZmllZCBpbmNyZW1lbnQgaXMgMSUgb2YgdGhlXG4gICAgICAgICAqIGRpZmZlcmVuY2Ugb3RoZXJ3aXNlIHN0ZXBWYWx1ZSBpcyAxXG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlcn0gdGhpc1xuICAgICAgICAgKi9cbiAgICAgICAgc3RlcDogZnVuY3Rpb24odikge1xuICAgICAgICAgIHRoaXMuX19zdGVwID0gdjtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgKTtcblxuICBmdW5jdGlvbiBudW1EZWNpbWFscyh4KSB7XG4gICAgeCA9IHgudG9TdHJpbmcoKTtcbiAgICBpZiAoeC5pbmRleE9mKCcuJykgPiAtMSkge1xuICAgICAgcmV0dXJuIHgubGVuZ3RoIC0geC5pbmRleE9mKCcuJykgLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTnVtYmVyQ29udHJvbGxlcjtcblxufSkoZGF0LmNvbnRyb2xsZXJzLkNvbnRyb2xsZXIsXG5kYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlckJveCA9IChmdW5jdGlvbiAoTnVtYmVyQ29udHJvbGxlciwgZG9tLCBjb21tb24pIHtcblxuICAvKipcbiAgICogQGNsYXNzIFJlcHJlc2VudHMgYSBnaXZlbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgdGhhdCBpcyBhIG51bWJlciBhbmRcbiAgICogcHJvdmlkZXMgYW4gaW5wdXQgZWxlbWVudCB3aXRoIHdoaWNoIHRvIG1hbmlwdWxhdGUgaXQuXG4gICAqXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXSBPcHRpb25hbCBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW1zLm1pbl0gTWluaW11bSBhbGxvd2VkIHZhbHVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW1zLm1heF0gTWF4aW11bSBhbGxvd2VkIHZhbHVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW1zLnN0ZXBdIEluY3JlbWVudCBieSB3aGljaCB0byBjaGFuZ2UgdmFsdWVcbiAgICpcbiAgICogQG1lbWJlciBkYXQuY29udHJvbGxlcnNcbiAgICovXG4gIHZhciBOdW1iZXJDb250cm9sbGVyQm94ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zKSB7XG5cbiAgICB0aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IGZhbHNlO1xuXG4gICAgTnVtYmVyQ29udHJvbGxlckJveC5zdXBlcmNsYXNzLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zKTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiB7TnVtYmVyfSBQcmV2aW91cyBtb3VzZSB5IHBvc2l0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHZhciBwcmV2X3k7XG5cbiAgICB0aGlzLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuX19pbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuXG4gICAgLy8gTWFrZXMgaXQgc28gbWFudWFsbHkgc3BlY2lmaWVkIHZhbHVlcyBhcmUgbm90IHRydW5jYXRlZC5cblxuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdibHVyJywgb25CbHVyKTtcbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgLy8gV2hlbiBwcmVzc2luZyBlbnRpcmUsIHlvdSBjYW4gYmUgYXMgcHJlY2lzZSBhcyB5b3Ugd2FudC5cbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIF90aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgICBfdGhpcy5fX3RydW5jYXRpb25TdXNwZW5kZWQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgICB2YXIgYXR0ZW1wdGVkID0gcGFyc2VGbG9hdChfdGhpcy5fX2lucHV0LnZhbHVlKTtcbiAgICAgIGlmICghY29tbW9uLmlzTmFOKGF0dGVtcHRlZCkpIF90aGlzLnNldFZhbHVlKGF0dGVtcHRlZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgb25DaGFuZ2UoKTtcbiAgICAgIGlmIChfdGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChfdGhpcywgX3RoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBwcmV2X3kgPSBlLmNsaWVudFk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURyYWcoZSkge1xuXG4gICAgICB2YXIgZGlmZiA9IHByZXZfeSAtIGUuY2xpZW50WTtcbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLmdldFZhbHVlKCkgKyBkaWZmICogX3RoaXMuX19pbXBsaWVkU3RlcCk7XG5cbiAgICAgIHByZXZfeSA9IGUuY2xpZW50WTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcblxuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9faW5wdXQpO1xuXG4gIH07XG5cbiAgTnVtYmVyQ29udHJvbGxlckJveC5zdXBlcmNsYXNzID0gTnVtYmVyQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBOdW1iZXJDb250cm9sbGVyQm94LnByb3RvdHlwZSxcbiAgICAgIE51bWJlckNvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICB7XG5cbiAgICAgICAgdXBkYXRlRGlzcGxheTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICB0aGlzLl9faW5wdXQudmFsdWUgPSB0aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA/IHRoaXMuZ2V0VmFsdWUoKSA6IHJvdW5kVG9EZWNpbWFsKHRoaXMuZ2V0VmFsdWUoKSwgdGhpcy5fX3ByZWNpc2lvbik7XG4gICAgICAgICAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJCb3guc3VwZXJjbGFzcy5wcm90b3R5cGUudXBkYXRlRGlzcGxheS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIGZ1bmN0aW9uIHJvdW5kVG9EZWNpbWFsKHZhbHVlLCBkZWNpbWFscykge1xuICAgIHZhciB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcbiAgfVxuXG4gIHJldHVybiBOdW1iZXJDb250cm9sbGVyQm94O1xuXG59KShkYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlcixcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNvbW1vbik7XG5cblxuZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJTbGlkZXIgPSAoZnVuY3Rpb24gKE51bWJlckNvbnRyb2xsZXIsIGRvbSwgY3NzLCBjb21tb24sIHN0eWxlU2hlZXQpIHtcblxuICAvKipcbiAgICogQGNsYXNzIFJlcHJlc2VudHMgYSBnaXZlbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgdGhhdCBpcyBhIG51bWJlciwgY29udGFpbnNcbiAgICogYSBtaW5pbXVtIGFuZCBtYXhpbXVtLCBhbmQgcHJvdmlkZXMgYSBzbGlkZXIgZWxlbWVudCB3aXRoIHdoaWNoIHRvXG4gICAqIG1hbmlwdWxhdGUgaXQuIEl0IHNob3VsZCBiZSBub3RlZCB0aGF0IHRoZSBzbGlkZXIgZWxlbWVudCBpcyBtYWRlIHVwIG9mXG4gICAqIDxjb2RlPiZsdDtkaXYmZ3Q7PC9jb2RlPiB0YWdzLCA8c3Ryb25nPm5vdDwvc3Ryb25nPiB0aGUgaHRtbDVcbiAgICogPGNvZGU+Jmx0O3NsaWRlciZndDs8L2NvZGU+IGVsZW1lbnQuXG4gICAqXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyXG4gICAqIFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge051bWJlcn0gbWluVmFsdWUgTWluaW11bSBhbGxvd2VkIHZhbHVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhWYWx1ZSBNYXhpbXVtIGFsbG93ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXBWYWx1ZSBJbmNyZW1lbnQgYnkgd2hpY2ggdG8gY2hhbmdlIHZhbHVlXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgTnVtYmVyQ29udHJvbGxlclNsaWRlciA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIG1pbiwgbWF4LCBzdGVwKSB7XG5cbiAgICBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5LCB7IG1pbjogbWluLCBtYXg6IG1heCwgc3RlcDogc3RlcCB9KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLl9fYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX19mb3JlZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgXG5cblxuICAgIGRvbS5iaW5kKHRoaXMuX19iYWNrZ3JvdW5kLCAnbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgIFxuICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fYmFja2dyb3VuZCwgJ3NsaWRlcicpO1xuICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fZm9yZWdyb3VuZCwgJ3NsaWRlci1mZycpO1xuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuXG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcblxuICAgICAgb25Nb3VzZURyYWcoZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURyYWcoZSkge1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBvZmZzZXQgPSBkb20uZ2V0T2Zmc2V0KF90aGlzLl9fYmFja2dyb3VuZCk7XG4gICAgICB2YXIgd2lkdGggPSBkb20uZ2V0V2lkdGgoX3RoaXMuX19iYWNrZ3JvdW5kKTtcbiAgICAgIFxuICAgICAgX3RoaXMuc2V0VmFsdWUoXG4gICAgICAgIG1hcChlLmNsaWVudFgsIG9mZnNldC5sZWZ0LCBvZmZzZXQubGVmdCArIHdpZHRoLCBfdGhpcy5fX21pbiwgX3RoaXMuX19tYXgpXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBpZiAoX3RoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoX3RoaXMsIF90aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuXG4gICAgdGhpcy5fX2JhY2tncm91bmQuYXBwZW5kQ2hpbGQodGhpcy5fX2ZvcmVncm91bmQpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fYmFja2dyb3VuZCk7XG5cbiAgfTtcblxuICBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnN1cGVyY2xhc3MgPSBOdW1iZXJDb250cm9sbGVyO1xuXG4gIC8qKlxuICAgKiBJbmplY3RzIGRlZmF1bHQgc3R5bGVzaGVldCBmb3Igc2xpZGVyIGVsZW1lbnRzLlxuICAgKi9cbiAgTnVtYmVyQ29udHJvbGxlclNsaWRlci51c2VEZWZhdWx0U3R5bGVzID0gZnVuY3Rpb24oKSB7XG4gICAgY3NzLmluamVjdChzdHlsZVNoZWV0KTtcbiAgfTtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnByb3RvdHlwZSxcbiAgICAgIE51bWJlckNvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICB7XG5cbiAgICAgICAgdXBkYXRlRGlzcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHBjdCA9ICh0aGlzLmdldFZhbHVlKCkgLSB0aGlzLl9fbWluKS8odGhpcy5fX21heCAtIHRoaXMuX19taW4pO1xuICAgICAgICAgIHRoaXMuX19mb3JlZ3JvdW5kLnN0eWxlLndpZHRoID0gcGN0KjEwMCsnJSc7XG4gICAgICAgICAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJTbGlkZXIuc3VwZXJjbGFzcy5wcm90b3R5cGUudXBkYXRlRGlzcGxheS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuXG5cbiAgKTtcblxuICBmdW5jdGlvbiBtYXAodiwgaTEsIGkyLCBvMSwgbzIpIHtcbiAgICByZXR1cm4gbzEgKyAobzIgLSBvMSkgKiAoKHYgLSBpMSkgLyAoaTIgLSBpMSkpO1xuICB9XG5cbiAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJTbGlkZXI7XG4gIFxufSkoZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXIsXG5kYXQuZG9tLmRvbSxcbmRhdC51dGlscy5jc3MsXG5kYXQudXRpbHMuY29tbW9uLFxuXCIuc2xpZGVyIHtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMnB4IDRweCByZ2JhKDAsMCwwLDAuMTUpO1xcbiAgaGVpZ2h0OiAxZW07XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xcbiAgcGFkZGluZzogMCAwLjVlbTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5zbGlkZXItZmcge1xcbiAgcGFkZGluZzogMXB4IDAgMnB4IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWFhO1xcbiAgaGVpZ2h0OiAxZW07XFxuICBtYXJnaW4tbGVmdDogLTAuNWVtO1xcbiAgcGFkZGluZy1yaWdodDogMC41ZW07XFxuICBib3JkZXItcmFkaXVzOiAxZW0gMCAwIDFlbTtcXG59XFxuXFxuLnNsaWRlci1mZzphZnRlciB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyOiAgMXB4IHNvbGlkICNhYWE7XFxuICBjb250ZW50OiAnJztcXG4gIGZsb2F0OiByaWdodDtcXG4gIG1hcmdpbi1yaWdodDogLTFlbTtcXG4gIG1hcmdpbi10b3A6IC0xcHg7XFxuICBoZWlnaHQ6IDAuOWVtO1xcbiAgd2lkdGg6IDAuOWVtO1xcbn1cIik7XG5cblxuZGF0LmNvbnRyb2xsZXJzLkZ1bmN0aW9uQ29udHJvbGxlciA9IChmdW5jdGlvbiAoQ29udHJvbGxlciwgZG9tLCBjb21tb24pIHtcblxuICAvKipcbiAgICogQGNsYXNzIFByb3ZpZGVzIGEgR1VJIGludGVyZmFjZSB0byBmaXJlIGEgc3BlY2lmaWVkIG1ldGhvZCwgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgRnVuY3Rpb25Db250cm9sbGVyID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgdGV4dCkge1xuXG4gICAgRnVuY3Rpb25Db250cm9sbGVyLnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLl9fYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX2J1dHRvbi5pbm5lckhUTUwgPSB0ZXh0ID09PSB1bmRlZmluZWQgPyAnRmlyZScgOiB0ZXh0O1xuICAgIGRvbS5iaW5kKHRoaXMuX19idXR0b24sICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF90aGlzLmZpcmUoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fYnV0dG9uLCAnYnV0dG9uJyk7XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX2J1dHRvbik7XG5cblxuICB9O1xuXG4gIEZ1bmN0aW9uQ29udHJvbGxlci5zdXBlcmNsYXNzID0gQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBGdW5jdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLFxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG4gICAgICB7XG4gICAgICAgIFxuICAgICAgICBmaXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodGhpcy5fX29uQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLl9fb25DaGFuZ2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nZXRWYWx1ZSgpLmNhbGwodGhpcy5vYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgKTtcblxuICByZXR1cm4gRnVuY3Rpb25Db250cm9sbGVyO1xuXG59KShkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcixcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNvbW1vbik7XG5cblxuZGF0LmNvbnRyb2xsZXJzLkJvb2xlYW5Db250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBkb20sIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUHJvdmlkZXMgYSBjaGVja2JveCBpbnB1dCB0byBhbHRlciB0aGUgYm9vbGVhbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gICAqIEBleHRlbmRzIGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSBtYW5pcHVsYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIG1hbmlwdWxhdGVkXG4gICAqXG4gICAqIEBtZW1iZXIgZGF0LmNvbnRyb2xsZXJzXG4gICAqL1xuICB2YXIgQm9vbGVhbkNvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG5cbiAgICBCb29sZWFuQ29udHJvbGxlci5zdXBlcmNsYXNzLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMuX19wcmV2ID0gdGhpcy5nZXRWYWx1ZSgpO1xuXG4gICAgdGhpcy5fX2NoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLl9fY2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG5cblxuICAgIGRvbS5iaW5kKHRoaXMuX19jaGVja2JveCwgJ2NoYW5nZScsIG9uQ2hhbmdlLCBmYWxzZSk7XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX2NoZWNrYm94KTtcblxuICAgIC8vIE1hdGNoIG9yaWdpbmFsIHZhbHVlXG4gICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG5cbiAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgIF90aGlzLnNldFZhbHVlKCFfdGhpcy5fX3ByZXYpO1xuICAgIH1cblxuICB9O1xuXG4gIEJvb2xlYW5Db250cm9sbGVyLnN1cGVyY2xhc3MgPSBDb250cm9sbGVyO1xuXG4gIGNvbW1vbi5leHRlbmQoXG5cbiAgICAgIEJvb2xlYW5Db250cm9sbGVyLnByb3RvdHlwZSxcbiAgICAgIENvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICB7XG5cbiAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBCb29sZWFuQ29udHJvbGxlci5zdXBlcmNsYXNzLnByb3RvdHlwZS5zZXRWYWx1ZS5jYWxsKHRoaXMsIHYpO1xuICAgICAgICAgIGlmICh0aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKHRoaXMsIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX19wcmV2ID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZSgpID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLl9fY2hlY2tib3guc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIHRoaXMuX19jaGVja2JveC5jaGVja2VkID0gdHJ1ZTsgICAgXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gQm9vbGVhbkNvbnRyb2xsZXIuc3VwZXJjbGFzcy5wcm90b3R5cGUudXBkYXRlRGlzcGxheS5jYWxsKHRoaXMpO1xuXG4gICAgICAgIH1cblxuXG4gICAgICB9XG5cbiAgKTtcblxuICByZXR1cm4gQm9vbGVhbkNvbnRyb2xsZXI7XG5cbn0pKGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyLFxuZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuY29sb3IudG9TdHJpbmcgPSAoZnVuY3Rpb24gKGNvbW1vbikge1xuXG4gIHJldHVybiBmdW5jdGlvbihjb2xvcikge1xuXG4gICAgaWYgKGNvbG9yLmEgPT0gMSB8fCBjb21tb24uaXNVbmRlZmluZWQoY29sb3IuYSkpIHtcblxuICAgICAgdmFyIHMgPSBjb2xvci5oZXgudG9TdHJpbmcoMTYpO1xuICAgICAgd2hpbGUgKHMubGVuZ3RoIDwgNikge1xuICAgICAgICBzID0gJzAnICsgcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcjJyArIHM7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByZXR1cm4gJ3JnYmEoJyArIE1hdGgucm91bmQoY29sb3IucikgKyAnLCcgKyBNYXRoLnJvdW5kKGNvbG9yLmcpICsgJywnICsgTWF0aC5yb3VuZChjb2xvci5iKSArICcsJyArIGNvbG9yLmEgKyAnKSc7XG5cbiAgICB9XG5cbiAgfVxuXG59KShkYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuY29sb3IuaW50ZXJwcmV0ID0gKGZ1bmN0aW9uICh0b1N0cmluZywgY29tbW9uKSB7XG5cbiAgdmFyIHJlc3VsdCwgdG9SZXR1cm47XG5cbiAgdmFyIGludGVycHJldCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdG9SZXR1cm4gPSBmYWxzZTtcblxuICAgIHZhciBvcmlnaW5hbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gY29tbW9uLnRvQXJyYXkoYXJndW1lbnRzKSA6IGFyZ3VtZW50c1swXTtcblxuICAgIGNvbW1vbi5lYWNoKElOVEVSUFJFVEFUSU9OUywgZnVuY3Rpb24oZmFtaWx5KSB7XG5cbiAgICAgIGlmIChmYW1pbHkubGl0bXVzKG9yaWdpbmFsKSkge1xuXG4gICAgICAgIGNvbW1vbi5lYWNoKGZhbWlseS5jb252ZXJzaW9ucywgZnVuY3Rpb24oY29udmVyc2lvbiwgY29udmVyc2lvbk5hbWUpIHtcblxuICAgICAgICAgIHJlc3VsdCA9IGNvbnZlcnNpb24ucmVhZChvcmlnaW5hbCk7XG5cbiAgICAgICAgICBpZiAodG9SZXR1cm4gPT09IGZhbHNlICYmIHJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRvUmV0dXJuID0gcmVzdWx0O1xuICAgICAgICAgICAgcmVzdWx0LmNvbnZlcnNpb25OYW1lID0gY29udmVyc2lvbk5hbWU7XG4gICAgICAgICAgICByZXN1bHQuY29udmVyc2lvbiA9IGNvbnZlcnNpb247XG4gICAgICAgICAgICByZXR1cm4gY29tbW9uLkJSRUFLO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb21tb24uQlJFQUs7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuXG4gIH07XG5cbiAgdmFyIElOVEVSUFJFVEFUSU9OUyA9IFtcblxuICAgIC8vIFN0cmluZ3NcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzU3RyaW5nLFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFRIUkVFX0NIQVJfSEVYOiB7XG5cbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuXG4gICAgICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9eIyhbQS1GMC05XSkoW0EtRjAtOV0pKFtBLUYwLTldKSQvaSk7XG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgICAgIGhleDogcGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAnMHgnICtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0WzFdLnRvU3RyaW5nKCkgKyB0ZXN0WzFdLnRvU3RyaW5nKCkgK1xuICAgICAgICAgICAgICAgICAgICAgIHRlc3RbMl0udG9TdHJpbmcoKSArIHRlc3RbMl0udG9TdHJpbmcoKSArXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdFszXS50b1N0cmluZygpICsgdGVzdFszXS50b1N0cmluZygpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9LFxuXG4gICAgICAgIFNJWF9DSEFSX0hFWDoge1xuXG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXiMoW0EtRjAtOV17Nn0pJC9pKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICAgICAgaGV4OiBwYXJzZUludCgnMHgnICsgdGVzdFsxXS50b1N0cmluZygpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9LFxuXG4gICAgICAgIENTU19SR0I6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgICAgICBnOiBwYXJzZUZsb2F0KHRlc3RbMl0pLFxuICAgICAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiB0b1N0cmluZ1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgQ1NTX1JHQkE6IHtcblxuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JhXFwoXFxzKiguKylcXHMqLFxccyooLispXFxzKixcXHMqKC4rKVxccypcXCxcXHMqKC4rKVxccypcXCkvKTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogcGFyc2VGbG9hdCh0ZXN0WzFdKSxcbiAgICAgICAgICAgICAgZzogcGFyc2VGbG9hdCh0ZXN0WzJdKSxcbiAgICAgICAgICAgICAgYjogcGFyc2VGbG9hdCh0ZXN0WzNdKSxcbiAgICAgICAgICAgICAgYTogcGFyc2VGbG9hdCh0ZXN0WzRdKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogdG9TdHJpbmdcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBOdW1iZXJzXG4gICAge1xuXG4gICAgICBsaXRtdXM6IGNvbW1vbi5pc051bWJlcixcblxuICAgICAgY29udmVyc2lvbnM6IHtcblxuICAgICAgICBIRVg6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc3BhY2U6ICdIRVgnLFxuICAgICAgICAgICAgICBoZXg6IG9yaWdpbmFsLFxuICAgICAgICAgICAgICBjb252ZXJzaW9uTmFtZTogJ0hFWCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sb3IuaGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gQXJyYXlzXG4gICAge1xuXG4gICAgICBsaXRtdXM6IGNvbW1vbi5pc0FycmF5LFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFJHQl9BUlJBWToge1xuICAgICAgICAgIHJlYWQ6IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9IDMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgICAgcjogb3JpZ2luYWxbMF0sXG4gICAgICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgICAgICBiOiBvcmlnaW5hbFsyXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmJdO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIFJHQkFfQVJSQVk6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCAhPSA0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgIHI6IG9yaWdpbmFsWzBdLFxuICAgICAgICAgICAgICBnOiBvcmlnaW5hbFsxXSxcbiAgICAgICAgICAgICAgYjogb3JpZ2luYWxbMl0sXG4gICAgICAgICAgICAgIGE6IG9yaWdpbmFsWzNdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYV07XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIE9iamVjdHNcbiAgICB7XG5cbiAgICAgIGxpdG11czogY29tbW9uLmlzT2JqZWN0LFxuXG4gICAgICBjb252ZXJzaW9uczoge1xuXG4gICAgICAgIFJHQkFfT0JKOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuZykgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgICAgcjogb3JpZ2luYWwucixcbiAgICAgICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgICAgIGI6IG9yaWdpbmFsLmIsXG4gICAgICAgICAgICAgICAgYTogb3JpZ2luYWwuYVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcjogY29sb3IucixcbiAgICAgICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICAgICAgYjogY29sb3IuYixcbiAgICAgICAgICAgICAgYTogY29sb3IuYVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBSR0JfT0JKOiB7XG4gICAgICAgICAgcmVhZDogZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICAgICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuZykgJiZcbiAgICAgICAgICAgICAgICBjb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICAgICAgcjogb3JpZ2luYWwucixcbiAgICAgICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgICAgIGI6IG9yaWdpbmFsLmJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB3cml0ZTogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHI6IGNvbG9yLnIsXG4gICAgICAgICAgICAgIGc6IGNvbG9yLmcsXG4gICAgICAgICAgICAgIGI6IGNvbG9yLmJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgSFNWQV9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5oKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC52KSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5hKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnSFNWJyxcbiAgICAgICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgICAgIHM6IG9yaWdpbmFsLnMsXG4gICAgICAgICAgICAgICAgdjogb3JpZ2luYWwudixcbiAgICAgICAgICAgICAgICBhOiBvcmlnaW5hbC5hXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgd3JpdGU6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgICAgICB2OiBjb2xvci52LFxuICAgICAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIEhTVl9PQko6IHtcbiAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5oKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJlxuICAgICAgICAgICAgICAgIGNvbW1vbi5pc051bWJlcihvcmlnaW5hbC52KSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNwYWNlOiAnSFNWJyxcbiAgICAgICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgICAgIHM6IG9yaWdpbmFsLnMsXG4gICAgICAgICAgICAgICAgdjogb3JpZ2luYWwudlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHdyaXRlOiBmdW5jdGlvbihjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaDogY29sb3IuaCxcbiAgICAgICAgICAgICAgczogY29sb3IucyxcbiAgICAgICAgICAgICAgdjogY29sb3IudlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuXG4gIF07XG5cbiAgcmV0dXJuIGludGVycHJldDtcblxuXG59KShkYXQuY29sb3IudG9TdHJpbmcsXG5kYXQudXRpbHMuY29tbW9uKTtcblxuXG5kYXQuR1VJID0gZGF0Lmd1aS5HVUkgPSAoZnVuY3Rpb24gKGNzcywgc2F2ZURpYWxvZ3VlQ29udGVudHMsIHN0eWxlU2hlZXQsIGNvbnRyb2xsZXJGYWN0b3J5LCBDb250cm9sbGVyLCBCb29sZWFuQ29udHJvbGxlciwgRnVuY3Rpb25Db250cm9sbGVyLCBOdW1iZXJDb250cm9sbGVyQm94LCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLCBPcHRpb25Db250cm9sbGVyLCBDb2xvckNvbnRyb2xsZXIsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgQ2VudGVyZWREaXYsIGRvbSwgY29tbW9uKSB7XG5cbiAgY3NzLmluamVjdChzdHlsZVNoZWV0KTtcblxuICAvKiogT3V0ZXItbW9zdCBjbGFzc05hbWUgZm9yIEdVSSdzICovXG4gIHZhciBDU1NfTkFNRVNQQUNFID0gJ2RnJztcblxuICB2YXIgSElERV9LRVlfQ09ERSA9IDcyO1xuXG4gIC8qKiBUaGUgb25seSB2YWx1ZSBzaGFyZWQgYmV0d2VlbiB0aGUgSlMgYW5kIFNDU1MuIFVzZSBjYXV0aW9uLiAqL1xuICB2YXIgQ0xPU0VfQlVUVE9OX0hFSUdIVCA9IDIwO1xuXG4gIHZhciBERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUUgPSAnRGVmYXVsdCc7XG5cbiAgdmFyIFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgPSAoZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAnbG9jYWxTdG9yYWdlJyBpbiB3aW5kb3cgJiYgd2luZG93Wydsb2NhbFN0b3JhZ2UnXSAhPT0gbnVsbDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KSgpO1xuXG4gIHZhciBTQVZFX0RJQUxPR1VFO1xuXG4gIC8qKiBIYXZlIHdlIHlldCB0byBjcmVhdGUgYW4gYXV0b1BsYWNlIEdVST8gKi9cbiAgdmFyIGF1dG9fcGxhY2VfdmlyZ2luID0gdHJ1ZTtcblxuICAvKiogRml4ZWQgcG9zaXRpb24gZGl2IHRoYXQgYXV0byBwbGFjZSBHVUkncyBnbyBpbnNpZGUgKi9cbiAgdmFyIGF1dG9fcGxhY2VfY29udGFpbmVyO1xuXG4gIC8qKiBBcmUgd2UgaGlkaW5nIHRoZSBHVUkncyA/ICovXG4gIHZhciBoaWRlID0gZmFsc2U7XG5cbiAgLyoqIEdVSSdzIHdoaWNoIHNob3VsZCBiZSBoaWRkZW4gKi9cbiAgdmFyIGhpZGVhYmxlX2d1aXMgPSBbXTtcblxuICAvKipcbiAgICogQSBsaWdodHdlaWdodCBjb250cm9sbGVyIGxpYnJhcnkgZm9yIEphdmFTY3JpcHQuIEl0IGFsbG93cyB5b3UgdG8gZWFzaWx5XG4gICAqIG1hbmlwdWxhdGUgdmFyaWFibGVzIGFuZCBmaXJlIGZ1bmN0aW9ucyBvbiB0aGUgZmx5LlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogQG1lbWJlciBkYXQuZ3VpXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5uYW1lXSBUaGUgbmFtZSBvZiB0aGlzIEdVSS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMubG9hZF0gSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzYXZlZCBzdGF0ZSBvZlxuICAgKiB0aGlzIEdVSS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbcGFyYW1zLmF1dG89dHJ1ZV1cbiAgICogQHBhcmFtIHtkYXQuZ3VpLkdVSX0gW3BhcmFtcy5wYXJlbnRdIFRoZSBHVUkgSSdtIG5lc3RlZCBpbi5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbcGFyYW1zLmNsb3NlZF0gSWYgdHJ1ZSwgc3RhcnRzIGNsb3NlZFxuICAgKi9cbiAgdmFyIEdVSSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8qKlxuICAgICAqIE91dGVybW9zdCBET00gRWxlbWVudFxuICAgICAqIEB0eXBlIERPTUVsZW1lbnRcbiAgICAgKi9cbiAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fdWwpO1xuXG4gICAgZG9tLmFkZENsYXNzKHRoaXMuZG9tRWxlbWVudCwgQ1NTX05BTUVTUEFDRSk7XG5cbiAgICAvKipcbiAgICAgKiBOZXN0ZWQgR1VJJ3MgYnkgbmFtZVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB0aGlzLl9fZm9sZGVycyA9IHt9O1xuXG4gICAgdGhpcy5fX2NvbnRyb2xsZXJzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIG9iamVjdHMgSSdtIHJlbWVtYmVyaW5nIGZvciBzYXZlLCBvbmx5IHVzZWQgaW4gdG9wIGxldmVsIEdVSVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB0aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIE1hcHMgdGhlIGluZGV4IG9mIHJlbWVtYmVyZWQgb2JqZWN0cyB0byBhIG1hcCBvZiBjb250cm9sbGVycywgb25seSB1c2VkXG4gICAgICogaW4gdG9wIGxldmVsIEdVSS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBbXG4gICAgICogIHtcbiAgICAgKiAgICBwcm9wZXJ0eU5hbWU6IENvbnRyb2xsZXIsXG4gICAgICogICAgYW5vdGhlclByb3BlcnR5TmFtZTogQ29udHJvbGxlclxuICAgICAqICB9LFxuICAgICAqICB7XG4gICAgICogICAgcHJvcGVydHlOYW1lOiBDb250cm9sbGVyXG4gICAgICogIH1cbiAgICAgKiBdXG4gICAgICovXG4gICAgdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVycyA9IFtdO1xuXG4gICAgdGhpcy5fX2xpc3RlbmluZyA9IFtdO1xuXG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgLy8gRGVmYXVsdCBwYXJhbWV0ZXJzXG4gICAgcGFyYW1zID0gY29tbW9uLmRlZmF1bHRzKHBhcmFtcywge1xuICAgICAgYXV0b1BsYWNlOiB0cnVlLFxuICAgICAgd2lkdGg6IEdVSS5ERUZBVUxUX1dJRFRIXG4gICAgfSk7XG5cbiAgICBwYXJhbXMgPSBjb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgICByZXNpemFibGU6IHBhcmFtcy5hdXRvUGxhY2UsXG4gICAgICBoaWRlYWJsZTogcGFyYW1zLmF1dG9QbGFjZVxuICAgIH0pO1xuXG5cbiAgICBpZiAoIWNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMubG9hZCkpIHtcblxuICAgICAgLy8gRXhwbGljaXQgcHJlc2V0XG4gICAgICBpZiAocGFyYW1zLnByZXNldCkgcGFyYW1zLmxvYWQucHJlc2V0ID0gcGFyYW1zLnByZXNldDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHBhcmFtcy5sb2FkID0geyBwcmVzZXQ6IERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSB9O1xuXG4gICAgfVxuXG4gICAgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSAmJiBwYXJhbXMuaGlkZWFibGUpIHtcbiAgICAgIGhpZGVhYmxlX2d1aXMucHVzaCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJvb3QgbGV2ZWwgR1VJJ3MgYXJlIHJlc2l6YWJsZS5cbiAgICBwYXJhbXMucmVzaXphYmxlID0gY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpICYmIHBhcmFtcy5yZXNpemFibGU7XG5cblxuICAgIGlmIChwYXJhbXMuYXV0b1BsYWNlICYmIGNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMuc2Nyb2xsYWJsZSkpIHtcbiAgICAgIHBhcmFtcy5zY3JvbGxhYmxlID0gdHJ1ZTtcbiAgICB9XG4vLyAgICBwYXJhbXMuc2Nyb2xsYWJsZSA9IGNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSAmJiBwYXJhbXMuc2Nyb2xsYWJsZSA9PT0gdHJ1ZTtcblxuICAgIC8vIE5vdCBwYXJ0IG9mIHBhcmFtcyBiZWNhdXNlIEkgZG9uJ3Qgd2FudCBwZW9wbGUgcGFzc2luZyB0aGlzIGluIHZpYVxuICAgIC8vIGNvbnN0cnVjdG9yLiBTaG91bGQgYmUgYSAncmVtZW1iZXJlZCcgdmFsdWUuXG4gICAgdmFyIHVzZV9sb2NhbF9zdG9yYWdlID1cbiAgICAgICAgU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSAmJlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaCh0aGlzLCAnaXNMb2NhbCcpKSA9PT0gJ3RydWUnO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcyxcblxuICAgICAgICAvKiogQGxlbmRzIGRhdC5ndWkuR1VJLnByb3RvdHlwZSAqL1xuICAgICAgICB7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgcGFyZW50IDxjb2RlPkdVSTwvY29kZT5cbiAgICAgICAgICAgKiBAdHlwZSBkYXQuZ3VpLkdVSVxuICAgICAgICAgICAqL1xuICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHNjcm9sbGFibGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJhbXMuc2Nyb2xsYWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSGFuZGxlcyA8Y29kZT5HVUk8L2NvZGU+J3MgZWxlbWVudCBwbGFjZW1lbnQgZm9yIHlvdVxuICAgICAgICAgICAqIEB0eXBlIEJvb2xlYW5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBhdXRvUGxhY2U6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJhbXMuYXV0b1BsYWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgaWRlbnRpZmllciBmb3IgYSBzZXQgb2Ygc2F2ZWQgdmFsdWVzXG4gICAgICAgICAgICogQHR5cGUgU3RyaW5nXG4gICAgICAgICAgICovXG4gICAgICAgICAgcHJlc2V0OiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0Um9vdCgpLnByZXNldDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLmxvYWQucHJlc2V0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmdldFJvb3QoKS5wcmVzZXQgPSB2O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5sb2FkLnByZXNldCA9IHY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2V0UHJlc2V0U2VsZWN0SW5kZXgodGhpcyk7XG4gICAgICAgICAgICAgIF90aGlzLnJldmVydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSB3aWR0aCBvZiA8Y29kZT5HVUk8L2NvZGU+IGVsZW1lbnRcbiAgICAgICAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgICAgICAgKi9cbiAgICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy53aWR0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgcGFyYW1zLndpZHRoID0gdjtcbiAgICAgICAgICAgICAgc2V0V2lkdGgoX3RoaXMsIHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgbmFtZSBvZiA8Y29kZT5HVUk8L2NvZGU+LiBVc2VkIGZvciBmb2xkZXJzLiBpLmVcbiAgICAgICAgICAgKiBhIGZvbGRlcidzIG5hbWVcbiAgICAgICAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zLm5hbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgIC8vIFRPRE8gQ2hlY2sgZm9yIGNvbGxpc2lvbnMgYW1vbmcgc2libGluZyBmb2xkZXJzXG4gICAgICAgICAgICAgIHBhcmFtcy5uYW1lID0gdjtcbiAgICAgICAgICAgICAgaWYgKHRpdGxlX3Jvd19uYW1lKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVfcm93X25hbWUuaW5uZXJIVE1MID0gcGFyYW1zLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogV2hldGhlciB0aGUgPGNvZGU+R1VJPC9jb2RlPiBpcyBjb2xsYXBzZWQgb3Igbm90XG4gICAgICAgICAgICogQHR5cGUgQm9vbGVhblxuICAgICAgICAgICAqL1xuICAgICAgICAgIGNsb3NlZDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy5jbG9zZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgIHBhcmFtcy5jbG9zZWQgPSB2O1xuICAgICAgICAgICAgICBpZiAocGFyYW1zLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIGRvbS5hZGRDbGFzcyhfdGhpcy5fX3VsLCBHVUkuQ0xBU1NfQ0xPU0VEKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoX3RoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gRm9yIGJyb3dzZXJzIHRoYXQgYXJlbid0IGdvaW5nIHRvIHJlc3BlY3QgdGhlIENTUyB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICAvLyBMZXRzIGp1c3QgY2hlY2sgb3VyIGhlaWdodCBhZ2FpbnN0IHRoZSB3aW5kb3cgaGVpZ2h0IHJpZ2h0IG9mZlxuICAgICAgICAgICAgICAvLyB0aGUgYmF0LlxuICAgICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgaWYgKF90aGlzLl9fY2xvc2VCdXR0b24pIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fX2Nsb3NlQnV0dG9uLmlubmVySFRNTCA9IHYgPyBHVUkuVEVYVF9PUEVOIDogR1VJLlRFWFRfQ0xPU0VEO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIENvbnRhaW5zIGFsbCBwcmVzZXRzXG4gICAgICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICAgICovXG4gICAgICAgICAgbG9hZDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcy5sb2FkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIHVzZSA8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL1N0b3JhZ2UjbG9jYWxTdG9yYWdlXCI+bG9jYWxTdG9yYWdlPC9hPiBhcyB0aGUgbWVhbnMgZm9yXG4gICAgICAgICAgICogPGNvZGU+cmVtZW1iZXI8L2NvZGU+aW5nXG4gICAgICAgICAgICogQHR5cGUgQm9vbGVhblxuICAgICAgICAgICAqL1xuICAgICAgICAgIHVzZUxvY2FsU3RvcmFnZToge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdXNlX2xvY2FsX3N0b3JhZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihib29sKSB7XG4gICAgICAgICAgICAgIGlmIChTVVBQT1JUU19MT0NBTF9TVE9SQUdFKSB7XG4gICAgICAgICAgICAgICAgdXNlX2xvY2FsX3N0b3JhZ2UgPSBib29sO1xuICAgICAgICAgICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICAgICAgICBkb20uYmluZCh3aW5kb3csICd1bmxvYWQnLCBzYXZlVG9Mb2NhbFN0b3JhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3VubG9hZCcsIHNhdmVUb0xvY2FsU3RvcmFnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2goX3RoaXMsICdpc0xvY2FsJyksIGJvb2wpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAvLyBBcmUgd2UgYSByb290IGxldmVsIEdVST9cbiAgICBpZiAoY29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpKSB7XG5cbiAgICAgIHBhcmFtcy5jbG9zZWQgPSBmYWxzZTtcblxuICAgICAgZG9tLmFkZENsYXNzKHRoaXMuZG9tRWxlbWVudCwgR1VJLkNMQVNTX01BSU4pO1xuICAgICAgZG9tLm1ha2VTZWxlY3RhYmxlKHRoaXMuZG9tRWxlbWVudCwgZmFsc2UpO1xuXG4gICAgICAvLyBBcmUgd2Ugc3VwcG9zZWQgdG8gYmUgbG9hZGluZyBsb2NhbGx5P1xuICAgICAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UpIHtcblxuICAgICAgICBpZiAodXNlX2xvY2FsX3N0b3JhZ2UpIHtcblxuICAgICAgICAgIF90aGlzLnVzZUxvY2FsU3RvcmFnZSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc2F2ZWRfZ3VpID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaCh0aGlzLCAnZ3VpJykpO1xuXG4gICAgICAgICAgaWYgKHNhdmVkX2d1aSkge1xuICAgICAgICAgICAgcGFyYW1zLmxvYWQgPSBKU09OLnBhcnNlKHNhdmVkX2d1aSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICB0aGlzLl9fY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuX19jbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSBHVUkuVEVYVF9DTE9TRUQ7XG4gICAgICBkb20uYWRkQ2xhc3ModGhpcy5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfQ0xPU0VfQlVUVE9OKTtcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fY2xvc2VCdXR0b24pO1xuXG4gICAgICBkb20uYmluZCh0aGlzLl9fY2xvc2VCdXR0b24sICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIF90aGlzLmNsb3NlZCA9ICFfdGhpcy5jbG9zZWQ7XG5cblxuICAgICAgfSk7XG5cblxuICAgICAgLy8gT2gsIHlvdSdyZSBhIG5lc3RlZCBHVUkhXG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKHBhcmFtcy5jbG9zZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJhbXMuY2xvc2VkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRpdGxlX3Jvd19uYW1lID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFyYW1zLm5hbWUpO1xuICAgICAgZG9tLmFkZENsYXNzKHRpdGxlX3Jvd19uYW1lLCAnY29udHJvbGxlci1uYW1lJyk7XG5cbiAgICAgIHZhciB0aXRsZV9yb3cgPSBhZGRSb3coX3RoaXMsIHRpdGxlX3Jvd19uYW1lKTtcblxuICAgICAgdmFyIG9uX2NsaWNrX3RpdGxlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF90aGlzLmNsb3NlZCA9ICFfdGhpcy5jbG9zZWQ7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fdWwsIEdVSS5DTEFTU19DTE9TRUQpO1xuXG4gICAgICBkb20uYWRkQ2xhc3ModGl0bGVfcm93LCAndGl0bGUnKTtcbiAgICAgIGRvbS5iaW5kKHRpdGxlX3JvdywgJ2NsaWNrJywgb25fY2xpY2tfdGl0bGUpO1xuXG4gICAgICBpZiAoIXBhcmFtcy5jbG9zZWQpIHtcbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmIChwYXJhbXMuYXV0b1BsYWNlKSB7XG5cbiAgICAgIGlmIChjb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkpIHtcblxuICAgICAgICBpZiAoYXV0b19wbGFjZV92aXJnaW4pIHtcbiAgICAgICAgICBhdXRvX3BsYWNlX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGRvbS5hZGRDbGFzcyhhdXRvX3BsYWNlX2NvbnRhaW5lciwgQ1NTX05BTUVTUEFDRSk7XG4gICAgICAgICAgZG9tLmFkZENsYXNzKGF1dG9fcGxhY2VfY29udGFpbmVyLCBHVUkuQ0xBU1NfQVVUT19QTEFDRV9DT05UQUlORVIpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYXV0b19wbGFjZV9jb250YWluZXIpO1xuICAgICAgICAgIGF1dG9fcGxhY2VfdmlyZ2luID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQdXQgaXQgaW4gdGhlIGRvbSBmb3IgeW91LlxuICAgICAgICBhdXRvX3BsYWNlX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIEFwcGx5IHRoZSBhdXRvIHN0eWxlc1xuICAgICAgICBkb20uYWRkQ2xhc3ModGhpcy5kb21FbGVtZW50LCBHVUkuQ0xBU1NfQVVUT19QTEFDRSk7XG5cbiAgICAgIH1cblxuXG4gICAgICAvLyBNYWtlIGl0IG5vdCBlbGFzdGljLlxuICAgICAgaWYgKCF0aGlzLnBhcmVudCkgc2V0V2lkdGgoX3RoaXMsIHBhcmFtcy53aWR0aCk7XG5cbiAgICB9XG5cbiAgICBkb20uYmluZCh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbigpIHsgX3RoaXMub25SZXNpemUoKSB9KTtcbiAgICBkb20uYmluZCh0aGlzLl9fdWwsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7IF90aGlzLm9uUmVzaXplKCk7IH0pO1xuICAgIGRvbS5iaW5kKHRoaXMuX191bCwgJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbigpIHsgX3RoaXMub25SZXNpemUoKSB9KTtcbiAgICBkb20uYmluZCh0aGlzLl9fdWwsICdvVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uKCkgeyBfdGhpcy5vblJlc2l6ZSgpIH0pO1xuICAgIHRoaXMub25SZXNpemUoKTtcblxuXG4gICAgaWYgKHBhcmFtcy5yZXNpemFibGUpIHtcbiAgICAgIGFkZFJlc2l6ZUhhbmRsZSh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlVG9Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKF90aGlzLCAnZ3VpJyksIEpTT04uc3RyaW5naWZ5KF90aGlzLmdldFNhdmVPYmplY3QoKSkpO1xuICAgIH1cblxuICAgIHZhciByb290ID0gX3RoaXMuZ2V0Um9vdCgpO1xuICAgIGZ1bmN0aW9uIHJlc2V0V2lkdGgoKSB7XG4gICAgICAgIHZhciByb290ID0gX3RoaXMuZ2V0Um9vdCgpO1xuICAgICAgICByb290LndpZHRoICs9IDE7XG4gICAgICAgIGNvbW1vbi5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICByb290LndpZHRoIC09IDE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBhcmFtcy5wYXJlbnQpIHtcbiAgICAgICAgcmVzZXRXaWR0aCgpO1xuICAgICAgfVxuXG4gIH07XG5cbiAgR1VJLnRvZ2dsZUhpZGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGhpZGUgPSAhaGlkZTtcbiAgICBjb21tb24uZWFjaChoaWRlYWJsZV9ndWlzLCBmdW5jdGlvbihndWkpIHtcbiAgICAgIGd1aS5kb21FbGVtZW50LnN0eWxlLnpJbmRleCA9IGhpZGUgPyAtOTk5IDogOTk5O1xuICAgICAgZ3VpLmRvbUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IGhpZGUgPyAwIDogMTtcbiAgICB9KTtcbiAgfTtcblxuICBHVUkuQ0xBU1NfQVVUT19QTEFDRSA9ICdhJztcbiAgR1VJLkNMQVNTX0FVVE9fUExBQ0VfQ09OVEFJTkVSID0gJ2FjJztcbiAgR1VJLkNMQVNTX01BSU4gPSAnbWFpbic7XG4gIEdVSS5DTEFTU19DT05UUk9MTEVSX1JPVyA9ICdjcic7XG4gIEdVSS5DTEFTU19UT09fVEFMTCA9ICd0YWxsZXItdGhhbi13aW5kb3cnO1xuICBHVUkuQ0xBU1NfQ0xPU0VEID0gJ2Nsb3NlZCc7XG4gIEdVSS5DTEFTU19DTE9TRV9CVVRUT04gPSAnY2xvc2UtYnV0dG9uJztcbiAgR1VJLkNMQVNTX0RSQUcgPSAnZHJhZyc7XG5cbiAgR1VJLkRFRkFVTFRfV0lEVEggPSAyNDU7XG4gIEdVSS5URVhUX0NMT1NFRCA9ICdDbG9zZSBDb250cm9scyc7XG4gIEdVSS5URVhUX09QRU4gPSAnT3BlbiBDb250cm9scyc7XG5cbiAgZG9tLmJpbmQod2luZG93LCAna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50LnR5cGUgIT09ICd0ZXh0JyAmJlxuICAgICAgICAoZS53aGljaCA9PT0gSElERV9LRVlfQ09ERSB8fCBlLmtleUNvZGUgPT0gSElERV9LRVlfQ09ERSkpIHtcbiAgICAgIEdVSS50b2dnbGVIaWRlKCk7XG4gICAgfVxuXG4gIH0sIGZhbHNlKTtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBHVUkucHJvdG90eXBlLFxuXG4gICAgICAvKiogQGxlbmRzIGRhdC5ndWkuR1VJICovXG4gICAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5XG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcn0gVGhlIG5ldyBjb250cm9sbGVyIHRoYXQgd2FzIGFkZGVkLlxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgIGFkZDogZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXG4gICAgICAgICAgcmV0dXJuIGFkZChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZhY3RvcnlBcmdzOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5XG4gICAgICAgICAqIEByZXR1cm5zIHtkYXQuY29udHJvbGxlcnMuQ29sb3JDb250cm9sbGVyfSBUaGUgbmV3IGNvbnRyb2xsZXIgdGhhdCB3YXMgYWRkZWQuXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkQ29sb3I6IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgICAgICAgIHJldHVybiBhZGQoXG4gICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gY29udHJvbGxlclxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oY29udHJvbGxlcikge1xuXG4gICAgICAgICAgLy8gVE9ETyBsaXN0ZW5pbmc/XG4gICAgICAgICAgdGhpcy5fX3VsLnJlbW92ZUNoaWxkKGNvbnRyb2xsZXIuX19saSk7XG4gICAgICAgICAgdGhpcy5fX2NvbnRyb2xsZXJzLnNsaWNlKHRoaXMuX19jb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpLCAxKTtcbiAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgIGNvbW1vbi5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLm9uUmVzaXplKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmICh0aGlzLmF1dG9QbGFjZSkge1xuICAgICAgICAgICAgYXV0b19wbGFjZV9jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5kb21FbGVtZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIG5hbWVcbiAgICAgICAgICogQHJldHVybnMge2RhdC5ndWkuR1VJfSBUaGUgbmV3IGZvbGRlci5cbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IGlmIHRoaXMgR1VJIGFscmVhZHkgaGFzIGEgZm9sZGVyIGJ5IHRoZSBzcGVjaWZpZWRcbiAgICAgICAgICogbmFtZVxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgIGFkZEZvbGRlcjogZnVuY3Rpb24obmFtZSkge1xuXG4gICAgICAgICAgLy8gV2UgaGF2ZSB0byBwcmV2ZW50IGNvbGxpc2lvbnMgb24gbmFtZXMgaW4gb3JkZXIgdG8gaGF2ZSBhIGtleVxuICAgICAgICAgIC8vIGJ5IHdoaWNoIHRvIHJlbWVtYmVyIHNhdmVkIHZhbHVlc1xuICAgICAgICAgIGlmICh0aGlzLl9fZm9sZGVyc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBhbHJlYWR5IGhhdmUgYSBmb2xkZXIgaW4gdGhpcyBHVUkgYnkgdGhlJyArXG4gICAgICAgICAgICAgICAgJyBuYW1lIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbmV3X2d1aV9wYXJhbXMgPSB7IG5hbWU6IG5hbWUsIHBhcmVudDogdGhpcyB9O1xuXG4gICAgICAgICAgLy8gV2UgbmVlZCB0byBwYXNzIGRvd24gdGhlIGF1dG9QbGFjZSB0cmFpdCBzbyB0aGF0IHdlIGNhblxuICAgICAgICAgIC8vIGF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gb3Blbi9jbG9zZSBmb2xkZXIgYWN0aW9ucyB0b1xuICAgICAgICAgIC8vIGVuc3VyZSB0aGF0IGEgc2Nyb2xsYmFyIGFwcGVhcnMgaWYgdGhlIHdpbmRvdyBpcyB0b28gc2hvcnQuXG4gICAgICAgICAgbmV3X2d1aV9wYXJhbXMuYXV0b1BsYWNlID0gdGhpcy5hdXRvUGxhY2U7XG5cbiAgICAgICAgICAvLyBEbyB3ZSBoYXZlIHNhdmVkIGFwcGVhcmFuY2UgZGF0YSBmb3IgdGhpcyBmb2xkZXI/XG5cbiAgICAgICAgICBpZiAodGhpcy5sb2FkICYmIC8vIEFueXRoaW5nIGxvYWRlZD9cbiAgICAgICAgICAgICAgdGhpcy5sb2FkLmZvbGRlcnMgJiYgLy8gV2FzIG15IHBhcmVudCBhIGRlYWQtZW5kP1xuICAgICAgICAgICAgICB0aGlzLmxvYWQuZm9sZGVyc1tuYW1lXSkgeyAvLyBEaWQgZGFkZHkgcmVtZW1iZXIgbWU/XG5cbiAgICAgICAgICAgIC8vIFN0YXJ0IG1lIGNsb3NlZCBpZiBJIHdhcyBjbG9zZWRcbiAgICAgICAgICAgIG5ld19ndWlfcGFyYW1zLmNsb3NlZCA9IHRoaXMubG9hZC5mb2xkZXJzW25hbWVdLmNsb3NlZDtcblxuICAgICAgICAgICAgLy8gUGFzcyBkb3duIHRoZSBsb2FkZWQgZGF0YVxuICAgICAgICAgICAgbmV3X2d1aV9wYXJhbXMubG9hZCA9IHRoaXMubG9hZC5mb2xkZXJzW25hbWVdO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGd1aSA9IG5ldyBHVUkobmV3X2d1aV9wYXJhbXMpO1xuICAgICAgICAgIHRoaXMuX19mb2xkZXJzW25hbWVdID0gZ3VpO1xuXG4gICAgICAgICAgdmFyIGxpID0gYWRkUm93KHRoaXMsIGd1aS5kb21FbGVtZW50KTtcbiAgICAgICAgICBkb20uYWRkQ2xhc3MobGksICdmb2xkZXInKTtcbiAgICAgICAgICByZXR1cm4gZ3VpO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uUmVzaXplOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciByb290ID0gdGhpcy5nZXRSb290KCk7XG5cbiAgICAgICAgICBpZiAocm9vdC5zY3JvbGxhYmxlKSB7XG5cbiAgICAgICAgICAgIHZhciB0b3AgPSBkb20uZ2V0T2Zmc2V0KHJvb3QuX191bCkudG9wO1xuICAgICAgICAgICAgdmFyIGggPSAwO1xuXG4gICAgICAgICAgICBjb21tb24uZWFjaChyb290Ll9fdWwuY2hpbGROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICBpZiAoISAocm9vdC5hdXRvUGxhY2UgJiYgbm9kZSA9PT0gcm9vdC5fX3NhdmVfcm93KSlcbiAgICAgICAgICAgICAgICBoICs9IGRvbS5nZXRIZWlnaHQobm9kZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIENMT1NFX0JVVFRPTl9IRUlHSFQgPCBoKSB7XG4gICAgICAgICAgICAgIGRvbS5hZGRDbGFzcyhyb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCk7XG4gICAgICAgICAgICAgIHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3AgLSBDTE9TRV9CVVRUT05fSEVJR0hUICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRvbS5yZW1vdmVDbGFzcyhyb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCk7XG4gICAgICAgICAgICAgIHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocm9vdC5fX3Jlc2l6ZV9oYW5kbGUpIHtcbiAgICAgICAgICAgIGNvbW1vbi5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcm9vdC5fX3Jlc2l6ZV9oYW5kbGUuc3R5bGUuaGVpZ2h0ID0gcm9vdC5fX3VsLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocm9vdC5fX2Nsb3NlQnV0dG9uKSB7XG4gICAgICAgICAgICByb290Ll9fY2xvc2VCdXR0b24uc3R5bGUud2lkdGggPSByb290LndpZHRoICsgJ3B4JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFyayBvYmplY3RzIGZvciBzYXZpbmcuIFRoZSBvcmRlciBvZiB0aGVzZSBvYmplY3RzIGNhbm5vdCBjaGFuZ2UgYXNcbiAgICAgICAgICogdGhlIEdVSSBncm93cy4gV2hlbiByZW1lbWJlcmluZyBuZXcgb2JqZWN0cywgYXBwZW5kIHRoZW0gdG8gdGhlIGVuZFxuICAgICAgICAgKiBvZiB0aGUgbGlzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3QuLi59IG9iamVjdHNcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IGlmIG5vdCBjYWxsZWQgb24gYSB0b3AgbGV2ZWwgR1VJLlxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgIHJlbWVtYmVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmIChjb21tb24uaXNVbmRlZmluZWQoU0FWRV9ESUFMT0dVRSkpIHtcbiAgICAgICAgICAgIFNBVkVfRElBTE9HVUUgPSBuZXcgQ2VudGVyZWREaXYoKTtcbiAgICAgICAgICAgIFNBVkVfRElBTE9HVUUuZG9tRWxlbWVudC5pbm5lckhUTUwgPSBzYXZlRGlhbG9ndWVDb250ZW50cztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4gb25seSBjYWxsIHJlbWVtYmVyIG9uIGEgdG9wIGxldmVsIEdVSS5cIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgIGNvbW1vbi5lYWNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgYWRkU2F2ZU1lbnUoX3RoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF90aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMuaW5kZXhPZihvYmplY3QpID09IC0xKSB7XG4gICAgICAgICAgICAgIF90aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRoaXMuYXV0b1BsYWNlKSB7XG4gICAgICAgICAgICAvLyBTZXQgc2F2ZSByb3cgd2lkdGhcbiAgICAgICAgICAgIHNldFdpZHRoKHRoaXMsIHRoaXMud2lkdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7ZGF0Lmd1aS5HVUl9IHRoZSB0b3Btb3N0IHBhcmVudCBHVUkgb2YgYSBuZXN0ZWQgR1VJLlxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgIGdldFJvb3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBndWkgPSB0aGlzO1xuICAgICAgICAgIHdoaWxlIChndWkucGFyZW50KSB7XG4gICAgICAgICAgICBndWkgPSBndWkucGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ3VpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBhIEpTT04gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBzdGF0ZSBvZlxuICAgICAgICAgKiB0aGlzIEdVSSBhcyB3ZWxsIGFzIGl0cyByZW1lbWJlcmVkIHByb3BlcnRpZXMuXG4gICAgICAgICAqIEBpbnN0YW5jZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2F2ZU9iamVjdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSB0aGlzLmxvYWQ7XG5cbiAgICAgICAgICB0b1JldHVybi5jbG9zZWQgPSB0aGlzLmNsb3NlZDtcblxuICAgICAgICAgIC8vIEFtIEkgcmVtZW1iZXJpbmcgYW55IHZhbHVlcz9cbiAgICAgICAgICBpZiAodGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgdG9SZXR1cm4ucHJlc2V0ID0gdGhpcy5wcmVzZXQ7XG5cbiAgICAgICAgICAgIGlmICghdG9SZXR1cm4ucmVtZW1iZXJlZCkge1xuICAgICAgICAgICAgICB0b1JldHVybi5yZW1lbWJlcmVkID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRvUmV0dXJuLnJlbWVtYmVyZWRbdGhpcy5wcmVzZXRdID0gZ2V0Q3VycmVudFByZXNldCh0aGlzKTtcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRvUmV0dXJuLmZvbGRlcnMgPSB7fTtcbiAgICAgICAgICBjb21tb24uZWFjaCh0aGlzLl9fZm9sZGVycywgZnVuY3Rpb24oZWxlbWVudCwga2V5KSB7XG4gICAgICAgICAgICB0b1JldHVybi5mb2xkZXJzW2tleV0gPSBlbGVtZW50LmdldFNhdmVPYmplY3QoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHNhdmU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgaWYgKCF0aGlzLmxvYWQucmVtZW1iZXJlZCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkLnJlbWVtYmVyZWQgPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZFt0aGlzLnByZXNldF0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuICAgICAgICAgIG1hcmtQcmVzZXRNb2RpZmllZCh0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzYXZlQXM6IGZ1bmN0aW9uKHByZXNldE5hbWUpIHtcblxuICAgICAgICAgIGlmICghdGhpcy5sb2FkLnJlbWVtYmVyZWQpIHtcblxuICAgICAgICAgICAgLy8gUmV0YWluIGRlZmF1bHQgdmFsdWVzIHVwb24gZmlyc3Qgc2F2ZVxuICAgICAgICAgICAgdGhpcy5sb2FkLnJlbWVtYmVyZWQgPSB7fTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkW0RFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRV0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMsIHRydWUpO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5sb2FkLnJlbWVtYmVyZWRbcHJlc2V0TmFtZV0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuICAgICAgICAgIHRoaXMucHJlc2V0ID0gcHJlc2V0TmFtZTtcbiAgICAgICAgICBhZGRQcmVzZXRPcHRpb24odGhpcywgcHJlc2V0TmFtZSwgdHJ1ZSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZXZlcnQ6IGZ1bmN0aW9uKGd1aSkge1xuXG4gICAgICAgICAgY29tbW9uLmVhY2godGhpcy5fX2NvbnRyb2xsZXJzLCBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHJldmVydCB3b3JrIG9uIERlZmF1bHQuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0Um9vdCgpLmxvYWQucmVtZW1iZXJlZCkge1xuICAgICAgICAgICAgICBjb250cm9sbGVyLnNldFZhbHVlKGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlY2FsbFNhdmVkVmFsdWUoZ3VpIHx8IHRoaXMuZ2V0Um9vdCgpLCBjb250cm9sbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgIGNvbW1vbi5lYWNoKHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbihmb2xkZXIpIHtcbiAgICAgICAgICAgIGZvbGRlci5yZXZlcnQoZm9sZGVyKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghZ3VpKSB7XG4gICAgICAgICAgICBtYXJrUHJlc2V0TW9kaWZpZWQodGhpcy5nZXRSb290KCksIGZhbHNlKTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3RlbjogZnVuY3Rpb24oY29udHJvbGxlcikge1xuXG4gICAgICAgICAgdmFyIGluaXQgPSB0aGlzLl9fbGlzdGVuaW5nLmxlbmd0aCA9PSAwO1xuICAgICAgICAgIHRoaXMuX19saXN0ZW5pbmcucHVzaChjb250cm9sbGVyKTtcbiAgICAgICAgICBpZiAoaW5pdCkgdXBkYXRlRGlzcGxheXModGhpcy5fX2xpc3RlbmluZyk7XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgKTtcblxuICBmdW5jdGlvbiBhZGQoZ3VpLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcblxuICAgIGlmIChvYmplY3RbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk9iamVjdCBcIiArIG9iamVjdCArIFwiIGhhcyBubyBwcm9wZXJ0eSBcXFwiXCIgKyBwcm9wZXJ0eSArIFwiXFxcIlwiKTtcbiAgICB9XG5cbiAgICB2YXIgY29udHJvbGxlcjtcblxuICAgIGlmIChwYXJhbXMuY29sb3IpIHtcblxuICAgICAgY29udHJvbGxlciA9IG5ldyBDb2xvckNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB2YXIgZmFjdG9yeUFyZ3MgPSBbb2JqZWN0LHByb3BlcnR5XS5jb25jYXQocGFyYW1zLmZhY3RvcnlBcmdzKTtcbiAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyRmFjdG9yeS5hcHBseShndWksIGZhY3RvcnlBcmdzKTtcblxuICAgIH1cblxuICAgIGlmIChwYXJhbXMuYmVmb3JlIGluc3RhbmNlb2YgQ29udHJvbGxlcikge1xuICAgICAgcGFyYW1zLmJlZm9yZSA9IHBhcmFtcy5iZWZvcmUuX19saTtcbiAgICB9XG5cbiAgICByZWNhbGxTYXZlZFZhbHVlKGd1aSwgY29udHJvbGxlcik7XG5cbiAgICBkb20uYWRkQ2xhc3MoY29udHJvbGxlci5kb21FbGVtZW50LCAnYycpO1xuXG4gICAgdmFyIG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgZG9tLmFkZENsYXNzKG5hbWUsICdwcm9wZXJ0eS1uYW1lJyk7XG4gICAgbmFtZS5pbm5lckhUTUwgPSBjb250cm9sbGVyLnByb3BlcnR5O1xuXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbGxlci5kb21FbGVtZW50KTtcblxuICAgIHZhciBsaSA9IGFkZFJvdyhndWksIGNvbnRhaW5lciwgcGFyYW1zLmJlZm9yZSk7XG5cbiAgICBkb20uYWRkQ2xhc3MobGksIEdVSS5DTEFTU19DT05UUk9MTEVSX1JPVyk7XG4gICAgZG9tLmFkZENsYXNzKGxpLCB0eXBlb2YgY29udHJvbGxlci5nZXRWYWx1ZSgpKTtcblxuICAgIGF1Z21lbnRDb250cm9sbGVyKGd1aSwgbGksIGNvbnRyb2xsZXIpO1xuXG4gICAgZ3VpLl9fY29udHJvbGxlcnMucHVzaChjb250cm9sbGVyKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyO1xuXG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcm93IHRvIHRoZSBlbmQgb2YgdGhlIEdVSSBvciBiZWZvcmUgYW5vdGhlciByb3cuXG4gICAqXG4gICAqIEBwYXJhbSBndWlcbiAgICogQHBhcmFtIFtkb21dIElmIHNwZWNpZmllZCwgaW5zZXJ0cyB0aGUgZG9tIGNvbnRlbnQgaW4gdGhlIG5ldyByb3dcbiAgICogQHBhcmFtIFtsaUJlZm9yZV0gSWYgc3BlY2lmaWVkLCBwbGFjZXMgdGhlIG5ldyByb3cgYmVmb3JlIGFub3RoZXIgcm93XG4gICAqL1xuICBmdW5jdGlvbiBhZGRSb3coZ3VpLCBkb20sIGxpQmVmb3JlKSB7XG4gICAgdmFyIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBpZiAoZG9tKSBsaS5hcHBlbmRDaGlsZChkb20pO1xuICAgIGlmIChsaUJlZm9yZSkge1xuICAgICAgZ3VpLl9fdWwuaW5zZXJ0QmVmb3JlKGxpLCBwYXJhbXMuYmVmb3JlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3VpLl9fdWwuYXBwZW5kQ2hpbGQobGkpO1xuICAgIH1cbiAgICBndWkub25SZXNpemUoKTtcbiAgICByZXR1cm4gbGk7XG4gIH1cblxuICBmdW5jdGlvbiBhdWdtZW50Q29udHJvbGxlcihndWksIGxpLCBjb250cm9sbGVyKSB7XG5cbiAgICBjb250cm9sbGVyLl9fbGkgPSBsaTtcbiAgICBjb250cm9sbGVyLl9fZ3VpID0gZ3VpO1xuXG4gICAgY29tbW9uLmV4dGVuZChjb250cm9sbGVyLCB7XG5cbiAgICAgIG9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBjb250cm9sbGVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgcmV0dXJuIGFkZChcbiAgICAgICAgICAgICAgZ3VpLFxuICAgICAgICAgICAgICBjb250cm9sbGVyLm9iamVjdCxcbiAgICAgICAgICAgICAgY29udHJvbGxlci5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJlZm9yZTogY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZyxcbiAgICAgICAgICAgICAgICBmYWN0b3J5QXJnczogW2NvbW1vbi50b0FycmF5KGFyZ3VtZW50cyldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tbW9uLmlzQXJyYXkob3B0aW9ucykgfHwgY29tbW9uLmlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgICAgY29udHJvbGxlci5yZW1vdmUoKTtcblxuICAgICAgICAgIHJldHVybiBhZGQoXG4gICAgICAgICAgICAgIGd1aSxcbiAgICAgICAgICAgICAgY29udHJvbGxlci5vYmplY3QsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvcGVydHksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWZvcmU6IGNvbnRyb2xsZXIuX19saS5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgZmFjdG9yeUFyZ3M6IFtvcHRpb25zXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICAgIH0sXG5cbiAgICAgIG5hbWU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgY29udHJvbGxlci5fX2xpLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHY7XG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgICAgfSxcblxuICAgICAgbGlzdGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udHJvbGxlci5fX2d1aS5saXN0ZW4oY29udHJvbGxlcik7XG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udHJvbGxlci5fX2d1aS5yZW1vdmUoY29udHJvbGxlcik7XG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAvLyBBbGwgc2xpZGVycyBzaG91bGQgYmUgYWNjb21wYW5pZWQgYnkgYSBib3guXG4gICAgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBOdW1iZXJDb250cm9sbGVyU2xpZGVyKSB7XG5cbiAgICAgIHZhciBib3ggPSBuZXcgTnVtYmVyQ29udHJvbGxlckJveChjb250cm9sbGVyLm9iamVjdCwgY29udHJvbGxlci5wcm9wZXJ0eSxcbiAgICAgICAgICB7IG1pbjogY29udHJvbGxlci5fX21pbiwgbWF4OiBjb250cm9sbGVyLl9fbWF4LCBzdGVwOiBjb250cm9sbGVyLl9fc3RlcCB9KTtcblxuICAgICAgY29tbW9uLmVhY2goWyd1cGRhdGVEaXNwbGF5JywgJ29uQ2hhbmdlJywgJ29uRmluaXNoQ2hhbmdlJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgcGMgPSBjb250cm9sbGVyW21ldGhvZF07XG4gICAgICAgIHZhciBwYiA9IGJveFttZXRob2RdO1xuICAgICAgICBjb250cm9sbGVyW21ldGhvZF0gPSBib3hbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICBwYy5hcHBseShjb250cm9sbGVyLCBhcmdzKTtcbiAgICAgICAgICByZXR1cm4gcGIuYXBwbHkoYm94LCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRvbS5hZGRDbGFzcyhsaSwgJ2hhcy1zbGlkZXInKTtcbiAgICAgIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5pbnNlcnRCZWZvcmUoYm94LmRvbUVsZW1lbnQsIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIE51bWJlckNvbnRyb2xsZXJCb3gpIHtcblxuICAgICAgdmFyIHIgPSBmdW5jdGlvbihyZXR1cm5lZCkge1xuXG4gICAgICAgIC8vIEhhdmUgd2UgZGVmaW5lZCBib3RoIGJvdW5kYXJpZXM/XG4gICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIoY29udHJvbGxlci5fX21pbikgJiYgY29tbW9uLmlzTnVtYmVyKGNvbnRyb2xsZXIuX19tYXgpKSB7XG5cbiAgICAgICAgICAvLyBXZWxsLCB0aGVuIGxldHMganVzdCByZXBsYWNlIHRoaXMgd2l0aCBhIHNsaWRlci5cbiAgICAgICAgICBjb250cm9sbGVyLnJlbW92ZSgpO1xuICAgICAgICAgIHJldHVybiBhZGQoXG4gICAgICAgICAgICAgIGd1aSxcbiAgICAgICAgICAgICAgY29udHJvbGxlci5vYmplY3QsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvcGVydHksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiZWZvcmU6IGNvbnRyb2xsZXIuX19saS5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgZmFjdG9yeUFyZ3M6IFtjb250cm9sbGVyLl9fbWluLCBjb250cm9sbGVyLl9fbWF4LCBjb250cm9sbGVyLl9fc3RlcF1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5lZDtcblxuICAgICAgfTtcblxuICAgICAgY29udHJvbGxlci5taW4gPSBjb21tb24uY29tcG9zZShyLCBjb250cm9sbGVyLm1pbik7XG4gICAgICBjb250cm9sbGVyLm1heCA9IGNvbW1vbi5jb21wb3NlKHIsIGNvbnRyb2xsZXIubWF4KTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgQm9vbGVhbkNvbnRyb2xsZXIpIHtcblxuICAgICAgZG9tLmJpbmQobGksICdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb20uZmFrZUV2ZW50KGNvbnRyb2xsZXIuX19jaGVja2JveCwgJ2NsaWNrJyk7XG4gICAgICB9KTtcblxuICAgICAgZG9tLmJpbmQoY29udHJvbGxlci5fX2NoZWNrYm94LCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIFByZXZlbnRzIGRvdWJsZS10b2dnbGVcbiAgICAgIH0pXG5cbiAgICB9XG4gICAgZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIEZ1bmN0aW9uQ29udHJvbGxlcikge1xuXG4gICAgICBkb20uYmluZChsaSwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvbS5mYWtlRXZlbnQoY29udHJvbGxlci5fX2J1dHRvbiwgJ2NsaWNrJyk7XG4gICAgICB9KTtcblxuICAgICAgZG9tLmJpbmQobGksICdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9tLmFkZENsYXNzKGNvbnRyb2xsZXIuX19idXR0b24sICdob3ZlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvbS5iaW5kKGxpLCAnbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9tLnJlbW92ZUNsYXNzKGNvbnRyb2xsZXIuX19idXR0b24sICdob3ZlcicpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIENvbG9yQ29udHJvbGxlcikge1xuXG4gICAgICBkb20uYWRkQ2xhc3MobGksICdjb2xvcicpO1xuICAgICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5ID0gY29tbW9uLmNvbXBvc2UoZnVuY3Rpb24ocikge1xuICAgICAgICBsaS5zdHlsZS5ib3JkZXJMZWZ0Q29sb3IgPSBjb250cm9sbGVyLl9fY29sb3IudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgICB9LCBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkpO1xuXG4gICAgICBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkoKTtcblxuICAgIH1cblxuICAgIGNvbnRyb2xsZXIuc2V0VmFsdWUgPSBjb21tb24uY29tcG9zZShmdW5jdGlvbihyKSB7XG4gICAgICBpZiAoZ3VpLmdldFJvb3QoKS5fX3ByZXNldF9zZWxlY3QgJiYgY29udHJvbGxlci5pc01vZGlmaWVkKCkpIHtcbiAgICAgICAgbWFya1ByZXNldE1vZGlmaWVkKGd1aS5nZXRSb290KCksIHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfSwgY29udHJvbGxlci5zZXRWYWx1ZSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2FsbFNhdmVkVmFsdWUoZ3VpLCBjb250cm9sbGVyKSB7XG5cbiAgICAvLyBGaW5kIHRoZSB0b3Btb3N0IEdVSSwgdGhhdCdzIHdoZXJlIHJlbWVtYmVyZWQgb2JqZWN0cyBsaXZlLlxuICAgIHZhciByb290ID0gZ3VpLmdldFJvb3QoKTtcblxuICAgIC8vIERvZXMgdGhlIG9iamVjdCB3ZSdyZSBjb250cm9sbGluZyBtYXRjaCBhbnl0aGluZyB3ZSd2ZSBiZWVuIHRvbGQgdG9cbiAgICAvLyByZW1lbWJlcj9cbiAgICB2YXIgbWF0Y2hlZF9pbmRleCA9IHJvb3QuX19yZW1lbWJlcmVkT2JqZWN0cy5pbmRleE9mKGNvbnRyb2xsZXIub2JqZWN0KTtcblxuICAgIC8vIFdoeSB5ZXMsIGl0IGRvZXMhXG4gICAgaWYgKG1hdGNoZWRfaW5kZXggIT0gLTEpIHtcblxuICAgICAgLy8gTGV0IG1lIGZldGNoIGEgbWFwIG9mIGNvbnRyb2xsZXJzIGZvciB0aGNvbW1vbi5pc09iamVjdC5cbiAgICAgIHZhciBjb250cm9sbGVyX21hcCA9XG4gICAgICAgICAgcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1ttYXRjaGVkX2luZGV4XTtcblxuICAgICAgLy8gT2hwLCBJIGJlbGlldmUgdGhpcyBpcyB0aGUgZmlyc3QgY29udHJvbGxlciB3ZSd2ZSBjcmVhdGVkIGZvciB0aGlzXG4gICAgICAvLyBvYmplY3QuIExldHMgbWFrZSB0aGUgbWFwIGZyZXNoLlxuICAgICAgaWYgKGNvbnRyb2xsZXJfbWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udHJvbGxlcl9tYXAgPSB7fTtcbiAgICAgICAgcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1ttYXRjaGVkX2luZGV4XSA9XG4gICAgICAgICAgICBjb250cm9sbGVyX21hcDtcbiAgICAgIH1cblxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGlzIGNvbnRyb2xsZXJcbiAgICAgIGNvbnRyb2xsZXJfbWFwW2NvbnRyb2xsZXIucHJvcGVydHldID0gY29udHJvbGxlcjtcblxuICAgICAgLy8gT2theSwgbm93IGhhdmUgd2Ugc2F2ZWQgYW55IHZhbHVlcyBmb3IgdGhpcyBjb250cm9sbGVyP1xuICAgICAgaWYgKHJvb3QubG9hZCAmJiByb290LmxvYWQucmVtZW1iZXJlZCkge1xuXG4gICAgICAgIHZhciBwcmVzZXRfbWFwID0gcm9vdC5sb2FkLnJlbWVtYmVyZWQ7XG5cbiAgICAgICAgLy8gV2hpY2ggcHJlc2V0IGFyZSB3ZSB0cnlpbmcgdG8gbG9hZD9cbiAgICAgICAgdmFyIHByZXNldDtcblxuICAgICAgICBpZiAocHJlc2V0X21hcFtndWkucHJlc2V0XSkge1xuXG4gICAgICAgICAgcHJlc2V0ID0gcHJlc2V0X21hcFtndWkucHJlc2V0XTtcblxuICAgICAgICB9IGVsc2UgaWYgKHByZXNldF9tYXBbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXSkge1xuXG4gICAgICAgICAgLy8gVWhoLCB5b3UgY2FuIGhhdmUgdGhlIGRlZmF1bHQgaW5zdGVhZD9cbiAgICAgICAgICBwcmVzZXQgPSBwcmVzZXRfbWFwW0RFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRV07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIE5hZGEuXG5cbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gRGlkIHRoZSBsb2FkZWQgb2JqZWN0IHJlbWVtYmVyIHRoY29tbW9uLmlzT2JqZWN0P1xuICAgICAgICBpZiAocHJlc2V0W21hdGNoZWRfaW5kZXhdICYmXG5cbiAgICAgICAgICAvLyBEaWQgd2UgcmVtZW1iZXIgdGhpcyBwYXJ0aWN1bGFyIHByb3BlcnR5P1xuICAgICAgICAgICAgcHJlc2V0W21hdGNoZWRfaW5kZXhdW2NvbnRyb2xsZXIucHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIC8vIFdlIGRpZCByZW1lbWJlciBzb21ldGhpbmcgZm9yIHRoaXMgZ3V5IC4uLlxuICAgICAgICAgIHZhciB2YWx1ZSA9IHByZXNldFttYXRjaGVkX2luZGV4XVtjb250cm9sbGVyLnByb3BlcnR5XTtcblxuICAgICAgICAgIC8vIEFuZCB0aGF0J3Mgd2hhdCBpdCBpcy5cbiAgICAgICAgICBjb250cm9sbGVyLmluaXRpYWxWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIGNvbnRyb2xsZXIuc2V0VmFsdWUodmFsdWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2VIYXNoKGd1aSwga2V5KSB7XG4gICAgLy8gVE9ETyBob3cgZG9lcyB0aGlzIGRlYWwgd2l0aCBtdWx0aXBsZSBHVUkncz9cbiAgICByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICcuJyArIGtleTtcblxuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2F2ZU1lbnUoZ3VpKSB7XG5cbiAgICB2YXIgZGl2ID0gZ3VpLl9fc2F2ZV9yb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgZG9tLmFkZENsYXNzKGd1aS5kb21FbGVtZW50LCAnaGFzLXNhdmUnKTtcblxuICAgIGd1aS5fX3VsLmluc2VydEJlZm9yZShkaXYsIGd1aS5fX3VsLmZpcnN0Q2hpbGQpO1xuXG4gICAgZG9tLmFkZENsYXNzKGRpdiwgJ3NhdmUtcm93Jyk7XG5cbiAgICB2YXIgZ2VhcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgZ2VhcnMuaW5uZXJIVE1MID0gJyZuYnNwOyc7XG4gICAgZG9tLmFkZENsYXNzKGdlYXJzLCAnYnV0dG9uIGdlYXJzJyk7XG5cbiAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBGdW5jdGlvbkNvbnRyb2xsZXJcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnU2F2ZSc7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbiwgJ2J1dHRvbicpO1xuICAgIGRvbS5hZGRDbGFzcyhidXR0b24sICdzYXZlJyk7XG5cbiAgICB2YXIgYnV0dG9uMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBidXR0b24yLmlubmVySFRNTCA9ICdOZXcnO1xuICAgIGRvbS5hZGRDbGFzcyhidXR0b24yLCAnYnV0dG9uJyk7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbjIsICdzYXZlLWFzJyk7XG5cbiAgICB2YXIgYnV0dG9uMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBidXR0b24zLmlubmVySFRNTCA9ICdSZXZlcnQnO1xuICAgIGRvbS5hZGRDbGFzcyhidXR0b24zLCAnYnV0dG9uJyk7XG4gICAgZG9tLmFkZENsYXNzKGJ1dHRvbjMsICdyZXZlcnQnKTtcblxuICAgIHZhciBzZWxlY3QgPSBndWkuX19wcmVzZXRfc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG5cbiAgICBpZiAoZ3VpLmxvYWQgJiYgZ3VpLmxvYWQucmVtZW1iZXJlZCkge1xuXG4gICAgICBjb21tb24uZWFjaChndWkubG9hZC5yZW1lbWJlcmVkLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGFkZFByZXNldE9wdGlvbihndWksIGtleSwga2V5ID09IGd1aS5wcmVzZXQpO1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgYWRkUHJlc2V0T3B0aW9uKGd1aSwgREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZG9tLmJpbmQoc2VsZWN0LCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGd1aS5fX3ByZXNldF9zZWxlY3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLmlubmVySFRNTCA9IGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICBndWkucHJlc2V0ID0gdGhpcy52YWx1ZTtcblxuICAgIH0pO1xuXG4gICAgZGl2LmFwcGVuZENoaWxkKHNlbGVjdCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGdlYXJzKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uMik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGJ1dHRvbjMpO1xuXG4gICAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UpIHtcblxuICAgICAgdmFyIHNhdmVMb2NhbGx5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLXNhdmUtbG9jYWxseScpO1xuICAgICAgdmFyIGV4cGxhaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGctbG9jYWwtZXhwbGFpbicpO1xuXG4gICAgICBzYXZlTG9jYWxseS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgdmFyIGxvY2FsU3RvcmFnZUNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLWxvY2FsLXN0b3JhZ2UnKTtcblxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2goZ3VpLCAnaXNMb2NhbCcpKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZUNoZWNrQm94LnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dIaWRlRXhwbGFpbigpIHtcbiAgICAgICAgZXhwbGFpbi5zdHlsZS5kaXNwbGF5ID0gZ3VpLnVzZUxvY2FsU3RvcmFnZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICB9XG5cbiAgICAgIHNob3dIaWRlRXhwbGFpbigpO1xuXG4gICAgICAvLyBUT0RPOiBVc2UgYSBib29sZWFuIGNvbnRyb2xsZXIsIGZvb2whXG4gICAgICBkb20uYmluZChsb2NhbFN0b3JhZ2VDaGVja0JveCwgJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBndWkudXNlTG9jYWxTdG9yYWdlID0gIWd1aS51c2VMb2NhbFN0b3JhZ2U7XG4gICAgICAgIHNob3dIaWRlRXhwbGFpbigpO1xuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICB2YXIgbmV3Q29uc3RydWN0b3JUZXh0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZy1uZXctY29uc3RydWN0b3InKTtcblxuICAgIGRvbS5iaW5kKG5ld0NvbnN0cnVjdG9yVGV4dEFyZWEsICdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUubWV0YUtleSAmJiAoZS53aGljaCA9PT0gNjcgfHwgZS5rZXlDb2RlID09IDY3KSkge1xuICAgICAgICBTQVZFX0RJQUxPR1VFLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvbS5iaW5kKGdlYXJzLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIG5ld0NvbnN0cnVjdG9yVGV4dEFyZWEuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkoZ3VpLmdldFNhdmVPYmplY3QoKSwgdW5kZWZpbmVkLCAyKTtcbiAgICAgIFNBVkVfRElBTE9HVUUuc2hvdygpO1xuICAgICAgbmV3Q29uc3RydWN0b3JUZXh0QXJlYS5mb2N1cygpO1xuICAgICAgbmV3Q29uc3RydWN0b3JUZXh0QXJlYS5zZWxlY3QoKTtcbiAgICB9KTtcblxuICAgIGRvbS5iaW5kKGJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBndWkuc2F2ZSgpO1xuICAgIH0pO1xuXG4gICAgZG9tLmJpbmQoYnV0dG9uMiwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcHJlc2V0TmFtZSA9IHByb21wdCgnRW50ZXIgYSBuZXcgcHJlc2V0IG5hbWUuJyk7XG4gICAgICBpZiAocHJlc2V0TmFtZSkgZ3VpLnNhdmVBcyhwcmVzZXROYW1lKTtcbiAgICB9KTtcblxuICAgIGRvbS5iaW5kKGJ1dHRvbjMsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgZ3VpLnJldmVydCgpO1xuICAgIH0pO1xuXG4vLyAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uMik7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFJlc2l6ZUhhbmRsZShndWkpIHtcblxuICAgIGd1aS5fX3Jlc2l6ZV9oYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGNvbW1vbi5leHRlbmQoZ3VpLl9fcmVzaXplX2hhbmRsZS5zdHlsZSwge1xuXG4gICAgICB3aWR0aDogJzZweCcsXG4gICAgICBtYXJnaW5MZWZ0OiAnLTNweCcsXG4gICAgICBoZWlnaHQ6ICcyMDBweCcsXG4gICAgICBjdXJzb3I6ICdldy1yZXNpemUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbi8vICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnXG5cbiAgICB9KTtcblxuICAgIHZhciBwbW91c2VYO1xuXG4gICAgZG9tLmJpbmQoZ3VpLl9fcmVzaXplX2hhbmRsZSwgJ21vdXNlZG93bicsIGRyYWdTdGFydCk7XG4gICAgZG9tLmJpbmQoZ3VpLl9fY2xvc2VCdXR0b24sICdtb3VzZWRvd24nLCBkcmFnU3RhcnQpO1xuXG4gICAgZ3VpLmRvbUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGd1aS5fX3Jlc2l6ZV9oYW5kbGUsIGd1aS5kb21FbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgIGZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgcG1vdXNlWCA9IGUuY2xpZW50WDtcblxuICAgICAgZG9tLmFkZENsYXNzKGd1aS5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfRFJBRyk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBkcmFnKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBkcmFnU3RvcCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRyYWcoZSkge1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGd1aS53aWR0aCArPSBwbW91c2VYIC0gZS5jbGllbnRYO1xuICAgICAgZ3VpLm9uUmVzaXplKCk7XG4gICAgICBwbW91c2VYID0gZS5jbGllbnRYO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmFnU3RvcCgpIHtcblxuICAgICAgZG9tLnJlbW92ZUNsYXNzKGd1aS5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfRFJBRyk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgZHJhZ1N0b3ApO1xuXG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBzZXRXaWR0aChndWksIHcpIHtcbiAgICBndWkuZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICAgIC8vIEF1dG8gcGxhY2VkIHNhdmUtcm93cyBhcmUgcG9zaXRpb24gZml4ZWQsIHNvIHdlIGhhdmUgdG9cbiAgICAvLyBzZXQgdGhlIHdpZHRoIG1hbnVhbGx5IGlmIHdlIHdhbnQgaXQgdG8gYmxlZWQgdG8gdGhlIGVkZ2VcbiAgICBpZiAoZ3VpLl9fc2F2ZV9yb3cgJiYgZ3VpLmF1dG9QbGFjZSkge1xuICAgICAgZ3VpLl9fc2F2ZV9yb3cuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICB9aWYgKGd1aS5fX2Nsb3NlQnV0dG9uKSB7XG4gICAgICBndWkuX19jbG9zZUJ1dHRvbi5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRQcmVzZXQoZ3VpLCB1c2VJbml0aWFsVmFsdWVzKSB7XG5cbiAgICB2YXIgdG9SZXR1cm4gPSB7fTtcblxuICAgIC8vIEZvciBlYWNoIG9iamVjdCBJJ20gcmVtZW1iZXJpbmdcbiAgICBjb21tb24uZWFjaChndWkuX19yZW1lbWJlcmVkT2JqZWN0cywgZnVuY3Rpb24odmFsLCBpbmRleCkge1xuXG4gICAgICB2YXIgc2F2ZWRfdmFsdWVzID0ge307XG5cbiAgICAgIC8vIFRoZSBjb250cm9sbGVycyBJJ3ZlIG1hZGUgZm9yIHRoY29tbW9uLmlzT2JqZWN0IGJ5IHByb3BlcnR5XG4gICAgICB2YXIgY29udHJvbGxlcl9tYXAgPVxuICAgICAgICAgIGd1aS5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1tpbmRleF07XG5cbiAgICAgIC8vIFJlbWVtYmVyIGVhY2ggdmFsdWUgZm9yIGVhY2ggcHJvcGVydHlcbiAgICAgIGNvbW1vbi5lYWNoKGNvbnRyb2xsZXJfbWFwLCBmdW5jdGlvbihjb250cm9sbGVyLCBwcm9wZXJ0eSkge1xuICAgICAgICBzYXZlZF92YWx1ZXNbcHJvcGVydHldID0gdXNlSW5pdGlhbFZhbHVlcyA/IGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlIDogY29udHJvbGxlci5nZXRWYWx1ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmUgdGhlIHZhbHVlcyBmb3IgdGhjb21tb24uaXNPYmplY3RcbiAgICAgIHRvUmV0dXJuW2luZGV4XSA9IHNhdmVkX3ZhbHVlcztcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuXG4gIH1cblxuICBmdW5jdGlvbiBhZGRQcmVzZXRPcHRpb24oZ3VpLCBuYW1lLCBzZXRTZWxlY3RlZCkge1xuICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHQuaW5uZXJIVE1MID0gbmFtZTtcbiAgICBvcHQudmFsdWUgPSBuYW1lO1xuICAgIGd1aS5fX3ByZXNldF9zZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICBpZiAoc2V0U2VsZWN0ZWQpIHtcbiAgICAgIGd1aS5fX3ByZXNldF9zZWxlY3Quc2VsZWN0ZWRJbmRleCA9IGd1aS5fX3ByZXNldF9zZWxlY3QubGVuZ3RoIC0gMTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcmVzZXRTZWxlY3RJbmRleChndWkpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZ3VpLl9fcHJlc2V0X3NlbGVjdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGlmIChndWkuX19wcmVzZXRfc2VsZWN0W2luZGV4XS52YWx1ZSA9PSBndWkucHJlc2V0KSB7XG4gICAgICAgIGd1aS5fX3ByZXNldF9zZWxlY3Quc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcmtQcmVzZXRNb2RpZmllZChndWksIG1vZGlmaWVkKSB7XG4gICAgdmFyIG9wdCA9IGd1aS5fX3ByZXNldF9zZWxlY3RbZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4XTtcbi8vICAgIGNvbnNvbGUubG9nKCdtYXJrJywgbW9kaWZpZWQsIG9wdCk7XG4gICAgaWYgKG1vZGlmaWVkKSB7XG4gICAgICBvcHQuaW5uZXJIVE1MID0gb3B0LnZhbHVlICsgXCIqXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdC5pbm5lckhUTUwgPSBvcHQudmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRGlzcGxheXMoY29udHJvbGxlckFycmF5KSB7XG5cblxuICAgIGlmIChjb250cm9sbGVyQXJyYXkubGVuZ3RoICE9IDApIHtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICB1cGRhdGVEaXNwbGF5cyhjb250cm9sbGVyQXJyYXkpO1xuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBjb21tb24uZWFjaChjb250cm9sbGVyQXJyYXksIGZ1bmN0aW9uKGMpIHtcbiAgICAgIGMudXBkYXRlRGlzcGxheSgpO1xuICAgIH0pO1xuXG4gIH1cblxuICByZXR1cm4gR1VJO1xuXG59KShkYXQudXRpbHMuY3NzLFxuXCI8ZGl2IGlkPVxcXCJkZy1zYXZlXFxcIiBjbGFzcz1cXFwiZGcgZGlhbG9ndWVcXFwiPlxcblxcbiAgSGVyZSdzIHRoZSBuZXcgbG9hZCBwYXJhbWV0ZXIgZm9yIHlvdXIgPGNvZGU+R1VJPC9jb2RlPidzIGNvbnN0cnVjdG9yOlxcblxcbiAgPHRleHRhcmVhIGlkPVxcXCJkZy1uZXctY29uc3RydWN0b3JcXFwiPjwvdGV4dGFyZWE+XFxuXFxuICA8ZGl2IGlkPVxcXCJkZy1zYXZlLWxvY2FsbHlcXFwiPlxcblxcbiAgICA8aW5wdXQgaWQ9XFxcImRnLWxvY2FsLXN0b3JhZ2VcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIi8+IEF1dG9tYXRpY2FsbHkgc2F2ZVxcbiAgICB2YWx1ZXMgdG8gPGNvZGU+bG9jYWxTdG9yYWdlPC9jb2RlPiBvbiBleGl0LlxcblxcbiAgICA8ZGl2IGlkPVxcXCJkZy1sb2NhbC1leHBsYWluXFxcIj5UaGUgdmFsdWVzIHNhdmVkIHRvIDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gd2lsbFxcbiAgICAgIG92ZXJyaWRlIHRob3NlIHBhc3NlZCB0byA8Y29kZT5kYXQuR1VJPC9jb2RlPidzIGNvbnN0cnVjdG9yLiBUaGlzIG1ha2VzIGl0XFxuICAgICAgZWFzaWVyIHRvIHdvcmsgaW5jcmVtZW50YWxseSwgYnV0IDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gaXMgZnJhZ2lsZSxcXG4gICAgICBhbmQgeW91ciBmcmllbmRzIG1heSBub3Qgc2VlIHRoZSBzYW1lIHZhbHVlcyB5b3UgZG8uXFxuICAgICAgXFxuICAgIDwvZGl2PlxcbiAgICBcXG4gIDwvZGl2PlxcblxcbjwvZGl2PlwiLFxuXCIuZGcgdWx7bGlzdC1zdHlsZTpub25lO21hcmdpbjowO3BhZGRpbmc6MDt3aWR0aDoxMDAlO2NsZWFyOmJvdGh9LmRnLmFje3Bvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtyaWdodDowO2hlaWdodDowO3otaW5kZXg6MH0uZGc6bm90KC5hYykgLm1haW57b3ZlcmZsb3c6aGlkZGVufS5kZy5tYWluey13ZWJraXQtdHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyOy1vLXRyYW5zaXRpb246b3BhY2l0eSAwLjFzIGxpbmVhcjstbW96LXRyYW5zaXRpb246b3BhY2l0eSAwLjFzIGxpbmVhcjt0cmFuc2l0aW9uOm9wYWNpdHkgMC4xcyBsaW5lYXJ9LmRnLm1haW4udGFsbGVyLXRoYW4td2luZG93e292ZXJmbG93LXk6YXV0b30uZGcubWFpbi50YWxsZXItdGhhbi13aW5kb3cgLmNsb3NlLWJ1dHRvbntvcGFjaXR5OjE7bWFyZ2luLXRvcDotMXB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMyYzJjMmN9LmRnLm1haW4gdWwuY2xvc2VkIC5jbG9zZS1idXR0b257b3BhY2l0eToxICFpbXBvcnRhbnR9LmRnLm1haW46aG92ZXIgLmNsb3NlLWJ1dHRvbiwuZGcubWFpbiAuY2xvc2UtYnV0dG9uLmRyYWd7b3BhY2l0eToxfS5kZy5tYWluIC5jbG9zZS1idXR0b257LXdlYmtpdC10cmFuc2l0aW9uOm9wYWNpdHkgMC4xcyBsaW5lYXI7LW8tdHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IDAuMXMgbGluZWFyO3RyYW5zaXRpb246b3BhY2l0eSAwLjFzIGxpbmVhcjtib3JkZXI6MDtwb3NpdGlvbjphYnNvbHV0ZTtsaW5lLWhlaWdodDoxOXB4O2hlaWdodDoyMHB4O2N1cnNvcjpwb2ludGVyO3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQtY29sb3I6IzAwMH0uZGcubWFpbiAuY2xvc2UtYnV0dG9uOmhvdmVye2JhY2tncm91bmQtY29sb3I6IzExMX0uZGcuYXtmbG9hdDpyaWdodDttYXJnaW4tcmlnaHQ6MTVweDtvdmVyZmxvdy14OmhpZGRlbn0uZGcuYS5oYXMtc2F2ZSB1bHttYXJnaW4tdG9wOjI3cHh9LmRnLmEuaGFzLXNhdmUgdWwuY2xvc2Vke21hcmdpbi10b3A6MH0uZGcuYSAuc2F2ZS1yb3d7cG9zaXRpb246Zml4ZWQ7dG9wOjA7ei1pbmRleDoxMDAyfS5kZyBsaXstd2Via2l0LXRyYW5zaXRpb246aGVpZ2h0IDAuMXMgZWFzZS1vdXQ7LW8tdHJhbnNpdGlvbjpoZWlnaHQgMC4xcyBlYXNlLW91dDstbW96LXRyYW5zaXRpb246aGVpZ2h0IDAuMXMgZWFzZS1vdXQ7dHJhbnNpdGlvbjpoZWlnaHQgMC4xcyBlYXNlLW91dH0uZGcgbGk6bm90KC5mb2xkZXIpe2N1cnNvcjphdXRvO2hlaWdodDoyN3B4O2xpbmUtaGVpZ2h0OjI3cHg7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MCA0cHggMCA1cHh9LmRnIGxpLmZvbGRlcntwYWRkaW5nOjA7Ym9yZGVyLWxlZnQ6NHB4IHNvbGlkIHJnYmEoMCwwLDAsMCl9LmRnIGxpLnRpdGxle2N1cnNvcjpwb2ludGVyO21hcmdpbi1sZWZ0Oi00cHh9LmRnIC5jbG9zZWQgbGk6bm90KC50aXRsZSksLmRnIC5jbG9zZWQgdWwgbGksLmRnIC5jbG9zZWQgdWwgbGkgPiAqe2hlaWdodDowO292ZXJmbG93OmhpZGRlbjtib3JkZXI6MH0uZGcgLmNye2NsZWFyOmJvdGg7cGFkZGluZy1sZWZ0OjNweDtoZWlnaHQ6MjdweH0uZGcgLnByb3BlcnR5LW5hbWV7Y3Vyc29yOmRlZmF1bHQ7ZmxvYXQ6bGVmdDtjbGVhcjpsZWZ0O3dpZHRoOjQwJTtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30uZGcgLmN7ZmxvYXQ6bGVmdDt3aWR0aDo2MCV9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF17Ym9yZGVyOjA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzozcHg7d2lkdGg6MTAwJTtmbG9hdDpyaWdodH0uZGcgLmhhcy1zbGlkZXIgaW5wdXRbdHlwZT10ZXh0XXt3aWR0aDozMCU7bWFyZ2luLWxlZnQ6MH0uZGcgLnNsaWRlcntmbG9hdDpsZWZ0O3dpZHRoOjY2JTttYXJnaW4tbGVmdDotNXB4O21hcmdpbi1yaWdodDowO2hlaWdodDoxOXB4O21hcmdpbi10b3A6NHB4fS5kZyAuc2xpZGVyLWZne2hlaWdodDoxMDAlfS5kZyAuYyBpbnB1dFt0eXBlPWNoZWNrYm94XXttYXJnaW4tdG9wOjlweH0uZGcgLmMgc2VsZWN0e21hcmdpbi10b3A6NXB4fS5kZyAuY3IuZnVuY3Rpb24sLmRnIC5jci5mdW5jdGlvbiAucHJvcGVydHktbmFtZSwuZGcgLmNyLmZ1bmN0aW9uICosLmRnIC5jci5ib29sZWFuLC5kZyAuY3IuYm9vbGVhbiAqe2N1cnNvcjpwb2ludGVyfS5kZyAuc2VsZWN0b3J7ZGlzcGxheTpub25lO3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbi1sZWZ0Oi05cHg7bWFyZ2luLXRvcDoyM3B4O3otaW5kZXg6MTB9LmRnIC5jOmhvdmVyIC5zZWxlY3RvciwuZGcgLnNlbGVjdG9yLmRyYWd7ZGlzcGxheTpibG9ja30uZGcgbGkuc2F2ZS1yb3d7cGFkZGluZzowfS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MHB4IDZweH0uZGcuZGlhbG9ndWV7YmFja2dyb3VuZC1jb2xvcjojMjIyO3dpZHRoOjQ2MHB4O3BhZGRpbmc6MTVweDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxNXB4fSNkZy1uZXctY29uc3RydWN0b3J7cGFkZGluZzoxMHB4O2NvbG9yOiMyMjI7Zm9udC1mYW1pbHk6TW9uYWNvLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHg7Ym9yZGVyOjA7cmVzaXplOm5vbmU7Ym94LXNoYWRvdzppbnNldCAxcHggMXB4IDFweCAjODg4O3dvcmQtd3JhcDpicmVhay13b3JkO21hcmdpbjoxMnB4IDA7ZGlzcGxheTpibG9jazt3aWR0aDo0NDBweDtvdmVyZmxvdy15OnNjcm9sbDtoZWlnaHQ6MTAwcHg7cG9zaXRpb246cmVsYXRpdmV9I2RnLWxvY2FsLWV4cGxhaW57ZGlzcGxheTpub25lO2ZvbnQtc2l6ZToxMXB4O2xpbmUtaGVpZ2h0OjE3cHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZC1jb2xvcjojMzMzO3BhZGRpbmc6OHB4O21hcmdpbi10b3A6MTBweH0jZGctbG9jYWwtZXhwbGFpbiBjb2Rle2ZvbnQtc2l6ZToxMHB4fSNkYXQtZ3VpLXNhdmUtbG9jYWxseXtkaXNwbGF5Om5vbmV9LmRne2NvbG9yOiNlZWU7Zm9udDoxMXB4ICdMdWNpZGEgR3JhbmRlJywgc2Fucy1zZXJpZjt0ZXh0LXNoYWRvdzowIC0xcHggMCAjMTExfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhcnt3aWR0aDo1cHg7YmFja2dyb3VuZDojMWExYTFhfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXJ7aGVpZ2h0OjA7ZGlzcGxheTpub25lfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOiM2NzY3Njd9LmRnIGxpOm5vdCguZm9sZGVyKXtiYWNrZ3JvdW5kOiMxYTFhMWE7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzJjMmMyY30uZGcgbGkuc2F2ZS1yb3d7bGluZS1oZWlnaHQ6MjVweDtiYWNrZ3JvdW5kOiNkYWQ1Y2I7Ym9yZGVyOjB9LmRnIGxpLnNhdmUtcm93IHNlbGVjdHttYXJnaW4tbGVmdDo1cHg7d2lkdGg6MTA4cHh9LmRnIGxpLnNhdmUtcm93IC5idXR0b257bWFyZ2luLWxlZnQ6NXB4O21hcmdpbi10b3A6MXB4O2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZTo5cHg7bGluZS1oZWlnaHQ6N3B4O3BhZGRpbmc6NHB4IDRweCA1cHggNHB4O2JhY2tncm91bmQ6I2M1YmRhZDtjb2xvcjojZmZmO3RleHQtc2hhZG93OjAgMXB4IDAgI2IwYTU4Zjtib3gtc2hhZG93OjAgLTFweCAwICNiMGE1OGY7Y3Vyc29yOnBvaW50ZXJ9LmRnIGxpLnNhdmUtcm93IC5idXR0b24uZ2VhcnN7YmFja2dyb3VuZDojYzViZGFkIHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFzQUFBQU5DQVlBQUFCLzlaUTdBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQVFKSlJFRlVlTnBpWUtBVS9QLy9Qd0dJQy9BcENBQmlCU0FXK0k4QUNsQWNnS3hRNFQ5aG9NQUVVcnh4MlFTR042K2VnRFgrL3ZXVDRlN044MkFNWW9QQXgvZXZ3V29Zb1NZYkFDWDJzN0t4Q3h6Y3NlekRoM2V2Rm9ERUJZVEVFcXljZ2dXQXpBOUF1VVNRUWdlWVBhOWZQdjYvWVdtL0FjeDVJUGI3dHkvZncrUVpibHc2N3ZEczhSMFlIeVFoZ09ieCt5QUprQnFtRzVkUFBEaDFhUE9HUi9ldWdXMEc0dmxJb1RJZnlGY0ErUWVraGhISmhQZFF4YmlBSWd1TUJUUVpyUEQ3MTA4TTZyb1dZREZRaUlBQXY2QW93LzFiRndYZ2lzK2YyTFVBeW53b0lhTmN6OFhOeDNEbDdNRUpVREdRcHg5Z3RROFlDdWVCK0QyNk9FQ0FBUURhZHQ3ZTQ2RDQyUUFBQUFCSlJVNUVya0pnZ2c9PSkgMnB4IDFweCBuby1yZXBlYXQ7aGVpZ2h0OjdweDt3aWR0aDo4cHh9LmRnIGxpLnNhdmUtcm93IC5idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojYmFiMTllO2JveC1zaGFkb3c6MCAtMXB4IDAgI2IwYTU4Zn0uZGcgbGkuZm9sZGVye2JvcmRlci1ib3R0b206MH0uZGcgbGkudGl0bGV7cGFkZGluZy1sZWZ0OjE2cHg7YmFja2dyb3VuZDojMDAwIHVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCUUFGQUpFQUFQLy8vL1B6OC8vLy8vLy8veUg1QkFFQUFBSUFMQUFBQUFBRkFBVUFBQUlJbEkraEtnRnhvQ2dBT3c9PSkgNnB4IDEwcHggbm8tcmVwZWF0O2N1cnNvcjpwb2ludGVyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKX0uZGcgLmNsb3NlZCBsaS50aXRsZXtiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCUUFGQUpFQUFQLy8vL1B6OC8vLy8vLy8veUg1QkFFQUFBSUFMQUFBQUFBRkFBVUFBQUlJbEdJV3FNQ2JXQUVBT3c9PSl9LmRnIC5jci5ib29sZWFue2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjODA2Nzg3fS5kZyAuY3IuZnVuY3Rpb257Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICNlNjFkNWZ9LmRnIC5jci5udW1iZXJ7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICMyZmExZDZ9LmRnIC5jci5udW1iZXIgaW5wdXRbdHlwZT10ZXh0XXtjb2xvcjojMmZhMWQ2fS5kZyAuY3Iuc3RyaW5ne2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjMWVkMzZmfS5kZyAuY3Iuc3RyaW5nIGlucHV0W3R5cGU9dGV4dF17Y29sb3I6IzFlZDM2Zn0uZGcgLmNyLmZ1bmN0aW9uOmhvdmVyLC5kZyAuY3IuYm9vbGVhbjpob3ZlcntiYWNrZ3JvdW5kOiMxMTF9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF17YmFja2dyb3VuZDojMzAzMDMwO291dGxpbmU6bm9uZX0uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XTpob3ZlcntiYWNrZ3JvdW5kOiMzYzNjM2N9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF06Zm9jdXN7YmFja2dyb3VuZDojNDk0OTQ5O2NvbG9yOiNmZmZ9LmRnIC5jIC5zbGlkZXJ7YmFja2dyb3VuZDojMzAzMDMwO2N1cnNvcjpldy1yZXNpemV9LmRnIC5jIC5zbGlkZXItZmd7YmFja2dyb3VuZDojMmZhMWQ2fS5kZyAuYyAuc2xpZGVyOmhvdmVye2JhY2tncm91bmQ6IzNjM2MzY30uZGcgLmMgLnNsaWRlcjpob3ZlciAuc2xpZGVyLWZne2JhY2tncm91bmQ6IzQ0YWJkYX1cXG5cIixcbmRhdC5jb250cm9sbGVycy5mYWN0b3J5ID0gKGZ1bmN0aW9uIChPcHRpb25Db250cm9sbGVyLCBOdW1iZXJDb250cm9sbGVyQm94LCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLCBTdHJpbmdDb250cm9sbGVyLCBGdW5jdGlvbkNvbnRyb2xsZXIsIEJvb2xlYW5Db250cm9sbGVyLCBjb21tb24pIHtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcblxuICAgICAgICB2YXIgaW5pdGlhbFZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcblxuICAgICAgICAvLyBQcm92aWRpbmcgb3B0aW9ucz9cbiAgICAgICAgaWYgKGNvbW1vbi5pc0FycmF5KGFyZ3VtZW50c1syXSkgfHwgY29tbW9uLmlzT2JqZWN0KGFyZ3VtZW50c1syXSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IE9wdGlvbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb3ZpZGluZyBhIG1hcD9cblxuICAgICAgICBpZiAoY29tbW9uLmlzTnVtYmVyKGluaXRpYWxWYWx1ZSkpIHtcblxuICAgICAgICAgIGlmIChjb21tb24uaXNOdW1iZXIoYXJndW1lbnRzWzJdKSAmJiBjb21tb24uaXNOdW1iZXIoYXJndW1lbnRzWzNdKSkge1xuXG4gICAgICAgICAgICAvLyBIYXMgbWluIGFuZCBtYXguXG4gICAgICAgICAgICByZXR1cm4gbmV3IE51bWJlckNvbnRyb2xsZXJTbGlkZXIob2JqZWN0LCBwcm9wZXJ0eSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM10pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyQm94KG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBhcmd1bWVudHNbMl0sIG1heDogYXJndW1lbnRzWzNdIH0pO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tbW9uLmlzU3RyaW5nKGluaXRpYWxWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFN0cmluZ0NvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tbW9uLmlzRnVuY3Rpb24oaW5pdGlhbFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25Db250cm9sbGVyKG9iamVjdCwgcHJvcGVydHksICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tb24uaXNCb29sZWFuKGluaXRpYWxWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEJvb2xlYW5Db250cm9sbGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH0pKGRhdC5jb250cm9sbGVycy5PcHRpb25Db250cm9sbGVyLFxuZGF0LmNvbnRyb2xsZXJzLk51bWJlckNvbnRyb2xsZXJCb3gsXG5kYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlclNsaWRlcixcbmRhdC5jb250cm9sbGVycy5TdHJpbmdDb250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBkb20sIGNvbW1vbikge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUHJvdmlkZXMgYSB0ZXh0IGlucHV0IHRvIGFsdGVyIHRoZSBzdHJpbmcgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgKlxuICAgKiBAZXh0ZW5kcyBkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlclxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgbWFuaXB1bGF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBtYW5pcHVsYXRlZFxuICAgKlxuICAgKiBAbWVtYmVyIGRhdC5jb250cm9sbGVyc1xuICAgKi9cbiAgdmFyIFN0cmluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG5cbiAgICBTdHJpbmdDb250cm9sbGVyLnN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuX19pbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuXG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAna2V5dXAnLCBvbkNoYW5nZSk7XG4gICAgZG9tLmJpbmQodGhpcy5fX2lucHV0LCAnY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2JsdXInLCBvbkJsdXIpO1xuICAgIGRvbS5iaW5kKHRoaXMuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcblxuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuICAgICAgX3RoaXMuc2V0VmFsdWUoX3RoaXMuX19pbnB1dC52YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcblxuICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9faW5wdXQpO1xuXG4gIH07XG5cbiAgU3RyaW5nQ29udHJvbGxlci5zdXBlcmNsYXNzID0gQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBTdHJpbmdDb250cm9sbGVyLnByb3RvdHlwZSxcbiAgICAgIENvbnRyb2xsZXIucHJvdG90eXBlLFxuXG4gICAgICB7XG5cbiAgICAgICAgdXBkYXRlRGlzcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gU3RvcHMgdGhlIGNhcmV0IGZyb20gbW92aW5nIG9uIGFjY291bnQgb2Y6XG4gICAgICAgICAgLy8ga2V5dXAgLT4gc2V0VmFsdWUgLT4gdXBkYXRlRGlzcGxheVxuICAgICAgICAgIGlmICghZG9tLmlzQWN0aXZlKHRoaXMuX19pbnB1dCkpIHtcbiAgICAgICAgICAgIHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFN0cmluZ0NvbnRyb2xsZXIuc3VwZXJjbGFzcy5wcm90b3R5cGUudXBkYXRlRGlzcGxheS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuXG4gIHJldHVybiBTdHJpbmdDb250cm9sbGVyO1xuXG59KShkYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcixcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNvbW1vbiksXG5kYXQuY29udHJvbGxlcnMuRnVuY3Rpb25Db250cm9sbGVyLFxuZGF0LmNvbnRyb2xsZXJzLkJvb2xlYW5Db250cm9sbGVyLFxuZGF0LnV0aWxzLmNvbW1vbiksXG5kYXQuY29udHJvbGxlcnMuQ29udHJvbGxlcixcbmRhdC5jb250cm9sbGVycy5Cb29sZWFuQ29udHJvbGxlcixcbmRhdC5jb250cm9sbGVycy5GdW5jdGlvbkNvbnRyb2xsZXIsXG5kYXQuY29udHJvbGxlcnMuTnVtYmVyQ29udHJvbGxlckJveCxcbmRhdC5jb250cm9sbGVycy5OdW1iZXJDb250cm9sbGVyU2xpZGVyLFxuZGF0LmNvbnRyb2xsZXJzLk9wdGlvbkNvbnRyb2xsZXIsXG5kYXQuY29udHJvbGxlcnMuQ29sb3JDb250cm9sbGVyID0gKGZ1bmN0aW9uIChDb250cm9sbGVyLCBkb20sIENvbG9yLCBpbnRlcnByZXQsIGNvbW1vbikge1xuXG4gIHZhciBDb2xvckNvbnRyb2xsZXIgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG5cbiAgICBDb2xvckNvbnRyb2xsZXIuc3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgdGhpcy5fX2NvbG9yID0gbmV3IENvbG9yKHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgdGhpcy5fX3RlbXAgPSBuZXcgQ29sb3IoMCk7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBkb20ubWFrZVNlbGVjdGFibGUodGhpcy5kb21FbGVtZW50LCBmYWxzZSk7XG5cbiAgICB0aGlzLl9fc2VsZWN0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fc2VsZWN0b3IuY2xhc3NOYW1lID0gJ3NlbGVjdG9yJztcblxuICAgIHRoaXMuX19zYXR1cmF0aW9uX2ZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX3NhdHVyYXRpb25fZmllbGQuY2xhc3NOYW1lID0gJ3NhdHVyYXRpb24tZmllbGQnO1xuXG4gICAgdGhpcy5fX2ZpZWxkX2tub2IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fZmllbGRfa25vYi5jbGFzc05hbWUgPSAnZmllbGQta25vYic7XG4gICAgdGhpcy5fX2ZpZWxkX2tub2JfYm9yZGVyID0gJzJweCBzb2xpZCAnO1xuXG4gICAgdGhpcy5fX2h1ZV9rbm9iID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX2h1ZV9rbm9iLmNsYXNzTmFtZSA9ICdodWUta25vYic7XG5cbiAgICB0aGlzLl9faHVlX2ZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX2h1ZV9maWVsZC5jbGFzc05hbWUgPSAnaHVlLWZpZWxkJztcblxuICAgIHRoaXMuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5fX2lucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgdGhpcy5fX2lucHV0X3RleHRTaGFkb3cgPSAnMCAxcHggMXB4ICc7XG5cbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHsgLy8gb24gZW50ZXJcbiAgICAgICAgb25CbHVyLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb20uYmluZCh0aGlzLl9faW5wdXQsICdibHVyJywgb25CbHVyKTtcblxuICAgIGRvbS5iaW5kKHRoaXMuX19zZWxlY3RvciwgJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgZG9tXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLCAnZHJhZycpXG4gICAgICAgIC5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZG9tLnJlbW92ZUNsYXNzKF90aGlzLl9fc2VsZWN0b3IsICdkcmFnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB2YXIgdmFsdWVfZmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX3NlbGVjdG9yLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzEyMnB4JyxcbiAgICAgIGhlaWdodDogJzEwMnB4JyxcbiAgICAgIHBhZGRpbmc6ICczcHgnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIyMicsXG4gICAgICBib3hTaGFkb3c6ICcwcHggMXB4IDNweCByZ2JhKDAsMCwwLDAuMyknXG4gICAgfSk7XG5cbiAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19maWVsZF9rbm9iLnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAnMTJweCcsXG4gICAgICBoZWlnaHQ6ICcxMnB4JyxcbiAgICAgIGJvcmRlcjogdGhpcy5fX2ZpZWxkX2tub2JfYm9yZGVyICsgKHRoaXMuX19jb2xvci52IDwgLjUgPyAnI2ZmZicgOiAnIzAwMCcpLFxuICAgICAgYm94U2hhZG93OiAnMHB4IDFweCAzcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxuICAgICAgekluZGV4OiAxXG4gICAgfSk7XG4gICAgXG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLl9faHVlX2tub2Iuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxNXB4JyxcbiAgICAgIGhlaWdodDogJzJweCcsXG4gICAgICBib3JkZXJSaWdodDogJzRweCBzb2xpZCAjZmZmJyxcbiAgICAgIHpJbmRleDogMVxuICAgIH0pO1xuXG4gICAgY29tbW9uLmV4dGVuZCh0aGlzLl9fc2F0dXJhdGlvbl9maWVsZC5zdHlsZSwge1xuICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgIzU1NScsXG4gICAgICBtYXJnaW5SaWdodDogJzNweCcsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgfSk7XG5cbiAgICBjb21tb24uZXh0ZW5kKHZhbHVlX2ZpZWxkLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBiYWNrZ3JvdW5kOiAnbm9uZSdcbiAgICB9KTtcbiAgICBcbiAgICBsaW5lYXJHcmFkaWVudCh2YWx1ZV9maWVsZCwgJ3RvcCcsICdyZ2JhKDAsMCwwLDApJywgJyMwMDAnKTtcblxuICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX2h1ZV9maWVsZC5zdHlsZSwge1xuICAgICAgd2lkdGg6ICcxNXB4JyxcbiAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM1NTUnLFxuICAgICAgY3Vyc29yOiAnbnMtcmVzaXplJ1xuICAgIH0pO1xuXG4gICAgaHVlR3JhZGllbnQodGhpcy5fX2h1ZV9maWVsZCk7XG5cbiAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19pbnB1dC5zdHlsZSwge1xuICAgICAgb3V0bGluZTogJ25vbmUnLFxuLy8gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4vLyAgICAgIHBhZGRpbmc6ICc0cHgnLFxuLy8gICAgICBtYXJnaW5Cb3R0b206ICc2cHgnLFxuICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgIGJvcmRlcjogMCxcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgIHRleHRTaGFkb3c6IHRoaXMuX19pbnB1dF90ZXh0U2hhZG93ICsgJ3JnYmEoMCwwLDAsMC43KSdcbiAgICB9KTtcblxuICAgIGRvbS5iaW5kKHRoaXMuX19zYXR1cmF0aW9uX2ZpZWxkLCAnbW91c2Vkb3duJywgZmllbGREb3duKTtcbiAgICBkb20uYmluZCh0aGlzLl9fZmllbGRfa25vYiwgJ21vdXNlZG93bicsIGZpZWxkRG93bik7XG5cbiAgICBkb20uYmluZCh0aGlzLl9faHVlX2ZpZWxkLCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgc2V0SChlKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIHNldEgpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2V1cCcsIHVuYmluZEgpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZmllbGREb3duKGUpIHtcbiAgICAgIHNldFNWKGUpO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnbm9uZSc7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRTVik7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgdW5iaW5kU1YpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuYmluZFNWKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRTVik7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCB1bmJpbmRTVik7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgICB2YXIgaSA9IGludGVycHJldCh0aGlzLnZhbHVlKTtcbiAgICAgIGlmIChpICE9PSBmYWxzZSkge1xuICAgICAgICBfdGhpcy5fX2NvbG9yLl9fc3RhdGUgPSBpO1xuICAgICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZhbHVlID0gX3RoaXMuX19jb2xvci50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuYmluZEgoKSB7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIHNldEgpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgdW5iaW5kSCk7XG4gICAgfVxuXG4gICAgdGhpcy5fX3NhdHVyYXRpb25fZmllbGQuYXBwZW5kQ2hpbGQodmFsdWVfZmllbGQpO1xuICAgIHRoaXMuX19zZWxlY3Rvci5hcHBlbmRDaGlsZCh0aGlzLl9fZmllbGRfa25vYik7XG4gICAgdGhpcy5fX3NlbGVjdG9yLmFwcGVuZENoaWxkKHRoaXMuX19zYXR1cmF0aW9uX2ZpZWxkKTtcbiAgICB0aGlzLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQodGhpcy5fX2h1ZV9maWVsZCk7XG4gICAgdGhpcy5fX2h1ZV9maWVsZC5hcHBlbmRDaGlsZCh0aGlzLl9faHVlX2tub2IpO1xuXG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19pbnB1dCk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX19zZWxlY3Rvcik7XG5cbiAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcblxuICAgIGZ1bmN0aW9uIHNldFNWKGUpIHtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgdyA9IGRvbS5nZXRXaWR0aChfdGhpcy5fX3NhdHVyYXRpb25fZmllbGQpO1xuICAgICAgdmFyIG8gPSBkb20uZ2V0T2Zmc2V0KF90aGlzLl9fc2F0dXJhdGlvbl9maWVsZCk7XG4gICAgICB2YXIgcyA9IChlLmNsaWVudFggLSBvLmxlZnQgKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIC8gdztcbiAgICAgIHZhciB2ID0gMSAtIChlLmNsaWVudFkgLSBvLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAvIHc7XG5cbiAgICAgIGlmICh2ID4gMSkgdiA9IDE7XG4gICAgICBlbHNlIGlmICh2IDwgMCkgdiA9IDA7XG5cbiAgICAgIGlmIChzID4gMSkgcyA9IDE7XG4gICAgICBlbHNlIGlmIChzIDwgMCkgcyA9IDA7XG5cbiAgICAgIF90aGlzLl9fY29sb3IudiA9IHY7XG4gICAgICBfdGhpcy5fX2NvbG9yLnMgPSBzO1xuXG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSk7XG5cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0SChlKSB7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIHMgPSBkb20uZ2V0SGVpZ2h0KF90aGlzLl9faHVlX2ZpZWxkKTtcbiAgICAgIHZhciBvID0gZG9tLmdldE9mZnNldChfdGhpcy5fX2h1ZV9maWVsZCk7XG4gICAgICB2YXIgaCA9IDEgLSAoZS5jbGllbnRZIC0gby50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLyBzO1xuXG4gICAgICBpZiAoaCA+IDEpIGggPSAxO1xuICAgICAgZWxzZSBpZiAoaCA8IDApIGggPSAwO1xuXG4gICAgICBfdGhpcy5fX2NvbG9yLmggPSBoICogMzYwO1xuXG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICB9O1xuXG4gIENvbG9yQ29udHJvbGxlci5zdXBlcmNsYXNzID0gQ29udHJvbGxlcjtcblxuICBjb21tb24uZXh0ZW5kKFxuXG4gICAgICBDb2xvckNvbnRyb2xsZXIucHJvdG90eXBlLFxuICAgICAgQ29udHJvbGxlci5wcm90b3R5cGUsXG5cbiAgICAgIHtcblxuICAgICAgICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciBpID0gaW50ZXJwcmV0KHRoaXMuZ2V0VmFsdWUoKSk7XG5cbiAgICAgICAgICBpZiAoaSAhPT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgdmFyIG1pc21hdGNoID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBtaXNtYXRjaCBvbiB0aGUgaW50ZXJwcmV0ZWQgdmFsdWUuXG5cbiAgICAgICAgICAgIGNvbW1vbi5lYWNoKENvbG9yLkNPTVBPTkVOVFMsIGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgICBpZiAoIWNvbW1vbi5pc1VuZGVmaW5lZChpW2NvbXBvbmVudF0pICYmXG4gICAgICAgICAgICAgICAgICAhY29tbW9uLmlzVW5kZWZpbmVkKHRoaXMuX19jb2xvci5fX3N0YXRlW2NvbXBvbmVudF0pICYmXG4gICAgICAgICAgICAgICAgICBpW2NvbXBvbmVudF0gIT09IHRoaXMuX19jb2xvci5fX3N0YXRlW2NvbXBvbmVudF0pIHtcbiAgICAgICAgICAgICAgICBtaXNtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9OyAvLyBicmVha1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgLy8gSWYgbm90aGluZyBkaXZlcmdlcywgd2Uga2VlcCBvdXIgcHJldmlvdXMgdmFsdWVzXG4gICAgICAgICAgICAvLyBmb3Igc3RhdGVmdWxuZXNzLCBvdGhlcndpc2Ugd2UgcmVjYWxjdWxhdGUgZnJlc2hcbiAgICAgICAgICAgIGlmIChtaXNtYXRjaCkge1xuICAgICAgICAgICAgICBjb21tb24uZXh0ZW5kKHRoaXMuX19jb2xvci5fX3N0YXRlLCBpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX3RlbXAuX19zdGF0ZSwgdGhpcy5fX2NvbG9yLl9fc3RhdGUpO1xuXG4gICAgICAgICAgdGhpcy5fX3RlbXAuYSA9IDE7XG5cbiAgICAgICAgICB2YXIgZmxpcCA9ICh0aGlzLl9fY29sb3IudiA8IC41IHx8IHRoaXMuX19jb2xvci5zID4gLjUpID8gMjU1IDogMDtcbiAgICAgICAgICB2YXIgX2ZsaXAgPSAyNTUgLSBmbGlwO1xuXG4gICAgICAgICAgY29tbW9uLmV4dGVuZCh0aGlzLl9fZmllbGRfa25vYi5zdHlsZSwge1xuICAgICAgICAgICAgbWFyZ2luTGVmdDogMTAwICogdGhpcy5fX2NvbG9yLnMgLSA3ICsgJ3B4JyxcbiAgICAgICAgICAgIG1hcmdpblRvcDogMTAwICogKDEgLSB0aGlzLl9fY29sb3IudikgLSA3ICsgJ3B4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5fX3RlbXAudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGJvcmRlcjogdGhpcy5fX2ZpZWxkX2tub2JfYm9yZGVyICsgJ3JnYignICsgZmxpcCArICcsJyArIGZsaXAgKyAnLCcgKyBmbGlwICsnKSdcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuX19odWVfa25vYi5zdHlsZS5tYXJnaW5Ub3AgPSAoMSAtIHRoaXMuX19jb2xvci5oIC8gMzYwKSAqIDEwMCArICdweCdcblxuICAgICAgICAgIHRoaXMuX190ZW1wLnMgPSAxO1xuICAgICAgICAgIHRoaXMuX190ZW1wLnYgPSAxO1xuXG4gICAgICAgICAgbGluZWFyR3JhZGllbnQodGhpcy5fX3NhdHVyYXRpb25fZmllbGQsICdsZWZ0JywgJyNmZmYnLCB0aGlzLl9fdGVtcC50b1N0cmluZygpKTtcblxuICAgICAgICAgIGNvbW1vbi5leHRlbmQodGhpcy5fX2lucHV0LnN0eWxlLCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuX19jb2xvci50b1N0cmluZygpLFxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoJyArIGZsaXAgKyAnLCcgKyBmbGlwICsgJywnICsgZmxpcCArJyknLFxuICAgICAgICAgICAgdGV4dFNoYWRvdzogdGhpcy5fX2lucHV0X3RleHRTaGFkb3cgKyAncmdiYSgnICsgX2ZsaXAgKyAnLCcgKyBfZmxpcCArICcsJyArIF9mbGlwICsnLC43KSdcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICApO1xuICBcbiAgdmFyIHZlbmRvcnMgPSBbJy1tb3otJywnLW8tJywnLXdlYmtpdC0nLCctbXMtJywnJ107XG4gIFxuICBmdW5jdGlvbiBsaW5lYXJHcmFkaWVudChlbGVtLCB4LCBhLCBiKSB7XG4gICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgY29tbW9uLmVhY2godmVuZG9ycywgZnVuY3Rpb24odmVuZG9yKSB7XG4gICAgICBlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6ICcgKyB2ZW5kb3IgKyAnbGluZWFyLWdyYWRpZW50KCcreCsnLCAnK2ErJyAwJSwgJyArIGIgKyAnIDEwMCUpOyAnO1xuICAgIH0pO1xuICB9XG4gIFxuICBmdW5jdGlvbiBodWVHcmFkaWVudChlbGVtKSB7XG4gICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCAjZmYwMGZmIDE3JSwgIzAwMDBmZiAzNCUsICMwMGZmZmYgNTAlLCAjMDBmZjAwIDY3JSwgI2ZmZmYwMCA4NCUsICNmZjAwMDAgMTAwJSk7J1xuICAgIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOydcbiAgICBlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCNmZjAwZmYgMTclLCMwMDAwZmYgMzQlLCMwMGZmZmYgNTAlLCMwMGZmMDAgNjclLCNmZmZmMDAgODQlLCNmZjAwMDAgMTAwJSk7J1xuICAgIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW1zLWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCNmZjAwZmYgMTclLCMwMDAwZmYgMzQlLCMwMGZmZmYgNTAlLCMwMGZmMDAgNjclLCNmZmZmMDAgODQlLCNmZjAwMDAgMTAwJSk7J1xuICAgIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnXG4gIH1cblxuXG4gIHJldHVybiBDb2xvckNvbnRyb2xsZXI7XG5cbn0pKGRhdC5jb250cm9sbGVycy5Db250cm9sbGVyLFxuZGF0LmRvbS5kb20sXG5kYXQuY29sb3IuQ29sb3IgPSAoZnVuY3Rpb24gKGludGVycHJldCwgbWF0aCwgdG9TdHJpbmcsIGNvbW1vbikge1xuXG4gIHZhciBDb2xvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5fX3N0YXRlID0gaW50ZXJwcmV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBpZiAodGhpcy5fX3N0YXRlID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgJ0ZhaWxlZCB0byBpbnRlcnByZXQgY29sb3IgYXJndW1lbnRzJztcbiAgICB9XG5cbiAgICB0aGlzLl9fc3RhdGUuYSA9IHRoaXMuX19zdGF0ZS5hIHx8IDE7XG5cblxuICB9O1xuXG4gIENvbG9yLkNPTVBPTkVOVFMgPSBbJ3InLCdnJywnYicsJ2gnLCdzJywndicsJ2hleCcsJ2EnXTtcblxuICBjb21tb24uZXh0ZW5kKENvbG9yLnByb3RvdHlwZSwge1xuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b09yaWdpbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGUuY29udmVyc2lvbi53cml0ZSh0aGlzKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ3InLCAyKTtcbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2cnLCAxKTtcbiAgZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2InLCAwKTtcblxuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnaCcpO1xuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAncycpO1xuICBkZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAndicpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb2xvci5wcm90b3R5cGUsICdhJywge1xuXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGUuYTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbih2KSB7XG4gICAgICB0aGlzLl9fc3RhdGUuYSA9IHY7XG4gICAgfVxuXG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb2xvci5wcm90b3R5cGUsICdoZXgnLCB7XG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiAoIXRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ0hFWCcpIHtcbiAgICAgICAgdGhpcy5fX3N0YXRlLmhleCA9IG1hdGgucmdiX3RvX2hleCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5oZXg7XG5cbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbih2KSB7XG5cbiAgICAgIHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdIRVgnO1xuICAgICAgdGhpcy5fX3N0YXRlLmhleCA9IHY7XG5cbiAgICB9XG5cbiAgfSk7XG5cbiAgZnVuY3Rpb24gZGVmaW5lUkdCQ29tcG9uZW50KHRhcmdldCwgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG5cbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ1JHQicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG4gICAgICAgIH1cblxuICAgICAgICByZWNhbGN1bGF0ZVJHQih0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG5cbiAgICAgIH0sXG5cbiAgICAgIHNldDogZnVuY3Rpb24odikge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdSR0InKSB7XG4gICAgICAgICAgcmVjYWxjdWxhdGVSR0IodGhpcywgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCk7XG4gICAgICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ1JHQic7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc3RhdGVbY29tcG9uZW50XSA9IHY7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVIU1ZDb21wb25lbnQodGFyZ2V0LCBjb21wb25lbnQpIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbXBvbmVudCwge1xuXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgPT09ICdIU1YnKVxuICAgICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcblxuICAgICAgICByZWNhbGN1bGF0ZUhTVih0aGlzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG5cbiAgICAgIH0sXG5cbiAgICAgIHNldDogZnVuY3Rpb24odikge1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdIU1YnKSB7XG4gICAgICAgICAgcmVjYWxjdWxhdGVIU1YodGhpcyk7XG4gICAgICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ0hTVic7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc3RhdGVbY29tcG9uZW50XSA9IHY7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiByZWNhbGN1bGF0ZVJHQihjb2xvciwgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCkge1xuXG4gICAgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIRVgnKSB7XG5cbiAgICAgIGNvbG9yLl9fc3RhdGVbY29tcG9uZW50XSA9IG1hdGguY29tcG9uZW50X2Zyb21faGV4KGNvbG9yLl9fc3RhdGUuaGV4LCBjb21wb25lbnRIZXhJbmRleCk7XG5cbiAgICB9IGVsc2UgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIU1YnKSB7XG5cbiAgICAgIGNvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSwgbWF0aC5oc3ZfdG9fcmdiKGNvbG9yLl9fc3RhdGUuaCwgY29sb3IuX19zdGF0ZS5zLCBjb2xvci5fX3N0YXRlLnYpKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRocm93ICdDb3JydXB0ZWQgY29sb3Igc3RhdGUnO1xuXG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiByZWNhbGN1bGF0ZUhTVihjb2xvcikge1xuXG4gICAgdmFyIHJlc3VsdCA9IG1hdGgucmdiX3RvX2hzdihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcblxuICAgIGNvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSxcbiAgICAgICAge1xuICAgICAgICAgIHM6IHJlc3VsdC5zLFxuICAgICAgICAgIHY6IHJlc3VsdC52XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCFjb21tb24uaXNOYU4ocmVzdWx0LmgpKSB7XG4gICAgICBjb2xvci5fX3N0YXRlLmggPSByZXN1bHQuaDtcbiAgICB9IGVsc2UgaWYgKGNvbW1vbi5pc1VuZGVmaW5lZChjb2xvci5fX3N0YXRlLmgpKSB7XG4gICAgICBjb2xvci5fX3N0YXRlLmggPSAwO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIENvbG9yO1xuXG59KShkYXQuY29sb3IuaW50ZXJwcmV0LFxuZGF0LmNvbG9yLm1hdGggPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciB0bXBDb21wb25lbnQ7XG5cbiAgcmV0dXJuIHtcblxuICAgIGhzdl90b19yZ2I6IGZ1bmN0aW9uKGgsIHMsIHYpIHtcblxuICAgICAgdmFyIGhpID0gTWF0aC5mbG9vcihoIC8gNjApICUgNjtcblxuICAgICAgdmFyIGYgPSBoIC8gNjAgLSBNYXRoLmZsb29yKGggLyA2MCk7XG4gICAgICB2YXIgcCA9IHYgKiAoMS4wIC0gcyk7XG4gICAgICB2YXIgcSA9IHYgKiAoMS4wIC0gKGYgKiBzKSk7XG4gICAgICB2YXIgdCA9IHYgKiAoMS4wIC0gKCgxLjAgLSBmKSAqIHMpKTtcbiAgICAgIHZhciBjID0gW1xuICAgICAgICBbdiwgdCwgcF0sXG4gICAgICAgIFtxLCB2LCBwXSxcbiAgICAgICAgW3AsIHYsIHRdLFxuICAgICAgICBbcCwgcSwgdl0sXG4gICAgICAgIFt0LCBwLCB2XSxcbiAgICAgICAgW3YsIHAsIHFdXG4gICAgICBdW2hpXTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcjogY1swXSAqIDI1NSxcbiAgICAgICAgZzogY1sxXSAqIDI1NSxcbiAgICAgICAgYjogY1syXSAqIDI1NVxuICAgICAgfTtcblxuICAgIH0sXG5cbiAgICByZ2JfdG9faHN2OiBmdW5jdGlvbihyLCBnLCBiKSB7XG5cbiAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgICAgICBkZWx0YSA9IG1heCAtIG1pbixcbiAgICAgICAgICBoLCBzO1xuXG4gICAgICBpZiAobWF4ICE9IDApIHtcbiAgICAgICAgcyA9IGRlbHRhIC8gbWF4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoOiBOYU4sXG4gICAgICAgICAgczogMCxcbiAgICAgICAgICB2OiAwXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChyID09IG1heCkge1xuICAgICAgICBoID0gKGcgLSBiKSAvIGRlbHRhO1xuICAgICAgfSBlbHNlIGlmIChnID09IG1heCkge1xuICAgICAgICBoID0gMiArIChiIC0gcikgLyBkZWx0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGggPSA0ICsgKHIgLSBnKSAvIGRlbHRhO1xuICAgICAgfVxuICAgICAgaCAvPSA2O1xuICAgICAgaWYgKGggPCAwKSB7XG4gICAgICAgIGggKz0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaDogaCAqIDM2MCxcbiAgICAgICAgczogcyxcbiAgICAgICAgdjogbWF4IC8gMjU1XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICByZ2JfdG9faGV4OiBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgICB2YXIgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoMCwgMiwgcik7XG4gICAgICBoZXggPSB0aGlzLmhleF93aXRoX2NvbXBvbmVudChoZXgsIDEsIGcpO1xuICAgICAgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoaGV4LCAwLCBiKTtcbiAgICAgIHJldHVybiBoZXg7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudF9mcm9tX2hleDogZnVuY3Rpb24oaGV4LCBjb21wb25lbnRJbmRleCkge1xuICAgICAgcmV0dXJuIChoZXggPj4gKGNvbXBvbmVudEluZGV4ICogOCkpICYgMHhGRjtcbiAgICB9LFxuXG4gICAgaGV4X3dpdGhfY29tcG9uZW50OiBmdW5jdGlvbihoZXgsIGNvbXBvbmVudEluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIDw8ICh0bXBDb21wb25lbnQgPSBjb21wb25lbnRJbmRleCAqIDgpIHwgKGhleCAmIH4gKDB4RkYgPDwgdG1wQ29tcG9uZW50KSk7XG4gICAgfVxuXG4gIH1cblxufSkoKSxcbmRhdC5jb2xvci50b1N0cmluZyxcbmRhdC51dGlscy5jb21tb24pLFxuZGF0LmNvbG9yLmludGVycHJldCxcbmRhdC51dGlscy5jb21tb24pLFxuZGF0LnV0aWxzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgLyoqXG4gICAqIHJlcXVpcmVqcyB2ZXJzaW9uIG9mIFBhdWwgSXJpc2gncyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICogaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAgICovXG5cbiAgcmV0dXJuIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG5cbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cbiAgICAgIH07XG59KSgpLFxuZGF0LmRvbS5DZW50ZXJlZERpdiA9IChmdW5jdGlvbiAoZG9tLCBjb21tb24pIHtcblxuXG4gIHZhciBDZW50ZXJlZERpdiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5iYWNrZ3JvdW5kRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbW1vbi5leHRlbmQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZSwge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjgpJyxcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICB6SW5kZXg6ICcxMDAwJyxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBXZWJraXRUcmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzIGxpbmVhcidcbiAgICB9KTtcblxuICAgIGRvbS5tYWtlRnVsbHNjcmVlbih0aGlzLmJhY2tncm91bmRFbGVtZW50KTtcbiAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcblxuICAgIHRoaXMuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbW1vbi5leHRlbmQodGhpcy5kb21FbGVtZW50LnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgIHpJbmRleDogJzEwMDEnLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIFdlYmtpdFRyYW5zaXRpb246ICctd2Via2l0LXRyYW5zZm9ybSAwLjJzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnMgbGluZWFyJ1xuICAgIH0pO1xuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb21FbGVtZW50KTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgZG9tLmJpbmQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBfdGhpcy5oaWRlKCk7XG4gICAgfSk7XG5cblxuICB9O1xuXG4gIENlbnRlcmVkRGl2LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIFxuXG5cbiAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbi8vICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnNTIlJztcbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEuMSknO1xuXG4gICAgdGhpcy5sYXlvdXQoKTtcblxuICAgIGNvbW1vbi5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgX3RoaXMuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIF90aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcbiAgICB9KTtcblxuICB9O1xuXG4gIENlbnRlcmVkRGl2LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGhpZGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgX3RoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgX3RoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgZG9tLnVuYmluZChfdGhpcy5kb21FbGVtZW50LCAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGhpZGUpO1xuICAgICAgZG9tLnVuYmluZChfdGhpcy5kb21FbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIGhpZGUpO1xuICAgICAgZG9tLnVuYmluZChfdGhpcy5kb21FbGVtZW50LCAnb1RyYW5zaXRpb25FbmQnLCBoaWRlKTtcblxuICAgIH07XG5cbiAgICBkb20uYmluZCh0aGlzLmRvbUVsZW1lbnQsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgaGlkZSk7XG4gICAgZG9tLmJpbmQodGhpcy5kb21FbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIGhpZGUpO1xuICAgIGRvbS5iaW5kKHRoaXMuZG9tRWxlbWVudCwgJ29UcmFuc2l0aW9uRW5kJywgaGlkZSk7XG5cbiAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuLy8gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICc0OCUnO1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEuMSknO1xuXG4gIH07XG5cbiAgQ2VudGVyZWREaXYucHJvdG90eXBlLmxheW91dCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gd2luZG93LmlubmVyV2lkdGgvMiAtIGRvbS5nZXRXaWR0aCh0aGlzLmRvbUVsZW1lbnQpIC8gMiArICdweCc7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodC8yIC0gZG9tLmdldEhlaWdodCh0aGlzLmRvbUVsZW1lbnQpIC8gMiArICdweCc7XG4gIH07XG4gIFxuICBmdW5jdGlvbiBsb2NrU2Nyb2xsKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgfVxuXG4gIHJldHVybiBDZW50ZXJlZERpdjtcblxufSkoZGF0LmRvbS5kb20sXG5kYXQudXRpbHMuY29tbW9uKSxcbmRhdC5kb20uZG9tLFxuZGF0LnV0aWxzLmNvbW1vbik7IiwiKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGtleXMgPSAkT2JqZWN0LmtleXM7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgJHByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zO1xuICB2YXIgJHNlYWwgPSBPYmplY3Quc2VhbDtcbiAgdmFyICRpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciBtZXRob2QgPSBub25FbnVtO1xuICB2YXIgY291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIG5ld1VuaXF1ZVN0cmluZygpIHtcbiAgICByZXR1cm4gJ19fJCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgJyQnICsgKytjb3VudGVyICsgJyRfXyc7XG4gIH1cbiAgdmFyIHN5bWJvbEludGVybmFsUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERhdGFQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sVmFsdWVzID0gJGNyZWF0ZShudWxsKTtcbiAgdmFyIHByaXZhdGVOYW1lcyA9ICRjcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGlzUHJpdmF0ZU5hbWUocykge1xuICAgIHJldHVybiBwcml2YXRlTmFtZXNbc107XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlUHJpdmF0ZU5hbWUoKSB7XG4gICAgdmFyIHMgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgICBwcml2YXRlTmFtZXNbc10gPSB0cnVlO1xuICAgIHJldHVybiBzO1xuICB9XG4gIGZ1bmN0aW9uIGlzU2hpbVN5bWJvbChzeW1ib2wpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN5bWJvbCA9PT0gJ29iamVjdCcgJiYgc3ltYm9sIGluc3RhbmNlb2YgU3ltYm9sVmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gdHlwZU9mKHYpIHtcbiAgICBpZiAoaXNTaGltU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICBmcmVlemUodGhpcyk7XG4gICAgc3ltYm9sVmFsdWVzW2tleV0gPSB0aGlzO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgdmFyIGhhc2hQcm9wZXJ0eSA9IGNyZWF0ZVByaXZhdGVOYW1lKCk7XG4gIHZhciBoYXNoUHJvcGVydHlEZXNjcmlwdG9yID0ge3ZhbHVlOiB1bmRlZmluZWR9O1xuICB2YXIgaGFzaE9iamVjdFByb3BlcnRpZXMgPSB7XG4gICAgaGFzaDoge3ZhbHVlOiB1bmRlZmluZWR9LFxuICAgIHNlbGY6IHt2YWx1ZTogdW5kZWZpbmVkfVxuICB9O1xuICB2YXIgaGFzaENvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBnZXRPd25IYXNoT2JqZWN0KG9iamVjdCkge1xuICAgIHZhciBoYXNoT2JqZWN0ID0gb2JqZWN0W2hhc2hQcm9wZXJ0eV07XG4gICAgaWYgKGhhc2hPYmplY3QgJiYgaGFzaE9iamVjdC5zZWxmID09PSBvYmplY3QpXG4gICAgICByZXR1cm4gaGFzaE9iamVjdDtcbiAgICBpZiAoJGlzRXh0ZW5zaWJsZShvYmplY3QpKSB7XG4gICAgICBoYXNoT2JqZWN0UHJvcGVydGllcy5oYXNoLnZhbHVlID0gaGFzaENvdW50ZXIrKztcbiAgICAgIGhhc2hPYmplY3RQcm9wZXJ0aWVzLnNlbGYudmFsdWUgPSBvYmplY3Q7XG4gICAgICBoYXNoUHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlID0gJGNyZWF0ZShudWxsLCBoYXNoT2JqZWN0UHJvcGVydGllcyk7XG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBoYXNoUHJvcGVydHksIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgcmV0dXJuIGhhc2hQcm9wZXJ0eURlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KTtcbiAgICByZXR1cm4gJGZyZWV6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG4gIGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKG9iamVjdCkge1xuICAgIGdldE93bkhhc2hPYmplY3Qob2JqZWN0KTtcbiAgICByZXR1cm4gJHByZXZlbnRFeHRlbnNpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgZnVuY3Rpb24gc2VhbChvYmplY3QpIHtcbiAgICBnZXRPd25IYXNoT2JqZWN0KG9iamVjdCk7XG4gICAgcmV0dXJuICRzZWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgZnJlZXplKFN5bWJvbFZhbHVlLnByb3RvdHlwZSk7XG4gIGZ1bmN0aW9uIGlzU3ltYm9sU3RyaW5nKHMpIHtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWVzW3NdIHx8IHByaXZhdGVOYW1lc1tzXTtcbiAgfVxuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTaGltU3ltYm9sKG5hbWUpKVxuICAgICAgcmV0dXJuIG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlU3ltYm9sS2V5cyhhcnJheSkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNTeW1ib2xTdHJpbmcoYXJyYXlbaV0pKSB7XG4gICAgICAgIHJ2LnB1c2goYXJyYXlbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICByZXR1cm4gcmVtb3ZlU3ltYm9sS2V5cygkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICAgIHJldHVybiByZW1vdmVTeW1ib2xLZXlzKCRrZXlzKG9iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzeW1ib2wgPSBzeW1ib2xWYWx1ZXNbbmFtZXNbaV1dO1xuICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICBydi5wdXNoKHN5bWJvbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShuYW1lKSB7XG4gICAgcmV0dXJuICRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGdsb2JhbC50cmFjZXVyICYmIGdsb2JhbC50cmFjZXVyLm9wdGlvbnNbbmFtZV07XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU2hpbVN5bWJvbChuYW1lKSkge1xuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZnJlZXplJywge3ZhbHVlOiBmcmVlemV9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAncHJldmVudEV4dGVuc2lvbnMnLCB7dmFsdWU6IHByZXZlbnRFeHRlbnNpb25zfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ3NlYWwnLCB7dmFsdWU6IHNlYWx9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAna2V5cycsIHt2YWx1ZToga2V5c30pO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBuYW1lID0gbmFtZXNbal07XG4gICAgICAgIGlmIChpc1N5bWJvbFN0cmluZyhuYW1lKSlcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgKGZ1bmN0aW9uKG1vZCwgbmFtZSkge1xuICAgICAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb2RbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KShhcmd1bWVudHNbaV0sIG5hbWVzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gICAgcmV0dXJuIHggIT0gbnVsbCAmJiAodHlwZW9mIHggPT09ICdvYmplY3QnIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKTtcbiAgfVxuICBmdW5jdGlvbiB0b09iamVjdCh4KSB7XG4gICAgaWYgKHggPT0gbnVsbClcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gJE9iamVjdCh4KTtcbiAgfVxuICBmdW5jdGlvbiBjaGVja09iamVjdENvZXJjaWJsZShhcmd1bWVudCkge1xuICAgIGlmIChhcmd1bWVudCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBjYW5ub3QgYmUgY29udmVydGVkIHRvIGFuIE9iamVjdCcpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnQ7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxTeW1ib2woZ2xvYmFsLCBTeW1ib2wpIHtcbiAgICBpZiAoIWdsb2JhbC5TeW1ib2wpIHtcbiAgICAgIGdsb2JhbC5TeW1ib2wgPSBTeW1ib2w7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIH1cbiAgICBpZiAoIWdsb2JhbC5TeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgIGdsb2JhbC5TeW1ib2wuaXRlcmF0b3IgPSBTeW1ib2woJ1N5bWJvbC5pdGVyYXRvcicpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXR1cEdsb2JhbHMoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxTeW1ib2woZ2xvYmFsLCBTeW1ib2wpO1xuICAgIGdsb2JhbC5SZWZsZWN0ID0gZ2xvYmFsLlJlZmxlY3QgfHwge307XG4gICAgZ2xvYmFsLlJlZmxlY3QuZ2xvYmFsID0gZ2xvYmFsLlJlZmxlY3QuZ2xvYmFsIHx8IGdsb2JhbDtcbiAgICBwb2x5ZmlsbE9iamVjdChnbG9iYWwuT2JqZWN0KTtcbiAgfVxuICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgZ2xvYmFsLiR0cmFjZXVyUnVudGltZSA9IHtcbiAgICBjaGVja09iamVjdENvZXJjaWJsZTogY2hlY2tPYmplY3RDb2VyY2libGUsXG4gICAgY3JlYXRlUHJpdmF0ZU5hbWU6IGNyZWF0ZVByaXZhdGVOYW1lLFxuICAgIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAgIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZXRPd25IYXNoT2JqZWN0OiBnZXRPd25IYXNoT2JqZWN0LFxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgICBpc09iamVjdDogaXNPYmplY3QsXG4gICAgaXNQcml2YXRlTmFtZTogaXNQcml2YXRlTmFtZSxcbiAgICBpc1N5bWJvbFN0cmluZzogaXNTeW1ib2xTdHJpbmcsXG4gICAga2V5czogJGtleXMsXG4gICAgc2V0dXBHbG9iYWxzOiBzZXR1cEdsb2JhbHMsXG4gICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuICAgIHRvUHJvcGVydHk6IHRvUHJvcGVydHksXG4gICAgdHlwZW9mOiB0eXBlT2ZcbiAgfTtcbn0pKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHBhdGg7XG4gIGZ1bmN0aW9uIHJlbGF0aXZlUmVxdWlyZShjYWxsZXJQYXRoLCByZXF1aXJlZFBhdGgpIHtcbiAgICBwYXRoID0gcGF0aCB8fCB0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZSgncGF0aCcpO1xuICAgIGZ1bmN0aW9uIGlzRGlyZWN0b3J5KHBhdGgpIHtcbiAgICAgIHJldHVybiBwYXRoLnNsaWNlKC0xKSA9PT0gJy8nO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0Fic29sdXRlKHBhdGgpIHtcbiAgICAgIHJldHVybiBwYXRoWzBdID09PSAnLyc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzUmVsYXRpdmUocGF0aCkge1xuICAgICAgcmV0dXJuIHBhdGhbMF0gPT09ICcuJztcbiAgICB9XG4gICAgaWYgKGlzRGlyZWN0b3J5KHJlcXVpcmVkUGF0aCkgfHwgaXNBYnNvbHV0ZShyZXF1aXJlZFBhdGgpKVxuICAgICAgcmV0dXJuO1xuICAgIHJldHVybiBpc1JlbGF0aXZlKHJlcXVpcmVkUGF0aCkgPyByZXF1aXJlKHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoY2FsbGVyUGF0aCksIHJlcXVpcmVkUGF0aCkpIDogcmVxdWlyZShyZXF1aXJlZFBhdGgpO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5yZXF1aXJlID0gcmVsYXRpdmVSZXF1aXJlO1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBmdW5jdGlvbiBzcHJlYWQoKSB7XG4gICAgdmFyIHJ2ID0gW10sXG4gICAgICAgIGogPSAwLFxuICAgICAgICBpdGVyUmVzdWx0O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWVUb1NwcmVhZCA9ICR0cmFjZXVyUnVudGltZS5jaGVja09iamVjdENvZXJjaWJsZShhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZVRvU3ByZWFkWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KFN5bWJvbC5pdGVyYXRvcildICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBzcHJlYWQgbm9uLWl0ZXJhYmxlIG9iamVjdC4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyID0gdmFsdWVUb1NwcmVhZFskdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShTeW1ib2wuaXRlcmF0b3IpXSgpO1xuICAgICAgd2hpbGUgKCEoaXRlclJlc3VsdCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHJ2W2orK10gPSBpdGVyUmVzdWx0LnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLnNwcmVhZCA9IHNwcmVhZDtcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICB2YXIgJGNyZWF0ZSA9ICRPYmplY3QuY3JlYXRlO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkdHJhY2V1clJ1bnRpbWUuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkdHJhY2V1clJ1bnRpbWUuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICB2YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSAkdHJhY2V1clJ1bnRpbWUuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgdmFyICRnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyICRfXzAgPSBPYmplY3QsXG4gICAgICBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJF9fMC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAgICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gJF9fMC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gIGZ1bmN0aW9uIHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIHByb3RvID0gJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpO1xuICAgIGRvIHtcbiAgICAgIHZhciByZXN1bHQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBwcm90byA9ICRnZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfSB3aGlsZSAocHJvdG8pO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJDb25zdHJ1Y3RvcihjdG9yKSB7XG4gICAgcmV0dXJuIGN0b3IuX19wcm90b19fO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKCFkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcigoXCJzdXBlciBoYXMgbm8gc2V0dGVyICdcIiArIG5hbWUgKyBcIicuXCIpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZXNjcmlwdG9ycyhvYmplY3QpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB7fTtcbiAgICB2YXIgbmFtZXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzW25hbWVdID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgIH1cbiAgICB2YXIgc3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbHNbaV07XG4gICAgICBkZXNjcmlwdG9yc1skdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShzeW1ib2wpXSA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCAkdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShzeW1ib2wpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JzO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGN0b3IsIG9iamVjdCwgc3RhdGljT2JqZWN0LCBzdXBlckNsYXNzKSB7XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzKSB7XG4gICAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGN0b3IuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICAgIGN0b3IucHJvdG90eXBlID0gJGNyZWF0ZShnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSwgZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gb2JqZWN0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoY3RvciwgJ3Byb3RvdHlwZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnRpZXMoY3RvciwgZ2V0RGVzY3JpcHRvcnMoc3RhdGljT2JqZWN0KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgICAgaWYgKCRPYmplY3QocHJvdG90eXBlKSA9PT0gcHJvdG90eXBlIHx8IHByb3RvdHlwZSA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgICAgdGhyb3cgbmV3ICRUeXBlRXJyb3IoJ3N1cGVyIHByb3RvdHlwZSBtdXN0IGJlIGFuIE9iamVjdCBvciBudWxsJyk7XG4gICAgfVxuICAgIGlmIChzdXBlckNsYXNzID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdGhyb3cgbmV3ICRUeXBlRXJyb3IoKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzICsgXCIuXCIpKTtcbiAgfVxuICBmdW5jdGlvbiBkZWZhdWx0U3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIGFyZ3MpIHtcbiAgICBpZiAoJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpICE9PSBudWxsKVxuICAgICAgc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsICdjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcyA9IGNyZWF0ZUNsYXNzO1xuICAkdHJhY2V1clJ1bnRpbWUuZGVmYXVsdFN1cGVyQ2FsbCA9IGRlZmF1bHRTdXBlckNhbGw7XG4gICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwgPSBzdXBlckNhbGw7XG4gICR0cmFjZXVyUnVudGltZS5zdXBlckNvbnN0cnVjdG9yID0gc3VwZXJDb25zdHJ1Y3RvcjtcbiAgJHRyYWNldXJSdW50aW1lLnN1cGVyR2V0ID0gc3VwZXJHZXQ7XG4gICR0cmFjZXVyUnVudGltZS5zdXBlclNldCA9IHN1cGVyU2V0O1xufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAodHlwZW9mICR0cmFjZXVyUnVudGltZSAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyYWNldXIgcnVudGltZSBub3QgZm91bmQuJyk7XG4gIH1cbiAgdmFyIGNyZWF0ZVByaXZhdGVOYW1lID0gJHRyYWNldXJSdW50aW1lLmNyZWF0ZVByaXZhdGVOYW1lO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkdHJhY2V1clJ1bnRpbWUuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICR0cmFjZXVyUnVudGltZS5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgZnVuY3Rpb24gbm9uRW51bSh2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfTtcbiAgfVxuICB2YXIgU1RfTkVXQk9STiA9IDA7XG4gIHZhciBTVF9FWEVDVVRJTkcgPSAxO1xuICB2YXIgU1RfU1VTUEVOREVEID0gMjtcbiAgdmFyIFNUX0NMT1NFRCA9IDM7XG4gIHZhciBFTkRfU1RBVEUgPSAtMjtcbiAgdmFyIFJFVEhST1dfU1RBVEUgPSAtMztcbiAgZnVuY3Rpb24gZ2V0SW50ZXJuYWxFcnJvcihzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ1RyYWNldXIgY29tcGlsZXIgYnVnOiBpbnZhbGlkIHN0YXRlIGluIHN0YXRlIG1hY2hpbmU6ICcgKyBzdGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gR2VuZXJhdG9yQ29udGV4dCgpIHtcbiAgICB0aGlzLnN0YXRlID0gMDtcbiAgICB0aGlzLkdTdGF0ZSA9IFNUX05FV0JPUk47XG4gICAgdGhpcy5zdG9yZWRFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maW5hbGx5RmFsbFRocm91Z2ggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZW50XyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudHJ5U3RhY2tfID0gW107XG4gIH1cbiAgR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgcHVzaFRyeTogZnVuY3Rpb24oY2F0Y2hTdGF0ZSwgZmluYWxseVN0YXRlKSB7XG4gICAgICBpZiAoZmluYWxseVN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmaW5hbGx5RmFsbFRocm91Z2ggPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlTdGFja18ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy50cnlTdGFja19baV0uY2F0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gdGhpcy50cnlTdGFja19baV0uY2F0Y2g7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmFsbHlGYWxsVGhyb3VnaCA9PT0gbnVsbClcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSBSRVRIUk9XX1NUQVRFO1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtcbiAgICAgICAgICBmaW5hbGx5OiBmaW5hbGx5U3RhdGUsXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoOiBmaW5hbGx5RmFsbFRocm91Z2hcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2F0Y2hTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtjYXRjaDogY2F0Y2hTdGF0ZX0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcG9wVHJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJ5U3RhY2tfLnBvcCgpO1xuICAgIH0sXG4gICAgZ2V0IHNlbnQoKSB7XG4gICAgICB0aGlzLm1heWJlVGhyb3coKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgc2V0IHNlbnQodikge1xuICAgICAgdGhpcy5zZW50XyA9IHY7XG4gICAgfSxcbiAgICBnZXQgc2VudElnbm9yZVRocm93KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBtYXliZVRocm93OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICB0aGlzLmFjdGlvbiA9ICduZXh0JztcbiAgICAgICAgdGhyb3cgdGhpcy5zZW50XztcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgICB0aHJvdyB0aGlzLnN0b3JlZEV4Y2VwdGlvbjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlRXhjZXB0aW9uOiBmdW5jdGlvbihleCkge1xuICAgICAgdGhpcy5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICB0aGlzLnN0YXRlID0gRU5EX1NUQVRFO1xuICAgICAgdGhyb3cgZXg7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBuZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCBhY3Rpb24sIHgpIHtcbiAgICBzd2l0Y2ggKGN0eC5HU3RhdGUpIHtcbiAgICAgIGNhc2UgU1RfRVhFQ1VUSU5HOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGV4ZWN1dGluZyBnZW5lcmF0b3JcIikpO1xuICAgICAgY2FzZSBTVF9DTE9TRUQ6XG4gICAgICAgIGlmIChhY3Rpb24gPT0gJ25leHQnKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB4O1xuICAgICAgY2FzZSBTVF9ORVdCT1JOOlxuICAgICAgICBpZiAoYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICB0aHJvdyB4O1xuICAgICAgICB9XG4gICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignU2VudCB2YWx1ZSB0byBuZXdib3JuIGdlbmVyYXRvcicpO1xuICAgICAgY2FzZSBTVF9TVVNQRU5ERUQ6XG4gICAgICAgIGN0eC5HU3RhdGUgPSBTVF9FWEVDVVRJTkc7XG4gICAgICAgIGN0eC5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgIGN0eC5zZW50ID0geDtcbiAgICAgICAgdmFyIHZhbHVlID0gbW92ZU5leHQoY3R4KTtcbiAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PT0gY3R4O1xuICAgICAgICBpZiAoZG9uZSlcbiAgICAgICAgICB2YWx1ZSA9IGN0eC5yZXR1cm5WYWx1ZTtcbiAgICAgICAgY3R4LkdTdGF0ZSA9IGRvbmUgPyBTVF9DTE9TRUQgOiBTVF9TVVNQRU5ERUQ7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgfTtcbiAgICB9XG4gIH1cbiAgdmFyIGN0eE5hbWUgPSBjcmVhdGVQcml2YXRlTmFtZSgpO1xuICB2YXIgbW92ZU5leHROYW1lID0gY3JlYXRlUHJpdmF0ZU5hbWUoKTtcbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAkZGVmaW5lUHJvcGVydHkoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oR2VuZXJhdG9yRnVuY3Rpb24pKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICBuZXh0OiBmdW5jdGlvbih2KSB7XG4gICAgICByZXR1cm4gbmV4dE9yVGhyb3codGhpc1tjdHhOYW1lXSwgdGhpc1ttb3ZlTmV4dE5hbWVdLCAnbmV4dCcsIHYpO1xuICAgIH0sXG4gICAgdGhyb3c6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHJldHVybiBuZXh0T3JUaHJvdyh0aGlzW2N0eE5hbWVdLCB0aGlzW21vdmVOZXh0TmFtZV0sICd0aHJvdycsIHYpO1xuICAgIH1cbiAgfTtcbiAgJGRlZmluZVByb3BlcnRpZXMoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtlbnVtZXJhYmxlOiBmYWxzZX0sXG4gICAgbmV4dDoge2VudW1lcmFibGU6IGZhbHNlfSxcbiAgICB0aHJvdzoge2VudW1lcmFibGU6IGZhbHNlfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCBub25FbnVtKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUdlbmVyYXRvckluc3RhbmNlKGlubmVyRnVuY3Rpb24sIGZ1bmN0aW9uT2JqZWN0LCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBHZW5lcmF0b3JDb250ZXh0KCk7XG4gICAgdmFyIG9iamVjdCA9ICRjcmVhdGUoZnVuY3Rpb25PYmplY3QucHJvdG90eXBlKTtcbiAgICBvYmplY3RbY3R4TmFtZV0gPSBjdHg7XG4gICAgb2JqZWN0W21vdmVOZXh0TmFtZV0gPSBtb3ZlTmV4dDtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIGluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbk9iamVjdCkge1xuICAgIGZ1bmN0aW9uT2JqZWN0LnByb3RvdHlwZSA9ICRjcmVhdGUoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlKTtcbiAgICBmdW5jdGlvbk9iamVjdC5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICByZXR1cm4gZnVuY3Rpb25PYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gQXN5bmNGdW5jdGlvbkNvbnRleHQoKSB7XG4gICAgR2VuZXJhdG9yQ29udGV4dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXJyID0gdW5kZWZpbmVkO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIGN0eC5yZXN1bHQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGN0eC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGN0eC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlID0gJGNyZWF0ZShHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSk7XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICB0aGlzLnJlc29sdmUodGhpcy5yZXR1cm5WYWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICB0aGlzLnJlamVjdCh0aGlzLnN0b3JlZEV4Y2VwdGlvbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWplY3QoZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKSk7XG4gICAgfVxuICB9O1xuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUuaGFuZGxlRXhjZXB0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGF0ZSA9IFJFVEhST1dfU1RBVEU7XG4gIH07XG4gIGZ1bmN0aW9uIGFzeW5jV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBBc3luY0Z1bmN0aW9uQ29udGV4dCgpO1xuICAgIGN0eC5jcmVhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIGN0eC5lcnJiYWNrID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICBoYW5kbGVDYXRjaChjdHgsIGVycik7XG4gICAgICBtb3ZlTmV4dChjdHgpO1xuICAgIH07XG4gICAgbW92ZU5leHQoY3R4KTtcbiAgICByZXR1cm4gY3R4LnJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gaW5uZXJGdW5jdGlvbi5jYWxsKHNlbGYsIGN0eCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgaGFuZGxlQ2F0Y2goY3R4LCBleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNhdGNoKGN0eCwgZXgpIHtcbiAgICBjdHguc3RvcmVkRXhjZXB0aW9uID0gZXg7XG4gICAgdmFyIGxhc3QgPSBjdHgudHJ5U3RhY2tfW2N0eC50cnlTdGFja18ubGVuZ3RoIC0gMV07XG4gICAgaWYgKCFsYXN0KSB7XG4gICAgICBjdHguaGFuZGxlRXhjZXB0aW9uKGV4KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY3R4LnN0YXRlID0gbGFzdC5jYXRjaCAhPT0gdW5kZWZpbmVkID8gbGFzdC5jYXRjaCA6IGxhc3QuZmluYWxseTtcbiAgICBpZiAobGFzdC5maW5hbGx5RmFsbFRocm91Z2ggIT09IHVuZGVmaW5lZClcbiAgICAgIGN0eC5maW5hbGx5RmFsbFRocm91Z2ggPSBsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaDtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuYXN5bmNXcmFwID0gYXN5bmNXcmFwO1xuICAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uID0gaW5pdEdlbmVyYXRvckZ1bmN0aW9uO1xuICAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UgPSBjcmVhdGVHZW5lcmF0b3JJbnN0YW5jZTtcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhvcHRfc2NoZW1lLCBvcHRfdXNlckluZm8sIG9wdF9kb21haW4sIG9wdF9wb3J0LCBvcHRfcGF0aCwgb3B0X3F1ZXJ5RGF0YSwgb3B0X2ZyYWdtZW50KSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGlmIChvcHRfc2NoZW1lKSB7XG4gICAgICBvdXQucHVzaChvcHRfc2NoZW1lLCAnOicpO1xuICAgIH1cbiAgICBpZiAob3B0X2RvbWFpbikge1xuICAgICAgb3V0LnB1c2goJy8vJyk7XG4gICAgICBpZiAob3B0X3VzZXJJbmZvKSB7XG4gICAgICAgIG91dC5wdXNoKG9wdF91c2VySW5mbywgJ0AnKTtcbiAgICAgIH1cbiAgICAgIG91dC5wdXNoKG9wdF9kb21haW4pO1xuICAgICAgaWYgKG9wdF9wb3J0KSB7XG4gICAgICAgIG91dC5wdXNoKCc6Jywgb3B0X3BvcnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0X3BhdGgpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9wYXRoKTtcbiAgICB9XG4gICAgaWYgKG9wdF9xdWVyeURhdGEpIHtcbiAgICAgIG91dC5wdXNoKCc/Jywgb3B0X3F1ZXJ5RGF0YSk7XG4gICAgfVxuICAgIGlmIChvcHRfZnJhZ21lbnQpIHtcbiAgICAgIG91dC5wdXNoKCcjJywgb3B0X2ZyYWdtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgfVxuICA7XG4gIHZhciBzcGxpdFJlID0gbmV3IFJlZ0V4cCgnXicgKyAnKD86JyArICcoW146Lz8jLl0rKScgKyAnOik/JyArICcoPzovLycgKyAnKD86KFteLz8jXSopQCk/JyArICcoW1xcXFx3XFxcXGRcXFxcLVxcXFx1MDEwMC1cXFxcdWZmZmYuJV0qKScgKyAnKD86OihbMC05XSspKT8nICsgJyk/JyArICcoW14/I10rKT8nICsgJyg/OlxcXFw/KFteI10qKSk/JyArICcoPzojKC4qKSk/JyArICckJyk7XG4gIHZhciBDb21wb25lbnRJbmRleCA9IHtcbiAgICBTQ0hFTUU6IDEsXG4gICAgVVNFUl9JTkZPOiAyLFxuICAgIERPTUFJTjogMyxcbiAgICBQT1JUOiA0LFxuICAgIFBBVEg6IDUsXG4gICAgUVVFUllfREFUQTogNixcbiAgICBGUkFHTUVOVDogN1xuICB9O1xuICBmdW5jdGlvbiBzcGxpdCh1cmkpIHtcbiAgICByZXR1cm4gKHVyaS5tYXRjaChzcGxpdFJlKSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRG90U2VnbWVudHMocGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnLycpXG4gICAgICByZXR1cm4gJy8nO1xuICAgIHZhciBsZWFkaW5nU2xhc2ggPSBwYXRoWzBdID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgdHJhaWxpbmdTbGFzaCA9IHBhdGguc2xpY2UoLTEpID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciB1cCA9IDA7XG4gICAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgc2VnbWVudHMubGVuZ3RoOyBwb3MrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1twb3NdO1xuICAgICAgc3dpdGNoIChzZWdtZW50KSB7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcuLic6XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGgpXG4gICAgICAgICAgICBvdXQucG9wKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXArKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBvdXQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZWFkaW5nU2xhc2gpIHtcbiAgICAgIHdoaWxlICh1cC0tID4gMCkge1xuICAgICAgICBvdXQudW5zaGlmdCgnLi4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICBvdXQucHVzaCgnLicpO1xuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1NsYXNoICsgb3V0LmpvaW4oJy8nKSArIHRyYWlsaW5nU2xhc2g7XG4gIH1cbiAgZnVuY3Rpb24gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpIHtcbiAgICB2YXIgcGF0aCA9IHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdIHx8ICcnO1xuICAgIHBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhwYXRoKTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5VU0VSX0lORk9dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5ET01BSU5dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QT1JUXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlFVRVJZX0RBVEFdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5GUkFHTUVOVF0pO1xuICB9XG4gIGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVVybCh1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVzb2x2ZVVybChiYXNlLCB1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHZhciBiYXNlUGFydHMgPSBzcGxpdChiYXNlKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSkge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gQ29tcG9uZW50SW5kZXguU0NIRU1FOyBpIDw9IENvbXBvbmVudEluZGV4LlBPUlQ7IGkrKykge1xuICAgICAgaWYgKCFwYXJ0c1tpXSkge1xuICAgICAgICBwYXJ0c1tpXSA9IGJhc2VQYXJ0c1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdWzBdID09ICcvJykge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgdmFyIGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkgKyBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiBpc0Fic29sdXRlKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hbWVbMF0gPT09ICcvJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KG5hbWUpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5jYW5vbmljYWxpemVVcmwgPSBjYW5vbmljYWxpemVVcmw7XG4gICR0cmFjZXVyUnVudGltZS5pc0Fic29sdXRlID0gaXNBYnNvbHV0ZTtcbiAgJHRyYWNldXJSdW50aW1lLnJlbW92ZURvdFNlZ21lbnRzID0gcmVtb3ZlRG90U2VnbWVudHM7XG4gICR0cmFjZXVyUnVudGltZS5yZXNvbHZlVXJsID0gcmVzb2x2ZVVybDtcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHR5cGVzID0ge1xuICAgIGFueToge25hbWU6ICdhbnknfSxcbiAgICBib29sZWFuOiB7bmFtZTogJ2Jvb2xlYW4nfSxcbiAgICBudW1iZXI6IHtuYW1lOiAnbnVtYmVyJ30sXG4gICAgc3RyaW5nOiB7bmFtZTogJ3N0cmluZyd9LFxuICAgIHN5bWJvbDoge25hbWU6ICdzeW1ib2wnfSxcbiAgICB2b2lkOiB7bmFtZTogJ3ZvaWQnfVxuICB9O1xuICB2YXIgR2VuZXJpY1R5cGUgPSBmdW5jdGlvbiBHZW5lcmljVHlwZSh0eXBlLCBhcmd1bWVudFR5cGVzKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmFyZ3VtZW50VHlwZXMgPSBhcmd1bWVudFR5cGVzO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShHZW5lcmljVHlwZSwge30sIHt9KTtcbiAgdmFyIHR5cGVSZWdpc3RlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGdlbmVyaWNUeXBlKHR5cGUpIHtcbiAgICBmb3IgKHZhciBhcmd1bWVudFR5cGVzID0gW10sXG4gICAgICAgICRfXzEgPSAxOyAkX18xIDwgYXJndW1lbnRzLmxlbmd0aDsgJF9fMSsrKVxuICAgICAgYXJndW1lbnRUeXBlc1skX18xIC0gMV0gPSBhcmd1bWVudHNbJF9fMV07XG4gICAgdmFyIHR5cGVNYXAgPSB0eXBlUmVnaXN0ZXI7XG4gICAgdmFyIGtleSA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25IYXNoT2JqZWN0KHR5cGUpLmhhc2g7XG4gICAgaWYgKCF0eXBlTWFwW2tleV0pIHtcbiAgICAgIHR5cGVNYXBba2V5XSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuICAgIHR5cGVNYXAgPSB0eXBlTWFwW2tleV07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudFR5cGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAga2V5ID0gJHRyYWNldXJSdW50aW1lLmdldE93bkhhc2hPYmplY3QoYXJndW1lbnRUeXBlc1tpXSkuaGFzaDtcbiAgICAgIGlmICghdHlwZU1hcFtrZXldKSB7XG4gICAgICAgIHR5cGVNYXBba2V5XSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB9XG4gICAgICB0eXBlTWFwID0gdHlwZU1hcFtrZXldO1xuICAgIH1cbiAgICB2YXIgdGFpbCA9IGFyZ3VtZW50VHlwZXNbYXJndW1lbnRUeXBlcy5sZW5ndGggLSAxXTtcbiAgICBrZXkgPSAkdHJhY2V1clJ1bnRpbWUuZ2V0T3duSGFzaE9iamVjdCh0YWlsKS5oYXNoO1xuICAgIGlmICghdHlwZU1hcFtrZXldKSB7XG4gICAgICB0eXBlTWFwW2tleV0gPSBuZXcgR2VuZXJpY1R5cGUodHlwZSwgYXJndW1lbnRUeXBlcyk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlTWFwW2tleV07XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLkdlbmVyaWNUeXBlID0gR2VuZXJpY1R5cGU7XG4gICR0cmFjZXVyUnVudGltZS5nZW5lcmljVHlwZSA9IGdlbmVyaWNUeXBlO1xuICAkdHJhY2V1clJ1bnRpbWUudHlwZSA9IHR5cGVzO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBNb2R1bGVFdmFsdWF0aW9uRXJyb3IgPSBmdW5jdGlvbiBNb2R1bGVFdmFsdWF0aW9uRXJyb3IoZXJyb25lb3VzTW9kdWxlTmFtZSwgY2F1c2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnOiAnICsgdGhpcy5zdHJpcENhdXNlKGNhdXNlKSArICcgaW4gJyArIGVycm9uZW91c01vZHVsZU5hbWU7XG4gICAgaWYgKCEoY2F1c2UgaW5zdGFuY2VvZiAkTW9kdWxlRXZhbHVhdGlvbkVycm9yKSAmJiBjYXVzZS5zdGFjaylcbiAgICAgIHRoaXMuc3RhY2sgPSB0aGlzLnN0cmlwU3RhY2soY2F1c2Uuc3RhY2spO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfTtcbiAgdmFyICRNb2R1bGVFdmFsdWF0aW9uRXJyb3IgPSBNb2R1bGVFdmFsdWF0aW9uRXJyb3I7XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKE1vZHVsZUV2YWx1YXRpb25FcnJvciwge1xuICAgIHN0cmlwRXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlLnJlcGxhY2UoLy4qRXJyb3I6LywgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJzonKTtcbiAgICB9LFxuICAgIHN0cmlwQ2F1c2U6IGZ1bmN0aW9uKGNhdXNlKSB7XG4gICAgICBpZiAoIWNhdXNlKVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgICBpZiAoIWNhdXNlLm1lc3NhZ2UpXG4gICAgICAgIHJldHVybiBjYXVzZSArICcnO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyaXBFcnJvcihjYXVzZS5tZXNzYWdlKTtcbiAgICB9LFxuICAgIGxvYWRlZEJ5OiBmdW5jdGlvbihtb2R1bGVOYW1lKSB7XG4gICAgICB0aGlzLnN0YWNrICs9ICdcXG4gbG9hZGVkIGJ5ICcgKyBtb2R1bGVOYW1lO1xuICAgIH0sXG4gICAgc3RyaXBTdGFjazogZnVuY3Rpb24oY2F1c2VTdGFjaykge1xuICAgICAgdmFyIHN0YWNrID0gW107XG4gICAgICBjYXVzZVN0YWNrLnNwbGl0KCdcXG4nKS5zb21lKChmdW5jdGlvbihmcmFtZSkge1xuICAgICAgICBpZiAoL1VuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLy50ZXN0KGZyYW1lKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgc3RhY2sucHVzaChmcmFtZSk7XG4gICAgICB9KSk7XG4gICAgICBzdGFja1swXSA9IHRoaXMuc3RyaXBFcnJvcihzdGFja1swXSk7XG4gICAgICByZXR1cm4gc3RhY2suam9pbignXFxuJyk7XG4gICAgfVxuICB9LCB7fSwgRXJyb3IpO1xuICBmdW5jdGlvbiBiZWZvcmVMaW5lcyhsaW5lcywgbnVtYmVyKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBmaXJzdCA9IG51bWJlciAtIDM7XG4gICAgaWYgKGZpcnN0IDwgMClcbiAgICAgIGZpcnN0ID0gMDtcbiAgICBmb3IgKHZhciBpID0gZmlyc3Q7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2gobGluZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGFmdGVyTGluZXMobGluZXMsIG51bWJlcikge1xuICAgIHZhciBsYXN0ID0gbnVtYmVyICsgMTtcbiAgICBpZiAobGFzdCA+IGxpbmVzLmxlbmd0aCAtIDEpXG4gICAgICBsYXN0ID0gbGluZXMubGVuZ3RoIC0gMTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IG51bWJlcjsgaSA8PSBsYXN0OyBpKyspIHtcbiAgICAgIHJlc3VsdC5wdXNoKGxpbmVzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2x1bW5TcGFjaW5nKGNvbHVtbnMpIHtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5zIC0gMTsgaSsrKSB7XG4gICAgICByZXN1bHQgKz0gJy0nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNvbnN0cnVjdG9yKCRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcikuY2FsbCh0aGlzLCB1cmwsIG51bGwpO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gIH07XG4gIHZhciAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcjtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IsIHtnZXRVbmNvYXRlZE1vZHVsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZV8pXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXztcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZWxhdGl2ZVJlcXVpcmU7XG4gICAgICAgIGlmICh0eXBlb2YgJHRyYWNldXJSdW50aW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWxhdGl2ZVJlcXVpcmUgPSAkdHJhY2V1clJ1bnRpbWUucmVxdWlyZS5iaW5kKG51bGwsIHRoaXMudXJsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV8gPSB0aGlzLmZ1bmMuY2FsbChnbG9iYWwsIHJlbGF0aXZlUmVxdWlyZSk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBNb2R1bGVFdmFsdWF0aW9uRXJyb3IpIHtcbiAgICAgICAgICBleC5sb2FkZWRCeSh0aGlzLnVybCk7XG4gICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4LnN0YWNrKSB7XG4gICAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5mdW5jLnRvU3RyaW5nKCkuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgIHZhciBldmFsZWQgPSBbXTtcbiAgICAgICAgICBleC5zdGFjay5zcGxpdCgnXFxuJykuc29tZShmdW5jdGlvbihmcmFtZSkge1xuICAgICAgICAgICAgaWYgKGZyYW1lLmluZGV4T2YoJ1VuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlJykgPiAwKVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBtID0gLyhhdFxcc1teXFxzXSpcXHMpLio+OihcXGQqKTooXFxkKilcXCkvLmV4ZWMoZnJhbWUpO1xuICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgdmFyIGxpbmUgPSBwYXJzZUludChtWzJdLCAxMCk7XG4gICAgICAgICAgICAgIGV2YWxlZCA9IGV2YWxlZC5jb25jYXQoYmVmb3JlTGluZXMobGluZXMsIGxpbmUpKTtcbiAgICAgICAgICAgICAgZXZhbGVkLnB1c2goY29sdW1uU3BhY2luZyhtWzNdKSArICdeJyk7XG4gICAgICAgICAgICAgIGV2YWxlZCA9IGV2YWxlZC5jb25jYXQoYWZ0ZXJMaW5lcyhsaW5lcywgbGluZSkpO1xuICAgICAgICAgICAgICBldmFsZWQucHVzaCgnPSA9ID0gPSA9ID0gPSA9ID0nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV2YWxlZC5wdXNoKGZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBleC5zdGFjayA9IGV2YWxlZC5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgTW9kdWxlRXZhbHVhdGlvbkVycm9yKHRoaXMudXJsLCBleCk7XG4gICAgICB9XG4gICAgfX0sIHt9LCBVbmNvYXRlZE1vZHVsZUVudHJ5KTtcbiAgZnVuY3Rpb24gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybjtcbiAgICB2YXIgdXJsID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgIHJldHVybiBtb2R1bGVJbnN0YW50aWF0b3JzW3VybF07XG4gIH1cbiAgO1xuICB2YXIgbW9kdWxlSW5zdGFuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpdmVNb2R1bGVTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBNb2R1bGUodW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB2YXIgaXNMaXZlID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBjb2F0ZWRNb2R1bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHVuY29hdGVkTW9kdWxlKS5mb3JFYWNoKChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZ2V0dGVyLFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgaWYgKGlzTGl2ZSA9PT0gbGl2ZU1vZHVsZVNlbnRpbmVsKSB7XG4gICAgICAgIHZhciBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodW5jb2F0ZWRNb2R1bGUsIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3IuZ2V0KVxuICAgICAgICAgIGdldHRlciA9IGRlc2NyLmdldDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIHZhbHVlID0gdW5jb2F0ZWRNb2R1bGVbbmFtZV07XG4gICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb2F0ZWRNb2R1bGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29hdGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29hdGVkTW9kdWxlO1xuICB9XG4gIHZhciBNb2R1bGVTdG9yZSA9IHtcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uKG5hbWUsIHJlZmVyZXJOYW1lLCByZWZlcmVyQWRkcmVzcykge1xuICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbW9kdWxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZywgbm90ICcgKyB0eXBlb2YgbmFtZSk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZShuYW1lKSlcbiAgICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICAgIGlmICgvW15cXC5dXFwvXFwuXFwuXFwvLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbW9kdWxlIG5hbWUgZW1iZWRzIC8uLi86ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lWzBdID09PSAnLicgJiYgcmVmZXJlck5hbWUpXG4gICAgICAgIHJldHVybiByZXNvbHZlVXJsKHJlZmVyZXJOYW1lLCBuYW1lKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB2YXIgbSA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIGlmICghbSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IG1vZHVsZUluc3RhbmNlc1ttLnVybF07XG4gICAgICBpZiAobW9kdWxlSW5zdGFuY2UpXG4gICAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbiAgICAgIG1vZHVsZUluc3RhbmNlID0gTW9kdWxlKG0uZ2V0VW5jb2F0ZWRNb2R1bGUoKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZXNbbS51cmxdID0gbW9kdWxlSW5zdGFuY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lLCBtb2R1bGUpIHtcbiAgICAgIG5vcm1hbGl6ZWROYW1lID0gU3RyaW5nKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICB9KSk7XG4gICAgICBtb2R1bGVJbnN0YW5jZXNbbm9ybWFsaXplZE5hbWVdID0gbW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGJhc2VVUkwoKSB7XG4gICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICB9LFxuICAgIHNldCBiYXNlVVJMKHYpIHtcbiAgICAgIGJhc2VVUkwgPSBTdHJpbmcodik7XG4gICAgfSxcbiAgICByZWdpc3Rlck1vZHVsZTogZnVuY3Rpb24obmFtZSwgZGVwcywgZnVuYykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWROYW1lID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBtb2R1bGUgbmFtZWQgJyArIG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCBmdW5jKTtcbiAgICB9LFxuICAgIGJ1bmRsZVN0b3JlOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICBpZiAoIWRlcHMgfHwgIWRlcHMubGVuZ3RoICYmICFmdW5jLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5hbWUsIGRlcHMsIGZ1bmMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idW5kbGVTdG9yZVtuYW1lXSA9IHtcbiAgICAgICAgICBkZXBzOiBkZXBzLFxuICAgICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRfXzAgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICB2YXIgZGVwTWFwID0ge307XG4gICAgICAgICAgICBkZXBzLmZvckVhY2goKGZ1bmN0aW9uKGRlcCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlcE1hcFtkZXBdID0gJF9fMFtpbmRleF07XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB2YXIgcmVnaXN0cnlFbnRyeSA9IGZ1bmMuY2FsbCh0aGlzLCBkZXBNYXApO1xuICAgICAgICAgICAgcmVnaXN0cnlFbnRyeS5leGVjdXRlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0cnlFbnRyeS5leHBvcnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEFub255bW91c01vZHVsZTogZnVuY3Rpb24oZnVuYykge1xuICAgICAgcmV0dXJuIG5ldyBNb2R1bGUoZnVuYy5jYWxsKGdsb2JhbCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgfSxcbiAgICBnZXRGb3JUZXN0aW5nOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgJF9fMCA9IHRoaXM7XG4gICAgICBpZiAoIXRoaXMudGVzdGluZ1ByZWZpeF8pIHtcbiAgICAgICAgT2JqZWN0LmtleXMobW9kdWxlSW5zdGFuY2VzKS5zb21lKChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgbSA9IC8odHJhY2V1ckBbXlxcL10qXFwvKS8uZXhlYyhrZXkpO1xuICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAkX18wLnRlc3RpbmdQcmVmaXhfID0gbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMudGVzdGluZ1ByZWZpeF8gKyBuYW1lKTtcbiAgICB9XG4gIH07XG4gIHZhciBtb2R1bGVTdG9yZU1vZHVsZSA9IG5ldyBNb2R1bGUoe01vZHVsZVN0b3JlOiBNb2R1bGVTdG9yZX0pO1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbW9kdWxlU3RvcmVNb2R1bGUpO1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlLmpzJywgbW9kdWxlU3RvcmVNb2R1bGUpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgcmVnaXN0ZXJNb2R1bGU6IE1vZHVsZVN0b3JlLnJlZ2lzdGVyTW9kdWxlLmJpbmQoTW9kdWxlU3RvcmUpLFxuICAgIGdldDogTW9kdWxlU3RvcmUuZ2V0LFxuICAgIHNldDogTW9kdWxlU3RvcmUuc2V0LFxuICAgIG5vcm1hbGl6ZTogTW9kdWxlU3RvcmUubm9ybWFsaXplXG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5nZXRNb2R1bGVJbXBsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpbnN0YW50aWF0b3IgPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKTtcbiAgICByZXR1cm4gaW5zdGFudGlhdG9yICYmIGluc3RhbnRpYXRvci5nZXRVbmNvYXRlZE1vZHVsZSgpO1xuICB9O1xufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCI7XG4gIHZhciAkY2VpbCA9IE1hdGguY2VpbDtcbiAgdmFyICRmbG9vciA9IE1hdGguZmxvb3I7XG4gIHZhciAkaXNGaW5pdGUgPSBpc0Zpbml0ZTtcbiAgdmFyICRpc05hTiA9IGlzTmFOO1xuICB2YXIgJHBvdyA9IE1hdGgucG93O1xuICB2YXIgJG1pbiA9IE1hdGgubWluO1xuICB2YXIgdG9PYmplY3QgPSAkdHJhY2V1clJ1bnRpbWUudG9PYmplY3Q7XG4gIGZ1bmN0aW9uIHRvVWludDMyKHgpIHtcbiAgICByZXR1cm4geCA+Pj4gMDtcbiAgfVxuICBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gICAgcmV0dXJuIHggJiYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNDYWxsYWJsZSh4KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xuICB9XG4gIGZ1bmN0aW9uIGlzTnVtYmVyKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdudW1iZXInO1xuICB9XG4gIGZ1bmN0aW9uIHRvSW50ZWdlcih4KSB7XG4gICAgeCA9ICt4O1xuICAgIGlmICgkaXNOYU4oeCkpXG4gICAgICByZXR1cm4gMDtcbiAgICBpZiAoeCA9PT0gMCB8fCAhJGlzRmluaXRlKHgpKVxuICAgICAgcmV0dXJuIHg7XG4gICAgcmV0dXJuIHggPiAwID8gJGZsb29yKHgpIDogJGNlaWwoeCk7XG4gIH1cbiAgdmFyIE1BWF9TQUZFX0xFTkdUSCA9ICRwb3coMiwgNTMpIC0gMTtcbiAgZnVuY3Rpb24gdG9MZW5ndGgoeCkge1xuICAgIHZhciBsZW4gPSB0b0ludGVnZXIoeCk7XG4gICAgcmV0dXJuIGxlbiA8IDAgPyAwIDogJG1pbihsZW4sIE1BWF9TQUZFX0xFTkdUSCk7XG4gIH1cbiAgZnVuY3Rpb24gY2hlY2tJdGVyYWJsZSh4KSB7XG4gICAgcmV0dXJuICFpc09iamVjdCh4KSA/IHVuZGVmaW5lZCA6IHhbU3ltYm9sLml0ZXJhdG9yXTtcbiAgfVxuICBmdW5jdGlvbiBpc0NvbnN0cnVjdG9yKHgpIHtcbiAgICByZXR1cm4gaXNDYWxsYWJsZSh4KTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh2YWx1ZSwgZG9uZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkb25lOiBkb25lXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBtYXliZURlZmluZShvYmplY3QsIG5hbWUsIGRlc2NyKSB7XG4gICAgaWYgKCEobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBtYXliZURlZmluZShvYmplY3QsIG5hbWUsIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBtYXliZURlZmluZUNvbnN0KG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBtYXliZURlZmluZShvYmplY3QsIG5hbWUsIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkRnVuY3Rpb25zKG9iamVjdCwgZnVuY3Rpb25zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gZnVuY3Rpb25zW2ldO1xuICAgICAgdmFyIHZhbHVlID0gZnVuY3Rpb25zW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUFkZENvbnN0cyhvYmplY3QsIGNvbnN0cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uc3RzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB2YXIgbmFtZSA9IGNvbnN0c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IGNvbnN0c1tpICsgMV07XG4gICAgICBtYXliZURlZmluZUNvbnN0KG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUFkZEl0ZXJhdG9yKG9iamVjdCwgZnVuYywgU3ltYm9sKSB7XG4gICAgaWYgKCFTeW1ib2wgfHwgIVN5bWJvbC5pdGVyYXRvciB8fCBvYmplY3RbU3ltYm9sLml0ZXJhdG9yXSlcbiAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0WydAQGl0ZXJhdG9yJ10pXG4gICAgICBmdW5jID0gb2JqZWN0WydAQGl0ZXJhdG9yJ107XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgICB2YWx1ZTogZnVuYyxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxuICB2YXIgcG9seWZpbGxzID0gW107XG4gIGZ1bmN0aW9uIHJlZ2lzdGVyUG9seWZpbGwoZnVuYykge1xuICAgIHBvbHlmaWxscy5wdXNoKGZ1bmMpO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQWxsKGdsb2JhbCkge1xuICAgIHBvbHlmaWxscy5mb3JFYWNoKChmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZihnbG9iYWwpO1xuICAgIH0pKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCB0b09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0b09iamVjdDtcbiAgICB9LFxuICAgIGdldCB0b1VpbnQzMigpIHtcbiAgICAgIHJldHVybiB0b1VpbnQzMjtcbiAgICB9LFxuICAgIGdldCBpc09iamVjdCgpIHtcbiAgICAgIHJldHVybiBpc09iamVjdDtcbiAgICB9LFxuICAgIGdldCBpc0NhbGxhYmxlKCkge1xuICAgICAgcmV0dXJuIGlzQ2FsbGFibGU7XG4gICAgfSxcbiAgICBnZXQgaXNOdW1iZXIoKSB7XG4gICAgICByZXR1cm4gaXNOdW1iZXI7XG4gICAgfSxcbiAgICBnZXQgdG9JbnRlZ2VyKCkge1xuICAgICAgcmV0dXJuIHRvSW50ZWdlcjtcbiAgICB9LFxuICAgIGdldCB0b0xlbmd0aCgpIHtcbiAgICAgIHJldHVybiB0b0xlbmd0aDtcbiAgICB9LFxuICAgIGdldCBjaGVja0l0ZXJhYmxlKCkge1xuICAgICAgcmV0dXJuIGNoZWNrSXRlcmFibGU7XG4gICAgfSxcbiAgICBnZXQgaXNDb25zdHJ1Y3RvcigpIHtcbiAgICAgIHJldHVybiBpc0NvbnN0cnVjdG9yO1xuICAgIH0sXG4gICAgZ2V0IGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IG1heWJlRGVmaW5lKCkge1xuICAgICAgcmV0dXJuIG1heWJlRGVmaW5lO1xuICAgIH0sXG4gICAgZ2V0IG1heWJlRGVmaW5lTWV0aG9kKCkge1xuICAgICAgcmV0dXJuIG1heWJlRGVmaW5lTWV0aG9kO1xuICAgIH0sXG4gICAgZ2V0IG1heWJlRGVmaW5lQ29uc3QoKSB7XG4gICAgICByZXR1cm4gbWF5YmVEZWZpbmVDb25zdDtcbiAgICB9LFxuICAgIGdldCBtYXliZUFkZEZ1bmN0aW9ucygpIHtcbiAgICAgIHJldHVybiBtYXliZUFkZEZ1bmN0aW9ucztcbiAgICB9LFxuICAgIGdldCBtYXliZUFkZENvbnN0cygpIHtcbiAgICAgIHJldHVybiBtYXliZUFkZENvbnN0cztcbiAgICB9LFxuICAgIGdldCBtYXliZUFkZEl0ZXJhdG9yKCkge1xuICAgICAgcmV0dXJuIG1heWJlQWRkSXRlcmF0b3I7XG4gICAgfSxcbiAgICBnZXQgcmVnaXN0ZXJQb2x5ZmlsbCgpIHtcbiAgICAgIHJldHVybiByZWdpc3RlclBvbHlmaWxsO1xuICAgIH0sXG4gICAgZ2V0IHBvbHlmaWxsQWxsKCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsQWxsO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvTWFwLmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcC5qc1wiO1xuICB2YXIgJF9fMCA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlscy5qc1wiKSxcbiAgICAgIGlzT2JqZWN0ID0gJF9fMC5pc09iamVjdCxcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IgPSAkX18wLm1heWJlQWRkSXRlcmF0b3IsXG4gICAgICByZWdpc3RlclBvbHlmaWxsID0gJF9fMC5yZWdpc3RlclBvbHlmaWxsO1xuICB2YXIgZ2V0T3duSGFzaE9iamVjdCA9ICR0cmFjZXVyUnVudGltZS5nZXRPd25IYXNoT2JqZWN0O1xuICB2YXIgJGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIGRlbGV0ZWRTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBsb29rdXBJbmRleChtYXAsIGtleSkge1xuICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICB2YXIgaGFzaE9iamVjdCA9IGdldE93bkhhc2hPYmplY3Qoa2V5KTtcbiAgICAgIHJldHVybiBoYXNoT2JqZWN0ICYmIG1hcC5vYmplY3RJbmRleF9baGFzaE9iamVjdC5oYXNoXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuIG1hcC5zdHJpbmdJbmRleF9ba2V5XTtcbiAgICByZXR1cm4gbWFwLnByaW1pdGl2ZUluZGV4X1trZXldO1xuICB9XG4gIGZ1bmN0aW9uIGluaXRNYXAobWFwKSB7XG4gICAgbWFwLmVudHJpZXNfID0gW107XG4gICAgbWFwLm9iamVjdEluZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLnN0cmluZ0luZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLnByaW1pdGl2ZUluZGV4XyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbWFwLmRlbGV0ZWRDb3VudF8gPSAwO1xuICB9XG4gIHZhciBNYXAgPSBmdW5jdGlvbiBNYXAoKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xuICAgIGlmICghaXNPYmplY3QodGhpcykpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNYXAgY2FsbGVkIG9uIGluY29tcGF0aWJsZSB0eXBlJyk7XG4gICAgaWYgKCRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdlbnRyaWVzXycpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNYXAgY2FuIG5vdCBiZSByZWVudHJhbnRseSBpbml0aWFsaXNlZCcpO1xuICAgIH1cbiAgICBpbml0TWFwKHRoaXMpO1xuICAgIGlmIChpdGVyYWJsZSAhPT0gbnVsbCAmJiBpdGVyYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKHZhciAkX18yID0gaXRlcmFibGVbJHRyYWNldXJSdW50aW1lLnRvUHJvcGVydHkoU3ltYm9sLml0ZXJhdG9yKV0oKSxcbiAgICAgICAgICAkX18zOyAhKCRfXzMgPSAkX18yLm5leHQoKSkuZG9uZTsgKSB7XG4gICAgICAgIHZhciAkX180ID0gJF9fMy52YWx1ZSxcbiAgICAgICAgICAgIGtleSA9ICRfXzRbMF0sXG4gICAgICAgICAgICB2YWx1ZSA9ICRfXzRbMV07XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoTWFwLCB7XG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbnRyaWVzXy5sZW5ndGggLyAyIC0gdGhpcy5kZWxldGVkQ291bnRfO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBpbmRleCA9IGxvb2t1cEluZGV4KHRoaXMsIGtleSk7XG4gICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50cmllc19baW5kZXggKyAxXTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdmFyIG9iamVjdE1vZGUgPSBpc09iamVjdChrZXkpO1xuICAgICAgdmFyIHN0cmluZ01vZGUgPSB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJztcbiAgICAgIHZhciBpbmRleCA9IGxvb2t1cEluZGV4KHRoaXMsIGtleSk7XG4gICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVudHJpZXNfW2luZGV4ICsgMV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5lbnRyaWVzXy5sZW5ndGg7XG4gICAgICAgIHRoaXMuZW50cmllc19baW5kZXhdID0ga2V5O1xuICAgICAgICB0aGlzLmVudHJpZXNfW2luZGV4ICsgMV0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9iamVjdE1vZGUpIHtcbiAgICAgICAgICB2YXIgaGFzaE9iamVjdCA9IGdldE93bkhhc2hPYmplY3Qoa2V5KTtcbiAgICAgICAgICB2YXIgaGFzaCA9IGhhc2hPYmplY3QuaGFzaDtcbiAgICAgICAgICB0aGlzLm9iamVjdEluZGV4X1toYXNoXSA9IGluZGV4O1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmluZ01vZGUpIHtcbiAgICAgICAgICB0aGlzLnN0cmluZ0luZGV4X1trZXldID0gaW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcmltaXRpdmVJbmRleF9ba2V5XSA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhhczogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gbG9va3VwSW5kZXgodGhpcywga2V5KSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBvYmplY3RNb2RlID0gaXNPYmplY3Qoa2V5KTtcbiAgICAgIHZhciBzdHJpbmdNb2RlID0gdHlwZW9mIGtleSA9PT0gJ3N0cmluZyc7XG4gICAgICB2YXIgaW5kZXg7XG4gICAgICB2YXIgaGFzaDtcbiAgICAgIGlmIChvYmplY3RNb2RlKSB7XG4gICAgICAgIHZhciBoYXNoT2JqZWN0ID0gZ2V0T3duSGFzaE9iamVjdChrZXkpO1xuICAgICAgICBpZiAoaGFzaE9iamVjdCkge1xuICAgICAgICAgIGluZGV4ID0gdGhpcy5vYmplY3RJbmRleF9baGFzaCA9IGhhc2hPYmplY3QuaGFzaF07XG4gICAgICAgICAgZGVsZXRlIHRoaXMub2JqZWN0SW5kZXhfW2hhc2hdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZ01vZGUpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLnN0cmluZ0luZGV4X1trZXldO1xuICAgICAgICBkZWxldGUgdGhpcy5zdHJpbmdJbmRleF9ba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5wcmltaXRpdmVJbmRleF9ba2V5XTtcbiAgICAgICAgZGVsZXRlIHRoaXMucHJpbWl0aXZlSW5kZXhfW2tleV07XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVudHJpZXNfW2luZGV4XSA9IGRlbGV0ZWRTZW50aW5lbDtcbiAgICAgICAgdGhpcy5lbnRyaWVzX1tpbmRleCArIDFdID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRlbGV0ZWRDb3VudF8rKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICBpbml0TWFwKHRoaXMpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tGbikge1xuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW50cmllc18ubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuZW50cmllc19baV07XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZW50cmllc19baSArIDFdO1xuICAgICAgICBpZiAoa2V5ID09PSBkZWxldGVkU2VudGluZWwpXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIGNhbGxiYWNrRm4uY2FsbCh0aGlzQXJnLCB2YWx1ZSwga2V5LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVudHJpZXM6ICR0cmFjZXVyUnVudGltZS5pbml0R2VuZXJhdG9yRnVuY3Rpb24oZnVuY3Rpb24gJF9fNSgpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIHJldHVybiAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoZnVuY3Rpb24oJGN0eCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggKCRjdHguc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGkgPCB0aGlzLmVudHJpZXNfLmxlbmd0aCkgPyA4IDogLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIGtleSA9IHRoaXMuZW50cmllc19baV07XG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5lbnRyaWVzX1tpICsgMV07XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChrZXkgPT09IGRlbGV0ZWRTZW50aW5lbCkgPyA0IDogNjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAyO1xuICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsdWVdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAkY3R4Lm1heWJlVGhyb3coKTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuICRjdHguZW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgfSwgJF9fNSwgdGhpcyk7XG4gICAgfSksXG4gICAga2V5czogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX182KCkge1xuICAgICAgdmFyIGksXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoaSA8IHRoaXMuZW50cmllc18ubGVuZ3RoKSA/IDggOiAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAga2V5ID0gdGhpcy5lbnRyaWVzX1tpXTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmVudHJpZXNfW2kgKyAxXTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGtleSA9PT0gZGVsZXRlZFNlbnRpbmVsKSA/IDQgOiA2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHgubWF5YmVUaHJvdygpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gNDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX182LCB0aGlzKTtcbiAgICB9KSxcbiAgICB2YWx1ZXM6ICR0cmFjZXVyUnVudGltZS5pbml0R2VuZXJhdG9yRnVuY3Rpb24oZnVuY3Rpb24gJF9fNygpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIHJldHVybiAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoZnVuY3Rpb24oJGN0eCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggKCRjdHguc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKGkgPCB0aGlzLmVudHJpZXNfLmxlbmd0aCkgPyA4IDogLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIGtleSA9IHRoaXMuZW50cmllc19baV07XG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5lbnRyaWVzX1tpICsgMV07XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSA5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IChrZXkgPT09IGRlbGV0ZWRTZW50aW5lbCkgPyA0IDogNjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAyO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHgubWF5YmVUaHJvdygpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gNDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX183LCB0aGlzKTtcbiAgICB9KVxuICB9LCB7fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IE1hcC5wcm90b3R5cGUuZW50cmllc1xuICB9KTtcbiAgZnVuY3Rpb24gcG9seWZpbGxNYXAoZ2xvYmFsKSB7XG4gICAgdmFyICRfXzQgPSBnbG9iYWwsXG4gICAgICAgIE9iamVjdCA9ICRfXzQuT2JqZWN0LFxuICAgICAgICBTeW1ib2wgPSAkX180LlN5bWJvbDtcbiAgICBpZiAoIWdsb2JhbC5NYXApXG4gICAgICBnbG9iYWwuTWFwID0gTWFwO1xuICAgIHZhciBtYXBQcm90b3R5cGUgPSBnbG9iYWwuTWFwLnByb3RvdHlwZTtcbiAgICBpZiAobWFwUHJvdG90eXBlLmVudHJpZXMgPT09IHVuZGVmaW5lZClcbiAgICAgIGdsb2JhbC5NYXAgPSBNYXA7XG4gICAgaWYgKG1hcFByb3RvdHlwZS5lbnRyaWVzKSB7XG4gICAgICBtYXliZUFkZEl0ZXJhdG9yKG1hcFByb3RvdHlwZSwgbWFwUHJvdG90eXBlLmVudHJpZXMsIFN5bWJvbCk7XG4gICAgICBtYXliZUFkZEl0ZXJhdG9yKE9iamVjdC5nZXRQcm90b3R5cGVPZihuZXcgZ2xvYmFsLk1hcCgpLmVudHJpZXMoKSksIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sIFN5bWJvbCk7XG4gICAgfVxuICB9XG4gIHJlZ2lzdGVyUG9seWZpbGwocG9seWZpbGxNYXApO1xuICByZXR1cm4ge1xuICAgIGdldCBNYXAoKSB7XG4gICAgICByZXR1cm4gTWFwO1xuICAgIH0sXG4gICAgZ2V0IHBvbHlmaWxsTWFwKCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsTWFwO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcC5qc1wiICsgJycpO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU2V0LmpzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1NldC5qc1wiO1xuICB2YXIgJF9fMCA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlscy5qc1wiKSxcbiAgICAgIGlzT2JqZWN0ID0gJF9fMC5pc09iamVjdCxcbiAgICAgIG1heWJlQWRkSXRlcmF0b3IgPSAkX18wLm1heWJlQWRkSXRlcmF0b3IsXG4gICAgICByZWdpc3RlclBvbHlmaWxsID0gJF9fMC5yZWdpc3RlclBvbHlmaWxsO1xuICB2YXIgTWFwID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL01hcC5qc1wiKS5NYXA7XG4gIHZhciBnZXRPd25IYXNoT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLmdldE93bkhhc2hPYmplY3Q7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICBmdW5jdGlvbiBpbml0U2V0KHNldCkge1xuICAgIHNldC5tYXBfID0gbmV3IE1hcCgpO1xuICB9XG4gIHZhciBTZXQgPSBmdW5jdGlvbiBTZXQoKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gYXJndW1lbnRzWzBdO1xuICAgIGlmICghaXNPYmplY3QodGhpcykpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSB0eXBlJyk7XG4gICAgaWYgKCRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdtYXBfJykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NldCBjYW4gbm90IGJlIHJlZW50cmFudGx5IGluaXRpYWxpc2VkJyk7XG4gICAgfVxuICAgIGluaXRTZXQodGhpcyk7XG4gICAgaWYgKGl0ZXJhYmxlICE9PSBudWxsICYmIGl0ZXJhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyICRfXzQgPSBpdGVyYWJsZVskdHJhY2V1clJ1bnRpbWUudG9Qcm9wZXJ0eShTeW1ib2wuaXRlcmF0b3IpXSgpLFxuICAgICAgICAgICRfXzU7ICEoJF9fNSA9ICRfXzQubmV4dCgpKS5kb25lOyApIHtcbiAgICAgICAgdmFyIGl0ZW0gPSAkX181LnZhbHVlO1xuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFNldCwge1xuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwXy5zaXplO1xuICAgIH0sXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcF8uaGFzKGtleSk7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdGhpcy5tYXBfLnNldChrZXksIGtleSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLmRlbGV0ZShrZXkpO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwXy5jbGVhcigpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2tGbikge1xuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YXIgJF9fMiA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5tYXBfLmZvckVhY2goKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgY2FsbGJhY2tGbi5jYWxsKHRoaXNBcmcsIGtleSwga2V5LCAkX18yKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIHZhbHVlczogJHRyYWNldXJSdW50aW1lLmluaXRHZW5lcmF0b3JGdW5jdGlvbihmdW5jdGlvbiAkX183KCkge1xuICAgICAgdmFyICRfXzgsXG4gICAgICAgICAgJF9fOTtcbiAgICAgIHJldHVybiAkdHJhY2V1clJ1bnRpbWUuY3JlYXRlR2VuZXJhdG9ySW5zdGFuY2UoZnVuY3Rpb24oJGN0eCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICBzd2l0Y2ggKCRjdHguc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgJF9fOCA9IHRoaXMubWFwXy5rZXlzKClbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgICAkY3R4LnNlbnQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICRjdHguYWN0aW9uID0gJ25leHQnO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJF9fOSA9ICRfXzhbJGN0eC5hY3Rpb25dKCRjdHguc2VudElnbm9yZVRocm93KTtcbiAgICAgICAgICAgICAgJGN0eC5zdGF0ZSA9IDk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gKCRfXzkuZG9uZSkgPyAzIDogMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICRjdHguc2VudCA9ICRfXzkudmFsdWU7XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAtMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAxMjtcbiAgICAgICAgICAgICAgcmV0dXJuICRfXzkudmFsdWU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gJGN0eC5lbmQoKTtcbiAgICAgICAgICB9XG4gICAgICB9LCAkX183LCB0aGlzKTtcbiAgICB9KSxcbiAgICBlbnRyaWVzOiAkdHJhY2V1clJ1bnRpbWUuaW5pdEdlbmVyYXRvckZ1bmN0aW9uKGZ1bmN0aW9uICRfXzEwKCkge1xuICAgICAgdmFyICRfXzExLFxuICAgICAgICAgICRfXzEyO1xuICAgICAgcmV0dXJuICR0cmFjZXVyUnVudGltZS5jcmVhdGVHZW5lcmF0b3JJbnN0YW5jZShmdW5jdGlvbigkY3R4KSB7XG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgIHN3aXRjaCAoJGN0eC5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAkX18xMSA9IHRoaXMubWFwXy5lbnRyaWVzKClbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgICAkY3R4LnNlbnQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICRjdHguYWN0aW9uID0gJ25leHQnO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgJF9fMTIgPSAkX18xMVskY3R4LmFjdGlvbl0oJGN0eC5zZW50SWdub3JlVGhyb3cpO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gOTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICRjdHguc3RhdGUgPSAoJF9fMTIuZG9uZSkgPyAzIDogMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICRjdHguc2VudCA9ICRfXzEyLnZhbHVlO1xuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gLTI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAkY3R4LnN0YXRlID0gMTI7XG4gICAgICAgICAgICAgIHJldHVybiAkX18xMi52YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiAkY3R4LmVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgIH0sICRfXzEwLCB0aGlzKTtcbiAgICB9KVxuICB9LCB7fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IFNldC5wcm90b3R5cGUudmFsdWVzXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2V0LnByb3RvdHlwZSwgJ2tleXMnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBTZXQucHJvdG90eXBlLnZhbHVlc1xuICB9KTtcbiAgZnVuY3Rpb24gcG9seWZpbGxTZXQoZ2xvYmFsKSB7XG4gICAgdmFyICRfXzYgPSBnbG9iYWwsXG4gICAgICAgIE9iamVjdCA9ICRfXzYuT2JqZWN0LFxuICAgICAgICBTeW1ib2wgPSAkX182LlN5bWJvbDtcbiAgICBpZiAoIWdsb2JhbC5TZXQpXG4gICAgICBnbG9iYWwuU2V0ID0gU2V0O1xuICAgIHZhciBzZXRQcm90b3R5cGUgPSBnbG9iYWwuU2V0LnByb3RvdHlwZTtcbiAgICBpZiAoc2V0UHJvdG90eXBlLnZhbHVlcykge1xuICAgICAgbWF5YmVBZGRJdGVyYXRvcihzZXRQcm90b3R5cGUsIHNldFByb3RvdHlwZS52YWx1ZXMsIFN5bWJvbCk7XG4gICAgICBtYXliZUFkZEl0ZXJhdG9yKE9iamVjdC5nZXRQcm90b3R5cGVPZihuZXcgZ2xvYmFsLlNldCgpLnZhbHVlcygpKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSwgU3ltYm9sKTtcbiAgICB9XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbFNldCk7XG4gIHJldHVybiB7XG4gICAgZ2V0IFNldCgpIHtcbiAgICAgIHJldHVybiBTZXQ7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxTZXQoKSB7XG4gICAgICByZXR1cm4gcG9seWZpbGxTZXQ7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU2V0LmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXAuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwLmpzXCI7XG4gIHZhciBsZW4gPSAwO1xuICBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gICAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gICAgbGVuICs9IDI7XG4gICAgaWYgKGxlbiA9PT0gMikge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxuICB2YXIgJF9fZGVmYXVsdCA9IGFzYXA7XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICB2YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGVuID0gMDtcbiAgfVxuICB2YXIgc2NoZWR1bGVGbHVzaDtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbiAgfSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gIH0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZS5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlLmpzXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXAuanNcIikuZGVmYXVsdDtcbiAgdmFyIHJlZ2lzdGVyUG9seWZpbGwgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIikucmVnaXN0ZXJQb2x5ZmlsbDtcbiAgdmFyIHByb21pc2VSYXcgPSB7fTtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gaWRSZXNvbHZlSGFuZGxlcih4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgZnVuY3Rpb24gaWRSZWplY3RIYW5kbGVyKHgpIHtcbiAgICB0aHJvdyB4O1xuICB9XG4gIGZ1bmN0aW9uIGNoYWluKHByb21pc2UpIHtcbiAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IGlkUmVzb2x2ZUhhbmRsZXI7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IGlkUmVqZWN0SGFuZGxlcjtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcHJvbWlzZS5vblJlc29sdmVfLnB1c2gob25SZXNvbHZlLCBkZWZlcnJlZCk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2gob25SZWplY3QsIGRlZmVycmVkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICsxOlxuICAgICAgICBwcm9taXNlRW5xdWV1ZShwcm9taXNlLnZhbHVlXywgW29uUmVzb2x2ZSwgZGVmZXJyZWRdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIC0xOlxuICAgICAgICBwcm9taXNlRW5xdWV1ZShwcm9taXNlLnZhbHVlXywgW29uUmVqZWN0LCBkZWZlcnJlZF0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVmZXJyZWQoQykge1xuICAgIGlmICh0aGlzID09PSAkUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBwcm9taXNlSW5pdChuZXcgJFByb21pc2UocHJvbWlzZVJhdykpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogcHJvbWlzZSxcbiAgICAgICAgcmVzb2x2ZTogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KTtcbiAgICAgICAgfSksXG4gICAgICAgIHJlamVjdDogKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpO1xuICAgICAgICB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VTZXQocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgb25SZXNvbHZlLCBvblJlamVjdCkge1xuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IG9uUmVzb2x2ZTtcbiAgICBwcm9taXNlLm9uUmVqZWN0XyA9IG9uUmVqZWN0O1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VJbml0KHByb21pc2UpIHtcbiAgICByZXR1cm4gcHJvbWlzZVNldChwcm9taXNlLCAwLCB1bmRlZmluZWQsIFtdLCBbXSk7XG4gIH1cbiAgdmFyIFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgaWYgKHJlc29sdmVyID09PSBwcm9taXNlUmF3KVxuICAgICAgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIHZhciBwcm9taXNlID0gcHJvbWlzZUluaXQodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc29sdmVyKChmdW5jdGlvbih4KSB7XG4gICAgICAgIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpO1xuICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgIHByb21pc2VSZWplY3QocHJvbWlzZSwgcik7XG4gICAgICB9KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcHJvbWlzZVJlamVjdChwcm9taXNlLCBlKTtcbiAgICB9XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbihvblJlc29sdmUsIG9uUmVqZWN0KSB7XG4gICAgICBpZiAodHlwZW9mIG9uUmVzb2x2ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgb25SZXNvbHZlID0gaWRSZXNvbHZlSGFuZGxlcjtcbiAgICAgIGlmICh0eXBlb2Ygb25SZWplY3QgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIG9uUmVqZWN0ID0gaWRSZWplY3RIYW5kbGVyO1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCBmdW5jdGlvbih4KSB7XG4gICAgICAgIHggPSBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KTtcbiAgICAgICAgcmV0dXJuIHggPT09IHRoYXQgPyBvblJlamVjdChuZXcgVHlwZUVycm9yKSA6IGlzUHJvbWlzZSh4KSA/IHgudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSA6IG9uUmVzb2x2ZSh4KTtcbiAgICAgIH0sIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAodGhpcyA9PT0gJFByb21pc2UpIHtcbiAgICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlU2V0KG5ldyAkUHJvbWlzZShwcm9taXNlUmF3KSwgKzEsIHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJlc29sdmUoeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVqZWN0OiBmdW5jdGlvbihyKSB7XG4gICAgICBpZiAodGhpcyA9PT0gJFByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VTZXQobmV3ICRQcm9taXNlKHByb21pc2VSYXcpLCAtMSwgcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJlamVjdChyKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWxsOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdmFyIHJlc29sdXRpb25zID0gW107XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgY291bnQgPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHZhbHVlc1tpXSkudGhlbihmdW5jdGlvbihpLCB4KSB7XG4gICAgICAgICAgICAgIHJlc29sdXRpb25zW2ldID0geDtcbiAgICAgICAgICAgICAgaWYgKC0tY291bnQgPT09IDApXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICAgICAgICB9LmJpbmQodW5kZWZpbmVkLCBpKSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIHJhY2U6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMucmVzb2x2ZSh2YWx1ZXNbaV0pLnRoZW4oKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeCk7XG4gICAgICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgfSk7XG4gIHZhciAkUHJvbWlzZSA9IFByb21pc2U7XG4gIHZhciAkUHJvbWlzZVJlamVjdCA9ICRQcm9taXNlLnJlamVjdDtcbiAgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCkge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICsxLCB4LCBwcm9taXNlLm9uUmVzb2x2ZV8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWplY3QocHJvbWlzZSwgcikge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsIC0xLCByLCBwcm9taXNlLm9uUmVqZWN0Xyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZURvbmUocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgcmVhY3Rpb25zKSB7XG4gICAgaWYgKHByb21pc2Uuc3RhdHVzXyAhPT0gMClcbiAgICAgIHJldHVybjtcbiAgICBwcm9taXNlRW5xdWV1ZSh2YWx1ZSwgcmVhY3Rpb25zKTtcbiAgICBwcm9taXNlU2V0KHByb21pc2UsIHN0YXR1cywgdmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VFbnF1ZXVlKHZhbHVlLCB0YXNrcykge1xuICAgIGFzeW5jKChmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgcHJvbWlzZUhhbmRsZSh2YWx1ZSwgdGFza3NbaV0sIHRhc2tzW2kgKyAxXSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VIYW5kbGUodmFsdWUsIGhhbmRsZXIsIGRlZmVycmVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGRlZmVycmVkLnByb21pc2UpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICBlbHNlIGlmIChpc1Byb21pc2UocmVzdWx0KSlcbiAgICAgICAgY2hhaW4ocmVzdWx0LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgZWxzZVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gIH1cbiAgdmFyIHRoZW5hYmxlU3ltYm9sID0gJ0BAdGhlbmFibGUnO1xuICBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gICAgcmV0dXJuIHggJiYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCkge1xuICAgIGlmICghaXNQcm9taXNlKHgpICYmIGlzT2JqZWN0KHgpKSB7XG4gICAgICB2YXIgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoZW4gPSB4LnRoZW47XG4gICAgICB9IGNhdGNoIChyKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gJFByb21pc2VSZWplY3QuY2FsbChjb25zdHJ1Y3Rvciwgcik7XG4gICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gcHJvbWlzZTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHAgPSB4W3RoZW5hYmxlU3ltYm9sXTtcbiAgICAgICAgaWYgKHApIHtcbiAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChjb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgeFt0aGVuYWJsZVN5bWJvbF0gPSBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwoeCwgZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgICB9IGNhdGNoIChyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4O1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIHJlZ2lzdGVyUG9seWZpbGwocG9seWZpbGxQcm9taXNlKTtcbiAgcmV0dXJuIHtcbiAgICBnZXQgUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlO1xuICAgIH0sXG4gICAgZ2V0IHBvbHlmaWxsUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBwb2x5ZmlsbFByb21pc2U7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZS5qc1wiICsgJycpO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nSXRlcmF0b3IuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ0l0ZXJhdG9yLmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QgPSAkX18wLmNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0LFxuICAgICAgaXNPYmplY3QgPSAkX18wLmlzT2JqZWN0O1xuICB2YXIgdG9Qcm9wZXJ0eSA9ICR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5O1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgaXRlcmF0ZWRTdHJpbmcgPSBTeW1ib2woJ2l0ZXJhdGVkU3RyaW5nJyk7XG4gIHZhciBzdHJpbmdJdGVyYXRvck5leHRJbmRleCA9IFN5bWJvbCgnc3RyaW5nSXRlcmF0b3JOZXh0SW5kZXgnKTtcbiAgdmFyIFN0cmluZ0l0ZXJhdG9yID0gZnVuY3Rpb24gU3RyaW5nSXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoU3RyaW5nSXRlcmF0b3IsICgkX18yID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX18yLCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvID0gdGhpcztcbiAgICAgIGlmICghaXNPYmplY3QobykgfHwgIWhhc093blByb3BlcnR5LmNhbGwobywgaXRlcmF0ZWRTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgbXVzdCBiZSBhIFN0cmluZ0l0ZXJhdG9yIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgdmFyIHMgPSBvW3RvUHJvcGVydHkoaXRlcmF0ZWRTdHJpbmcpXTtcbiAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgcG9zaXRpb24gPSBvW3RvUHJvcGVydHkoc3RyaW5nSXRlcmF0b3JOZXh0SW5kZXgpXTtcbiAgICAgIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgICAgIGlmIChwb3NpdGlvbiA+PSBsZW4pIHtcbiAgICAgICAgb1t0b1Byb3BlcnR5KGl0ZXJhdGVkU3RyaW5nKV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgdmFyIGZpcnN0ID0gcy5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcbiAgICAgIHZhciByZXN1bHRTdHJpbmc7XG4gICAgICBpZiAoZmlyc3QgPCAweEQ4MDAgfHwgZmlyc3QgPiAweERCRkYgfHwgcG9zaXRpb24gKyAxID09PSBsZW4pIHtcbiAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2Vjb25kID0gcy5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG4gICAgICAgIGlmIChzZWNvbmQgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGKSB7XG4gICAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShmaXJzdCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKHNlY29uZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9bdG9Qcm9wZXJ0eShzdHJpbmdJdGVyYXRvck5leHRJbmRleCldID0gcG9zaXRpb24gKyByZXN1bHRTdHJpbmcubGVuZ3RoO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHJlc3VsdFN0cmluZywgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX18yLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX18yKSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVTdHJpbmdJdGVyYXRvcihzdHJpbmcpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhzdHJpbmcpO1xuICAgIHZhciBpdGVyYXRvciA9IE9iamVjdC5jcmVhdGUoU3RyaW5nSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgICBpdGVyYXRvclt0b1Byb3BlcnR5KGl0ZXJhdGVkU3RyaW5nKV0gPSBzO1xuICAgIGl0ZXJhdG9yW3RvUHJvcGVydHkoc3RyaW5nSXRlcmF0b3JOZXh0SW5kZXgpXSA9IDA7XG4gICAgcmV0dXJuIGl0ZXJhdG9yO1xuICB9XG4gIHJldHVybiB7Z2V0IGNyZWF0ZVN0cmluZ0l0ZXJhdG9yKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN0cmluZ0l0ZXJhdG9yO1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmcuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nLmpzXCI7XG4gIHZhciBjcmVhdGVTdHJpbmdJdGVyYXRvciA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdJdGVyYXRvci5qc1wiKS5jcmVhdGVTdHJpbmdJdGVyYXRvcjtcbiAgdmFyICRfXzEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHMuanNcIiksXG4gICAgICBtYXliZUFkZEZ1bmN0aW9ucyA9ICRfXzEubWF5YmVBZGRGdW5jdGlvbnMsXG4gICAgICBtYXliZUFkZEl0ZXJhdG9yID0gJF9fMS5tYXliZUFkZEl0ZXJhdG9yLFxuICAgICAgcmVnaXN0ZXJQb2x5ZmlsbCA9ICRfXzEucmVnaXN0ZXJQb2x5ZmlsbDtcbiAgdmFyICR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcbiAgdmFyICRsYXN0SW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICB2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJGxhc3RJbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHN0YXJ0KSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2gpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAoc2VhcmNoICYmICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKHBvcyAhPSBwb3MpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgaWYgKHNlYXJjaExlbmd0aCArIHN0YXJ0ID4gc3RyaW5nTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpICE9IC0xO1xuICB9XG4gIGZ1bmN0aW9uIHJlcGVhdChjb3VudCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBuID0gY291bnQgPyBOdW1iZXIoY291bnQpIDogMDtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgIG4gPSAwO1xuICAgIH1cbiAgICBpZiAobiA8IDAgfHwgbiA9PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB3aGlsZSAobi0tKSB7XG4gICAgICByZXN1bHQgKz0gc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHNpemUgPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHNpemUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHZhciBmaXJzdCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgc2Vjb25kO1xuICAgIGlmIChmaXJzdCA+PSAweEQ4MDAgJiYgZmlyc3QgPD0gMHhEQkZGICYmIHNpemUgPiBpbmRleCArIDEpIHtcbiAgICAgIHNlY29uZCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gICAgICBpZiAoc2Vjb25kID49IDB4REMwMCAmJiBzZWNvbmQgPD0gMHhERkZGKSB7XG4gICAgICAgIHJldHVybiAoZmlyc3QgLSAweEQ4MDApICogMHg0MDAgKyBzZWNvbmQgLSAweERDMDAgKyAweDEwMDAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcmF3KGNhbGxzaXRlKSB7XG4gICAgdmFyIHJhdyA9IGNhbGxzaXRlLnJhdztcbiAgICB2YXIgbGVuID0gcmF3Lmxlbmd0aCA+Pj4gMDtcbiAgICBpZiAobGVuID09PSAwKVxuICAgICAgcmV0dXJuICcnO1xuICAgIHZhciBzID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBzICs9IHJhd1tpXTtcbiAgICAgIGlmIChpICsgMSA9PT0gbGVuKVxuICAgICAgICByZXR1cm4gcztcbiAgICAgIHMgKz0gYXJndW1lbnRzWysraV07XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoKSB7XG4gICAgdmFyIGNvZGVVbml0cyA9IFtdO1xuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG4gICAgdmFyIGhpZ2hTdXJyb2dhdGU7XG4gICAgdmFyIGxvd1N1cnJvZ2F0ZTtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgIGlmICghaXNGaW5pdGUoY29kZVBvaW50KSB8fCBjb2RlUG9pbnQgPCAwIHx8IGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50KSB7XG4gICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAoY29kZVBvaW50IDw9IDB4RkZGRikge1xuICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XG4gICAgICAgIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIDB4RDgwMDtcbiAgICAgICAgbG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJpbmdQcm90b3R5cGVJdGVyYXRvcigpIHtcbiAgICB2YXIgbyA9ICR0cmFjZXVyUnVudGltZS5jaGVja09iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICB2YXIgcyA9IFN0cmluZyhvKTtcbiAgICByZXR1cm4gY3JlYXRlU3RyaW5nSXRlcmF0b3Iocyk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxTdHJpbmcoZ2xvYmFsKSB7XG4gICAgdmFyIFN0cmluZyA9IGdsb2JhbC5TdHJpbmc7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLnByb3RvdHlwZSwgWydjb2RlUG9pbnRBdCcsIGNvZGVQb2ludEF0LCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ2luY2x1ZGVzJywgaW5jbHVkZXMsICdyZXBlYXQnLCByZXBlYXQsICdzdGFydHNXaXRoJywgc3RhcnRzV2l0aF0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZywgWydmcm9tQ29kZVBvaW50JywgZnJvbUNvZGVQb2ludCwgJ3JhdycsIHJhd10pO1xuICAgIG1heWJlQWRkSXRlcmF0b3IoU3RyaW5nLnByb3RvdHlwZSwgc3RyaW5nUHJvdG90eXBlSXRlcmF0b3IsIFN5bWJvbCk7XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbFN0cmluZyk7XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBpbmNsdWRlcygpIHtcbiAgICAgIHJldHVybiBpbmNsdWRlcztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH0sXG4gICAgZ2V0IHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yKCkge1xuICAgICAgcmV0dXJuIHN0cmluZ1Byb3RvdHlwZUl0ZXJhdG9yO1xuICAgIH0sXG4gICAgZ2V0IHBvbHlmaWxsU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHBvbHlmaWxsU3RyaW5nO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZy5qc1wiICsgJycpO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvci5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fMjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvci5qc1wiO1xuICB2YXIgJF9fMCA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlscy5qc1wiKSxcbiAgICAgIHRvT2JqZWN0ID0gJF9fMC50b09iamVjdCxcbiAgICAgIHRvVWludDMyID0gJF9fMC50b1VpbnQzMixcbiAgICAgIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0ID0gJF9fMC5jcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdDtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyA9IDE7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyA9IDI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMgPSAzO1xuICB2YXIgQXJyYXlJdGVyYXRvciA9IGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoQXJyYXlJdGVyYXRvciwgKCRfXzIgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzIsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5pdGVyYXRvck9iamVjdF87XG4gICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBpcyBub3QgYW4gQXJyYXlJdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF87XG4gICAgICB2YXIgaXRlbUtpbmQgPSBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfO1xuICAgICAgdmFyIGxlbmd0aCA9IHRvVWludDMyKGFycmF5Lmxlbmd0aCk7XG4gICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gSW5maW5pdHk7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChhcnJheVtpbmRleF0sIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChbaW5kZXgsIGFycmF5W2luZGV4XV0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChpbmRleCwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX18yLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX18yKSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGFycmF5LCBraW5kKSB7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KGFycmF5KTtcbiAgICB2YXIgaXRlcmF0b3IgPSBuZXcgQXJyYXlJdGVyYXRvcjtcbiAgICBpdGVyYXRvci5pdGVyYXRvck9iamVjdF8gPSBvYmplY3Q7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSAwO1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF8gPSBraW5kO1xuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuICBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyk7XG4gIH1cbiAgZnVuY3Rpb24ga2V5cygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMpO1xuICB9XG4gIGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH0sXG4gICAgZ2V0IGtleXMoKSB7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyTW9kdWxlKFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXkuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXkuanNcIjtcbiAgdmFyICRfXzAgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvci5qc1wiKSxcbiAgICAgIGVudHJpZXMgPSAkX18wLmVudHJpZXMsXG4gICAgICBrZXlzID0gJF9fMC5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fMC52YWx1ZXM7XG4gIHZhciAkX18xID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgY2hlY2tJdGVyYWJsZSA9ICRfXzEuY2hlY2tJdGVyYWJsZSxcbiAgICAgIGlzQ2FsbGFibGUgPSAkX18xLmlzQ2FsbGFibGUsXG4gICAgICBpc0NvbnN0cnVjdG9yID0gJF9fMS5pc0NvbnN0cnVjdG9yLFxuICAgICAgbWF5YmVBZGRGdW5jdGlvbnMgPSAkX18xLm1heWJlQWRkRnVuY3Rpb25zLFxuICAgICAgbWF5YmVBZGRJdGVyYXRvciA9ICRfXzEubWF5YmVBZGRJdGVyYXRvcixcbiAgICAgIHJlZ2lzdGVyUG9seWZpbGwgPSAkX18xLnJlZ2lzdGVyUG9seWZpbGwsXG4gICAgICB0b0ludGVnZXIgPSAkX18xLnRvSW50ZWdlcixcbiAgICAgIHRvTGVuZ3RoID0gJF9fMS50b0xlbmd0aCxcbiAgICAgIHRvT2JqZWN0ID0gJF9fMS50b09iamVjdDtcbiAgZnVuY3Rpb24gZnJvbShhcnJMaWtlKSB7XG4gICAgdmFyIG1hcEZuID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzJdO1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgaXRlbXMgPSB0b09iamVjdChhcnJMaWtlKTtcbiAgICB2YXIgbWFwcGluZyA9IG1hcEZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBhcnIsXG4gICAgICAgIGxlbjtcbiAgICBpZiAobWFwcGluZyAmJiAhaXNDYWxsYWJsZShtYXBGbikpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICBpZiAoY2hlY2tJdGVyYWJsZShpdGVtcykpIHtcbiAgICAgIGFyciA9IGlzQ29uc3RydWN0b3IoQykgPyBuZXcgQygpIDogW107XG4gICAgICBmb3IgKHZhciAkX18yID0gaXRlbXNbJHRyYWNldXJSdW50aW1lLnRvUHJvcGVydHkoU3ltYm9sLml0ZXJhdG9yKV0oKSxcbiAgICAgICAgICAkX18zOyAhKCRfXzMgPSAkX18yLm5leHQoKSkuZG9uZTsgKSB7XG4gICAgICAgIHZhciBpdGVtID0gJF9fMy52YWx1ZTtcbiAgICAgICAge1xuICAgICAgICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICAgICAgICBhcnJba10gPSBtYXBGbi5jYWxsKHRoaXNBcmcsIGl0ZW0sIGspO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJba10gPSBpdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFyci5sZW5ndGggPSBrO1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgbGVuID0gdG9MZW5ndGgoaXRlbXMubGVuZ3RoKTtcbiAgICBhcnIgPSBpc0NvbnN0cnVjdG9yKEMpID8gbmV3IEMobGVuKSA6IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICAgIGFycltrXSA9IHR5cGVvZiB0aGlzQXJnID09PSAndW5kZWZpbmVkJyA/IG1hcEZuKGl0ZW1zW2tdLCBrKSA6IG1hcEZuLmNhbGwodGhpc0FyZywgaXRlbXNba10sIGspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyW2tdID0gaXRlbXNba107XG4gICAgICB9XG4gICAgfVxuICAgIGFyci5sZW5ndGggPSBsZW47XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBvZigpIHtcbiAgICBmb3IgKHZhciBpdGVtcyA9IFtdLFxuICAgICAgICAkX180ID0gMDsgJF9fNCA8IGFyZ3VtZW50cy5sZW5ndGg7ICRfXzQrKylcbiAgICAgIGl0ZW1zWyRfXzRdID0gYXJndW1lbnRzWyRfXzRdO1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgbGVuID0gaXRlbXMubGVuZ3RoO1xuICAgIHZhciBhcnIgPSBpc0NvbnN0cnVjdG9yKEMpID8gbmV3IEMobGVuKSA6IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgIGFycltrXSA9IGl0ZW1zW2tdO1xuICAgIH1cbiAgICBhcnIubGVuZ3RoID0gbGVuO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gZmlsbCh2YWx1ZSkge1xuICAgIHZhciBzdGFydCA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIHZhciBlbmQgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChvYmplY3QubGVuZ3RoKTtcbiAgICB2YXIgZmlsbFN0YXJ0ID0gdG9JbnRlZ2VyKHN0YXJ0KTtcbiAgICB2YXIgZmlsbEVuZCA9IGVuZCAhPT0gdW5kZWZpbmVkID8gdG9JbnRlZ2VyKGVuZCkgOiBsZW47XG4gICAgZmlsbFN0YXJ0ID0gZmlsbFN0YXJ0IDwgMCA/IE1hdGgubWF4KGxlbiArIGZpbGxTdGFydCwgMCkgOiBNYXRoLm1pbihmaWxsU3RhcnQsIGxlbik7XG4gICAgZmlsbEVuZCA9IGZpbGxFbmQgPCAwID8gTWF0aC5tYXgobGVuICsgZmlsbEVuZCwgMCkgOiBNYXRoLm1pbihmaWxsRW5kLCBsZW4pO1xuICAgIHdoaWxlIChmaWxsU3RhcnQgPCBmaWxsRW5kKSB7XG4gICAgICBvYmplY3RbZmlsbFN0YXJ0XSA9IHZhbHVlO1xuICAgICAgZmlsbFN0YXJ0Kys7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gZmluZChwcmVkaWNhdGUpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICByZXR1cm4gZmluZEhlbHBlcih0aGlzLCBwcmVkaWNhdGUsIHRoaXNBcmcpO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcbiAgICByZXR1cm4gZmluZEhlbHBlcih0aGlzLCBwcmVkaWNhdGUsIHRoaXNBcmcsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRIZWxwZXIoc2VsZiwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIHJldHVybkluZGV4ID0gYXJndW1lbnRzWzNdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChzZWxmKTtcbiAgICB2YXIgbGVuID0gdG9MZW5ndGgob2JqZWN0Lmxlbmd0aCk7XG4gICAgaWYgKCFpc0NhbGxhYmxlKHByZWRpY2F0ZSkpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvYmplY3RbaV07XG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybkluZGV4ID8gaSA6IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuSW5kZXggPyAtMSA6IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KGdsb2JhbCkge1xuICAgIHZhciAkX181ID0gZ2xvYmFsLFxuICAgICAgICBBcnJheSA9ICRfXzUuQXJyYXksXG4gICAgICAgIE9iamVjdCA9ICRfXzUuT2JqZWN0LFxuICAgICAgICBTeW1ib2wgPSAkX181LlN5bWJvbDtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlcywgJ2ZpbGwnLCBmaWxsLCAnZmluZCcsIGZpbmQsICdmaW5kSW5kZXgnLCBmaW5kSW5kZXhdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheSwgWydmcm9tJywgZnJvbSwgJ29mJywgb2ZdKTtcbiAgICBtYXliZUFkZEl0ZXJhdG9yKEFycmF5LnByb3RvdHlwZSwgdmFsdWVzLCBTeW1ib2wpO1xuICAgIG1heWJlQWRkSXRlcmF0b3IoT2JqZWN0LmdldFByb3RvdHlwZU9mKFtdLnZhbHVlcygpKSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBTeW1ib2wpO1xuICB9XG4gIHJlZ2lzdGVyUG9seWZpbGwocG9seWZpbGxBcnJheSk7XG4gIHJldHVybiB7XG4gICAgZ2V0IGZyb20oKSB7XG4gICAgICByZXR1cm4gZnJvbTtcbiAgICB9LFxuICAgIGdldCBvZigpIHtcbiAgICAgIHJldHVybiBvZjtcbiAgICB9LFxuICAgIGdldCBmaWxsKCkge1xuICAgICAgcmV0dXJuIGZpbGw7XG4gICAgfSxcbiAgICBnZXQgZmluZCgpIHtcbiAgICAgIHJldHVybiBmaW5kO1xuICAgIH0sXG4gICAgZ2V0IGZpbmRJbmRleCgpIHtcbiAgICAgIHJldHVybiBmaW5kSW5kZXg7XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxBcnJheSgpIHtcbiAgICAgIHJldHVybiBwb2x5ZmlsbEFycmF5O1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5LmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9PYmplY3QuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvT2JqZWN0LmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgbWF5YmVBZGRGdW5jdGlvbnMgPSAkX18wLm1heWJlQWRkRnVuY3Rpb25zLFxuICAgICAgcmVnaXN0ZXJQb2x5ZmlsbCA9ICRfXzAucmVnaXN0ZXJQb2x5ZmlsbDtcbiAgdmFyICRfXzEgPSAkdHJhY2V1clJ1bnRpbWUsXG4gICAgICBkZWZpbmVQcm9wZXJ0eSA9ICRfXzEuZGVmaW5lUHJvcGVydHksXG4gICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkX18xLmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgICAgIGdldE93blByb3BlcnR5TmFtZXMgPSAkX18xLmdldE93blByb3BlcnR5TmFtZXMsXG4gICAgICBpc1ByaXZhdGVOYW1lID0gJF9fMS5pc1ByaXZhdGVOYW1lLFxuICAgICAga2V5cyA9ICRfXzEua2V5cztcbiAgZnVuY3Rpb24gaXMobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAobGVmdCA9PT0gcmlnaHQpXG4gICAgICByZXR1cm4gbGVmdCAhPT0gMCB8fCAxIC8gbGVmdCA9PT0gMSAvIHJpZ2h0O1xuICAgIHJldHVybiBsZWZ0ICE9PSBsZWZ0ICYmIHJpZ2h0ICE9PSByaWdodDtcbiAgfVxuICBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICB2YXIgcHJvcHMgPSBzb3VyY2UgPT0gbnVsbCA/IFtdIDoga2V5cyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIHZhciBuYW1lID0gcHJvcHNbcF07XG4gICAgICAgIGlmIChpc1ByaXZhdGVOYW1lKG5hbWUpKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB0YXJnZXRbbmFtZV0gPSBzb3VyY2VbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB2YXIgcHJvcHMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgdmFyIHAsXG4gICAgICAgIGRlc2NyaXB0b3IsXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgIHZhciBuYW1lID0gcHJvcHNbcF07XG4gICAgICBpZiAoaXNQcml2YXRlTmFtZShuYW1lKSlcbiAgICAgICAgY29udGludWU7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcHNbcF0pO1xuICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wc1twXSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoZ2xvYmFsKSB7XG4gICAgdmFyIE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoT2JqZWN0LCBbJ2Fzc2lnbicsIGFzc2lnbiwgJ2lzJywgaXMsICdtaXhpbicsIG1peGluXSk7XG4gIH1cbiAgcmVnaXN0ZXJQb2x5ZmlsbChwb2x5ZmlsbE9iamVjdCk7XG4gIHJldHVybiB7XG4gICAgZ2V0IGlzKCkge1xuICAgICAgcmV0dXJuIGlzO1xuICAgIH0sXG4gICAgZ2V0IGFzc2lnbigpIHtcbiAgICAgIHJldHVybiBhc3NpZ247XG4gICAgfSxcbiAgICBnZXQgbWl4aW4oKSB7XG4gICAgICByZXR1cm4gbWl4aW47XG4gICAgfSxcbiAgICBnZXQgcG9seWZpbGxPYmplY3QoKSB7XG4gICAgICByZXR1cm4gcG9seWZpbGxPYmplY3Q7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvT2JqZWN0LmpzXCIgKyAnJyk7XG5TeXN0ZW0ucmVnaXN0ZXJNb2R1bGUoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9OdW1iZXIuanNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvTnVtYmVyLmpzXCI7XG4gIHZhciAkX18wID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLFxuICAgICAgaXNOdW1iZXIgPSAkX18wLmlzTnVtYmVyLFxuICAgICAgbWF5YmVBZGRDb25zdHMgPSAkX18wLm1heWJlQWRkQ29uc3RzLFxuICAgICAgbWF5YmVBZGRGdW5jdGlvbnMgPSAkX18wLm1heWJlQWRkRnVuY3Rpb25zLFxuICAgICAgcmVnaXN0ZXJQb2x5ZmlsbCA9ICRfXzAucmVnaXN0ZXJQb2x5ZmlsbCxcbiAgICAgIHRvSW50ZWdlciA9ICRfXzAudG9JbnRlZ2VyO1xuICB2YXIgJGFicyA9IE1hdGguYWJzO1xuICB2YXIgJGlzRmluaXRlID0gaXNGaW5pdGU7XG4gIHZhciAkaXNOYU4gPSBpc05hTjtcbiAgdmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgTUlOX1NBRkVfSU5URUdFUiA9IC1NYXRoLnBvdygyLCA1MykgKyAxO1xuICB2YXIgRVBTSUxPTiA9IE1hdGgucG93KDIsIC01Mik7XG4gIGZ1bmN0aW9uIE51bWJlcklzRmluaXRlKG51bWJlcikge1xuICAgIHJldHVybiBpc051bWJlcihudW1iZXIpICYmICRpc0Zpbml0ZShudW1iZXIpO1xuICB9XG4gIDtcbiAgZnVuY3Rpb24gaXNJbnRlZ2VyKG51bWJlcikge1xuICAgIHJldHVybiBOdW1iZXJJc0Zpbml0ZShudW1iZXIpICYmIHRvSW50ZWdlcihudW1iZXIpID09PSBudW1iZXI7XG4gIH1cbiAgZnVuY3Rpb24gTnVtYmVySXNOYU4obnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKG51bWJlcikgJiYgJGlzTmFOKG51bWJlcik7XG4gIH1cbiAgO1xuICBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKG51bWJlcikge1xuICAgIGlmIChOdW1iZXJJc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgICB2YXIgaW50ZWdyYWwgPSB0b0ludGVnZXIobnVtYmVyKTtcbiAgICAgIGlmIChpbnRlZ3JhbCA9PT0gbnVtYmVyKVxuICAgICAgICByZXR1cm4gJGFicyhpbnRlZ3JhbCkgPD0gTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsTnVtYmVyKGdsb2JhbCkge1xuICAgIHZhciBOdW1iZXIgPSBnbG9iYWwuTnVtYmVyO1xuICAgIG1heWJlQWRkQ29uc3RzKE51bWJlciwgWydNQVhfU0FGRV9JTlRFR0VSJywgTUFYX1NBRkVfSU5URUdFUiwgJ01JTl9TQUZFX0lOVEVHRVInLCBNSU5fU0FGRV9JTlRFR0VSLCAnRVBTSUxPTicsIEVQU0lMT05dKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhOdW1iZXIsIFsnaXNGaW5pdGUnLCBOdW1iZXJJc0Zpbml0ZSwgJ2lzSW50ZWdlcicsIGlzSW50ZWdlciwgJ2lzTmFOJywgTnVtYmVySXNOYU4sICdpc1NhZmVJbnRlZ2VyJywgaXNTYWZlSW50ZWdlcl0pO1xuICB9XG4gIHJlZ2lzdGVyUG9seWZpbGwocG9seWZpbGxOdW1iZXIpO1xuICByZXR1cm4ge1xuICAgIGdldCBNQVhfU0FGRV9JTlRFR0VSKCkge1xuICAgICAgcmV0dXJuIE1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfSxcbiAgICBnZXQgTUlOX1NBRkVfSU5URUdFUigpIHtcbiAgICAgIHJldHVybiBNSU5fU0FGRV9JTlRFR0VSO1xuICAgIH0sXG4gICAgZ2V0IEVQU0lMT04oKSB7XG4gICAgICByZXR1cm4gRVBTSUxPTjtcbiAgICB9LFxuICAgIGdldCBpc0Zpbml0ZSgpIHtcbiAgICAgIHJldHVybiBOdW1iZXJJc0Zpbml0ZTtcbiAgICB9LFxuICAgIGdldCBpc0ludGVnZXIoKSB7XG4gICAgICByZXR1cm4gaXNJbnRlZ2VyO1xuICAgIH0sXG4gICAgZ2V0IGlzTmFOKCkge1xuICAgICAgcmV0dXJuIE51bWJlcklzTmFOO1xuICAgIH0sXG4gICAgZ2V0IGlzU2FmZUludGVnZXIoKSB7XG4gICAgICByZXR1cm4gaXNTYWZlSW50ZWdlcjtcbiAgICB9LFxuICAgIGdldCBwb2x5ZmlsbE51bWJlcigpIHtcbiAgICAgIHJldHVybiBwb2x5ZmlsbE51bWJlcjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9OdW1iZXIuanNcIiArICcnKTtcblN5c3RlbS5yZWdpc3Rlck1vZHVsZShcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxscy5qc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjc5L3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHMuanNcIjtcbiAgdmFyIHBvbHlmaWxsQWxsID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuNzkvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzLmpzXCIpLnBvbHlmaWxsQWxsO1xuICBwb2x5ZmlsbEFsbChSZWZsZWN0Lmdsb2JhbCk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gICAgcG9seWZpbGxBbGwoZ2xvYmFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC43OS9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzLmpzXCIgKyAnJyk7XG4iXX0=
