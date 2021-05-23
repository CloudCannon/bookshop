(() => {
  var __defProp = Object.defineProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // node_modules/liquidjs/dist/liquid.browser.umd.js
  var require_liquid_browser_umd = __commonJS({
    "node_modules/liquidjs/dist/liquid.browser.umd.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = global2 || self, factory(global2.liquidjs = {}));
      })(exports, function(exports2) {
        "use strict";
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2)
              if (b2.hasOwnProperty(p))
                d2[p] = b2[p];
          };
          return extendStatics(d, b);
        };
        function __extends(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        }
        var __assign = function() {
          __assign = Object.assign || function __assign2(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
            }
            return t;
          };
          return __assign.apply(this, arguments);
        };
        function __awaiter(thisArg, _arguments, P, generator) {
          return new (P || (P = Promise))(function(resolve2, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done ? resolve2(result.value) : new P(function(resolve3) {
                resolve3(result.value);
              }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        }
        function __generator(thisArg, body) {
          var _ = {label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: []}, f, y, t, g;
          return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return {value: op[1], done: false};
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return {value: op[0] ? op[1] : void 0, done: true};
          }
        }
        function __values(o) {
          var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
          if (m)
            return m.call(o);
          return {
            next: function() {
              if (o && i >= o.length)
                o = void 0;
              return {value: o && o[i++], done: !o};
            }
          };
        }
        function __read(o, n) {
          var m = typeof Symbol === "function" && o[Symbol.iterator];
          if (!m)
            return o;
          var i = m.call(o), r, ar = [], e;
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value);
          } catch (error) {
            e = {error};
          } finally {
            try {
              if (r && !r.done && (m = i["return"]))
                m.call(i);
            } finally {
              if (e)
                throw e.error;
            }
          }
          return ar;
        }
        function __spread() {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
          return ar;
        }
        var Drop = function() {
          function Drop2() {
          }
          Drop2.prototype.valueOf = function() {
            return void 0;
          };
          Drop2.prototype.liquidMethodMissing = function(key) {
            return void 0;
          };
          return Drop2;
        }();
        var toStr = Object.prototype.toString;
        var toLowerCase = String.prototype.toLowerCase;
        function isString(value) {
          return toStr.call(value) === "[object String]";
        }
        function isFunction(value) {
          return typeof value === "function";
        }
        function stringify(value) {
          value = toValue(value);
          return isNil(value) ? "" : String(value);
        }
        function toValue(value) {
          return value instanceof Drop ? value.valueOf() : value;
        }
        function isNumber(value) {
          return typeof value === "number";
        }
        function toLiquid(value) {
          if (value && isFunction(value.toLiquid))
            return toLiquid(value.toLiquid());
          return value;
        }
        function isNil(value) {
          return value === null || value === void 0;
        }
        function isArray(value) {
          return toStr.call(value) === "[object Array]";
        }
        function forOwn(object, iteratee) {
          object = object || {};
          for (var k in object) {
            if (object.hasOwnProperty(k)) {
              if (iteratee(object[k], k, object) === false)
                break;
            }
          }
          return object;
        }
        function last(arr) {
          return arr[arr.length - 1];
        }
        function isObject(value) {
          var type = typeof value;
          return value !== null && (type === "object" || type === "function");
        }
        function range(start, stop, step) {
          if (step === void 0) {
            step = 1;
          }
          var arr = [];
          for (var i = start; i < stop; i += step) {
            arr.push(i);
          }
          return arr;
        }
        function padStart(str, length, ch) {
          if (ch === void 0) {
            ch = " ";
          }
          return pad(str, length, ch, function(str2, ch2) {
            return ch2 + str2;
          });
        }
        function padEnd(str, length, ch) {
          if (ch === void 0) {
            ch = " ";
          }
          return pad(str, length, ch, function(str2, ch2) {
            return str2 + ch2;
          });
        }
        function pad(str, length, ch, add) {
          str = String(str);
          var n = length - str.length;
          while (n-- > 0)
            str = add(str, ch);
          return str;
        }
        function identify(val) {
          return val;
        }
        function snakeCase(str) {
          return str.replace(/(\w?)([A-Z])/g, function(_, a, b) {
            return (a ? a + "_" : "") + b.toLowerCase();
          });
        }
        function changeCase(str) {
          var hasLowerCase = __spread(str).some(function(ch) {
            return ch >= "a" && ch <= "z";
          });
          return hasLowerCase ? str.toUpperCase() : str.toLowerCase();
        }
        function ellipsis(str, N) {
          return str.length > N ? str.substr(0, N - 3) + "..." : str;
        }
        function caseInsensitiveCompare(a, b) {
          if (a == null && b == null)
            return 0;
          if (a == null)
            return 1;
          if (b == null)
            return -1;
          a = toLowerCase.call(a);
          b = toLowerCase.call(b);
          if (a < b)
            return -1;
          if (a > b)
            return 1;
          return 0;
        }
        var Node = function() {
          function Node2(key, value, next, prev) {
            this.key = key;
            this.value = value;
            this.next = next;
            this.prev = prev;
          }
          return Node2;
        }();
        var LRU = function() {
          function LRU2(limit, size2) {
            if (size2 === void 0) {
              size2 = 0;
            }
            this.limit = limit;
            this.size = size2;
            this.cache = {};
            this.head = new Node("HEAD", null, null, null);
            this.tail = new Node("TAIL", null, null, null);
            this.head.next = this.tail;
            this.tail.prev = this.head;
          }
          LRU2.prototype.write = function(key, value) {
            if (this.cache[key]) {
              this.cache[key].value = value;
            } else {
              var node = new Node(key, value, this.head.next, this.head);
              this.head.next.prev = node;
              this.head.next = node;
              this.cache[key] = node;
              this.size++;
              this.ensureLimit();
            }
          };
          LRU2.prototype.read = function(key) {
            if (!this.cache[key])
              return;
            var value = this.cache[key].value;
            this.remove(key);
            this.write(key, value);
            return value;
          };
          LRU2.prototype.remove = function(key) {
            var node = this.cache[key];
            node.prev.next = node.next;
            node.next.prev = node.prev;
            delete this.cache[key];
            this.size--;
          };
          LRU2.prototype.clear = function() {
            this.head.next = this.tail;
            this.tail.prev = this.head;
            this.size = 0;
            this.cache = {};
          };
          LRU2.prototype.ensureLimit = function() {
            if (this.size > this.limit)
              this.remove(this.tail.prev.key);
          };
          return LRU2;
        }();
        function domResolve(root, path) {
          var base = document.createElement("base");
          base.href = root;
          var head = document.getElementsByTagName("head")[0];
          head.insertBefore(base, head.firstChild);
          var a = document.createElement("a");
          a.href = path;
          var resolved = a.href;
          head.removeChild(base);
          return resolved;
        }
        function resolve(root, filepath, ext) {
          if (root.length && last(root) !== "/")
            root += "/";
          var url = domResolve(root, filepath);
          return url.replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/, function(str, origin, path) {
            var last2 = path.split("/").pop();
            if (/\.\w+$/.test(last2))
              return str;
            return origin + path + ext;
          });
        }
        function readFile(url) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, new Promise(function(resolve2, reject) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolve2(xhr.responseText);
                  } else {
                    reject(new Error(xhr.statusText));
                  }
                };
                xhr.onerror = function() {
                  reject(new Error("An error occurred whilst receiving the response."));
                };
                xhr.open("GET", url);
                xhr.send();
              })];
            });
          });
        }
        function readFileSync(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send();
          if (xhr.status < 200 || xhr.status >= 300) {
            throw new Error(xhr.statusText);
          }
          return xhr.responseText;
        }
        function exists(filepath) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, true];
            });
          });
        }
        function existsSync(filepath) {
          return true;
        }
        var fs = /* @__PURE__ */ Object.freeze({
          resolve,
          readFile,
          readFileSync,
          exists,
          existsSync
        });
        function isComparable(arg) {
          return arg && isFunction(arg.equals);
        }
        function isTruthy(val, ctx) {
          return !isFalsy(val, ctx);
        }
        function isFalsy(val, ctx) {
          if (ctx.opts.jsTruthy) {
            return !val;
          } else {
            return val === false || val === void 0 || val === null;
          }
        }
        var defaultOperators = {
          "==": function(l, r) {
            if (isComparable(l))
              return l.equals(r);
            if (isComparable(r))
              return r.equals(l);
            return l === r;
          },
          "!=": function(l, r) {
            if (isComparable(l))
              return !l.equals(r);
            if (isComparable(r))
              return !r.equals(l);
            return l !== r;
          },
          ">": function(l, r) {
            if (isComparable(l))
              return l.gt(r);
            if (isComparable(r))
              return r.lt(l);
            return l > r;
          },
          "<": function(l, r) {
            if (isComparable(l))
              return l.lt(r);
            if (isComparable(r))
              return r.gt(l);
            return l < r;
          },
          ">=": function(l, r) {
            if (isComparable(l))
              return l.geq(r);
            if (isComparable(r))
              return r.leq(l);
            return l >= r;
          },
          "<=": function(l, r) {
            if (isComparable(l))
              return l.leq(r);
            if (isComparable(r))
              return r.geq(l);
            return l <= r;
          },
          "contains": function(l, r) {
            return l && isFunction(l.indexOf) ? l.indexOf(r) > -1 : false;
          },
          "and": function(l, r, ctx) {
            return isTruthy(l, ctx) && isTruthy(r, ctx);
          },
          "or": function(l, r, ctx) {
            return isTruthy(l, ctx) || isTruthy(r, ctx);
          }
        };
        var TYPES = [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 4, 4, 4, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 8, 0, 0, 0, 0, 8, 0, 0, 0, 64, 0, 65, 0, 0, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 0, 0, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
        var IDENTIFIER = 1;
        var BLANK = 4;
        var QUOTE = 8;
        var INLINE_BLANK = 16;
        var NUMBER = 32;
        var SIGN = 64;
        TYPES[160] = TYPES[5760] = TYPES[6158] = TYPES[8192] = TYPES[8193] = TYPES[8194] = TYPES[8195] = TYPES[8196] = TYPES[8197] = TYPES[8198] = TYPES[8199] = TYPES[8200] = TYPES[8201] = TYPES[8202] = TYPES[8232] = TYPES[8233] = TYPES[8239] = TYPES[8287] = TYPES[12288] = BLANK;
        function createTrie(operators) {
          var e_1, _a;
          var trie = {};
          try {
            for (var _b = __values(Object.entries(operators)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var _d = __read(_c.value, 2), name_1 = _d[0], handler = _d[1];
              var node = trie;
              for (var i = 0; i < name_1.length; i++) {
                var c = name_1[i];
                node[c] = node[c] || {};
                if (i === name_1.length - 1 && TYPES[name_1.charCodeAt(i)] & IDENTIFIER) {
                  node[c].needBoundary = true;
                }
                node = node[c];
              }
              node.handler = handler;
              node.end = true;
            }
          } catch (e_1_1) {
            e_1 = {error: e_1_1};
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return))
                _a.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          return trie;
        }
        var defaultOptions = {
          root: ["."],
          cache: void 0,
          extname: "",
          fs,
          dynamicPartials: true,
          jsTruthy: false,
          trimTagRight: false,
          trimTagLeft: false,
          trimOutputRight: false,
          trimOutputLeft: false,
          greedy: true,
          tagDelimiterLeft: "{%",
          tagDelimiterRight: "%}",
          outputDelimiterLeft: "{{",
          outputDelimiterRight: "}}",
          preserveTimezones: false,
          strictFilters: false,
          strictVariables: false,
          lenientIf: false,
          globals: {},
          keepOutputType: false,
          operators: defaultOperators,
          operatorsTrie: createTrie(defaultOperators)
        };
        function normalize(options) {
          options = options || {};
          if (options.hasOwnProperty("root")) {
            options.root = normalizeStringArray(options.root);
          }
          if (options.hasOwnProperty("cache")) {
            var cache = void 0;
            if (typeof options.cache === "number")
              cache = options.cache > 0 ? new LRU(options.cache) : void 0;
            else if (typeof options.cache === "object")
              cache = options.cache;
            else
              cache = options.cache ? new LRU(1024) : void 0;
            options.cache = cache;
          }
          if (options.hasOwnProperty("operators")) {
            options.operatorsTrie = createTrie(options.operators);
          }
          return options;
        }
        function applyDefault(options) {
          return __assign({}, defaultOptions, options);
        }
        function normalizeStringArray(value) {
          if (isArray(value))
            return value;
          if (isString(value))
            return [value];
          return [];
        }
        var LiquidError = function(_super) {
          __extends(LiquidError2, _super);
          function LiquidError2(err, token) {
            var _this = _super.call(this, err.message) || this;
            _this.originalError = err;
            _this.token = token;
            _this.context = "";
            return _this;
          }
          LiquidError2.prototype.update = function() {
            var err = this.originalError;
            this.context = mkContext(this.token);
            this.message = mkMessage(err.message, this.token);
            this.stack = this.message + "\n" + this.context + "\n" + this.stack + "\nFrom " + err.stack;
          };
          return LiquidError2;
        }(Error);
        var TokenizationError = function(_super) {
          __extends(TokenizationError2, _super);
          function TokenizationError2(message, token) {
            var _this = _super.call(this, new Error(message), token) || this;
            _this.name = "TokenizationError";
            _super.prototype.update.call(_this);
            return _this;
          }
          return TokenizationError2;
        }(LiquidError);
        var ParseError = function(_super) {
          __extends(ParseError2, _super);
          function ParseError2(err, token) {
            var _this = _super.call(this, err, token) || this;
            _this.name = "ParseError";
            _this.message = err.message;
            _super.prototype.update.call(_this);
            return _this;
          }
          return ParseError2;
        }(LiquidError);
        var RenderError = function(_super) {
          __extends(RenderError2, _super);
          function RenderError2(err, tpl) {
            var _this = _super.call(this, err, tpl.token) || this;
            _this.name = "RenderError";
            _this.message = err.message;
            _super.prototype.update.call(_this);
            return _this;
          }
          RenderError2.is = function(obj) {
            return obj.name === "RenderError";
          };
          return RenderError2;
        }(LiquidError);
        var UndefinedVariableError = function(_super) {
          __extends(UndefinedVariableError2, _super);
          function UndefinedVariableError2(err, token) {
            var _this = _super.call(this, err, token) || this;
            _this.name = "UndefinedVariableError";
            _this.message = err.message;
            _super.prototype.update.call(_this);
            return _this;
          }
          return UndefinedVariableError2;
        }(LiquidError);
        var InternalUndefinedVariableError = function(_super) {
          __extends(InternalUndefinedVariableError2, _super);
          function InternalUndefinedVariableError2(variableName) {
            var _this = _super.call(this, "undefined variable: " + variableName) || this;
            _this.name = "InternalUndefinedVariableError";
            _this.variableName = variableName;
            return _this;
          }
          return InternalUndefinedVariableError2;
        }(Error);
        var AssertionError = function(_super) {
          __extends(AssertionError2, _super);
          function AssertionError2(message) {
            var _this = _super.call(this, message) || this;
            _this.name = "AssertionError";
            _this.message = message + "";
            return _this;
          }
          return AssertionError2;
        }(Error);
        function mkContext(token) {
          var _a = __read(token.getPosition(), 1), line = _a[0];
          var lines = token.input.split("\n");
          var begin = Math.max(line - 2, 1);
          var end = Math.min(line + 3, lines.length);
          var context = range(begin, end + 1).map(function(lineNumber) {
            var indicator = lineNumber === line ? ">> " : "   ";
            var num = padStart(String(lineNumber), String(end).length);
            var text2 = lines[lineNumber - 1];
            return "" + indicator + num + "| " + text2;
          }).join("\n");
          return context;
        }
        function mkMessage(msg, token) {
          if (token.file)
            msg += ", file:" + token.file;
          var _a = __read(token.getPosition(), 2), line = _a[0], col = _a[1];
          msg += ", line:" + line + ", col:" + col;
          return msg;
        }
        var Context = function() {
          function Context2(env, opts, sync) {
            if (env === void 0) {
              env = {};
            }
            if (opts === void 0) {
              opts = defaultOptions;
            }
            if (sync === void 0) {
              sync = false;
            }
            this.scopes = [{}];
            this.registers = {};
            this.sync = sync;
            this.opts = opts;
            this.globals = opts.globals;
            this.environments = env;
          }
          Context2.prototype.getRegister = function(key, defaultValue) {
            if (defaultValue === void 0) {
              defaultValue = {};
            }
            return this.registers[key] = this.registers[key] || defaultValue;
          };
          Context2.prototype.setRegister = function(key, value) {
            return this.registers[key] = value;
          };
          Context2.prototype.saveRegister = function() {
            var _this = this;
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              keys[_i] = arguments[_i];
            }
            return keys.map(function(key) {
              return [key, _this.getRegister(key)];
            });
          };
          Context2.prototype.restoreRegister = function(keyValues) {
            var _this = this;
            return keyValues.forEach(function(_a) {
              var _b = __read(_a, 2), key = _b[0], value = _b[1];
              return _this.setRegister(key, value);
            });
          };
          Context2.prototype.getAll = function() {
            return __spread([this.globals, this.environments], this.scopes).reduce(function(ctx, val) {
              return __assign(ctx, val);
            }, {});
          };
          Context2.prototype.get = function(paths) {
            var scope = this.findScope(paths[0]);
            return this.getFromScope(scope, paths);
          };
          Context2.prototype.getFromScope = function(scope, paths) {
            var _this = this;
            if (typeof paths === "string")
              paths = paths.split(".");
            return paths.reduce(function(scope2, path) {
              scope2 = readProperty(scope2, path);
              if (isNil(scope2) && _this.opts.strictVariables) {
                throw new InternalUndefinedVariableError(path);
              }
              return scope2;
            }, scope);
          };
          Context2.prototype.push = function(ctx) {
            return this.scopes.push(ctx);
          };
          Context2.prototype.pop = function() {
            return this.scopes.pop();
          };
          Context2.prototype.bottom = function() {
            return this.scopes[0];
          };
          Context2.prototype.findScope = function(key) {
            for (var i = this.scopes.length - 1; i >= 0; i--) {
              var candidate = this.scopes[i];
              if (key in candidate)
                return candidate;
            }
            if (key in this.environments)
              return this.environments;
            return this.globals;
          };
          return Context2;
        }();
        function readProperty(obj, key) {
          if (isNil(obj))
            return obj;
          obj = toLiquid(obj);
          if (isFunction(obj[key]))
            return obj[key]();
          if (obj instanceof Drop) {
            if (obj.hasOwnProperty(key))
              return obj[key];
            return obj.liquidMethodMissing(key);
          }
          if (key === "size")
            return readSize(obj);
          if (key === "first")
            return readFirst(obj);
          if (key === "last")
            return readLast(obj);
          return obj[key];
        }
        function readFirst(obj) {
          if (isArray(obj))
            return obj[0];
          return obj["first"];
        }
        function readLast(obj) {
          if (isArray(obj))
            return obj[obj.length - 1];
          return obj["last"];
        }
        function readSize(obj) {
          if (isArray(obj) || isString(obj))
            return obj.length;
          return obj["size"];
        }
        (function(TokenKind) {
          TokenKind[TokenKind["Number"] = 1] = "Number";
          TokenKind[TokenKind["Literal"] = 2] = "Literal";
          TokenKind[TokenKind["Tag"] = 4] = "Tag";
          TokenKind[TokenKind["Output"] = 8] = "Output";
          TokenKind[TokenKind["HTML"] = 16] = "HTML";
          TokenKind[TokenKind["Filter"] = 32] = "Filter";
          TokenKind[TokenKind["Hash"] = 64] = "Hash";
          TokenKind[TokenKind["PropertyAccess"] = 128] = "PropertyAccess";
          TokenKind[TokenKind["Word"] = 256] = "Word";
          TokenKind[TokenKind["Range"] = 512] = "Range";
          TokenKind[TokenKind["Quoted"] = 1024] = "Quoted";
          TokenKind[TokenKind["Operator"] = 2048] = "Operator";
          TokenKind[TokenKind["Delimited"] = 12] = "Delimited";
        })(exports2.TokenKind || (exports2.TokenKind = {}));
        function isDelimitedToken(val) {
          return !!(getKind(val) & exports2.TokenKind.Delimited);
        }
        function isOperatorToken(val) {
          return getKind(val) === exports2.TokenKind.Operator;
        }
        function isHTMLToken(val) {
          return getKind(val) === exports2.TokenKind.HTML;
        }
        function isOutputToken(val) {
          return getKind(val) === exports2.TokenKind.Output;
        }
        function isTagToken(val) {
          return getKind(val) === exports2.TokenKind.Tag;
        }
        function isQuotedToken(val) {
          return getKind(val) === exports2.TokenKind.Quoted;
        }
        function isLiteralToken(val) {
          return getKind(val) === exports2.TokenKind.Literal;
        }
        function isNumberToken(val) {
          return getKind(val) === exports2.TokenKind.Number;
        }
        function isPropertyAccessToken(val) {
          return getKind(val) === exports2.TokenKind.PropertyAccess;
        }
        function isWordToken(val) {
          return getKind(val) === exports2.TokenKind.Word;
        }
        function isRangeToken(val) {
          return getKind(val) === exports2.TokenKind.Range;
        }
        function getKind(val) {
          return val ? val.kind : -1;
        }
        var typeGuards = /* @__PURE__ */ Object.freeze({
          isDelimitedToken,
          isOperatorToken,
          isHTMLToken,
          isOutputToken,
          isTagToken,
          isQuotedToken,
          isLiteralToken,
          isNumberToken,
          isPropertyAccessToken,
          isWordToken,
          isRangeToken
        });
        function whiteSpaceCtrl(tokens, options) {
          var inRaw = false;
          for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (!isDelimitedToken(token))
              continue;
            if (!inRaw && token.trimLeft) {
              trimLeft(tokens[i - 1], options.greedy);
            }
            if (isTagToken(token)) {
              if (token.name === "raw")
                inRaw = true;
              else if (token.name === "endraw")
                inRaw = false;
            }
            if (!inRaw && token.trimRight) {
              trimRight(tokens[i + 1], options.greedy);
            }
          }
        }
        function trimLeft(token, greedy) {
          if (!token || !isHTMLToken(token))
            return;
          var mask = greedy ? BLANK : INLINE_BLANK;
          while (TYPES[token.input.charCodeAt(token.end - 1 - token.trimRight)] & mask)
            token.trimRight++;
        }
        function trimRight(token, greedy) {
          if (!token || !isHTMLToken(token))
            return;
          var mask = greedy ? BLANK : INLINE_BLANK;
          while (TYPES[token.input.charCodeAt(token.begin + token.trimLeft)] & mask)
            token.trimLeft++;
          if (token.input.charAt(token.begin + token.trimLeft) === "\n")
            token.trimLeft++;
        }
        var Token = function() {
          function Token2(kind, input, begin, end, file) {
            this.kind = kind;
            this.input = input;
            this.begin = begin;
            this.end = end;
            this.file = file;
          }
          Token2.prototype.getText = function() {
            return this.input.slice(this.begin, this.end);
          };
          Token2.prototype.getPosition = function() {
            var _a = __read([1, 1], 2), row = _a[0], col = _a[1];
            for (var i = 0; i < this.begin; i++) {
              if (this.input[i] === "\n") {
                row++;
                col = 1;
              } else
                col++;
            }
            return [row, col];
          };
          Token2.prototype.size = function() {
            return this.end - this.begin;
          };
          return Token2;
        }();
        var NumberToken = function(_super) {
          __extends(NumberToken2, _super);
          function NumberToken2(whole, decimal) {
            var _this = _super.call(this, exports2.TokenKind.Number, whole.input, whole.begin, decimal ? decimal.end : whole.end, whole.file) || this;
            _this.whole = whole;
            _this.decimal = decimal;
            return _this;
          }
          return NumberToken2;
        }(Token);
        var IdentifierToken = function(_super) {
          __extends(IdentifierToken2, _super);
          function IdentifierToken2(input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.Word, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.file = file;
            _this.content = _this.getText();
            return _this;
          }
          IdentifierToken2.prototype.isNumber = function(allowSign) {
            if (allowSign === void 0) {
              allowSign = false;
            }
            var begin = allowSign && TYPES[this.input.charCodeAt(this.begin)] & SIGN ? this.begin + 1 : this.begin;
            for (var i = begin; i < this.end; i++) {
              if (!(TYPES[this.input.charCodeAt(i)] & NUMBER))
                return false;
            }
            return true;
          };
          return IdentifierToken2;
        }(Token);
        var NullDrop = function(_super) {
          __extends(NullDrop2, _super);
          function NullDrop2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          NullDrop2.prototype.equals = function(value) {
            return isNil(toValue(value));
          };
          NullDrop2.prototype.gt = function() {
            return false;
          };
          NullDrop2.prototype.geq = function() {
            return false;
          };
          NullDrop2.prototype.lt = function() {
            return false;
          };
          NullDrop2.prototype.leq = function() {
            return false;
          };
          NullDrop2.prototype.valueOf = function() {
            return null;
          };
          return NullDrop2;
        }(Drop);
        var EmptyDrop = function(_super) {
          __extends(EmptyDrop2, _super);
          function EmptyDrop2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          EmptyDrop2.prototype.equals = function(value) {
            if (value instanceof EmptyDrop2)
              return false;
            value = toValue(value);
            if (isString(value) || isArray(value))
              return value.length === 0;
            if (isObject(value))
              return Object.keys(value).length === 0;
            return false;
          };
          EmptyDrop2.prototype.gt = function() {
            return false;
          };
          EmptyDrop2.prototype.geq = function() {
            return false;
          };
          EmptyDrop2.prototype.lt = function() {
            return false;
          };
          EmptyDrop2.prototype.leq = function() {
            return false;
          };
          EmptyDrop2.prototype.valueOf = function() {
            return "";
          };
          return EmptyDrop2;
        }(Drop);
        var BlankDrop = function(_super) {
          __extends(BlankDrop2, _super);
          function BlankDrop2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          BlankDrop2.prototype.equals = function(value) {
            if (value === false)
              return true;
            if (isNil(toValue(value)))
              return true;
            if (isString(value))
              return /^\s*$/.test(value);
            return _super.prototype.equals.call(this, value);
          };
          return BlankDrop2;
        }(EmptyDrop);
        var nil = new NullDrop();
        var literalValues = {
          "true": true,
          "false": false,
          "nil": nil,
          "null": nil,
          "empty": new EmptyDrop(),
          "blank": new BlankDrop()
        };
        var LiteralToken = function(_super) {
          __extends(LiteralToken2, _super);
          function LiteralToken2(input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.Literal, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.file = file;
            _this.literal = _this.getText();
            return _this;
          }
          return LiteralToken2;
        }(Token);
        var precedence = {
          "==": 1,
          "!=": 1,
          ">": 1,
          "<": 1,
          ">=": 1,
          "<=": 1,
          "contains": 1,
          "and": 0,
          "or": 0
        };
        var OperatorToken = function(_super) {
          __extends(OperatorToken2, _super);
          function OperatorToken2(input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.Operator, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.file = file;
            _this.operator = _this.getText();
            return _this;
          }
          OperatorToken2.prototype.getPrecedence = function() {
            var key = this.getText();
            return key in precedence ? precedence[key] : 1;
          };
          return OperatorToken2;
        }(Token);
        var rHex = /[\da-fA-F]/;
        var rOct = /[0-7]/;
        var escapeChar = {
          b: "\b",
          f: "\f",
          n: "\n",
          r: "\r",
          t: "	",
          v: "\v"
        };
        function hexVal(c) {
          var code = c.charCodeAt(0);
          if (code >= 97)
            return code - 87;
          if (code >= 65)
            return code - 55;
          return code - 48;
        }
        function parseStringLiteral(str) {
          var ret = "";
          for (var i = 1; i < str.length - 1; i++) {
            if (str[i] !== "\\") {
              ret += str[i];
              continue;
            }
            if (escapeChar[str[i + 1]] !== void 0) {
              ret += escapeChar[str[++i]];
            } else if (str[i + 1] === "u") {
              var val = 0;
              var j = i + 2;
              while (j <= i + 5 && rHex.test(str[j])) {
                val = val * 16 + hexVal(str[j++]);
              }
              i = j - 1;
              ret += String.fromCharCode(val);
            } else if (!rOct.test(str[i + 1])) {
              ret += str[++i];
            } else {
              var j = i + 1;
              var val = 0;
              while (j <= i + 3 && rOct.test(str[j])) {
                val = val * 8 + hexVal(str[j++]);
              }
              i = j - 1;
              ret += String.fromCharCode(val);
            }
          }
          return ret;
        }
        var PropertyAccessToken = function(_super) {
          __extends(PropertyAccessToken2, _super);
          function PropertyAccessToken2(variable, props, end) {
            var _this = _super.call(this, exports2.TokenKind.PropertyAccess, variable.input, variable.begin, end, variable.file) || this;
            _this.variable = variable;
            _this.props = props;
            return _this;
          }
          PropertyAccessToken2.prototype.getVariableAsText = function() {
            if (this.variable instanceof IdentifierToken) {
              return this.variable.getText();
            } else {
              return parseStringLiteral(this.variable.getText());
            }
          };
          return PropertyAccessToken2;
        }(Token);
        function assert(predicate, message) {
          if (!predicate) {
            var msg = message ? message() : "expect " + predicate + " to be true";
            throw new AssertionError(msg);
          }
        }
        var FilterToken = function(_super) {
          __extends(FilterToken2, _super);
          function FilterToken2(name, args, input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.Filter, input, begin, end, file) || this;
            _this.name = name;
            _this.args = args;
            return _this;
          }
          return FilterToken2;
        }(Token);
        var HashToken = function(_super) {
          __extends(HashToken2, _super);
          function HashToken2(input, begin, end, name, value, file) {
            var _this = _super.call(this, exports2.TokenKind.Hash, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.name = name;
            _this.value = value;
            _this.file = file;
            return _this;
          }
          return HashToken2;
        }(Token);
        var QuotedToken = function(_super) {
          __extends(QuotedToken2, _super);
          function QuotedToken2(input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.Quoted, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.file = file;
            return _this;
          }
          return QuotedToken2;
        }(Token);
        var HTMLToken = function(_super) {
          __extends(HTMLToken2, _super);
          function HTMLToken2(input, begin, end, file) {
            var _this = _super.call(this, exports2.TokenKind.HTML, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.file = file;
            _this.trimLeft = 0;
            _this.trimRight = 0;
            return _this;
          }
          HTMLToken2.prototype.getContent = function() {
            return this.input.slice(this.begin + this.trimLeft, this.end - this.trimRight);
          };
          return HTMLToken2;
        }(Token);
        var DelimitedToken = function(_super) {
          __extends(DelimitedToken2, _super);
          function DelimitedToken2(kind, content, input, begin, end, trimLeft2, trimRight2, file) {
            var _this = _super.call(this, kind, input, begin, end, file) || this;
            _this.trimLeft = false;
            _this.trimRight = false;
            _this.content = _this.getText();
            var tl = content[0] === "-";
            var tr = last(content) === "-";
            _this.content = content.slice(tl ? 1 : 0, tr ? -1 : content.length).trim();
            _this.trimLeft = tl || trimLeft2;
            _this.trimRight = tr || trimRight2;
            return _this;
          }
          return DelimitedToken2;
        }(Token);
        var TagToken = function(_super) {
          __extends(TagToken2, _super);
          function TagToken2(input, begin, end, options, file) {
            var _this = this;
            var trimTagLeft = options.trimTagLeft, trimTagRight = options.trimTagRight, tagDelimiterLeft = options.tagDelimiterLeft, tagDelimiterRight = options.tagDelimiterRight;
            var value = input.slice(begin + tagDelimiterLeft.length, end - tagDelimiterRight.length);
            _this = _super.call(this, exports2.TokenKind.Tag, value, input, begin, end, trimTagLeft, trimTagRight, file) || this;
            var tokenizer = new Tokenizer(_this.content, options.operatorsTrie);
            _this.name = tokenizer.readIdentifier().getText();
            if (!_this.name)
              throw new TokenizationError("illegal tag syntax", _this);
            tokenizer.skipBlank();
            _this.args = tokenizer.remaining();
            return _this;
          }
          return TagToken2;
        }(DelimitedToken);
        var RangeToken = function(_super) {
          __extends(RangeToken2, _super);
          function RangeToken2(input, begin, end, lhs, rhs, file) {
            var _this = _super.call(this, exports2.TokenKind.Range, input, begin, end, file) || this;
            _this.input = input;
            _this.begin = begin;
            _this.end = end;
            _this.lhs = lhs;
            _this.rhs = rhs;
            _this.file = file;
            return _this;
          }
          return RangeToken2;
        }(Token);
        var OutputToken = function(_super) {
          __extends(OutputToken2, _super);
          function OutputToken2(input, begin, end, options, file) {
            var _this = this;
            var trimOutputLeft = options.trimOutputLeft, trimOutputRight = options.trimOutputRight, outputDelimiterLeft = options.outputDelimiterLeft, outputDelimiterRight = options.outputDelimiterRight;
            var value = input.slice(begin + outputDelimiterLeft.length, end - outputDelimiterRight.length);
            _this = _super.call(this, exports2.TokenKind.Output, value, input, begin, end, trimOutputLeft, trimOutputRight, file) || this;
            return _this;
          }
          return OutputToken2;
        }(DelimitedToken);
        function matchOperator(str, begin, trie, end) {
          if (end === void 0) {
            end = str.length;
          }
          var node = trie;
          var i = begin;
          var info;
          while (node[str[i]] && i < end) {
            node = node[str[i++]];
            if (node["end"])
              info = node;
          }
          if (!info)
            return -1;
          if (info["needBoundary"] && TYPES[str.charCodeAt(i)] & IDENTIFIER)
            return -1;
          return i;
        }
        var Expression = function() {
          function Expression2(tokens) {
            this.postfix = __spread(toPostfix(tokens));
          }
          Expression2.prototype.evaluate = function(ctx, lenient) {
            var operands, _a, _b, token, r, l, result, _c, _d, e_1_1;
            var e_1, _e;
            return __generator(this, function(_f) {
              switch (_f.label) {
                case 0:
                  assert(ctx, function() {
                    return "unable to evaluate: context not defined";
                  });
                  operands = [];
                  _f.label = 1;
                case 1:
                  _f.trys.push([1, 9, 10, 11]);
                  _a = __values(this.postfix), _b = _a.next();
                  _f.label = 2;
                case 2:
                  if (!!_b.done)
                    return [3, 8];
                  token = _b.value;
                  if (!isOperatorToken(token))
                    return [3, 5];
                  return [4, operands.pop()];
                case 3:
                  r = _f.sent();
                  return [4, operands.pop()];
                case 4:
                  l = _f.sent();
                  result = evalOperatorToken(ctx.opts.operators, token, l, r, ctx);
                  operands.push(result);
                  return [3, 7];
                case 5:
                  _d = (_c = operands).push;
                  return [4, evalToken(token, ctx, lenient && this.postfix.length === 1)];
                case 6:
                  _d.apply(_c, [_f.sent()]);
                  _f.label = 7;
                case 7:
                  _b = _a.next();
                  return [3, 2];
                case 8:
                  return [3, 11];
                case 9:
                  e_1_1 = _f.sent();
                  e_1 = {error: e_1_1};
                  return [3, 11];
                case 10:
                  try {
                    if (_b && !_b.done && (_e = _a.return))
                      _e.call(_a);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 11:
                  return [2, operands[0]];
              }
            });
          };
          return Expression2;
        }();
        function evalToken(token, ctx, lenient) {
          if (lenient === void 0) {
            lenient = false;
          }
          if (isPropertyAccessToken(token))
            return evalPropertyAccessToken(token, ctx, lenient);
          if (isRangeToken(token))
            return evalRangeToken(token, ctx);
          if (isLiteralToken(token))
            return evalLiteralToken(token);
          if (isNumberToken(token))
            return evalNumberToken(token);
          if (isWordToken(token))
            return token.getText();
          if (isQuotedToken(token))
            return evalQuotedToken(token);
        }
        function evalPropertyAccessToken(token, ctx, lenient) {
          var variable = token.getVariableAsText();
          var props = token.props.map(function(prop) {
            return evalToken(prop, ctx, false);
          });
          try {
            return ctx.get(__spread([variable], props));
          } catch (e) {
            if (lenient && e.name === "InternalUndefinedVariableError")
              return null;
            throw new UndefinedVariableError(e, token);
          }
        }
        function evalNumberToken(token) {
          var str = token.whole.content + "." + (token.decimal ? token.decimal.content : "");
          return Number(str);
        }
        function evalQuotedToken(token) {
          return parseStringLiteral(token.getText());
        }
        function evalOperatorToken(operators, token, lhs, rhs, ctx) {
          var impl = operators[token.operator];
          return impl(lhs, rhs, ctx);
        }
        function evalLiteralToken(token) {
          return literalValues[token.literal];
        }
        function evalRangeToken(token, ctx) {
          var low = evalToken(token.lhs, ctx);
          var high = evalToken(token.rhs, ctx);
          return range(+low, +high + 1);
        }
        function toPostfix(tokens) {
          var ops, tokens_1, tokens_1_1, token, e_2_1;
          var e_2, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                ops = [];
                _b.label = 1;
              case 1:
                _b.trys.push([1, 10, 11, 12]);
                tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next();
                _b.label = 2;
              case 2:
                if (!!tokens_1_1.done)
                  return [3, 9];
                token = tokens_1_1.value;
                if (!isOperatorToken(token))
                  return [3, 6];
                _b.label = 3;
              case 3:
                if (!(ops.length && ops[ops.length - 1].getPrecedence() > token.getPrecedence()))
                  return [3, 5];
                return [4, ops.pop()];
              case 4:
                _b.sent();
                return [3, 3];
              case 5:
                ops.push(token);
                return [3, 8];
              case 6:
                return [4, token];
              case 7:
                _b.sent();
                _b.label = 8;
              case 8:
                tokens_1_1 = tokens_1.next();
                return [3, 2];
              case 9:
                return [3, 12];
              case 10:
                e_2_1 = _b.sent();
                e_2 = {error: e_2_1};
                return [3, 12];
              case 11:
                try {
                  if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return))
                    _a.call(tokens_1);
                } finally {
                  if (e_2)
                    throw e_2.error;
                }
                return [7];
              case 12:
                if (!ops.length)
                  return [3, 14];
                return [4, ops.pop()];
              case 13:
                _b.sent();
                return [3, 12];
              case 14:
                return [2];
            }
          });
        }
        var Tokenizer = function() {
          function Tokenizer2(input, trie, file) {
            if (file === void 0) {
              file = "";
            }
            this.input = input;
            this.trie = trie;
            this.file = file;
            this.p = 0;
            this.rawBeginAt = -1;
            this.N = input.length;
          }
          Tokenizer2.prototype.readExpression = function() {
            return new Expression(this.readExpressionTokens());
          };
          Tokenizer2.prototype.readExpressionTokens = function() {
            var operand, operator, operand_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  operand = this.readValue();
                  if (!operand)
                    return [2];
                  return [4, operand];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  if (!(this.p < this.N))
                    return [3, 5];
                  operator = this.readOperator();
                  if (!operator)
                    return [2];
                  operand_1 = this.readValue();
                  if (!operand_1)
                    return [2];
                  return [4, operator];
                case 3:
                  _a.sent();
                  return [4, operand_1];
                case 4:
                  _a.sent();
                  return [3, 2];
                case 5:
                  return [2];
              }
            });
          };
          Tokenizer2.prototype.readOperator = function() {
            this.skipBlank();
            var end = matchOperator(this.input, this.p, this.trie, this.p + 8);
            if (end === -1)
              return;
            return new OperatorToken(this.input, this.p, this.p = end, this.file);
          };
          Tokenizer2.prototype.readFilters = function() {
            var filters = [];
            while (true) {
              var filter = this.readFilter();
              if (!filter)
                return filters;
              filters.push(filter);
            }
          };
          Tokenizer2.prototype.readFilter = function() {
            var _this = this;
            this.skipBlank();
            if (this.end())
              return null;
            assert(this.peek() === "|", function() {
              return "unexpected token at " + _this.snapshot();
            });
            this.p++;
            var begin = this.p;
            var name = this.readIdentifier();
            if (!name.size())
              return null;
            var args = [];
            this.skipBlank();
            if (this.peek() === ":") {
              do {
                ++this.p;
                var arg = this.readFilterArg();
                arg && args.push(arg);
                while (this.p < this.N && this.peek() !== "," && this.peek() !== "|")
                  ++this.p;
              } while (this.peek() === ",");
            }
            return new FilterToken(name.getText(), args, this.input, begin, this.p, this.file);
          };
          Tokenizer2.prototype.readFilterArg = function() {
            var key = this.readValue();
            if (!key)
              return;
            this.skipBlank();
            if (this.peek() !== ":")
              return key;
            ++this.p;
            var value = this.readValue();
            return [key.getText(), value];
          };
          Tokenizer2.prototype.readTopLevelTokens = function(options) {
            if (options === void 0) {
              options = defaultOptions;
            }
            var tokens = [];
            while (this.p < this.N) {
              var token = this.readTopLevelToken(options);
              tokens.push(token);
            }
            whiteSpaceCtrl(tokens, options);
            return tokens;
          };
          Tokenizer2.prototype.readTopLevelToken = function(options) {
            var tagDelimiterLeft = options.tagDelimiterLeft, outputDelimiterLeft = options.outputDelimiterLeft;
            if (this.rawBeginAt > -1)
              return this.readEndrawOrRawContent(options);
            if (this.match(tagDelimiterLeft))
              return this.readTagToken(options);
            if (this.match(outputDelimiterLeft))
              return this.readOutputToken(options);
            return this.readHTMLToken(options);
          };
          Tokenizer2.prototype.readHTMLToken = function(options) {
            var begin = this.p;
            while (this.p < this.N) {
              var tagDelimiterLeft = options.tagDelimiterLeft, outputDelimiterLeft = options.outputDelimiterLeft;
              if (this.match(tagDelimiterLeft))
                break;
              if (this.match(outputDelimiterLeft))
                break;
              ++this.p;
            }
            return new HTMLToken(this.input, begin, this.p, this.file);
          };
          Tokenizer2.prototype.readTagToken = function(options) {
            if (options === void 0) {
              options = defaultOptions;
            }
            var _a = this, file = _a.file, input = _a.input;
            var begin = this.p;
            if (this.readToDelimiter(options.tagDelimiterRight) === -1) {
              throw this.mkError("tag " + this.snapshot(begin) + " not closed", begin);
            }
            var token = new TagToken(input, begin, this.p, options, file);
            if (token.name === "raw")
              this.rawBeginAt = begin;
            return token;
          };
          Tokenizer2.prototype.readToDelimiter = function(delimiter) {
            while (this.p < this.N) {
              if (this.peekType() & QUOTE) {
                this.readQuoted();
                continue;
              }
              ++this.p;
              if (this.rmatch(delimiter))
                return this.p;
            }
            return -1;
          };
          Tokenizer2.prototype.readOutputToken = function(options) {
            if (options === void 0) {
              options = defaultOptions;
            }
            var _a = this, file = _a.file, input = _a.input;
            var outputDelimiterRight = options.outputDelimiterRight;
            var begin = this.p;
            if (this.readToDelimiter(outputDelimiterRight) === -1) {
              throw this.mkError("output " + this.snapshot(begin) + " not closed", begin);
            }
            return new OutputToken(input, begin, this.p, options, file);
          };
          Tokenizer2.prototype.readEndrawOrRawContent = function(options) {
            var tagDelimiterLeft = options.tagDelimiterLeft, tagDelimiterRight = options.tagDelimiterRight;
            var begin = this.p;
            var leftPos = this.readTo(tagDelimiterLeft) - tagDelimiterLeft.length;
            while (this.p < this.N) {
              if (this.readIdentifier().getText() !== "endraw") {
                leftPos = this.readTo(tagDelimiterLeft) - tagDelimiterLeft.length;
                continue;
              }
              while (this.p <= this.N) {
                if (this.rmatch(tagDelimiterRight)) {
                  var end = this.p;
                  if (begin === leftPos) {
                    this.rawBeginAt = -1;
                    return new TagToken(this.input, begin, end, options, this.file);
                  } else {
                    this.p = leftPos;
                    return new HTMLToken(this.input, begin, leftPos, this.file);
                  }
                }
                if (this.rmatch(tagDelimiterLeft))
                  break;
                this.p++;
              }
            }
            throw this.mkError("raw " + this.snapshot(this.rawBeginAt) + " not closed", begin);
          };
          Tokenizer2.prototype.mkError = function(msg, begin) {
            return new TokenizationError(msg, new IdentifierToken(this.input, begin, this.N, this.file));
          };
          Tokenizer2.prototype.snapshot = function(begin) {
            if (begin === void 0) {
              begin = this.p;
            }
            return JSON.stringify(ellipsis(this.input.slice(begin), 16));
          };
          Tokenizer2.prototype.readWord = function() {
            console.warn("Tokenizer#readWord() will be removed, use #readIdentifier instead");
            return this.readIdentifier();
          };
          Tokenizer2.prototype.readIdentifier = function() {
            this.skipBlank();
            var begin = this.p;
            while (this.peekType() & IDENTIFIER)
              ++this.p;
            return new IdentifierToken(this.input, begin, this.p, this.file);
          };
          Tokenizer2.prototype.readHashes = function() {
            var hashes = [];
            while (true) {
              var hash = this.readHash();
              if (!hash)
                return hashes;
              hashes.push(hash);
            }
          };
          Tokenizer2.prototype.readHash = function() {
            this.skipBlank();
            if (this.peek() === ",")
              ++this.p;
            var begin = this.p;
            var name = this.readIdentifier();
            if (!name.size())
              return;
            var value;
            this.skipBlank();
            if (this.peek() === ":") {
              ++this.p;
              value = this.readValue();
            }
            return new HashToken(this.input, begin, this.p, name, value, this.file);
          };
          Tokenizer2.prototype.remaining = function() {
            return this.input.slice(this.p);
          };
          Tokenizer2.prototype.advance = function(i) {
            if (i === void 0) {
              i = 1;
            }
            this.p += i;
          };
          Tokenizer2.prototype.end = function() {
            return this.p >= this.N;
          };
          Tokenizer2.prototype.readTo = function(end) {
            while (this.p < this.N) {
              ++this.p;
              if (this.rmatch(end))
                return this.p;
            }
            return -1;
          };
          Tokenizer2.prototype.readValue = function() {
            var value = this.readQuoted() || this.readRange();
            if (value)
              return value;
            if (this.peek() === "[") {
              this.p++;
              var prop = this.readQuoted();
              if (!prop)
                return;
              if (this.peek() !== "]")
                return;
              this.p++;
              return new PropertyAccessToken(prop, [], this.p);
            }
            var variable = this.readIdentifier();
            if (!variable.size())
              return;
            var isNumber2 = variable.isNumber(true);
            var props = [];
            while (true) {
              if (this.peek() === "[") {
                isNumber2 = false;
                this.p++;
                var prop = this.readValue() || new IdentifierToken(this.input, this.p, this.p, this.file);
                this.readTo("]");
                props.push(prop);
              } else if (this.peek() === "." && this.peek(1) !== ".") {
                this.p++;
                var prop = this.readIdentifier();
                if (!prop.size())
                  break;
                if (!prop.isNumber())
                  isNumber2 = false;
                props.push(prop);
              } else
                break;
            }
            if (!props.length && literalValues.hasOwnProperty(variable.content)) {
              return new LiteralToken(this.input, variable.begin, variable.end, this.file);
            }
            if (isNumber2)
              return new NumberToken(variable, props[0]);
            return new PropertyAccessToken(variable, props, this.p);
          };
          Tokenizer2.prototype.readRange = function() {
            this.skipBlank();
            var begin = this.p;
            if (this.peek() !== "(")
              return;
            ++this.p;
            var lhs = this.readValueOrThrow();
            this.p += 2;
            var rhs = this.readValueOrThrow();
            ++this.p;
            return new RangeToken(this.input, begin, this.p, lhs, rhs, this.file);
          };
          Tokenizer2.prototype.readValueOrThrow = function() {
            var _this = this;
            var value = this.readValue();
            assert(value, function() {
              return "unexpected token " + _this.snapshot() + ", value expected";
            });
            return value;
          };
          Tokenizer2.prototype.readQuoted = function() {
            this.skipBlank();
            var begin = this.p;
            if (!(this.peekType() & QUOTE))
              return;
            ++this.p;
            var escaped = false;
            while (this.p < this.N) {
              ++this.p;
              if (this.input[this.p - 1] === this.input[begin] && !escaped)
                break;
              if (escaped)
                escaped = false;
              else if (this.input[this.p - 1] === "\\")
                escaped = true;
            }
            return new QuotedToken(this.input, begin, this.p, this.file);
          };
          Tokenizer2.prototype.readFileName = function() {
            var begin = this.p;
            while (!(this.peekType() & BLANK) && this.peek() !== "," && this.p < this.N)
              this.p++;
            return new IdentifierToken(this.input, begin, this.p, this.file);
          };
          Tokenizer2.prototype.match = function(word) {
            for (var i = 0; i < word.length; i++) {
              if (word[i] !== this.input[this.p + i])
                return false;
            }
            return true;
          };
          Tokenizer2.prototype.rmatch = function(pattern) {
            for (var i = 0; i < pattern.length; i++) {
              if (pattern[pattern.length - 1 - i] !== this.input[this.p - 1 - i])
                return false;
            }
            return true;
          };
          Tokenizer2.prototype.peekType = function(n) {
            if (n === void 0) {
              n = 0;
            }
            return TYPES[this.input.charCodeAt(this.p + n)];
          };
          Tokenizer2.prototype.peek = function(n) {
            if (n === void 0) {
              n = 0;
            }
            return this.input[this.p + n];
          };
          Tokenizer2.prototype.skipBlank = function() {
            while (this.peekType() & BLANK)
              ++this.p;
          };
          return Tokenizer2;
        }();
        var Emitter = function() {
          function Emitter2(keepOutputType) {
            this.html = "";
            this.break = false;
            this.continue = false;
            this.keepOutputType = false;
            this.keepOutputType = keepOutputType;
          }
          Emitter2.prototype.write = function(html) {
            if (this.keepOutputType === true) {
              html = toValue(html);
            } else {
              html = stringify(toValue(html));
            }
            if (this.keepOutputType === true && typeof html !== "string" && this.html === "") {
              this.html = html;
            } else {
              this.html = stringify(this.html) + stringify(html);
            }
          };
          return Emitter2;
        }();
        var Render = function() {
          function Render2() {
          }
          Render2.prototype.renderTemplates = function(templates, ctx, emitter) {
            var templates_1, templates_1_1, tpl, html, e_1, err, e_2_1;
            var e_2, _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  if (!emitter) {
                    emitter = new Emitter(ctx.opts.keepOutputType);
                  }
                  _b.label = 1;
                case 1:
                  _b.trys.push([1, 8, 9, 10]);
                  templates_1 = __values(templates), templates_1_1 = templates_1.next();
                  _b.label = 2;
                case 2:
                  if (!!templates_1_1.done)
                    return [3, 7];
                  tpl = templates_1_1.value;
                  _b.label = 3;
                case 3:
                  _b.trys.push([3, 5, , 6]);
                  return [4, tpl.render(ctx, emitter)];
                case 4:
                  html = _b.sent();
                  html && emitter.write(html);
                  if (emitter.break || emitter.continue)
                    return [3, 7];
                  return [3, 6];
                case 5:
                  e_1 = _b.sent();
                  err = RenderError.is(e_1) ? e_1 : new RenderError(e_1, tpl);
                  throw err;
                case 6:
                  templates_1_1 = templates_1.next();
                  return [3, 2];
                case 7:
                  return [3, 10];
                case 8:
                  e_2_1 = _b.sent();
                  e_2 = {error: e_2_1};
                  return [3, 10];
                case 9:
                  try {
                    if (templates_1_1 && !templates_1_1.done && (_a = templates_1.return))
                      _a.call(templates_1);
                  } finally {
                    if (e_2)
                      throw e_2.error;
                  }
                  return [7];
                case 10:
                  return [2, emitter.html];
              }
            });
          };
          return Render2;
        }();
        var ParseStream = function() {
          function ParseStream2(tokens, parseToken) {
            this.handlers = {};
            this.stopRequested = false;
            this.tokens = tokens;
            this.parseToken = parseToken;
          }
          ParseStream2.prototype.on = function(name, cb) {
            this.handlers[name] = cb;
            return this;
          };
          ParseStream2.prototype.trigger = function(event, arg) {
            var h = this.handlers[event];
            return h ? (h(arg), true) : false;
          };
          ParseStream2.prototype.start = function() {
            this.trigger("start");
            var token;
            while (!this.stopRequested && (token = this.tokens.shift())) {
              if (this.trigger("token", token))
                continue;
              if (isTagToken(token) && this.trigger("tag:" + token.name, token)) {
                continue;
              }
              var template = this.parseToken(token, this.tokens);
              this.trigger("template", template);
            }
            if (!this.stopRequested)
              this.trigger("end");
            return this;
          };
          ParseStream2.prototype.stop = function() {
            this.stopRequested = true;
            return this;
          };
          return ParseStream2;
        }();
        var TemplateImpl = function() {
          function TemplateImpl2(token) {
            this.token = token;
          }
          return TemplateImpl2;
        }();
        var Hash = function() {
          function Hash2(markup) {
            var e_1, _a;
            this.hash = {};
            var tokenizer = new Tokenizer(markup, {});
            try {
              for (var _b = __values(tokenizer.readHashes()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var hash = _c.value;
                this.hash[hash.name.content] = hash.value;
              }
            } catch (e_1_1) {
              e_1 = {error: e_1_1};
            } finally {
              try {
                if (_c && !_c.done && (_a = _b.return))
                  _a.call(_b);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
          }
          Hash2.prototype.render = function(ctx) {
            var hash, _a, _b, key, _c, _d, e_2_1;
            var e_2, _e;
            return __generator(this, function(_f) {
              switch (_f.label) {
                case 0:
                  hash = {};
                  _f.label = 1;
                case 1:
                  _f.trys.push([1, 6, 7, 8]);
                  _a = __values(Object.keys(this.hash)), _b = _a.next();
                  _f.label = 2;
                case 2:
                  if (!!_b.done)
                    return [3, 5];
                  key = _b.value;
                  _c = hash;
                  _d = key;
                  return [4, evalToken(this.hash[key], ctx)];
                case 3:
                  _c[_d] = _f.sent();
                  _f.label = 4;
                case 4:
                  _b = _a.next();
                  return [3, 2];
                case 5:
                  return [3, 8];
                case 6:
                  e_2_1 = _f.sent();
                  e_2 = {error: e_2_1};
                  return [3, 8];
                case 7:
                  try {
                    if (_b && !_b.done && (_e = _a.return))
                      _e.call(_a);
                  } finally {
                    if (e_2)
                      throw e_2.error;
                  }
                  return [7];
                case 8:
                  return [2, hash];
              }
            });
          };
          return Hash2;
        }();
        function isKeyValuePair(arr) {
          return isArray(arr);
        }
        var Filter = function() {
          function Filter2(name, impl, args, liquid) {
            this.name = name;
            this.impl = impl || identify;
            this.args = args;
            this.liquid = liquid;
          }
          Filter2.prototype.render = function(value, context) {
            var e_1, _a;
            var argv = [];
            try {
              for (var _b = __values(this.args), _c = _b.next(); !_c.done; _c = _b.next()) {
                var arg = _c.value;
                if (isKeyValuePair(arg))
                  argv.push([arg[0], evalToken(arg[1], context)]);
                else
                  argv.push(evalToken(arg, context));
              }
            } catch (e_1_1) {
              e_1 = {error: e_1_1};
            } finally {
              try {
                if (_c && !_c.done && (_a = _b.return))
                  _a.call(_b);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
            return this.impl.apply({context, liquid: this.liquid}, __spread([value], argv));
          };
          return Filter2;
        }();
        var Value = function() {
          function Value2(str, liquid) {
            this.filters = [];
            var tokenizer = new Tokenizer(str, liquid.options.operatorsTrie);
            this.initial = tokenizer.readExpression();
            this.filters = tokenizer.readFilters().map(function(_a) {
              var name = _a.name, args = _a.args;
              return new Filter(name, liquid.filters.get(name), args, liquid);
            });
          }
          Value2.prototype.value = function(ctx, lenient) {
            var val, _a, _b, filter, e_1_1;
            var e_1, _c;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  lenient = lenient || ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === "default";
                  return [4, this.initial.evaluate(ctx, lenient)];
                case 1:
                  val = _d.sent();
                  _d.label = 2;
                case 2:
                  _d.trys.push([2, 7, 8, 9]);
                  _a = __values(this.filters), _b = _a.next();
                  _d.label = 3;
                case 3:
                  if (!!_b.done)
                    return [3, 6];
                  filter = _b.value;
                  return [4, filter.render(val, ctx)];
                case 4:
                  val = _d.sent();
                  _d.label = 5;
                case 5:
                  _b = _a.next();
                  return [3, 3];
                case 6:
                  return [3, 9];
                case 7:
                  e_1_1 = _d.sent();
                  e_1 = {error: e_1_1};
                  return [3, 9];
                case 8:
                  try {
                    if (_b && !_b.done && (_c = _a.return))
                      _c.call(_a);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 9:
                  return [2, val];
              }
            });
          };
          return Value2;
        }();
        function createResolvedThenable(value) {
          var ret = {
            then: function(resolve2) {
              return resolve2(value);
            },
            catch: function() {
              return ret;
            }
          };
          return ret;
        }
        function createRejectedThenable(err) {
          var ret = {
            then: function(resolve2, reject) {
              if (reject)
                return reject(err);
              return ret;
            },
            catch: function(reject) {
              return reject(err);
            }
          };
          return ret;
        }
        function isThenable(val) {
          return val && isFunction(val.then);
        }
        function isAsyncIterator(val) {
          return val && isFunction(val.next) && isFunction(val.throw) && isFunction(val.return);
        }
        function toThenable(val) {
          if (isThenable(val))
            return val;
          if (isAsyncIterator(val))
            return reduce();
          return createResolvedThenable(val);
          function reduce(prev) {
            var state;
            try {
              state = val.next(prev);
            } catch (err) {
              return createRejectedThenable(err);
            }
            if (state.done)
              return createResolvedThenable(state.value);
            return toThenable(state.value).then(reduce, function(err) {
              var state2;
              try {
                state2 = val.throw(err);
              } catch (e) {
                return createRejectedThenable(e);
              }
              if (state2.done)
                return createResolvedThenable(state2.value);
              return reduce(state2.value);
            });
          }
        }
        function toPromise(val) {
          return Promise.resolve(toThenable(val));
        }
        function toValue$1(val) {
          var ret;
          toThenable(val).then(function(x) {
            ret = x;
            return createResolvedThenable(ret);
          }).catch(function(err) {
            throw err;
          });
          return ret;
        }
        var Tag = function(_super) {
          __extends(Tag2, _super);
          function Tag2(token, tokens, liquid) {
            var _this = _super.call(this, token) || this;
            _this.name = token.name;
            var impl = liquid.tags.get(token.name);
            _this.impl = Object.create(impl);
            _this.impl.liquid = liquid;
            if (_this.impl.parse) {
              _this.impl.parse(token, tokens);
            }
            return _this;
          }
          Tag2.prototype.render = function(ctx, emitter) {
            var hash, impl;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, new Hash(this.token.args).render(ctx)];
                case 1:
                  hash = _a.sent();
                  impl = this.impl;
                  if (!isFunction(impl.render))
                    return [3, 3];
                  return [4, impl.render(ctx, emitter, hash)];
                case 2:
                  return [2, _a.sent()];
                case 3:
                  return [2];
              }
            });
          };
          return Tag2;
        }(TemplateImpl);
        var Output = function(_super) {
          __extends(Output2, _super);
          function Output2(token, liquid) {
            var _this = _super.call(this, token) || this;
            _this.value = new Value(token.content, liquid);
            return _this;
          }
          Output2.prototype.render = function(ctx, emitter) {
            var val;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.value.value(ctx, false)];
                case 1:
                  val = _a.sent();
                  emitter.write(val);
                  return [2];
              }
            });
          };
          return Output2;
        }(TemplateImpl);
        var HTML = function(_super) {
          __extends(HTML2, _super);
          function HTML2(token) {
            var _this = _super.call(this, token) || this;
            _this.str = token.getContent();
            return _this;
          }
          HTML2.prototype.render = function(ctx, emitter) {
            return __generator(this, function(_a) {
              emitter.write(this.str);
              return [2];
            });
          };
          return HTML2;
        }(TemplateImpl);
        var Parser = function() {
          function Parser2(liquid) {
            this.liquid = liquid;
          }
          Parser2.prototype.parse = function(tokens) {
            var token;
            var templates = [];
            while (token = tokens.shift()) {
              templates.push(this.parseToken(token, tokens));
            }
            return templates;
          };
          Parser2.prototype.parseToken = function(token, remainTokens) {
            try {
              if (isTagToken(token)) {
                return new Tag(token, remainTokens, this.liquid);
              }
              if (isOutputToken(token)) {
                return new Output(token, this.liquid);
              }
              return new HTML(token);
            } catch (e) {
              throw new ParseError(e, token);
            }
          };
          Parser2.prototype.parseStream = function(tokens) {
            var _this = this;
            return new ParseStream(tokens, function(token, tokens2) {
              return _this.parseToken(token, tokens2);
            });
          };
          return Parser2;
        }();
        var assign = {
          parse: function(token) {
            var tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            this.key = tokenizer.readIdentifier().content;
            tokenizer.skipBlank();
            assert(tokenizer.peek() === "=", function() {
              return "illegal token " + token.getText();
            });
            tokenizer.advance();
            this.value = tokenizer.remaining();
          },
          render: function(ctx) {
            var _a, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _a = ctx.bottom();
                  _b = this.key;
                  return [4, this.liquid._evalValue(this.value, ctx)];
                case 1:
                  _a[_b] = _c.sent();
                  return [2];
              }
            });
          }
        };
        function toEnumerable(val) {
          if (isArray(val))
            return val;
          if (isString(val) && val.length > 0)
            return [val];
          if (isObject(val))
            return Object.keys(val).map(function(key) {
              return [key, val[key]];
            });
          return [];
        }
        function toArray(val) {
          if (isArray(val))
            return val;
          return [val];
        }
        var ForloopDrop = function(_super) {
          __extends(ForloopDrop2, _super);
          function ForloopDrop2(length) {
            var _this = _super.call(this) || this;
            _this.i = 0;
            _this.length = length;
            return _this;
          }
          ForloopDrop2.prototype.next = function() {
            this.i++;
          };
          ForloopDrop2.prototype.index0 = function() {
            return this.i;
          };
          ForloopDrop2.prototype.index = function() {
            return this.i + 1;
          };
          ForloopDrop2.prototype.first = function() {
            return this.i === 0;
          };
          ForloopDrop2.prototype.last = function() {
            return this.i === this.length - 1;
          };
          ForloopDrop2.prototype.rindex = function() {
            return this.length - this.i;
          };
          ForloopDrop2.prototype.rindex0 = function() {
            return this.length - this.i - 1;
          };
          ForloopDrop2.prototype.valueOf = function() {
            return JSON.stringify(this);
          };
          return ForloopDrop2;
        }(Drop);
        var For = {
          type: "block",
          parse: function(token, remainTokens) {
            var _this = this;
            var toknenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            var variable = toknenizer.readIdentifier();
            var inStr = toknenizer.readIdentifier();
            var collection = toknenizer.readValue();
            assert(variable.size() && inStr.content === "in" && collection, function() {
              return "illegal tag: " + token.getText();
            });
            this.variable = variable.content;
            this.collection = collection;
            this.hash = new Hash(toknenizer.remaining());
            this.templates = [];
            this.elseTemplates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens).on("start", function() {
              return p = _this.templates;
            }).on("tag:else", function() {
              return p = _this.elseTemplates;
            }).on("tag:endfor", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return p.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + token.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var r, collection, _a, hash, offset, limit, scope, collection_1, collection_1_1, item, e_1_1;
            var e_1, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  r = this.liquid.renderer;
                  _a = toEnumerable;
                  return [4, evalToken(this.collection, ctx)];
                case 1:
                  collection = _a.apply(void 0, [_c.sent()]);
                  if (!!collection.length)
                    return [3, 3];
                  return [4, r.renderTemplates(this.elseTemplates, ctx, emitter)];
                case 2:
                  _c.sent();
                  return [2];
                case 3:
                  return [4, this.hash.render(ctx)];
                case 4:
                  hash = _c.sent();
                  offset = hash.offset || 0;
                  limit = hash.limit === void 0 ? collection.length : hash.limit;
                  collection = collection.slice(offset, offset + limit);
                  if ("reversed" in hash)
                    collection.reverse();
                  scope = {forloop: new ForloopDrop(collection.length)};
                  ctx.push(scope);
                  _c.label = 5;
                case 5:
                  _c.trys.push([5, 10, 11, 12]);
                  collection_1 = __values(collection), collection_1_1 = collection_1.next();
                  _c.label = 6;
                case 6:
                  if (!!collection_1_1.done)
                    return [3, 9];
                  item = collection_1_1.value;
                  scope[this.variable] = item;
                  return [4, r.renderTemplates(this.templates, ctx, emitter)];
                case 7:
                  _c.sent();
                  if (emitter.break) {
                    emitter.break = false;
                    return [3, 9];
                  }
                  emitter.continue = false;
                  scope.forloop.next();
                  _c.label = 8;
                case 8:
                  collection_1_1 = collection_1.next();
                  return [3, 6];
                case 9:
                  return [3, 12];
                case 10:
                  e_1_1 = _c.sent();
                  e_1 = {error: e_1_1};
                  return [3, 12];
                case 11:
                  try {
                    if (collection_1_1 && !collection_1_1.done && (_b = collection_1.return))
                      _b.call(collection_1);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 12:
                  ctx.pop();
                  return [2];
              }
            });
          }
        };
        var capture = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            var tokenizer = new Tokenizer(tagToken.args, this.liquid.options.operatorsTrie);
            this.variable = readVariableName(tokenizer);
            assert(this.variable, function() {
              return tagToken.args + " not valid identifier";
            });
            this.templates = [];
            var stream = this.liquid.parser.parseStream(remainTokens);
            stream.on("tag:endcapture", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return _this.templates.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx) {
            var r, html;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  r = this.liquid.renderer;
                  return [4, r.renderTemplates(this.templates, ctx)];
                case 1:
                  html = _a.sent();
                  ctx.bottom()[this.variable] = html;
                  return [2];
              }
            });
          }
        };
        function readVariableName(tokenizer) {
          var word = tokenizer.readIdentifier().content;
          if (word)
            return word;
          var quoted = tokenizer.readQuoted();
          if (quoted)
            return evalQuotedToken(quoted);
        }
        var Case = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            this.cond = new Value(tagToken.args, this.liquid);
            this.cases = [];
            this.elseTemplates = [];
            var p = [];
            var stream = this.liquid.parser.parseStream(remainTokens).on("tag:when", function(token) {
              p = [];
              var tokenizer = new Tokenizer(token.args, _this.liquid.options.operatorsTrie);
              while (!tokenizer.end()) {
                var value = tokenizer.readValue();
                if (value) {
                  _this.cases.push({
                    val: value,
                    templates: p
                  });
                }
                tokenizer.readTo(",");
              }
            }).on("tag:else", function() {
              return p = _this.elseTemplates;
            }).on("tag:endcase", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return p.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var r, cond, _a, _b, _c, branch, val, e_1_1;
            var e_1, _d;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  r = this.liquid.renderer;
                  _a = toValue;
                  return [4, this.cond.value(ctx, ctx.opts.lenientIf)];
                case 1:
                  cond = _a.apply(void 0, [_e.sent()]);
                  _e.label = 2;
                case 2:
                  _e.trys.push([2, 7, 8, 9]);
                  _b = __values(this.cases), _c = _b.next();
                  _e.label = 3;
                case 3:
                  if (!!_c.done)
                    return [3, 6];
                  branch = _c.value;
                  val = evalToken(branch.val, ctx, ctx.opts.lenientIf);
                  if (!(val === cond))
                    return [3, 5];
                  return [4, r.renderTemplates(branch.templates, ctx, emitter)];
                case 4:
                  _e.sent();
                  return [2];
                case 5:
                  _c = _b.next();
                  return [3, 3];
                case 6:
                  return [3, 9];
                case 7:
                  e_1_1 = _e.sent();
                  e_1 = {error: e_1_1};
                  return [3, 9];
                case 8:
                  try {
                    if (_c && !_c.done && (_d = _b.return))
                      _d.call(_b);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 9:
                  return [4, r.renderTemplates(this.elseTemplates, ctx, emitter)];
                case 10:
                  _e.sent();
                  return [2];
              }
            });
          }
        };
        var comment = {
          parse: function(tagToken, remainTokens) {
            var stream = this.liquid.parser.parseStream(remainTokens);
            stream.on("token", function(token) {
              if (token.name === "endcomment")
                stream.stop();
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          }
        };
        var BlockMode;
        (function(BlockMode2) {
          BlockMode2[BlockMode2["OUTPUT"] = 0] = "OUTPUT";
          BlockMode2[BlockMode2["STORE"] = 1] = "STORE";
        })(BlockMode || (BlockMode = {}));
        var BlockMode$1 = BlockMode;
        var include = {
          parse: function(token) {
            var args = token.args;
            var tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie);
            this.file = this.liquid.options.dynamicPartials ? tokenizer.readValue() : tokenizer.readFileName();
            assert(this.file, function() {
              return 'illegal argument "' + token.args + '"';
            });
            var begin = tokenizer.p;
            var withStr = tokenizer.readIdentifier();
            if (withStr.content === "with") {
              tokenizer.skipBlank();
              if (tokenizer.peek() !== ":") {
                this.withVar = tokenizer.readValue();
              } else
                tokenizer.p = begin;
            } else
              tokenizer.p = begin;
            this.hash = new Hash(tokenizer.remaining());
          },
          render: function(ctx, emitter) {
            var _a, liquid, hash, withVar, file, renderer, filepath, _b, _c, saved, scope, templates;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _a = this, liquid = _a.liquid, hash = _a.hash, withVar = _a.withVar, file = _a.file;
                  renderer = liquid.renderer;
                  if (!ctx.opts.dynamicPartials)
                    return [3, 5];
                  if (!isQuotedToken(file))
                    return [3, 2];
                  return [4, renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)];
                case 1:
                  _c = _d.sent();
                  return [3, 4];
                case 2:
                  return [4, evalToken(file, ctx)];
                case 3:
                  _c = _d.sent();
                  _d.label = 4;
                case 4:
                  _b = _c;
                  return [3, 6];
                case 5:
                  _b = file.getText();
                  _d.label = 6;
                case 6:
                  filepath = _b;
                  assert(filepath, function() {
                    return 'illegal filename "' + file.getText() + '":"' + filepath + '"';
                  });
                  saved = ctx.saveRegister("blocks", "blockMode");
                  ctx.setRegister("blocks", {});
                  ctx.setRegister("blockMode", BlockMode$1.OUTPUT);
                  return [4, hash.render(ctx)];
                case 7:
                  scope = _d.sent();
                  if (withVar)
                    scope[filepath] = evalToken(withVar, ctx);
                  return [4, liquid._parseFile(filepath, ctx.opts, ctx.sync)];
                case 8:
                  templates = _d.sent();
                  ctx.push(scope);
                  return [4, renderer.renderTemplates(templates, ctx, emitter)];
                case 9:
                  _d.sent();
                  ctx.pop();
                  ctx.restoreRegister(saved);
                  return [2];
              }
            });
          }
        };
        var render = {
          parse: function(token) {
            var args = token.args;
            var tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie);
            this.file = this.liquid.options.dynamicPartials ? tokenizer.readValue() : tokenizer.readFileName();
            assert(this.file, function() {
              return 'illegal argument "' + token.args + '"';
            });
            while (!tokenizer.end()) {
              tokenizer.skipBlank();
              var begin = tokenizer.p;
              var keyword = tokenizer.readIdentifier();
              if (keyword.content === "with" || keyword.content === "for") {
                tokenizer.skipBlank();
                if (tokenizer.peek() !== ":") {
                  var value = tokenizer.readValue();
                  if (value) {
                    var beforeAs = tokenizer.p;
                    var asStr = tokenizer.readIdentifier();
                    var alias = void 0;
                    if (asStr.content === "as")
                      alias = tokenizer.readIdentifier();
                    else
                      tokenizer.p = beforeAs;
                    this[keyword.content] = {value, alias: alias && alias.content};
                    tokenizer.skipBlank();
                    if (tokenizer.peek() === ",")
                      tokenizer.advance();
                    continue;
                  }
                }
              }
              tokenizer.p = begin;
              break;
            }
            this.hash = new Hash(tokenizer.remaining());
          },
          render: function(ctx, emitter) {
            var _a, liquid, file, hash, renderer, filepath, _b, _c, childCtx, scope, _d, value, alias, _e, value, alias, collection, collection_1, collection_1_1, item, templates, e_1_1, templates;
            var e_1, _f;
            return __generator(this, function(_g) {
              switch (_g.label) {
                case 0:
                  _a = this, liquid = _a.liquid, file = _a.file, hash = _a.hash;
                  renderer = liquid.renderer;
                  if (!ctx.opts.dynamicPartials)
                    return [3, 4];
                  if (!isQuotedToken(file))
                    return [3, 2];
                  return [4, renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)];
                case 1:
                  _c = _g.sent();
                  return [3, 3];
                case 2:
                  _c = evalToken(file, ctx);
                  _g.label = 3;
                case 3:
                  _b = _c;
                  return [3, 5];
                case 4:
                  _b = file.getText();
                  _g.label = 5;
                case 5:
                  filepath = _b;
                  assert(filepath, function() {
                    return 'illegal filename "' + file.getText() + '":"' + filepath + '"';
                  });
                  childCtx = new Context({}, ctx.opts, ctx.sync);
                  return [4, hash.render(ctx)];
                case 6:
                  scope = _g.sent();
                  if (this["with"]) {
                    _d = this["with"], value = _d.value, alias = _d.alias;
                    scope[alias || filepath] = evalToken(value, ctx);
                  }
                  childCtx.push(scope);
                  if (!this["for"])
                    return [3, 16];
                  _e = this["for"], value = _e.value, alias = _e.alias;
                  collection = evalToken(value, ctx);
                  collection = toEnumerable(collection);
                  scope["forloop"] = new ForloopDrop(collection.length);
                  _g.label = 7;
                case 7:
                  _g.trys.push([7, 13, 14, 15]);
                  collection_1 = __values(collection), collection_1_1 = collection_1.next();
                  _g.label = 8;
                case 8:
                  if (!!collection_1_1.done)
                    return [3, 12];
                  item = collection_1_1.value;
                  scope[alias] = item;
                  return [4, liquid._parseFile(filepath, childCtx.opts, childCtx.sync)];
                case 9:
                  templates = _g.sent();
                  return [4, renderer.renderTemplates(templates, childCtx, emitter)];
                case 10:
                  _g.sent();
                  scope.forloop.next();
                  _g.label = 11;
                case 11:
                  collection_1_1 = collection_1.next();
                  return [3, 8];
                case 12:
                  return [3, 15];
                case 13:
                  e_1_1 = _g.sent();
                  e_1 = {error: e_1_1};
                  return [3, 15];
                case 14:
                  try {
                    if (collection_1_1 && !collection_1_1.done && (_f = collection_1.return))
                      _f.call(collection_1);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 15:
                  return [3, 19];
                case 16:
                  return [4, liquid._parseFile(filepath, childCtx.opts, childCtx.sync)];
                case 17:
                  templates = _g.sent();
                  return [4, renderer.renderTemplates(templates, childCtx, emitter)];
                case 18:
                  _g.sent();
                  _g.label = 19;
                case 19:
                  return [2];
              }
            });
          }
        };
        var decrement = {
          parse: function(token) {
            var tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            this.variable = tokenizer.readIdentifier().content;
          },
          render: function(context, emitter) {
            var scope = context.environments;
            if (!isNumber(scope[this.variable])) {
              scope[this.variable] = 0;
            }
            emitter.write(stringify(--scope[this.variable]));
          }
        };
        var cycle = {
          parse: function(tagToken) {
            var tokenizer = new Tokenizer(tagToken.args, this.liquid.options.operatorsTrie);
            var group = tokenizer.readValue();
            tokenizer.skipBlank();
            this.candidates = [];
            if (group) {
              if (tokenizer.peek() === ":") {
                this.group = group;
                tokenizer.advance();
              } else
                this.candidates.push(group);
            }
            while (!tokenizer.end()) {
              var value = tokenizer.readValue();
              if (value)
                this.candidates.push(value);
              tokenizer.readTo(",");
            }
            assert(this.candidates.length, function() {
              return "empty candidates: " + tagToken.getText();
            });
          },
          render: function(ctx, emitter) {
            var group = evalToken(this.group, ctx);
            var fingerprint = "cycle:" + group + ":" + this.candidates.join(",");
            var groups = ctx.getRegister("cycle");
            var idx = groups[fingerprint];
            if (idx === void 0) {
              idx = groups[fingerprint] = 0;
            }
            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            groups[fingerprint] = idx;
            var html = evalToken(candidate, ctx);
            emitter.write(html);
          }
        };
        var If = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            this.branches = [];
            this.elseTemplates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens).on("start", function() {
              return _this.branches.push({
                cond: new Value(tagToken.args, _this.liquid),
                templates: p = []
              });
            }).on("tag:elsif", function(token) {
              _this.branches.push({
                cond: new Value(token.args, _this.liquid),
                templates: p = []
              });
            }).on("tag:else", function() {
              return p = _this.elseTemplates;
            }).on("tag:endif", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return p.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var r, _a, _b, branch, cond, e_1_1;
            var e_1, _c;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  r = this.liquid.renderer;
                  _d.label = 1;
                case 1:
                  _d.trys.push([1, 7, 8, 9]);
                  _a = __values(this.branches), _b = _a.next();
                  _d.label = 2;
                case 2:
                  if (!!_b.done)
                    return [3, 6];
                  branch = _b.value;
                  return [4, branch.cond.value(ctx, ctx.opts.lenientIf)];
                case 3:
                  cond = _d.sent();
                  if (!isTruthy(cond, ctx))
                    return [3, 5];
                  return [4, r.renderTemplates(branch.templates, ctx, emitter)];
                case 4:
                  _d.sent();
                  return [2];
                case 5:
                  _b = _a.next();
                  return [3, 2];
                case 6:
                  return [3, 9];
                case 7:
                  e_1_1 = _d.sent();
                  e_1 = {error: e_1_1};
                  return [3, 9];
                case 8:
                  try {
                    if (_b && !_b.done && (_c = _a.return))
                      _c.call(_a);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 9:
                  return [4, r.renderTemplates(this.elseTemplates, ctx, emitter)];
                case 10:
                  _d.sent();
                  return [2];
              }
            });
          }
        };
        var increment = {
          parse: function(token) {
            var tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            this.variable = tokenizer.readIdentifier().content;
          },
          render: function(context, emitter) {
            var scope = context.environments;
            if (!isNumber(scope[this.variable])) {
              scope[this.variable] = 0;
            }
            var val = scope[this.variable];
            scope[this.variable]++;
            emitter.write(stringify(val));
          }
        };
        var layout = {
          parse: function(token, remainTokens) {
            var tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            var file = this.liquid.options.dynamicPartials ? tokenizer.readValue() : tokenizer.readFileName();
            assert(file, function() {
              return 'illegal argument "' + token.args + '"';
            });
            this.file = file;
            this.hash = new Hash(tokenizer.remaining());
            this.tpls = this.liquid.parser.parse(remainTokens);
          },
          render: function(ctx, emitter) {
            var _a, liquid, hash, file, renderer, html_1, filepath, _b, _c, templates, html, blocks, _d, _e, partial;
            return __generator(this, function(_f) {
              switch (_f.label) {
                case 0:
                  _a = this, liquid = _a.liquid, hash = _a.hash, file = _a.file;
                  renderer = liquid.renderer;
                  if (!(file.getText() === "none"))
                    return [3, 2];
                  ctx.setRegister("blockMode", BlockMode$1.OUTPUT);
                  return [4, renderer.renderTemplates(this.tpls, ctx)];
                case 1:
                  html_1 = _f.sent();
                  emitter.write(html_1);
                  return [2];
                case 2:
                  if (!ctx.opts.dynamicPartials)
                    return [3, 6];
                  if (!isQuotedToken(file))
                    return [3, 4];
                  return [4, renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)];
                case 3:
                  _c = _f.sent();
                  return [3, 5];
                case 4:
                  _c = evalToken(this.file, ctx);
                  _f.label = 5;
                case 5:
                  _b = _c;
                  return [3, 7];
                case 6:
                  _b = file.getText();
                  _f.label = 7;
                case 7:
                  filepath = _b;
                  assert(filepath, function() {
                    return 'file "' + file.getText() + '"("' + filepath + '") not available';
                  });
                  return [
                    4,
                    liquid._parseFile(filepath, ctx.opts, ctx.sync)
                  ];
                case 8:
                  templates = _f.sent();
                  ctx.setRegister("blockMode", BlockMode$1.STORE);
                  return [4, renderer.renderTemplates(this.tpls, ctx)];
                case 9:
                  html = _f.sent();
                  blocks = ctx.getRegister("blocks");
                  if (blocks[""] === void 0)
                    blocks[""] = function() {
                      return html;
                    };
                  ctx.setRegister("blockMode", BlockMode$1.OUTPUT);
                  _e = (_d = ctx).push;
                  return [4, hash.render(ctx)];
                case 10:
                  _e.apply(_d, [_f.sent()]);
                  return [4, renderer.renderTemplates(templates, ctx)];
                case 11:
                  partial = _f.sent();
                  ctx.pop();
                  emitter.write(partial);
                  return [2];
              }
            });
          }
        };
        var BlockDrop = function(_super) {
          __extends(BlockDrop2, _super);
          function BlockDrop2(superBlockRender) {
            if (superBlockRender === void 0) {
              superBlockRender = function() {
                return "";
              };
            }
            var _this = _super.call(this) || this;
            _this.superBlockRender = superBlockRender;
            return _this;
          }
          BlockDrop2.prototype.super = function() {
            return this.superBlockRender();
          };
          return BlockDrop2;
        }(Drop);
        var block = {
          parse: function(token, remainTokens) {
            var _this = this;
            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : "";
            this.tpls = [];
            var stream = this.liquid.parser.parseStream(remainTokens).on("tag:endblock", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return _this.tpls.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + token.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var blockRender;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  blockRender = this.getBlockRender(ctx);
                  return [4, this.emitHTML(ctx, emitter, blockRender)];
                case 1:
                  _a.sent();
                  return [2];
              }
            });
          },
          getBlockRender: function(ctx) {
            var _a = this, liquid = _a.liquid, tpls = _a.tpls;
            var extendedBlockRender = ctx.getRegister("blocks")[this.block];
            var defaultBlockRender = function(superBlock) {
              var result;
              return __generator(this, function(_a2) {
                switch (_a2.label) {
                  case 0:
                    ctx.push({block: superBlock});
                    return [4, liquid.renderer.renderTemplates(tpls, ctx)];
                  case 1:
                    result = _a2.sent();
                    ctx.pop();
                    return [2, result];
                }
              });
            };
            return extendedBlockRender ? function(superBlock) {
              return extendedBlockRender(new BlockDrop(function() {
                return defaultBlockRender(superBlock);
              }));
            } : defaultBlockRender;
          },
          emitHTML: function(ctx, emitter, blockRender) {
            var _a, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  if (!(ctx.getRegister("blockMode", BlockMode$1.OUTPUT) === BlockMode$1.STORE))
                    return [3, 1];
                  ctx.getRegister("blocks")[this.block] = blockRender;
                  return [3, 3];
                case 1:
                  _b = (_a = emitter).write;
                  return [4, blockRender(new BlockDrop())];
                case 2:
                  _b.apply(_a, [_c.sent()]);
                  _c.label = 3;
                case 3:
                  return [2];
              }
            });
          }
        };
        var raw = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            this.tokens = [];
            var stream = this.liquid.parser.parseStream(remainTokens);
            stream.on("token", function(token) {
              if (token.name === "endraw")
                stream.stop();
              else
                _this.tokens.push(token);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function() {
            return this.tokens.map(function(token) {
              return token.getText();
            }).join("");
          }
        };
        var TablerowloopDrop = function(_super) {
          __extends(TablerowloopDrop2, _super);
          function TablerowloopDrop2(length, cols) {
            var _this = _super.call(this, length) || this;
            _this.length = length;
            _this.cols = cols;
            return _this;
          }
          TablerowloopDrop2.prototype.row = function() {
            return Math.floor(this.i / this.cols) + 1;
          };
          TablerowloopDrop2.prototype.col0 = function() {
            return this.i % this.cols;
          };
          TablerowloopDrop2.prototype.col = function() {
            return this.col0() + 1;
          };
          TablerowloopDrop2.prototype.col_first = function() {
            return this.col0() === 0;
          };
          TablerowloopDrop2.prototype.col_last = function() {
            return this.col() === this.cols;
          };
          return TablerowloopDrop2;
        }(ForloopDrop);
        var tablerow = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            var tokenizer = new Tokenizer(tagToken.args, this.liquid.options.operatorsTrie);
            this.variable = tokenizer.readIdentifier();
            tokenizer.skipBlank();
            var tmp = tokenizer.readIdentifier();
            assert(tmp && tmp.content === "in", function() {
              return "illegal tag: " + tagToken.getText();
            });
            this.collection = tokenizer.readValue();
            this.hash = new Hash(tokenizer.remaining());
            this.templates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens).on("start", function() {
              return p = _this.templates;
            }).on("tag:endtablerow", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return p.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var collection, _a, hash, offset, limit, cols, r, tablerowloop, scope, idx;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = toEnumerable;
                  return [4, evalToken(this.collection, ctx)];
                case 1:
                  collection = _a.apply(void 0, [_b.sent()]);
                  return [4, this.hash.render(ctx)];
                case 2:
                  hash = _b.sent();
                  offset = hash.offset || 0;
                  limit = hash.limit === void 0 ? collection.length : hash.limit;
                  collection = collection.slice(offset, offset + limit);
                  cols = hash.cols || collection.length;
                  r = this.liquid.renderer;
                  tablerowloop = new TablerowloopDrop(collection.length, cols);
                  scope = {tablerowloop};
                  ctx.push(scope);
                  idx = 0;
                  _b.label = 3;
                case 3:
                  if (!(idx < collection.length))
                    return [3, 6];
                  scope[this.variable.content] = collection[idx];
                  if (tablerowloop.col0() === 0) {
                    if (tablerowloop.row() !== 1)
                      emitter.write("</tr>");
                    emitter.write('<tr class="row' + tablerowloop.row() + '">');
                  }
                  emitter.write('<td class="col' + tablerowloop.col() + '">');
                  return [4, r.renderTemplates(this.templates, ctx, emitter)];
                case 4:
                  _b.sent();
                  emitter.write("</td>");
                  _b.label = 5;
                case 5:
                  idx++, tablerowloop.next();
                  return [3, 3];
                case 6:
                  if (collection.length)
                    emitter.write("</tr>");
                  ctx.pop();
                  return [2];
              }
            });
          }
        };
        var unless = {
          parse: function(tagToken, remainTokens) {
            var _this = this;
            this.templates = [];
            this.branches = [];
            this.elseTemplates = [];
            var p;
            var stream = this.liquid.parser.parseStream(remainTokens).on("start", function() {
              p = _this.templates;
              _this.cond = new Value(tagToken.args, _this.liquid);
            }).on("tag:elsif", function(token) {
              _this.branches.push({
                cond: new Value(token.args, _this.liquid),
                templates: p = []
              });
            }).on("tag:else", function() {
              return p = _this.elseTemplates;
            }).on("tag:endunless", function() {
              return stream.stop();
            }).on("template", function(tpl) {
              return p.push(tpl);
            }).on("end", function() {
              throw new Error("tag " + tagToken.getText() + " not closed");
            });
            stream.start();
          },
          render: function(ctx, emitter) {
            var r, cond, _a, _b, branch, cond_1, e_1_1;
            var e_1, _c;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  r = this.liquid.renderer;
                  return [4, this.cond.value(ctx, ctx.opts.lenientIf)];
                case 1:
                  cond = _d.sent();
                  if (!isFalsy(cond, ctx))
                    return [3, 3];
                  return [4, r.renderTemplates(this.templates, ctx, emitter)];
                case 2:
                  _d.sent();
                  return [2];
                case 3:
                  _d.trys.push([3, 9, 10, 11]);
                  _a = __values(this.branches), _b = _a.next();
                  _d.label = 4;
                case 4:
                  if (!!_b.done)
                    return [3, 8];
                  branch = _b.value;
                  return [4, branch.cond.value(ctx, ctx.opts.lenientIf)];
                case 5:
                  cond_1 = _d.sent();
                  if (!isTruthy(cond_1, ctx))
                    return [3, 7];
                  return [4, r.renderTemplates(branch.templates, ctx, emitter)];
                case 6:
                  _d.sent();
                  return [2];
                case 7:
                  _b = _a.next();
                  return [3, 4];
                case 8:
                  return [3, 11];
                case 9:
                  e_1_1 = _d.sent();
                  e_1 = {error: e_1_1};
                  return [3, 11];
                case 10:
                  try {
                    if (_b && !_b.done && (_c = _a.return))
                      _c.call(_a);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 11:
                  return [4, r.renderTemplates(this.elseTemplates, ctx, emitter)];
                case 12:
                  _d.sent();
                  return [2];
              }
            });
          }
        };
        var Break = {
          render: function(ctx, emitter) {
            emitter.break = true;
          }
        };
        var Continue = {
          render: function(ctx, emitter) {
            emitter.continue = true;
          }
        };
        var tags = {
          assign,
          "for": For,
          capture,
          "case": Case,
          comment,
          include,
          render,
          decrement,
          increment,
          cycle,
          "if": If,
          layout,
          block,
          raw,
          tablerow,
          unless,
          "break": Break,
          "continue": Continue
        };
        var escapeMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&#34;",
          "'": "&#39;"
        };
        var unescapeMap = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&#34;": '"',
          "&#39;": "'"
        };
        function escape(str) {
          return stringify(str).replace(/&|<|>|"|'/g, function(m) {
            return escapeMap[m];
          });
        }
        function unescape(str) {
          return String(str).replace(/&(amp|lt|gt|#34|#39);/g, function(m) {
            return unescapeMap[m];
          });
        }
        function escapeOnce(str) {
          return escape(unescape(str));
        }
        function newlineToBr(v) {
          return v.replace(/\n/g, "<br />\n");
        }
        function stripHtml(v) {
          return v.replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, "");
        }
        var abs = Math.abs;
        var atLeast = Math.max;
        var atMost = Math.min;
        var ceil = Math.ceil;
        var dividedBy = function(v, arg) {
          return v / arg;
        };
        var floor = Math.floor;
        var minus = function(v, arg) {
          return v - arg;
        };
        var modulo = function(v, arg) {
          return v % arg;
        };
        var times = function(v, arg) {
          return v * arg;
        };
        function round(v, arg) {
          if (arg === void 0) {
            arg = 0;
          }
          var amp = Math.pow(10, arg);
          return Math.round(v * amp) / amp;
        }
        function plus(v, arg) {
          return Number(v) + Number(arg);
        }
        function sortNatural(input, property) {
          if (!input || !input.sort)
            return [];
          if (property !== void 0) {
            return __spread(input).sort(function(lhs, rhs) {
              return caseInsensitiveCompare(lhs[property], rhs[property]);
            });
          }
          return __spread(input).sort(caseInsensitiveCompare);
        }
        var urlDecode = function(x) {
          return x.split("+").map(decodeURIComponent).join(" ");
        };
        var urlEncode = function(x) {
          return x.split(" ").map(encodeURIComponent).join("+");
        };
        var join = function(v, arg) {
          return v.join(arg === void 0 ? " " : arg);
        };
        var last$1 = function(v) {
          return isArray(v) ? last(v) : "";
        };
        var first = function(v) {
          return isArray(v) ? v[0] : "";
        };
        var reverse = function(v) {
          return __spread(v).reverse();
        };
        function sort(arr, property) {
          var _this = this;
          var getValue = function(obj) {
            return property ? _this.context.getFromScope(obj, property.split(".")) : obj;
          };
          return toArray(arr).sort(function(lhs, rhs) {
            lhs = getValue(lhs);
            rhs = getValue(rhs);
            return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
          });
        }
        var size = function(v) {
          return v && v.length || 0;
        };
        function map(arr, property) {
          var _this = this;
          return toArray(arr).map(function(obj) {
            return _this.context.getFromScope(obj, property.split("."));
          });
        }
        function compact(arr) {
          return toArray(arr).filter(function(x) {
            return !isNil(x);
          });
        }
        function concat(v, arg) {
          return toArray(v).concat(arg);
        }
        function slice(v, begin, length) {
          if (length === void 0) {
            length = 1;
          }
          begin = begin < 0 ? v.length + begin : begin;
          return v.slice(begin, begin + length);
        }
        function where(arr, property, expected) {
          var _this = this;
          return toArray(arr).filter(function(obj) {
            var value = _this.context.getFromScope(obj, String(property).split("."));
            return expected === void 0 ? isTruthy(value, _this.context) : value === expected;
          });
        }
        function uniq(arr) {
          var u = {};
          return (arr || []).filter(function(val) {
            if (u.hasOwnProperty(String(val)))
              return false;
            u[String(val)] = true;
            return true;
          });
        }
        var rFormat = /%([-_0^#:]+)?(\d+)?([EO])?(.)/;
        var monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        var dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
        var monthNamesShort = monthNames.map(abbr);
        var dayNamesShort = dayNames.map(abbr);
        var suffixes = {
          1: "st",
          2: "nd",
          3: "rd",
          "default": "th"
        };
        function abbr(str) {
          return str.slice(0, 3);
        }
        function daysInMonth(d) {
          var feb = isLeapYear(d) ? 29 : 28;
          return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        }
        function getDayOfYear(d) {
          var num = 0;
          for (var i = 0; i < d.getMonth(); ++i) {
            num += daysInMonth(d)[i];
          }
          return num + d.getDate();
        }
        function getWeekOfYear(d, startDay) {
          var now = getDayOfYear(d) + (startDay - d.getDay());
          var jan1 = new Date(d.getFullYear(), 0, 1);
          var then = 7 - jan1.getDay() + startDay;
          return String(Math.floor((now - then) / 7) + 1);
        }
        function isLeapYear(d) {
          var year = d.getFullYear();
          return !!((year & 3) === 0 && (year % 100 || year % 400 === 0 && year));
        }
        function getSuffix(d) {
          var str = d.getDate().toString();
          var index = parseInt(str.slice(-1));
          return suffixes[index] || suffixes["default"];
        }
        function century(d) {
          return parseInt(d.getFullYear().toString().substring(0, 2), 10);
        }
        var padWidths = {
          d: 2,
          e: 2,
          H: 2,
          I: 2,
          j: 3,
          k: 2,
          l: 2,
          L: 3,
          m: 2,
          M: 2,
          S: 2,
          U: 2,
          W: 2
        };
        var padChars = {
          a: " ",
          A: " ",
          b: " ",
          B: " ",
          c: " ",
          e: " ",
          k: " ",
          l: " ",
          p: " ",
          P: " "
        };
        var formatCodes = {
          a: function(d) {
            return dayNamesShort[d.getDay()];
          },
          A: function(d) {
            return dayNames[d.getDay()];
          },
          b: function(d) {
            return monthNamesShort[d.getMonth()];
          },
          B: function(d) {
            return monthNames[d.getMonth()];
          },
          c: function(d) {
            return d.toLocaleString();
          },
          C: function(d) {
            return century(d);
          },
          d: function(d) {
            return d.getDate();
          },
          e: function(d) {
            return d.getDate();
          },
          H: function(d) {
            return d.getHours();
          },
          I: function(d) {
            return String(d.getHours() % 12 || 12);
          },
          j: function(d) {
            return getDayOfYear(d);
          },
          k: function(d) {
            return d.getHours();
          },
          l: function(d) {
            return String(d.getHours() % 12 || 12);
          },
          L: function(d) {
            return d.getMilliseconds();
          },
          m: function(d) {
            return d.getMonth() + 1;
          },
          M: function(d) {
            return d.getMinutes();
          },
          N: function(d, opts) {
            var width = Number(opts.width) || 9;
            var str = String(d.getMilliseconds()).substr(0, width);
            return padEnd(str, width, "0");
          },
          p: function(d) {
            return d.getHours() < 12 ? "AM" : "PM";
          },
          P: function(d) {
            return d.getHours() < 12 ? "am" : "pm";
          },
          q: function(d) {
            return getSuffix(d);
          },
          s: function(d) {
            return Math.round(d.valueOf() / 1e3);
          },
          S: function(d) {
            return d.getSeconds();
          },
          u: function(d) {
            return d.getDay() || 7;
          },
          U: function(d) {
            return getWeekOfYear(d, 0);
          },
          w: function(d) {
            return d.getDay();
          },
          W: function(d) {
            return getWeekOfYear(d, 1);
          },
          x: function(d) {
            return d.toLocaleDateString();
          },
          X: function(d) {
            return d.toLocaleTimeString();
          },
          y: function(d) {
            return d.getFullYear().toString().substring(2, 4);
          },
          Y: function(d) {
            return d.getFullYear();
          },
          z: function(d, opts) {
            var offset = d.getTimezoneOffset();
            var nOffset = Math.abs(offset);
            var h = Math.floor(nOffset / 60);
            var m = nOffset % 60;
            return (offset > 0 ? "-" : "+") + padStart(h, 2, "0") + (opts.flags[":"] ? ":" : "") + padStart(m, 2, "0");
          },
          "t": function() {
            return "	";
          },
          "n": function() {
            return "\n";
          },
          "%": function() {
            return "%";
          }
        };
        formatCodes.h = formatCodes.b;
        function strftime(inputDate, formatStr) {
          var d = inputDate;
          if (d instanceof TimezoneDate) {
            d = d.getDisplayDate();
          }
          var output = "";
          var remaining = formatStr;
          var match;
          while (match = rFormat.exec(remaining)) {
            output += remaining.slice(0, match.index);
            remaining = remaining.slice(match.index + match[0].length);
            output += format(d, match);
          }
          return output + remaining;
        }
        function format(d, match) {
          var e_1, _a;
          var _b = __read(match, 5), input = _b[0], _c = _b[1], flagStr = _c === void 0 ? "" : _c, width = _b[2], modifier = _b[3], conversion = _b[4];
          var convert = formatCodes[conversion];
          if (!convert)
            return input;
          var flags = {};
          try {
            for (var flagStr_1 = __values(flagStr), flagStr_1_1 = flagStr_1.next(); !flagStr_1_1.done; flagStr_1_1 = flagStr_1.next()) {
              var flag = flagStr_1_1.value;
              flags[flag] = true;
            }
          } catch (e_1_1) {
            e_1 = {error: e_1_1};
          } finally {
            try {
              if (flagStr_1_1 && !flagStr_1_1.done && (_a = flagStr_1.return))
                _a.call(flagStr_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          var ret = String(convert(d, {flags, width, modifier}));
          var padChar = padChars[conversion] || "0";
          var padWidth = width || padWidths[conversion] || 0;
          if (flags["^"])
            ret = ret.toUpperCase();
          else if (flags["#"])
            ret = changeCase(ret);
          if (flags["_"])
            padChar = " ";
          else if (flags["0"])
            padChar = "0";
          if (flags["-"])
            padWidth = 0;
          return padStart(ret, padWidth, padChar);
        }
        var TimezoneDate = function(_super) {
          __extends(TimezoneDate2, _super);
          function TimezoneDate2(dateString) {
            var _this = _super.call(this, dateString) || this;
            _this.dateString = dateString;
            _this.ISO8601_TIMEZONE_PATTERN = /([zZ]|([+-])(\d{2}):(\d{2}))$/;
            _this.inputTimezoneOffset = 0;
            var m = dateString.match(_this.ISO8601_TIMEZONE_PATTERN);
            if (m && m[1] === "Z") {
              _this.inputTimezoneOffset = _this.getTimezoneOffset();
            } else if (m && m[2] && m[3] && m[4]) {
              var _a = __read(m, 5), sign = _a[2], hours = _a[3], minutes = _a[4];
              var delta = (sign === "+" ? 1 : -1) * (parseInt(hours, 10) * 60 + parseInt(minutes, 10));
              _this.inputTimezoneOffset = _this.getTimezoneOffset() + delta;
            }
            return _this;
          }
          TimezoneDate2.prototype.getDisplayDate = function() {
            return new Date(+this + this.inputTimezoneOffset * 60 * 1e3);
          };
          return TimezoneDate2;
        }(Date);
        function date(v, arg) {
          var date2 = v;
          if (v === "now" || v === "today") {
            date2 = new Date();
          } else if (isNumber(v)) {
            date2 = new Date(v * 1e3);
          } else if (isString(v)) {
            if (/^\d+$/.test(v)) {
              date2 = new Date(+v * 1e3);
            } else if (this.context.opts.preserveTimezones) {
              date2 = new TimezoneDate(v);
            } else {
              date2 = new Date(v);
            }
          }
          return isValidDate(date2) ? strftime(date2, arg) : v;
        }
        function isValidDate(date2) {
          return date2 instanceof Date && !isNaN(date2.getTime());
        }
        function Default(v, arg) {
          if (isArray(v) || isString(v))
            return v.length ? v : arg;
          return isFalsy(toValue(v), this.context) ? arg : v;
        }
        function json(v) {
          return JSON.stringify(v);
        }
        function append2(v, arg) {
          assert(arg !== void 0, function() {
            return "append expect 2 arguments";
          });
          return stringify(v) + stringify(arg);
        }
        function prepend(v, arg) {
          assert(arg !== void 0, function() {
            return "prepend expect 2 arguments";
          });
          return stringify(arg) + stringify(v);
        }
        function lstrip(v) {
          return stringify(v).replace(/^\s+/, "");
        }
        function downcase(v) {
          return stringify(v).toLowerCase();
        }
        function upcase(str) {
          return stringify(str).toUpperCase();
        }
        function remove(v, arg) {
          return stringify(v).split(String(arg)).join("");
        }
        function removeFirst(v, l) {
          return stringify(v).replace(String(l), "");
        }
        function rstrip(str) {
          return stringify(str).replace(/\s+$/, "");
        }
        function split(v, arg) {
          return stringify(v).split(String(arg));
        }
        function strip(v) {
          return stringify(v).trim();
        }
        function stripNewlines(v) {
          return stringify(v).replace(/\n/g, "");
        }
        function capitalize(str) {
          str = stringify(str);
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        function replace(v, pattern, replacement) {
          return stringify(v).split(String(pattern)).join(replacement);
        }
        function replaceFirst(v, arg1, arg2) {
          return stringify(v).replace(String(arg1), arg2);
        }
        function truncate(v, l, o) {
          if (l === void 0) {
            l = 50;
          }
          if (o === void 0) {
            o = "...";
          }
          v = stringify(v);
          if (v.length <= l)
            return v;
          return v.substr(0, l - o.length) + o;
        }
        function truncatewords(v, l, o) {
          if (l === void 0) {
            l = 15;
          }
          if (o === void 0) {
            o = "...";
          }
          var arr = v.split(/\s+/);
          var ret = arr.slice(0, l).join(" ");
          if (arr.length >= l)
            ret += o;
          return ret;
        }
        var builtinFilters = /* @__PURE__ */ Object.freeze({
          escape,
          escapeOnce,
          newlineToBr,
          stripHtml,
          abs,
          atLeast,
          atMost,
          ceil,
          dividedBy,
          floor,
          minus,
          modulo,
          times,
          round,
          plus,
          sortNatural,
          urlDecode,
          urlEncode,
          join,
          last: last$1,
          first,
          reverse,
          sort,
          size,
          map,
          compact,
          concat,
          slice,
          where,
          uniq,
          date,
          Default,
          json,
          append: append2,
          prepend,
          lstrip,
          downcase,
          upcase,
          remove,
          removeFirst,
          rstrip,
          split,
          strip,
          stripNewlines,
          capitalize,
          replace,
          replaceFirst,
          truncate,
          truncatewords
        });
        var TagMap = function() {
          function TagMap2() {
            this.impls = {};
          }
          TagMap2.prototype.get = function(name) {
            var impl = this.impls[name];
            assert(impl, function() {
              return 'tag "' + name + '" not found';
            });
            return impl;
          };
          TagMap2.prototype.set = function(name, impl) {
            this.impls[name] = impl;
          };
          return TagMap2;
        }();
        var FilterMap = function() {
          function FilterMap2(strictFilters, liquid) {
            this.strictFilters = strictFilters;
            this.liquid = liquid;
            this.impls = {};
          }
          FilterMap2.prototype.get = function(name) {
            var impl = this.impls[name];
            assert(impl || !this.strictFilters, function() {
              return "undefined filter: " + name;
            });
            return impl;
          };
          FilterMap2.prototype.set = function(name, impl) {
            this.impls[name] = impl;
          };
          FilterMap2.prototype.create = function(name, args) {
            return new Filter(name, this.get(name), args, this.liquid);
          };
          return FilterMap2;
        }();
        var Liquid = function() {
          function Liquid2(opts) {
            var _this = this;
            if (opts === void 0) {
              opts = {};
            }
            this.options = applyDefault(normalize(opts));
            this.parser = new Parser(this);
            this.renderer = new Render();
            this.filters = new FilterMap(this.options.strictFilters, this);
            this.tags = new TagMap();
            forOwn(tags, function(conf, name) {
              return _this.registerTag(snakeCase(name), conf);
            });
            forOwn(builtinFilters, function(handler, name) {
              return _this.registerFilter(snakeCase(name), handler);
            });
          }
          Liquid2.prototype.parse = function(html, filepath) {
            var tokenizer = new Tokenizer(html, this.options.operatorsTrie, filepath);
            var tokens = tokenizer.readTopLevelTokens(this.options);
            return this.parser.parse(tokens);
          };
          Liquid2.prototype._render = function(tpl, scope, opts, sync) {
            var options = __assign({}, this.options, normalize(opts));
            var ctx = new Context(scope, options, sync);
            var emitter = new Emitter(options.keepOutputType);
            return this.renderer.renderTemplates(tpl, ctx, emitter);
          };
          Liquid2.prototype.render = function(tpl, scope, opts) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, toPromise(this._render(tpl, scope, opts, false))];
              });
            });
          };
          Liquid2.prototype.renderSync = function(tpl, scope, opts) {
            return toValue$1(this._render(tpl, scope, opts, true));
          };
          Liquid2.prototype._parseAndRender = function(html, scope, opts, sync) {
            var tpl = this.parse(html);
            return this._render(tpl, scope, opts, sync);
          };
          Liquid2.prototype.parseAndRender = function(html, scope, opts) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, toPromise(this._parseAndRender(html, scope, opts, false))];
              });
            });
          };
          Liquid2.prototype.parseAndRenderSync = function(html, scope, opts) {
            return toValue$1(this._parseAndRender(html, scope, opts, true));
          };
          Liquid2.prototype._parseFile = function(file, opts, sync) {
            var options, paths, filepath, paths_1, paths_1_1, filepath, cache, tpls, _a, tpl, _b, _c, e_1_1;
            var e_1, _d;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  options = __assign({}, this.options, normalize(opts));
                  paths = options.root.map(function(root) {
                    return options.fs.resolve(root, file, options.extname);
                  });
                  if (options.fs.fallback !== void 0) {
                    filepath = options.fs.fallback(file);
                    if (filepath !== void 0)
                      paths.push(filepath);
                  }
                  _e.label = 1;
                case 1:
                  _e.trys.push([1, 13, 14, 15]);
                  paths_1 = __values(paths), paths_1_1 = paths_1.next();
                  _e.label = 2;
                case 2:
                  if (!!paths_1_1.done)
                    return [3, 12];
                  filepath = paths_1_1.value;
                  cache = options.cache;
                  if (!cache)
                    return [3, 4];
                  return [4, cache.read(filepath)];
                case 3:
                  tpls = _e.sent();
                  if (tpls)
                    return [2, tpls];
                  _e.label = 4;
                case 4:
                  if (!sync)
                    return [3, 5];
                  _a = options.fs.existsSync(filepath);
                  return [3, 7];
                case 5:
                  return [4, options.fs.exists(filepath)];
                case 6:
                  _a = _e.sent();
                  _e.label = 7;
                case 7:
                  if (!_a)
                    return [3, 11];
                  _b = this.parse;
                  if (!sync)
                    return [3, 8];
                  _c = options.fs.readFileSync(filepath);
                  return [3, 10];
                case 8:
                  return [4, options.fs.readFile(filepath)];
                case 9:
                  _c = _e.sent();
                  _e.label = 10;
                case 10:
                  tpl = _b.apply(this, [_c, filepath]);
                  if (cache)
                    cache.write(filepath, tpl);
                  return [2, tpl];
                case 11:
                  paths_1_1 = paths_1.next();
                  return [3, 2];
                case 12:
                  return [3, 15];
                case 13:
                  e_1_1 = _e.sent();
                  e_1 = {error: e_1_1};
                  return [3, 15];
                case 14:
                  try {
                    if (paths_1_1 && !paths_1_1.done && (_d = paths_1.return))
                      _d.call(paths_1);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                  return [7];
                case 15:
                  throw this.lookupError(file, options.root);
              }
            });
          };
          Liquid2.prototype.parseFile = function(file, opts) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, toPromise(this._parseFile(file, opts, false))];
              });
            });
          };
          Liquid2.prototype.parseFileSync = function(file, opts) {
            return toValue$1(this._parseFile(file, opts, true));
          };
          Liquid2.prototype.renderFile = function(file, ctx, opts) {
            return __awaiter(this, void 0, void 0, function() {
              var templates;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, this.parseFile(file, opts)];
                  case 1:
                    templates = _a.sent();
                    return [2, this.render(templates, ctx, opts)];
                }
              });
            });
          };
          Liquid2.prototype.renderFileSync = function(file, ctx, opts) {
            var templates = this.parseFileSync(file, opts);
            return this.renderSync(templates, ctx, opts);
          };
          Liquid2.prototype._evalValue = function(str, ctx) {
            var value = new Value(str, this);
            return value.value(ctx, false);
          };
          Liquid2.prototype.evalValue = function(str, ctx) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, toPromise(this._evalValue(str, ctx))];
              });
            });
          };
          Liquid2.prototype.evalValueSync = function(str, ctx) {
            return toValue$1(this._evalValue(str, ctx));
          };
          Liquid2.prototype.registerFilter = function(name, filter) {
            this.filters.set(name, filter);
          };
          Liquid2.prototype.registerTag = function(name, tag) {
            this.tags.set(name, tag);
          };
          Liquid2.prototype.plugin = function(plugin) {
            return plugin.call(this, Liquid2);
          };
          Liquid2.prototype.express = function() {
            var self2 = this;
            return function(filePath, ctx, callback) {
              var opts = {root: __spread(normalizeStringArray(this.root), self2.options.root)};
              self2.renderFile(filePath, ctx, opts).then(function(html) {
                return callback(null, html);
              }, callback);
            };
          };
          Liquid2.prototype.lookupError = function(file, roots) {
            var err = new Error("ENOENT");
            err.message = 'ENOENT: Failed to lookup "' + file + '" in "' + roots + '"';
            err.code = "ENOENT";
            return err;
          };
          Liquid2.prototype.getTemplate = function(file, opts) {
            return __awaiter(this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                return [2, this.parseFile(file, opts)];
              });
            });
          };
          Liquid2.prototype.getTemplateSync = function(file, opts) {
            return this.parseFileSync(file, opts);
          };
          return Liquid2;
        }();
        exports2.AssertionError = AssertionError;
        exports2.Context = Context;
        exports2.Drop = Drop;
        exports2.Emitter = Emitter;
        exports2.Expression = Expression;
        exports2.Hash = Hash;
        exports2.InternalUndefinedVariableError = InternalUndefinedVariableError;
        exports2.Liquid = Liquid;
        exports2.LiquidError = LiquidError;
        exports2.ParseError = ParseError;
        exports2.ParseStream = ParseStream;
        exports2.RenderError = RenderError;
        exports2.TagToken = TagToken;
        exports2.Token = Token;
        exports2.TokenizationError = TokenizationError;
        exports2.Tokenizer = Tokenizer;
        exports2.TypeGuards = typeGuards;
        exports2.UndefinedVariableError = UndefinedVariableError;
        exports2.Value = Value;
        exports2.assert = assert;
        exports2.createTrie = createTrie;
        exports2.defaultOperators = defaultOperators;
        exports2.evalQuotedToken = evalQuotedToken;
        exports2.evalToken = evalToken;
        exports2.isFalsy = isFalsy;
        exports2.isTruthy = isTruthy;
        exports2.toPromise = toPromise;
        exports2.toThenable = toThenable;
        exports2.toValue = toValue;
        Object.defineProperty(exports2, "__esModule", {value: true});
      });
    }
  });

  // node_modules/toml/lib/parser.js
  var require_parser = __commonJS({
    "node_modules/toml/lib/parser.js"(exports, module) {
      module.exports = function() {
        function peg$subclass(child, parent) {
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
        }
        function SyntaxError(message, expected, found, offset, line, column) {
          this.message = message;
          this.expected = expected;
          this.found = found;
          this.offset = offset;
          this.line = line;
          this.column = column;
          this.name = "SyntaxError";
        }
        peg$subclass(SyntaxError, Error);
        function parse(input) {
          var options = arguments.length > 1 ? arguments[1] : {}, peg$FAILED = {}, peg$startRuleFunctions = {start: peg$parsestart}, peg$startRuleFunction = peg$parsestart, peg$c0 = [], peg$c1 = function() {
            return nodes;
          }, peg$c2 = peg$FAILED, peg$c3 = "#", peg$c4 = {type: "literal", value: "#", description: '"#"'}, peg$c5 = void 0, peg$c6 = {type: "any", description: "any character"}, peg$c7 = "[", peg$c8 = {type: "literal", value: "[", description: '"["'}, peg$c9 = "]", peg$c10 = {type: "literal", value: "]", description: '"]"'}, peg$c11 = function(name) {
            addNode(node("ObjectPath", name, line, column));
          }, peg$c12 = function(name) {
            addNode(node("ArrayPath", name, line, column));
          }, peg$c13 = function(parts, name) {
            return parts.concat(name);
          }, peg$c14 = function(name) {
            return [name];
          }, peg$c15 = function(name) {
            return name;
          }, peg$c16 = ".", peg$c17 = {type: "literal", value: ".", description: '"."'}, peg$c18 = "=", peg$c19 = {type: "literal", value: "=", description: '"="'}, peg$c20 = function(key, value) {
            addNode(node("Assign", value, line, column, key));
          }, peg$c21 = function(chars) {
            return chars.join("");
          }, peg$c22 = function(node2) {
            return node2.value;
          }, peg$c23 = '"""', peg$c24 = {type: "literal", value: '"""', description: '"\\"\\"\\""'}, peg$c25 = null, peg$c26 = function(chars) {
            return node("String", chars.join(""), line, column);
          }, peg$c27 = '"', peg$c28 = {type: "literal", value: '"', description: '"\\""'}, peg$c29 = "'''", peg$c30 = {type: "literal", value: "'''", description: `"'''"`}, peg$c31 = "'", peg$c32 = {type: "literal", value: "'", description: `"'"`}, peg$c33 = function(char) {
            return char;
          }, peg$c34 = function(char) {
            return char;
          }, peg$c35 = "\\", peg$c36 = {type: "literal", value: "\\", description: '"\\\\"'}, peg$c37 = function() {
            return "";
          }, peg$c38 = "e", peg$c39 = {type: "literal", value: "e", description: '"e"'}, peg$c40 = "E", peg$c41 = {type: "literal", value: "E", description: '"E"'}, peg$c42 = function(left, right) {
            return node("Float", parseFloat(left + "e" + right), line, column);
          }, peg$c43 = function(text3) {
            return node("Float", parseFloat(text3), line, column);
          }, peg$c44 = "+", peg$c45 = {type: "literal", value: "+", description: '"+"'}, peg$c46 = function(digits) {
            return digits.join("");
          }, peg$c47 = "-", peg$c48 = {type: "literal", value: "-", description: '"-"'}, peg$c49 = function(digits) {
            return "-" + digits.join("");
          }, peg$c50 = function(text3) {
            return node("Integer", parseInt(text3, 10), line, column);
          }, peg$c51 = "true", peg$c52 = {type: "literal", value: "true", description: '"true"'}, peg$c53 = function() {
            return node("Boolean", true, line, column);
          }, peg$c54 = "false", peg$c55 = {type: "literal", value: "false", description: '"false"'}, peg$c56 = function() {
            return node("Boolean", false, line, column);
          }, peg$c57 = function() {
            return node("Array", [], line, column);
          }, peg$c58 = function(value) {
            return node("Array", value ? [value] : [], line, column);
          }, peg$c59 = function(values) {
            return node("Array", values, line, column);
          }, peg$c60 = function(values, value) {
            return node("Array", values.concat(value), line, column);
          }, peg$c61 = function(value) {
            return value;
          }, peg$c62 = ",", peg$c63 = {type: "literal", value: ",", description: '","'}, peg$c64 = "{", peg$c65 = {type: "literal", value: "{", description: '"{"'}, peg$c66 = "}", peg$c67 = {type: "literal", value: "}", description: '"}"'}, peg$c68 = function(values) {
            return node("InlineTable", values, line, column);
          }, peg$c69 = function(key, value) {
            return node("InlineTableValue", value, line, column, key);
          }, peg$c70 = function(digits) {
            return "." + digits;
          }, peg$c71 = function(date) {
            return date.join("");
          }, peg$c72 = ":", peg$c73 = {type: "literal", value: ":", description: '":"'}, peg$c74 = function(time) {
            return time.join("");
          }, peg$c75 = "T", peg$c76 = {type: "literal", value: "T", description: '"T"'}, peg$c77 = "Z", peg$c78 = {type: "literal", value: "Z", description: '"Z"'}, peg$c79 = function(date, time) {
            return node("Date", new Date(date + "T" + time + "Z"), line, column);
          }, peg$c80 = function(date, time) {
            return node("Date", new Date(date + "T" + time), line, column);
          }, peg$c81 = /^[ \t]/, peg$c82 = {type: "class", value: "[ \\t]", description: "[ \\t]"}, peg$c83 = "\n", peg$c84 = {type: "literal", value: "\n", description: '"\\n"'}, peg$c85 = "\r", peg$c86 = {type: "literal", value: "\r", description: '"\\r"'}, peg$c87 = /^[0-9a-f]/i, peg$c88 = {type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i"}, peg$c89 = /^[0-9]/, peg$c90 = {type: "class", value: "[0-9]", description: "[0-9]"}, peg$c91 = "_", peg$c92 = {type: "literal", value: "_", description: '"_"'}, peg$c93 = function() {
            return "";
          }, peg$c94 = /^[A-Za-z0-9_\-]/, peg$c95 = {type: "class", value: "[A-Za-z0-9_\\-]", description: "[A-Za-z0-9_\\-]"}, peg$c96 = function(d) {
            return d.join("");
          }, peg$c97 = '\\"', peg$c98 = {type: "literal", value: '\\"', description: '"\\\\\\""'}, peg$c99 = function() {
            return '"';
          }, peg$c100 = "\\\\", peg$c101 = {type: "literal", value: "\\\\", description: '"\\\\\\\\"'}, peg$c102 = function() {
            return "\\";
          }, peg$c103 = "\\b", peg$c104 = {type: "literal", value: "\\b", description: '"\\\\b"'}, peg$c105 = function() {
            return "\b";
          }, peg$c106 = "\\t", peg$c107 = {type: "literal", value: "\\t", description: '"\\\\t"'}, peg$c108 = function() {
            return "	";
          }, peg$c109 = "\\n", peg$c110 = {type: "literal", value: "\\n", description: '"\\\\n"'}, peg$c111 = function() {
            return "\n";
          }, peg$c112 = "\\f", peg$c113 = {type: "literal", value: "\\f", description: '"\\\\f"'}, peg$c114 = function() {
            return "\f";
          }, peg$c115 = "\\r", peg$c116 = {type: "literal", value: "\\r", description: '"\\\\r"'}, peg$c117 = function() {
            return "\r";
          }, peg$c118 = "\\U", peg$c119 = {type: "literal", value: "\\U", description: '"\\\\U"'}, peg$c120 = function(digits) {
            return convertCodePoint(digits.join(""));
          }, peg$c121 = "\\u", peg$c122 = {type: "literal", value: "\\u", description: '"\\\\u"'}, peg$currPos = 0, peg$reportedPos = 0, peg$cachedPos = 0, peg$cachedPosDetails = {line: 1, column: 1, seenCR: false}, peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$cache = {}, peg$result;
          if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
              throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
            }
            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
          }
          function text2() {
            return input.substring(peg$reportedPos, peg$currPos);
          }
          function offset() {
            return peg$reportedPos;
          }
          function line() {
            return peg$computePosDetails(peg$reportedPos).line;
          }
          function column() {
            return peg$computePosDetails(peg$reportedPos).column;
          }
          function expected(description) {
            throw peg$buildException(null, [{type: "other", description}], peg$reportedPos);
          }
          function error(message) {
            throw peg$buildException(message, null, peg$reportedPos);
          }
          function peg$computePosDetails(pos) {
            function advance(details, startPos, endPos) {
              var p, ch;
              for (p = startPos; p < endPos; p++) {
                ch = input.charAt(p);
                if (ch === "\n") {
                  if (!details.seenCR) {
                    details.line++;
                  }
                  details.column = 1;
                  details.seenCR = false;
                } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                  details.line++;
                  details.column = 1;
                  details.seenCR = true;
                } else {
                  details.column++;
                  details.seenCR = false;
                }
              }
            }
            if (peg$cachedPos !== pos) {
              if (peg$cachedPos > pos) {
                peg$cachedPos = 0;
                peg$cachedPosDetails = {line: 1, column: 1, seenCR: false};
              }
              advance(peg$cachedPosDetails, peg$cachedPos, pos);
              peg$cachedPos = pos;
            }
            return peg$cachedPosDetails;
          }
          function peg$fail(expected2) {
            if (peg$currPos < peg$maxFailPos) {
              return;
            }
            if (peg$currPos > peg$maxFailPos) {
              peg$maxFailPos = peg$currPos;
              peg$maxFailExpected = [];
            }
            peg$maxFailExpected.push(expected2);
          }
          function peg$buildException(message, expected2, pos) {
            function cleanupExpected(expected3) {
              var i = 1;
              expected3.sort(function(a, b) {
                if (a.description < b.description) {
                  return -1;
                } else if (a.description > b.description) {
                  return 1;
                } else {
                  return 0;
                }
              });
              while (i < expected3.length) {
                if (expected3[i - 1] === expected3[i]) {
                  expected3.splice(i, 1);
                } else {
                  i++;
                }
              }
            }
            function buildMessage(expected3, found2) {
              function stringEscape(s) {
                function hex(ch) {
                  return ch.charCodeAt(0).toString(16).toUpperCase();
                }
                return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) {
                  return "\\x0" + hex(ch);
                }).replace(/[\x10-\x1F\x80-\xFF]/g, function(ch) {
                  return "\\x" + hex(ch);
                }).replace(/[\u0180-\u0FFF]/g, function(ch) {
                  return "\\u0" + hex(ch);
                }).replace(/[\u1080-\uFFFF]/g, function(ch) {
                  return "\\u" + hex(ch);
                });
              }
              var expectedDescs = new Array(expected3.length), expectedDesc, foundDesc, i;
              for (i = 0; i < expected3.length; i++) {
                expectedDescs[i] = expected3[i].description;
              }
              expectedDesc = expected3.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected3.length - 1] : expectedDescs[0];
              foundDesc = found2 ? '"' + stringEscape(found2) + '"' : "end of input";
              return "Expected " + expectedDesc + " but " + foundDesc + " found.";
            }
            var posDetails = peg$computePosDetails(pos), found = pos < input.length ? input.charAt(pos) : null;
            if (expected2 !== null) {
              cleanupExpected(expected2);
            }
            return new SyntaxError(message !== null ? message : buildMessage(expected2, found), expected2, found, pos, posDetails.line, posDetails.column);
          }
          function peg$parsestart() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 0, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseline();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parseline();
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c1();
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseline() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 49 + 1, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseS();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parseS();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseexpression();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseS();
                }
                if (s3 !== peg$FAILED) {
                  s4 = [];
                  s5 = peg$parsecomment();
                  while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    s5 = peg$parsecomment();
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parseNL();
                    if (s6 !== peg$FAILED) {
                      while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        s6 = peg$parseNL();
                      }
                    } else {
                      s5 = peg$c2;
                    }
                    if (s5 === peg$FAILED) {
                      s5 = peg$parseEOF();
                    }
                    if (s5 !== peg$FAILED) {
                      s1 = [s1, s2, s3, s4, s5];
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = [];
              s2 = peg$parseS();
              if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                  s1.push(s2);
                  s2 = peg$parseS();
                }
              } else {
                s1 = peg$c2;
              }
              if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseNL();
                if (s3 !== peg$FAILED) {
                  while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseNL();
                  }
                } else {
                  s2 = peg$c2;
                }
                if (s2 === peg$FAILED) {
                  s2 = peg$parseEOF();
                }
                if (s2 !== peg$FAILED) {
                  s1 = [s1, s2];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$parseNL();
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseexpression() {
            var s0;
            var key = peg$currPos * 49 + 2, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parsecomment();
            if (s0 === peg$FAILED) {
              s0 = peg$parsepath();
              if (s0 === peg$FAILED) {
                s0 = peg$parsetablearray();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseassignment();
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsecomment() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 49 + 3, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 35) {
              s1 = peg$c3;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c4);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$currPos;
              s4 = peg$currPos;
              peg$silentFails++;
              s5 = peg$parseNL();
              if (s5 === peg$FAILED) {
                s5 = peg$parseEOF();
              }
              peg$silentFails--;
              if (s5 === peg$FAILED) {
                s4 = peg$c5;
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
              if (s4 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c6);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c2;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c2;
              }
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$currPos;
                peg$silentFails++;
                s5 = peg$parseNL();
                if (s5 === peg$FAILED) {
                  s5 = peg$parseEOF();
                }
                peg$silentFails--;
                if (s5 === peg$FAILED) {
                  s4 = peg$c5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c2;
                }
                if (s4 !== peg$FAILED) {
                  if (input.length > peg$currPos) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c6);
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    s4 = [s4, s5];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c2;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c2;
                }
              }
              if (s2 !== peg$FAILED) {
                s1 = [s1, s2];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsepath() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 49 + 4, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s1 = peg$c7;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseS();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseS();
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parsetable_key();
                if (s3 !== peg$FAILED) {
                  s4 = [];
                  s5 = peg$parseS();
                  while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    s5 = peg$parseS();
                  }
                  if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s5 = peg$c9;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c10);
                      }
                    }
                    if (s5 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c11(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsetablearray() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            var key = peg$currPos * 49 + 5, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s1 = peg$c7;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 91) {
                s2 = peg$c7;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c8);
                }
              }
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseS();
                }
                if (s3 !== peg$FAILED) {
                  s4 = peg$parsetable_key();
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parseS();
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parseS();
                    }
                    if (s5 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 93) {
                        s6 = peg$c9;
                        peg$currPos++;
                      } else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c10);
                        }
                      }
                      if (s6 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 93) {
                          s7 = peg$c9;
                          peg$currPos++;
                        } else {
                          s7 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c10);
                          }
                        }
                        if (s7 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c12(s4);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsetable_key() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 6, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsedot_ended_table_key_part();
            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parsedot_ended_table_key_part();
              }
            } else {
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsetable_key_part();
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c13(s1, s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsetable_key_part();
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c14(s1);
              }
              s0 = s1;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsetable_key_part() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 7, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseS();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parseS();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsekey();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseS();
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c15(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = [];
              s2 = peg$parseS();
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseS();
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsequoted_key();
                if (s2 !== peg$FAILED) {
                  s3 = [];
                  s4 = peg$parseS();
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parseS();
                  }
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c15(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsedot_ended_table_key_part() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 49 + 8, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseS();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parseS();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsekey();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseS();
                }
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c16;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c17);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parseS();
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parseS();
                    }
                    if (s5 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c15(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = [];
              s2 = peg$parseS();
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseS();
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsequoted_key();
                if (s2 !== peg$FAILED) {
                  s3 = [];
                  s4 = peg$parseS();
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parseS();
                  }
                  if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                      s4 = peg$c16;
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c17);
                      }
                    }
                    if (s4 !== peg$FAILED) {
                      s5 = [];
                      s6 = peg$parseS();
                      while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        s6 = peg$parseS();
                      }
                      if (s5 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c15(s2);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseassignment() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 49 + 9, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parsekey();
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseS();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseS();
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 61) {
                  s3 = peg$c18;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c19);
                  }
                }
                if (s3 !== peg$FAILED) {
                  s4 = [];
                  s5 = peg$parseS();
                  while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    s5 = peg$parseS();
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsevalue();
                    if (s5 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c20(s1, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsequoted_key();
              if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseS();
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parseS();
                }
                if (s2 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c18;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c19);
                    }
                  }
                  if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$parseS();
                    while (s5 !== peg$FAILED) {
                      s4.push(s5);
                      s5 = peg$parseS();
                    }
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parsevalue();
                      if (s5 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c20(s1, s5);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsekey() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 10, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseASCII_BASIC();
            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseASCII_BASIC();
              }
            } else {
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c21(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsequoted_key() {
            var s0, s1;
            var key = peg$currPos * 49 + 11, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parsedouble_quoted_single_line_string();
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c22(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsesingle_quoted_single_line_string();
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c22(s1);
              }
              s0 = s1;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsevalue() {
            var s0;
            var key = peg$currPos * 49 + 12, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parsestring();
            if (s0 === peg$FAILED) {
              s0 = peg$parsedatetime();
              if (s0 === peg$FAILED) {
                s0 = peg$parsefloat();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseinteger();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseboolean();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parsearray();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseinline_table();
                      }
                    }
                  }
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsestring() {
            var s0;
            var key = peg$currPos * 49 + 13, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parsedouble_quoted_multiline_string();
            if (s0 === peg$FAILED) {
              s0 = peg$parsedouble_quoted_single_line_string();
              if (s0 === peg$FAILED) {
                s0 = peg$parsesingle_quoted_multiline_string();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsesingle_quoted_single_line_string();
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsedouble_quoted_multiline_string() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 14, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c23) {
              s1 = peg$c23;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c24);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseNL();
              if (s2 === peg$FAILED) {
                s2 = peg$c25;
              }
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsemultiline_string_char();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parsemultiline_string_char();
                }
                if (s3 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 3) === peg$c23) {
                    s4 = peg$c23;
                    peg$currPos += 3;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c24);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c26(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsedouble_quoted_single_line_string() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 49 + 15, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 34) {
              s1 = peg$c27;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c28);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsestring_char();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsestring_char();
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                  s3 = peg$c27;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c28);
                  }
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c26(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsesingle_quoted_multiline_string() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 16, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c29) {
              s1 = peg$c29;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c30);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseNL();
              if (s2 === peg$FAILED) {
                s2 = peg$c25;
              }
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsemultiline_literal_char();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parsemultiline_literal_char();
                }
                if (s3 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 3) === peg$c29) {
                    s4 = peg$c29;
                    peg$currPos += 3;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c30);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c26(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsesingle_quoted_single_line_string() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 49 + 17, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
              s1 = peg$c31;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c32);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseliteral_char();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseliteral_char();
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 39) {
                  s3 = peg$c31;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c32);
                  }
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c26(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsestring_char() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 18, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parseESCAPED();
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$currPos;
              peg$silentFails++;
              if (input.charCodeAt(peg$currPos) === 34) {
                s2 = peg$c27;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c28);
                }
              }
              peg$silentFails--;
              if (s2 === peg$FAILED) {
                s1 = peg$c5;
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
              if (s1 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s2 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c6);
                  }
                }
                if (s2 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c33(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseliteral_char() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 19, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 39) {
              s2 = peg$c31;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c32);
              }
            }
            peg$silentFails--;
            if (s2 === peg$FAILED) {
              s1 = peg$c5;
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              if (input.length > peg$currPos) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c6);
                }
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c33(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsemultiline_string_char() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 20, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parseESCAPED();
            if (s0 === peg$FAILED) {
              s0 = peg$parsemultiline_string_delim();
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.substr(peg$currPos, 3) === peg$c23) {
                  s2 = peg$c23;
                  peg$currPos += 3;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c24);
                  }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                  s1 = peg$c5;
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
                if (s1 !== peg$FAILED) {
                  if (input.length > peg$currPos) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c6);
                    }
                  }
                  if (s2 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c34(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsemultiline_string_delim() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 21, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c35;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c36);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseNL();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseNLS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseNLS();
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c37();
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsemultiline_literal_char() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 22, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            if (input.substr(peg$currPos, 3) === peg$c29) {
              s2 = peg$c29;
              peg$currPos += 3;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c30);
              }
            }
            peg$silentFails--;
            if (s2 === peg$FAILED) {
              s1 = peg$c5;
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              if (input.length > peg$currPos) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c6);
                }
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c33(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsefloat() {
            var s0, s1, s2, s3;
            var key = peg$currPos * 49 + 23, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parsefloat_text();
            if (s1 === peg$FAILED) {
              s1 = peg$parseinteger_text();
            }
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 101) {
                s2 = peg$c38;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c39);
                }
              }
              if (s2 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 69) {
                  s2 = peg$c40;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c41);
                  }
                }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parseinteger_text();
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c42(s1, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsefloat_text();
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c43(s1);
              }
              s0 = s1;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsefloat_text() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 49 + 24, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 43) {
              s1 = peg$c44;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c45);
              }
            }
            if (s1 === peg$FAILED) {
              s1 = peg$c25;
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parseDIGITS();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                  s4 = peg$c16;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c17);
                  }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseDIGITS();
                  if (s5 !== peg$FAILED) {
                    s3 = [s3, s4, s5];
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c46(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c47;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c48);
                }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseDIGITS();
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c16;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c17);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseDIGITS();
                    if (s5 !== peg$FAILED) {
                      s3 = [s3, s4, s5];
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c2;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
                if (s2 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c49(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseinteger() {
            var s0, s1;
            var key = peg$currPos * 49 + 25, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parseinteger_text();
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c50(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseinteger_text() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 26, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 43) {
              s1 = peg$c44;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c45);
              }
            }
            if (s1 === peg$FAILED) {
              s1 = peg$c25;
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseDIGIT_OR_UNDER();
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parseDIGIT_OR_UNDER();
                }
              } else {
                s2 = peg$c2;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 46) {
                  s4 = peg$c16;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c17);
                  }
                }
                peg$silentFails--;
                if (s4 === peg$FAILED) {
                  s3 = peg$c5;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c2;
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c46(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c47;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c48);
                }
              }
              if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDIGIT_OR_UNDER();
                if (s3 !== peg$FAILED) {
                  while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDIGIT_OR_UNDER();
                  }
                } else {
                  s2 = peg$c2;
                }
                if (s2 !== peg$FAILED) {
                  s3 = peg$currPos;
                  peg$silentFails++;
                  if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c16;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c17);
                    }
                  }
                  peg$silentFails--;
                  if (s4 === peg$FAILED) {
                    s3 = peg$c5;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c2;
                  }
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c49(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseboolean() {
            var s0, s1;
            var key = peg$currPos * 49 + 27, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c51) {
              s1 = peg$c51;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c52);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c53();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 5) === peg$c54) {
                s1 = peg$c54;
                peg$currPos += 5;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c55);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c56();
              }
              s0 = s1;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsearray() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 28, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s1 = peg$c7;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsearray_sep();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsearray_sep();
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s3 = peg$c9;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c10);
                  }
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c57();
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 91) {
                s1 = peg$c7;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c8);
                }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsearray_value();
                if (s2 === peg$FAILED) {
                  s2 = peg$c25;
                }
                if (s2 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s3 = peg$c9;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c58(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 91) {
                  s1 = peg$c7;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                  }
                }
                if (s1 !== peg$FAILED) {
                  s2 = [];
                  s3 = peg$parsearray_value_list();
                  if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                      s2.push(s3);
                      s3 = peg$parsearray_value_list();
                    }
                  } else {
                    s2 = peg$c2;
                  }
                  if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s3 = peg$c9;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c10);
                      }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c59(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 91) {
                    s1 = peg$c7;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c8);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parsearray_value_list();
                    if (s3 !== peg$FAILED) {
                      while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parsearray_value_list();
                      }
                    } else {
                      s2 = peg$c2;
                    }
                    if (s2 !== peg$FAILED) {
                      s3 = peg$parsearray_value();
                      if (s3 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 93) {
                          s4 = peg$c9;
                          peg$currPos++;
                        } else {
                          s4 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c10);
                          }
                        }
                        if (s4 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c60(s2, s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsearray_value() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 29, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsearray_sep();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsearray_sep();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsevalue();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsearray_sep();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parsearray_sep();
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c61(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsearray_value_list() {
            var s0, s1, s2, s3, s4, s5, s6;
            var key = peg$currPos * 49 + 30, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsearray_sep();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsearray_sep();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsevalue();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsearray_sep();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parsearray_sep();
                }
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s4 = peg$c62;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c63);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parsearray_sep();
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parsearray_sep();
                    }
                    if (s5 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c61(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsearray_sep() {
            var s0;
            var key = peg$currPos * 49 + 31, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parseS();
            if (s0 === peg$FAILED) {
              s0 = peg$parseNL();
              if (s0 === peg$FAILED) {
                s0 = peg$parsecomment();
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseinline_table() {
            var s0, s1, s2, s3, s4, s5;
            var key = peg$currPos * 49 + 32, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 123) {
              s1 = peg$c64;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c65);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseS();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseS();
              }
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseinline_table_assignment();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseinline_table_assignment();
                }
                if (s3 !== peg$FAILED) {
                  s4 = [];
                  s5 = peg$parseS();
                  while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    s5 = peg$parseS();
                  }
                  if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s5 = peg$c66;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c67);
                      }
                    }
                    if (s5 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c68(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseinline_table_assignment() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            var key = peg$currPos * 49 + 33, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseS();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parseS();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsekey();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseS();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseS();
                }
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s4 = peg$c18;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c19);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parseS();
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parseS();
                    }
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsevalue();
                      if (s6 !== peg$FAILED) {
                        s7 = [];
                        s8 = peg$parseS();
                        while (s8 !== peg$FAILED) {
                          s7.push(s8);
                          s8 = peg$parseS();
                        }
                        if (s7 !== peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 44) {
                            s8 = peg$c62;
                            peg$currPos++;
                          } else {
                            s8 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c63);
                            }
                          }
                          if (s8 !== peg$FAILED) {
                            s9 = [];
                            s10 = peg$parseS();
                            while (s10 !== peg$FAILED) {
                              s9.push(s10);
                              s10 = peg$parseS();
                            }
                            if (s9 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c69(s2, s6);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c2;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c2;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = [];
              s2 = peg$parseS();
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseS();
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsekey();
                if (s2 !== peg$FAILED) {
                  s3 = [];
                  s4 = peg$parseS();
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parseS();
                  }
                  if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                      s4 = peg$c18;
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c19);
                      }
                    }
                    if (s4 !== peg$FAILED) {
                      s5 = [];
                      s6 = peg$parseS();
                      while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        s6 = peg$parseS();
                      }
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parsevalue();
                        if (s6 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c69(s2, s6);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsesecfragment() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 34, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
              s1 = peg$c16;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c17);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseDIGITS();
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c70(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsedate() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            var key = peg$currPos * 49 + 35, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseDIGIT_OR_UNDER();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseDIGIT_OR_UNDER();
              if (s3 !== peg$FAILED) {
                s4 = peg$parseDIGIT_OR_UNDER();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseDIGIT_OR_UNDER();
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 45) {
                      s6 = peg$c47;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c48);
                      }
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseDIGIT_OR_UNDER();
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseDIGIT_OR_UNDER();
                        if (s8 !== peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 45) {
                            s9 = peg$c47;
                            peg$currPos++;
                          } else {
                            s9 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c48);
                            }
                          }
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parseDIGIT_OR_UNDER();
                            if (s10 !== peg$FAILED) {
                              s11 = peg$parseDIGIT_OR_UNDER();
                              if (s11 !== peg$FAILED) {
                                s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
                                s1 = s2;
                              } else {
                                peg$currPos = s1;
                                s1 = peg$c2;
                              }
                            } else {
                              peg$currPos = s1;
                              s1 = peg$c2;
                            }
                          } else {
                            peg$currPos = s1;
                            s1 = peg$c2;
                          }
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c71(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsetime() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            var key = peg$currPos * 49 + 36, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseDIGIT_OR_UNDER();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseDIGIT_OR_UNDER();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s4 = peg$c72;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c73);
                  }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseDIGIT_OR_UNDER();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseDIGIT_OR_UNDER();
                    if (s6 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 58) {
                        s7 = peg$c72;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c73);
                        }
                      }
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseDIGIT_OR_UNDER();
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parseDIGIT_OR_UNDER();
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parsesecfragment();
                            if (s10 === peg$FAILED) {
                              s10 = peg$c25;
                            }
                            if (s10 !== peg$FAILED) {
                              s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10];
                              s1 = s2;
                            } else {
                              peg$currPos = s1;
                              s1 = peg$c2;
                            }
                          } else {
                            peg$currPos = s1;
                            s1 = peg$c2;
                          }
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c74(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsetime_with_offset() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;
            var key = peg$currPos * 49 + 37, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseDIGIT_OR_UNDER();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseDIGIT_OR_UNDER();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s4 = peg$c72;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c73);
                  }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseDIGIT_OR_UNDER();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseDIGIT_OR_UNDER();
                    if (s6 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 58) {
                        s7 = peg$c72;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c73);
                        }
                      }
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseDIGIT_OR_UNDER();
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parseDIGIT_OR_UNDER();
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parsesecfragment();
                            if (s10 === peg$FAILED) {
                              s10 = peg$c25;
                            }
                            if (s10 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 45) {
                                s11 = peg$c47;
                                peg$currPos++;
                              } else {
                                s11 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$c48);
                                }
                              }
                              if (s11 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 43) {
                                  s11 = peg$c44;
                                  peg$currPos++;
                                } else {
                                  s11 = peg$FAILED;
                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$c45);
                                  }
                                }
                              }
                              if (s11 !== peg$FAILED) {
                                s12 = peg$parseDIGIT_OR_UNDER();
                                if (s12 !== peg$FAILED) {
                                  s13 = peg$parseDIGIT_OR_UNDER();
                                  if (s13 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 58) {
                                      s14 = peg$c72;
                                      peg$currPos++;
                                    } else {
                                      s14 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$c73);
                                      }
                                    }
                                    if (s14 !== peg$FAILED) {
                                      s15 = peg$parseDIGIT_OR_UNDER();
                                      if (s15 !== peg$FAILED) {
                                        s16 = peg$parseDIGIT_OR_UNDER();
                                        if (s16 !== peg$FAILED) {
                                          s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16];
                                          s1 = s2;
                                        } else {
                                          peg$currPos = s1;
                                          s1 = peg$c2;
                                        }
                                      } else {
                                        peg$currPos = s1;
                                        s1 = peg$c2;
                                      }
                                    } else {
                                      peg$currPos = s1;
                                      s1 = peg$c2;
                                    }
                                  } else {
                                    peg$currPos = s1;
                                    s1 = peg$c2;
                                  }
                                } else {
                                  peg$currPos = s1;
                                  s1 = peg$c2;
                                }
                              } else {
                                peg$currPos = s1;
                                s1 = peg$c2;
                              }
                            } else {
                              peg$currPos = s1;
                              s1 = peg$c2;
                            }
                          } else {
                            peg$currPos = s1;
                            s1 = peg$c2;
                          }
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c74(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parsedatetime() {
            var s0, s1, s2, s3, s4;
            var key = peg$currPos * 49 + 38, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = peg$parsedate();
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 84) {
                s2 = peg$c75;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c76);
                }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parsetime();
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 90) {
                    s4 = peg$c77;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c78);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c79(s1, s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsedate();
              if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 84) {
                  s2 = peg$c75;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c76);
                  }
                }
                if (s2 !== peg$FAILED) {
                  s3 = peg$parsetime_with_offset();
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c80(s1, s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseS() {
            var s0;
            var key = peg$currPos * 49 + 39, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            if (peg$c81.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c82);
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseNL() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 40, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            if (input.charCodeAt(peg$currPos) === 10) {
              s0 = peg$c83;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c84);
              }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 13) {
                s1 = peg$c85;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c86);
                }
              }
              if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 10) {
                  s2 = peg$c83;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c84);
                  }
                }
                if (s2 !== peg$FAILED) {
                  s1 = [s1, s2];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseNLS() {
            var s0;
            var key = peg$currPos * 49 + 41, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$parseNL();
            if (s0 === peg$FAILED) {
              s0 = peg$parseS();
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseEOF() {
            var s0, s1;
            var key = peg$currPos * 49 + 42, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            peg$silentFails++;
            if (input.length > peg$currPos) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c6);
              }
            }
            peg$silentFails--;
            if (s1 === peg$FAILED) {
              s0 = peg$c5;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseHEX() {
            var s0;
            var key = peg$currPos * 49 + 43, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            if (peg$c87.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c88);
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseDIGIT_OR_UNDER() {
            var s0, s1;
            var key = peg$currPos * 49 + 44, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            if (peg$c89.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c90);
              }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 95) {
                s1 = peg$c91;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c92);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c93();
              }
              s0 = s1;
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseASCII_BASIC() {
            var s0;
            var key = peg$currPos * 49 + 45, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            if (peg$c94.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c95);
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseDIGITS() {
            var s0, s1, s2;
            var key = peg$currPos * 49 + 46, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseDIGIT_OR_UNDER();
            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseDIGIT_OR_UNDER();
              }
            } else {
              s1 = peg$c2;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c96(s1);
            }
            s0 = s1;
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseESCAPED() {
            var s0, s1;
            var key = peg$currPos * 49 + 47, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c97) {
              s1 = peg$c97;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c98);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c99();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c100) {
                s1 = peg$c100;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c101);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c102();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c103) {
                  s1 = peg$c103;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c104);
                  }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c105();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c106) {
                    s1 = peg$c106;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c107);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c108();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c109) {
                      s1 = peg$c109;
                      peg$currPos += 2;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c110);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c111();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.substr(peg$currPos, 2) === peg$c112) {
                        s1 = peg$c112;
                        peg$currPos += 2;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c113);
                        }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c114();
                      }
                      s0 = s1;
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c115) {
                          s1 = peg$c115;
                          peg$currPos += 2;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c116);
                          }
                        }
                        if (s1 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c117();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseESCAPED_UNICODE();
                        }
                      }
                    }
                  }
                }
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          function peg$parseESCAPED_UNICODE() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            var key = peg$currPos * 49 + 48, cached = peg$cache[key];
            if (cached) {
              peg$currPos = cached.nextPos;
              return cached.result;
            }
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c118) {
              s1 = peg$c118;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c119);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parseHEX();
              if (s3 !== peg$FAILED) {
                s4 = peg$parseHEX();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseHEX();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseHEX();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseHEX();
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseHEX();
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parseHEX();
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parseHEX();
                            if (s10 !== peg$FAILED) {
                              s3 = [s3, s4, s5, s6, s7, s8, s9, s10];
                              s2 = s3;
                            } else {
                              peg$currPos = s2;
                              s2 = peg$c2;
                            }
                          } else {
                            peg$currPos = s2;
                            s2 = peg$c2;
                          }
                        } else {
                          peg$currPos = s2;
                          s2 = peg$c2;
                        }
                      } else {
                        peg$currPos = s2;
                        s2 = peg$c2;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c2;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c120(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c121) {
                s1 = peg$c121;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c122);
                }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseHEX();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parseHEX();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseHEX();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parseHEX();
                      if (s6 !== peg$FAILED) {
                        s3 = [s3, s4, s5, s6];
                        s2 = s3;
                      } else {
                        peg$currPos = s2;
                        s2 = peg$c2;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c2;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
                if (s2 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c120(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
            peg$cache[key] = {nextPos: peg$currPos, result: s0};
            return s0;
          }
          var nodes = [];
          function genError(err, line2, col) {
            var ex = new Error(err);
            ex.line = line2;
            ex.column = col;
            throw ex;
          }
          function addNode(node2) {
            nodes.push(node2);
          }
          function node(type, value, line2, column2, key) {
            var obj = {type, value, line: line2(), column: column2()};
            if (key)
              obj.key = key;
            return obj;
          }
          function convertCodePoint(str, line2, col) {
            var num = parseInt("0x" + str);
            if (!isFinite(num) || Math.floor(num) != num || num < 0 || num > 1114111 || num > 55295 && num < 57344) {
              genError("Invalid Unicode escape code: " + str, line2, col);
            } else {
              return fromCodePoint(num);
            }
          }
          function fromCodePoint() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                result += String.fromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          }
          peg$result = peg$startRuleFunction();
          if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
          } else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
              peg$fail({type: "end", description: "end of input"});
            }
            throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
          }
        }
        return {
          SyntaxError,
          parse
        };
      }();
    }
  });

  // node_modules/toml/lib/compiler.js
  var require_compiler = __commonJS({
    "node_modules/toml/lib/compiler.js"(exports, module) {
      "use strict";
      function compile(nodes) {
        var assignedPaths = [];
        var valueAssignments = [];
        var currentPath = "";
        var data = Object.create(null);
        var context = data;
        var arrayMode = false;
        return reduce(nodes);
        function reduce(nodes2) {
          var node;
          for (var i = 0; i < nodes2.length; i++) {
            node = nodes2[i];
            switch (node.type) {
              case "Assign":
                assign(node);
                break;
              case "ObjectPath":
                setPath(node);
                break;
              case "ArrayPath":
                addTableArray(node);
                break;
            }
          }
          return data;
        }
        function genError(err, line, col) {
          var ex = new Error(err);
          ex.line = line;
          ex.column = col;
          throw ex;
        }
        function assign(node) {
          var key = node.key;
          var value = node.value;
          var line = node.line;
          var column = node.column;
          var fullPath;
          if (currentPath) {
            fullPath = currentPath + "." + key;
          } else {
            fullPath = key;
          }
          if (typeof context[key] !== "undefined") {
            genError("Cannot redefine existing key '" + fullPath + "'.", line, column);
          }
          context[key] = reduceValueNode(value);
          if (!pathAssigned(fullPath)) {
            assignedPaths.push(fullPath);
            valueAssignments.push(fullPath);
          }
        }
        function pathAssigned(path) {
          return assignedPaths.indexOf(path) !== -1;
        }
        function reduceValueNode(node) {
          if (node.type === "Array") {
            return reduceArrayWithTypeChecking(node.value);
          } else if (node.type === "InlineTable") {
            return reduceInlineTableNode(node.value);
          } else {
            return node.value;
          }
        }
        function reduceInlineTableNode(values) {
          var obj = Object.create(null);
          for (var i = 0; i < values.length; i++) {
            var val = values[i];
            if (val.value.type === "InlineTable") {
              obj[val.key] = reduceInlineTableNode(val.value.value);
            } else if (val.type === "InlineTableValue") {
              obj[val.key] = reduceValueNode(val.value);
            }
          }
          return obj;
        }
        function setPath(node) {
          var path = node.value;
          var quotedPath = path.map(quoteDottedString).join(".");
          var line = node.line;
          var column = node.column;
          if (pathAssigned(quotedPath)) {
            genError("Cannot redefine existing key '" + path + "'.", line, column);
          }
          assignedPaths.push(quotedPath);
          context = deepRef(data, path, Object.create(null), line, column);
          currentPath = path;
        }
        function addTableArray(node) {
          var path = node.value;
          var quotedPath = path.map(quoteDottedString).join(".");
          var line = node.line;
          var column = node.column;
          if (!pathAssigned(quotedPath)) {
            assignedPaths.push(quotedPath);
          }
          assignedPaths = assignedPaths.filter(function(p) {
            return p.indexOf(quotedPath) !== 0;
          });
          assignedPaths.push(quotedPath);
          context = deepRef(data, path, [], line, column);
          currentPath = quotedPath;
          if (context instanceof Array) {
            var newObj = Object.create(null);
            context.push(newObj);
            context = newObj;
          } else {
            genError("Cannot redefine existing key '" + path + "'.", line, column);
          }
        }
        function deepRef(start, keys, value, line, column) {
          var traversed = [];
          var traversedPath = "";
          var path = keys.join(".");
          var ctx = start;
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            traversed.push(key);
            traversedPath = traversed.join(".");
            if (typeof ctx[key] === "undefined") {
              if (i === keys.length - 1) {
                ctx[key] = value;
              } else {
                ctx[key] = Object.create(null);
              }
            } else if (i !== keys.length - 1 && valueAssignments.indexOf(traversedPath) > -1) {
              genError("Cannot redefine existing key '" + traversedPath + "'.", line, column);
            }
            ctx = ctx[key];
            if (ctx instanceof Array && ctx.length && i < keys.length - 1) {
              ctx = ctx[ctx.length - 1];
            }
          }
          return ctx;
        }
        function reduceArrayWithTypeChecking(array) {
          var firstType = null;
          for (var i = 0; i < array.length; i++) {
            var node = array[i];
            if (firstType === null) {
              firstType = node.type;
            } else {
              if (node.type !== firstType) {
                genError("Cannot add value of type " + node.type + " to array of type " + firstType + ".", node.line, node.column);
              }
            }
          }
          return array.map(reduceValueNode);
        }
        function quoteDottedString(str) {
          if (str.indexOf(".") > -1) {
            return '"' + str + '"';
          } else {
            return str;
          }
        }
      }
      module.exports = {
        compile
      };
    }
  });

  // node_modules/toml/index.js
  var require_toml = __commonJS({
    "node_modules/toml/index.js"(exports, module) {
      var parser = require_parser();
      var compiler = require_compiler();
      module.exports = {
        parse: function(input) {
          var nodes = parser.parse(input.toString());
          return compiler.compile(nodes);
        }
      };
    }
  });

  // node_modules/js-yaml/lib/common.js
  var require_common = __commonJS({
    "node_modules/js-yaml/lib/common.js"(exports, module) {
      "use strict";
      function isNothing(subject) {
        return typeof subject === "undefined" || subject === null;
      }
      function isObject(subject) {
        return typeof subject === "object" && subject !== null;
      }
      function toArray(sequence) {
        if (Array.isArray(sequence))
          return sequence;
        else if (isNothing(sequence))
          return [];
        return [sequence];
      }
      function extend(target, source) {
        var index, length, key, sourceKeys;
        if (source) {
          sourceKeys = Object.keys(source);
          for (index = 0, length = sourceKeys.length; index < length; index += 1) {
            key = sourceKeys[index];
            target[key] = source[key];
          }
        }
        return target;
      }
      function repeat(string, count) {
        var result = "", cycle;
        for (cycle = 0; cycle < count; cycle += 1) {
          result += string;
        }
        return result;
      }
      function isNegativeZero(number) {
        return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
      }
      module.exports.isNothing = isNothing;
      module.exports.isObject = isObject;
      module.exports.toArray = toArray;
      module.exports.repeat = repeat;
      module.exports.isNegativeZero = isNegativeZero;
      module.exports.extend = extend;
    }
  });

  // node_modules/js-yaml/lib/exception.js
  var require_exception = __commonJS({
    "node_modules/js-yaml/lib/exception.js"(exports, module) {
      "use strict";
      function formatError(exception, compact) {
        var where = "", message = exception.reason || "(unknown reason)";
        if (!exception.mark)
          return message;
        if (exception.mark.name) {
          where += 'in "' + exception.mark.name + '" ';
        }
        where += "(" + (exception.mark.line + 1) + ":" + (exception.mark.column + 1) + ")";
        if (!compact && exception.mark.snippet) {
          where += "\n\n" + exception.mark.snippet;
        }
        return message + " " + where;
      }
      function YAMLException(reason, mark) {
        Error.call(this);
        this.name = "YAMLException";
        this.reason = reason;
        this.mark = mark;
        this.message = formatError(this, false);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          this.stack = new Error().stack || "";
        }
      }
      YAMLException.prototype = Object.create(Error.prototype);
      YAMLException.prototype.constructor = YAMLException;
      YAMLException.prototype.toString = function toString(compact) {
        return this.name + ": " + formatError(this, compact);
      };
      module.exports = YAMLException;
    }
  });

  // node_modules/js-yaml/lib/snippet.js
  var require_snippet = __commonJS({
    "node_modules/js-yaml/lib/snippet.js"(exports, module) {
      "use strict";
      var common = require_common();
      function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
        var head = "";
        var tail = "";
        var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
        if (position - lineStart > maxHalfLength) {
          head = " ... ";
          lineStart = position - maxHalfLength + head.length;
        }
        if (lineEnd - position > maxHalfLength) {
          tail = " ...";
          lineEnd = position + maxHalfLength - tail.length;
        }
        return {
          str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
          pos: position - lineStart + head.length
        };
      }
      function padStart(string, max) {
        return common.repeat(" ", max - string.length) + string;
      }
      function makeSnippet(mark, options) {
        options = Object.create(options || null);
        if (!mark.buffer)
          return null;
        if (!options.maxLength)
          options.maxLength = 79;
        if (typeof options.indent !== "number")
          options.indent = 1;
        if (typeof options.linesBefore !== "number")
          options.linesBefore = 3;
        if (typeof options.linesAfter !== "number")
          options.linesAfter = 2;
        var re = /\r?\n|\r|\0/g;
        var lineStarts = [0];
        var lineEnds = [];
        var match;
        var foundLineNo = -1;
        while (match = re.exec(mark.buffer)) {
          lineEnds.push(match.index);
          lineStarts.push(match.index + match[0].length);
          if (mark.position <= match.index && foundLineNo < 0) {
            foundLineNo = lineStarts.length - 2;
          }
        }
        if (foundLineNo < 0)
          foundLineNo = lineStarts.length - 1;
        var result = "", i, line;
        var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
        var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
        for (i = 1; i <= options.linesBefore; i++) {
          if (foundLineNo - i < 0)
            break;
          line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
          result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
        }
        line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
        result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
        result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
        for (i = 1; i <= options.linesAfter; i++) {
          if (foundLineNo + i >= lineEnds.length)
            break;
          line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
          result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
        }
        return result.replace(/\n$/, "");
      }
      module.exports = makeSnippet;
    }
  });

  // node_modules/js-yaml/lib/type.js
  var require_type = __commonJS({
    "node_modules/js-yaml/lib/type.js"(exports, module) {
      "use strict";
      var YAMLException = require_exception();
      var TYPE_CONSTRUCTOR_OPTIONS = [
        "kind",
        "multi",
        "resolve",
        "construct",
        "instanceOf",
        "predicate",
        "represent",
        "representName",
        "defaultStyle",
        "styleAliases"
      ];
      var YAML_NODE_KINDS = [
        "scalar",
        "sequence",
        "mapping"
      ];
      function compileStyleAliases(map) {
        var result = {};
        if (map !== null) {
          Object.keys(map).forEach(function(style) {
            map[style].forEach(function(alias) {
              result[String(alias)] = style;
            });
          });
        }
        return result;
      }
      function Type(tag, options) {
        options = options || {};
        Object.keys(options).forEach(function(name) {
          if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
            throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
          }
        });
        this.options = options;
        this.tag = tag;
        this.kind = options["kind"] || null;
        this.resolve = options["resolve"] || function() {
          return true;
        };
        this.construct = options["construct"] || function(data) {
          return data;
        };
        this.instanceOf = options["instanceOf"] || null;
        this.predicate = options["predicate"] || null;
        this.represent = options["represent"] || null;
        this.representName = options["representName"] || null;
        this.defaultStyle = options["defaultStyle"] || null;
        this.multi = options["multi"] || false;
        this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
        if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
          throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
        }
      }
      module.exports = Type;
    }
  });

  // node_modules/js-yaml/lib/schema.js
  var require_schema = __commonJS({
    "node_modules/js-yaml/lib/schema.js"(exports, module) {
      "use strict";
      var YAMLException = require_exception();
      var Type = require_type();
      function compileList(schema, name) {
        var result = [];
        schema[name].forEach(function(currentType) {
          var newIndex = result.length;
          result.forEach(function(previousType, previousIndex) {
            if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
              newIndex = previousIndex;
            }
          });
          result[newIndex] = currentType;
        });
        return result;
      }
      function compileMap() {
        var result = {
          scalar: {},
          sequence: {},
          mapping: {},
          fallback: {},
          multi: {
            scalar: [],
            sequence: [],
            mapping: [],
            fallback: []
          }
        }, index, length;
        function collectType(type) {
          if (type.multi) {
            result.multi[type.kind].push(type);
            result.multi["fallback"].push(type);
          } else {
            result[type.kind][type.tag] = result["fallback"][type.tag] = type;
          }
        }
        for (index = 0, length = arguments.length; index < length; index += 1) {
          arguments[index].forEach(collectType);
        }
        return result;
      }
      function Schema(definition) {
        return this.extend(definition);
      }
      Schema.prototype.extend = function extend(definition) {
        var implicit = [];
        var explicit = [];
        if (definition instanceof Type) {
          explicit.push(definition);
        } else if (Array.isArray(definition)) {
          explicit = explicit.concat(definition);
        } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
          if (definition.implicit)
            implicit = implicit.concat(definition.implicit);
          if (definition.explicit)
            explicit = explicit.concat(definition.explicit);
        } else {
          throw new YAMLException("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
        }
        implicit.forEach(function(type) {
          if (!(type instanceof Type)) {
            throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
          }
          if (type.loadKind && type.loadKind !== "scalar") {
            throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
          }
          if (type.multi) {
            throw new YAMLException("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
          }
        });
        explicit.forEach(function(type) {
          if (!(type instanceof Type)) {
            throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
          }
        });
        var result = Object.create(Schema.prototype);
        result.implicit = (this.implicit || []).concat(implicit);
        result.explicit = (this.explicit || []).concat(explicit);
        result.compiledImplicit = compileList(result, "implicit");
        result.compiledExplicit = compileList(result, "explicit");
        result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
        return result;
      };
      module.exports = Schema;
    }
  });

  // node_modules/js-yaml/lib/type/str.js
  var require_str = __commonJS({
    "node_modules/js-yaml/lib/type/str.js"(exports, module) {
      "use strict";
      var Type = require_type();
      module.exports = new Type("tag:yaml.org,2002:str", {
        kind: "scalar",
        construct: function(data) {
          return data !== null ? data : "";
        }
      });
    }
  });

  // node_modules/js-yaml/lib/type/seq.js
  var require_seq = __commonJS({
    "node_modules/js-yaml/lib/type/seq.js"(exports, module) {
      "use strict";
      var Type = require_type();
      module.exports = new Type("tag:yaml.org,2002:seq", {
        kind: "sequence",
        construct: function(data) {
          return data !== null ? data : [];
        }
      });
    }
  });

  // node_modules/js-yaml/lib/type/map.js
  var require_map = __commonJS({
    "node_modules/js-yaml/lib/type/map.js"(exports, module) {
      "use strict";
      var Type = require_type();
      module.exports = new Type("tag:yaml.org,2002:map", {
        kind: "mapping",
        construct: function(data) {
          return data !== null ? data : {};
        }
      });
    }
  });

  // node_modules/js-yaml/lib/schema/failsafe.js
  var require_failsafe = __commonJS({
    "node_modules/js-yaml/lib/schema/failsafe.js"(exports, module) {
      "use strict";
      var Schema = require_schema();
      module.exports = new Schema({
        explicit: [
          require_str(),
          require_seq(),
          require_map()
        ]
      });
    }
  });

  // node_modules/js-yaml/lib/type/null.js
  var require_null = __commonJS({
    "node_modules/js-yaml/lib/type/null.js"(exports, module) {
      "use strict";
      var Type = require_type();
      function resolveYamlNull(data) {
        if (data === null)
          return true;
        var max = data.length;
        return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
      }
      function constructYamlNull() {
        return null;
      }
      function isNull(object) {
        return object === null;
      }
      module.exports = new Type("tag:yaml.org,2002:null", {
        kind: "scalar",
        resolve: resolveYamlNull,
        construct: constructYamlNull,
        predicate: isNull,
        represent: {
          canonical: function() {
            return "~";
          },
          lowercase: function() {
            return "null";
          },
          uppercase: function() {
            return "NULL";
          },
          camelcase: function() {
            return "Null";
          },
          empty: function() {
            return "";
          }
        },
        defaultStyle: "lowercase"
      });
    }
  });

  // node_modules/js-yaml/lib/type/bool.js
  var require_bool = __commonJS({
    "node_modules/js-yaml/lib/type/bool.js"(exports, module) {
      "use strict";
      var Type = require_type();
      function resolveYamlBoolean(data) {
        if (data === null)
          return false;
        var max = data.length;
        return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
      }
      function constructYamlBoolean(data) {
        return data === "true" || data === "True" || data === "TRUE";
      }
      function isBoolean(object) {
        return Object.prototype.toString.call(object) === "[object Boolean]";
      }
      module.exports = new Type("tag:yaml.org,2002:bool", {
        kind: "scalar",
        resolve: resolveYamlBoolean,
        construct: constructYamlBoolean,
        predicate: isBoolean,
        represent: {
          lowercase: function(object) {
            return object ? "true" : "false";
          },
          uppercase: function(object) {
            return object ? "TRUE" : "FALSE";
          },
          camelcase: function(object) {
            return object ? "True" : "False";
          }
        },
        defaultStyle: "lowercase"
      });
    }
  });

  // node_modules/js-yaml/lib/type/int.js
  var require_int = __commonJS({
    "node_modules/js-yaml/lib/type/int.js"(exports, module) {
      "use strict";
      var common = require_common();
      var Type = require_type();
      function isHexCode(c) {
        return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
      }
      function isOctCode(c) {
        return 48 <= c && c <= 55;
      }
      function isDecCode(c) {
        return 48 <= c && c <= 57;
      }
      function resolveYamlInteger(data) {
        if (data === null)
          return false;
        var max = data.length, index = 0, hasDigits = false, ch;
        if (!max)
          return false;
        ch = data[index];
        if (ch === "-" || ch === "+") {
          ch = data[++index];
        }
        if (ch === "0") {
          if (index + 1 === max)
            return true;
          ch = data[++index];
          if (ch === "b") {
            index++;
            for (; index < max; index++) {
              ch = data[index];
              if (ch === "_")
                continue;
              if (ch !== "0" && ch !== "1")
                return false;
              hasDigits = true;
            }
            return hasDigits && ch !== "_";
          }
          if (ch === "x") {
            index++;
            for (; index < max; index++) {
              ch = data[index];
              if (ch === "_")
                continue;
              if (!isHexCode(data.charCodeAt(index)))
                return false;
              hasDigits = true;
            }
            return hasDigits && ch !== "_";
          }
          if (ch === "o") {
            index++;
            for (; index < max; index++) {
              ch = data[index];
              if (ch === "_")
                continue;
              if (!isOctCode(data.charCodeAt(index)))
                return false;
              hasDigits = true;
            }
            return hasDigits && ch !== "_";
          }
        }
        if (ch === "_")
          return false;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (!isDecCode(data.charCodeAt(index))) {
            return false;
          }
          hasDigits = true;
        }
        if (!hasDigits || ch === "_")
          return false;
        return true;
      }
      function constructYamlInteger(data) {
        var value = data, sign = 1, ch;
        if (value.indexOf("_") !== -1) {
          value = value.replace(/_/g, "");
        }
        ch = value[0];
        if (ch === "-" || ch === "+") {
          if (ch === "-")
            sign = -1;
          value = value.slice(1);
          ch = value[0];
        }
        if (value === "0")
          return 0;
        if (ch === "0") {
          if (value[1] === "b")
            return sign * parseInt(value.slice(2), 2);
          if (value[1] === "x")
            return sign * parseInt(value.slice(2), 16);
          if (value[1] === "o")
            return sign * parseInt(value.slice(2), 8);
        }
        return sign * parseInt(value, 10);
      }
      function isInteger(object) {
        return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
      }
      module.exports = new Type("tag:yaml.org,2002:int", {
        kind: "scalar",
        resolve: resolveYamlInteger,
        construct: constructYamlInteger,
        predicate: isInteger,
        represent: {
          binary: function(obj) {
            return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
          },
          octal: function(obj) {
            return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
          },
          decimal: function(obj) {
            return obj.toString(10);
          },
          hexadecimal: function(obj) {
            return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
          }
        },
        defaultStyle: "decimal",
        styleAliases: {
          binary: [2, "bin"],
          octal: [8, "oct"],
          decimal: [10, "dec"],
          hexadecimal: [16, "hex"]
        }
      });
    }
  });

  // node_modules/js-yaml/lib/type/float.js
  var require_float = __commonJS({
    "node_modules/js-yaml/lib/type/float.js"(exports, module) {
      "use strict";
      var common = require_common();
      var Type = require_type();
      var YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
      function resolveYamlFloat(data) {
        if (data === null)
          return false;
        if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
          return false;
        }
        return true;
      }
      function constructYamlFloat(data) {
        var value, sign;
        value = data.replace(/_/g, "").toLowerCase();
        sign = value[0] === "-" ? -1 : 1;
        if ("+-".indexOf(value[0]) >= 0) {
          value = value.slice(1);
        }
        if (value === ".inf") {
          return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        } else if (value === ".nan") {
          return NaN;
        }
        return sign * parseFloat(value, 10);
      }
      var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
      function representYamlFloat(object, style) {
        var res;
        if (isNaN(object)) {
          switch (style) {
            case "lowercase":
              return ".nan";
            case "uppercase":
              return ".NAN";
            case "camelcase":
              return ".NaN";
          }
        } else if (Number.POSITIVE_INFINITY === object) {
          switch (style) {
            case "lowercase":
              return ".inf";
            case "uppercase":
              return ".INF";
            case "camelcase":
              return ".Inf";
          }
        } else if (Number.NEGATIVE_INFINITY === object) {
          switch (style) {
            case "lowercase":
              return "-.inf";
            case "uppercase":
              return "-.INF";
            case "camelcase":
              return "-.Inf";
          }
        } else if (common.isNegativeZero(object)) {
          return "-0.0";
        }
        res = object.toString(10);
        return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
      }
      function isFloat(object) {
        return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
      }
      module.exports = new Type("tag:yaml.org,2002:float", {
        kind: "scalar",
        resolve: resolveYamlFloat,
        construct: constructYamlFloat,
        predicate: isFloat,
        represent: representYamlFloat,
        defaultStyle: "lowercase"
      });
    }
  });

  // node_modules/js-yaml/lib/schema/json.js
  var require_json = __commonJS({
    "node_modules/js-yaml/lib/schema/json.js"(exports, module) {
      "use strict";
      module.exports = require_failsafe().extend({
        implicit: [
          require_null(),
          require_bool(),
          require_int(),
          require_float()
        ]
      });
    }
  });

  // node_modules/js-yaml/lib/schema/core.js
  var require_core = __commonJS({
    "node_modules/js-yaml/lib/schema/core.js"(exports, module) {
      "use strict";
      module.exports = require_json();
    }
  });

  // node_modules/js-yaml/lib/type/timestamp.js
  var require_timestamp = __commonJS({
    "node_modules/js-yaml/lib/type/timestamp.js"(exports, module) {
      "use strict";
      var Type = require_type();
      var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
      var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
      function resolveYamlTimestamp(data) {
        if (data === null)
          return false;
        if (YAML_DATE_REGEXP.exec(data) !== null)
          return true;
        if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
          return true;
        return false;
      }
      function constructYamlTimestamp(data) {
        var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
        match = YAML_DATE_REGEXP.exec(data);
        if (match === null)
          match = YAML_TIMESTAMP_REGEXP.exec(data);
        if (match === null)
          throw new Error("Date resolve error");
        year = +match[1];
        month = +match[2] - 1;
        day = +match[3];
        if (!match[4]) {
          return new Date(Date.UTC(year, month, day));
        }
        hour = +match[4];
        minute = +match[5];
        second = +match[6];
        if (match[7]) {
          fraction = match[7].slice(0, 3);
          while (fraction.length < 3) {
            fraction += "0";
          }
          fraction = +fraction;
        }
        if (match[9]) {
          tz_hour = +match[10];
          tz_minute = +(match[11] || 0);
          delta = (tz_hour * 60 + tz_minute) * 6e4;
          if (match[9] === "-")
            delta = -delta;
        }
        date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
        if (delta)
          date.setTime(date.getTime() - delta);
        return date;
      }
      function representYamlTimestamp(object) {
        return object.toISOString();
      }
      module.exports = new Type("tag:yaml.org,2002:timestamp", {
        kind: "scalar",
        resolve: resolveYamlTimestamp,
        construct: constructYamlTimestamp,
        instanceOf: Date,
        represent: representYamlTimestamp
      });
    }
  });

  // node_modules/js-yaml/lib/type/merge.js
  var require_merge = __commonJS({
    "node_modules/js-yaml/lib/type/merge.js"(exports, module) {
      "use strict";
      var Type = require_type();
      function resolveYamlMerge(data) {
        return data === "<<" || data === null;
      }
      module.exports = new Type("tag:yaml.org,2002:merge", {
        kind: "scalar",
        resolve: resolveYamlMerge
      });
    }
  });

  // node_modules/js-yaml/lib/type/binary.js
  var require_binary = __commonJS({
    "node_modules/js-yaml/lib/type/binary.js"(exports, module) {
      "use strict";
      var Type = require_type();
      var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
      function resolveYamlBinary(data) {
        if (data === null)
          return false;
        var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
        for (idx = 0; idx < max; idx++) {
          code = map.indexOf(data.charAt(idx));
          if (code > 64)
            continue;
          if (code < 0)
            return false;
          bitlen += 6;
        }
        return bitlen % 8 === 0;
      }
      function constructYamlBinary(data) {
        var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
        for (idx = 0; idx < max; idx++) {
          if (idx % 4 === 0 && idx) {
            result.push(bits >> 16 & 255);
            result.push(bits >> 8 & 255);
            result.push(bits & 255);
          }
          bits = bits << 6 | map.indexOf(input.charAt(idx));
        }
        tailbits = max % 4 * 6;
        if (tailbits === 0) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        } else if (tailbits === 18) {
          result.push(bits >> 10 & 255);
          result.push(bits >> 2 & 255);
        } else if (tailbits === 12) {
          result.push(bits >> 4 & 255);
        }
        return new Uint8Array(result);
      }
      function representYamlBinary(object) {
        var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
        for (idx = 0; idx < max; idx++) {
          if (idx % 3 === 0 && idx) {
            result += map[bits >> 18 & 63];
            result += map[bits >> 12 & 63];
            result += map[bits >> 6 & 63];
            result += map[bits & 63];
          }
          bits = (bits << 8) + object[idx];
        }
        tail = max % 3;
        if (tail === 0) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        } else if (tail === 2) {
          result += map[bits >> 10 & 63];
          result += map[bits >> 4 & 63];
          result += map[bits << 2 & 63];
          result += map[64];
        } else if (tail === 1) {
          result += map[bits >> 2 & 63];
          result += map[bits << 4 & 63];
          result += map[64];
          result += map[64];
        }
        return result;
      }
      function isBinary(obj) {
        return Object.prototype.toString.call(obj) === "[object Uint8Array]";
      }
      module.exports = new Type("tag:yaml.org,2002:binary", {
        kind: "scalar",
        resolve: resolveYamlBinary,
        construct: constructYamlBinary,
        predicate: isBinary,
        represent: representYamlBinary
      });
    }
  });

  // node_modules/js-yaml/lib/type/omap.js
  var require_omap = __commonJS({
    "node_modules/js-yaml/lib/type/omap.js"(exports, module) {
      "use strict";
      var Type = require_type();
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      var _toString = Object.prototype.toString;
      function resolveYamlOmap(data) {
        if (data === null)
          return true;
        var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
        for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          pairHasKey = false;
          if (_toString.call(pair) !== "[object Object]")
            return false;
          for (pairKey in pair) {
            if (_hasOwnProperty.call(pair, pairKey)) {
              if (!pairHasKey)
                pairHasKey = true;
              else
                return false;
            }
          }
          if (!pairHasKey)
            return false;
          if (objectKeys.indexOf(pairKey) === -1)
            objectKeys.push(pairKey);
          else
            return false;
        }
        return true;
      }
      function constructYamlOmap(data) {
        return data !== null ? data : [];
      }
      module.exports = new Type("tag:yaml.org,2002:omap", {
        kind: "sequence",
        resolve: resolveYamlOmap,
        construct: constructYamlOmap
      });
    }
  });

  // node_modules/js-yaml/lib/type/pairs.js
  var require_pairs = __commonJS({
    "node_modules/js-yaml/lib/type/pairs.js"(exports, module) {
      "use strict";
      var Type = require_type();
      var _toString = Object.prototype.toString;
      function resolveYamlPairs(data) {
        if (data === null)
          return true;
        var index, length, pair, keys, result, object = data;
        result = new Array(object.length);
        for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          if (_toString.call(pair) !== "[object Object]")
            return false;
          keys = Object.keys(pair);
          if (keys.length !== 1)
            return false;
          result[index] = [keys[0], pair[keys[0]]];
        }
        return true;
      }
      function constructYamlPairs(data) {
        if (data === null)
          return [];
        var index, length, pair, keys, result, object = data;
        result = new Array(object.length);
        for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          keys = Object.keys(pair);
          result[index] = [keys[0], pair[keys[0]]];
        }
        return result;
      }
      module.exports = new Type("tag:yaml.org,2002:pairs", {
        kind: "sequence",
        resolve: resolveYamlPairs,
        construct: constructYamlPairs
      });
    }
  });

  // node_modules/js-yaml/lib/type/set.js
  var require_set = __commonJS({
    "node_modules/js-yaml/lib/type/set.js"(exports, module) {
      "use strict";
      var Type = require_type();
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      function resolveYamlSet(data) {
        if (data === null)
          return true;
        var key, object = data;
        for (key in object) {
          if (_hasOwnProperty.call(object, key)) {
            if (object[key] !== null)
              return false;
          }
        }
        return true;
      }
      function constructYamlSet(data) {
        return data !== null ? data : {};
      }
      module.exports = new Type("tag:yaml.org,2002:set", {
        kind: "mapping",
        resolve: resolveYamlSet,
        construct: constructYamlSet
      });
    }
  });

  // node_modules/js-yaml/lib/schema/default.js
  var require_default = __commonJS({
    "node_modules/js-yaml/lib/schema/default.js"(exports, module) {
      "use strict";
      module.exports = require_core().extend({
        implicit: [
          require_timestamp(),
          require_merge()
        ],
        explicit: [
          require_binary(),
          require_omap(),
          require_pairs(),
          require_set()
        ]
      });
    }
  });

  // node_modules/js-yaml/lib/loader.js
  var require_loader = __commonJS({
    "node_modules/js-yaml/lib/loader.js"(exports, module) {
      "use strict";
      var common = require_common();
      var YAMLException = require_exception();
      var makeSnippet = require_snippet();
      var DEFAULT_SCHEMA = require_default();
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      var CONTEXT_FLOW_IN = 1;
      var CONTEXT_FLOW_OUT = 2;
      var CONTEXT_BLOCK_IN = 3;
      var CONTEXT_BLOCK_OUT = 4;
      var CHOMPING_CLIP = 1;
      var CHOMPING_STRIP = 2;
      var CHOMPING_KEEP = 3;
      var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
      var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
      var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
      var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      function is_EOL(c) {
        return c === 10 || c === 13;
      }
      function is_WHITE_SPACE(c) {
        return c === 9 || c === 32;
      }
      function is_WS_OR_EOL(c) {
        return c === 9 || c === 32 || c === 10 || c === 13;
      }
      function is_FLOW_INDICATOR(c) {
        return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
      }
      function fromHexCode(c) {
        var lc;
        if (48 <= c && c <= 57) {
          return c - 48;
        }
        lc = c | 32;
        if (97 <= lc && lc <= 102) {
          return lc - 97 + 10;
        }
        return -1;
      }
      function escapedHexLen(c) {
        if (c === 120) {
          return 2;
        }
        if (c === 117) {
          return 4;
        }
        if (c === 85) {
          return 8;
        }
        return 0;
      }
      function fromDecimalCode(c) {
        if (48 <= c && c <= 57) {
          return c - 48;
        }
        return -1;
      }
      function simpleEscapeSequence(c) {
        return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
      }
      function charFromCodepoint(c) {
        if (c <= 65535) {
          return String.fromCharCode(c);
        }
        return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
      }
      var simpleEscapeCheck = new Array(256);
      var simpleEscapeMap = new Array(256);
      for (var i = 0; i < 256; i++) {
        simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
        simpleEscapeMap[i] = simpleEscapeSequence(i);
      }
      function State(input, options) {
        this.input = input;
        this.filename = options["filename"] || null;
        this.schema = options["schema"] || DEFAULT_SCHEMA;
        this.onWarning = options["onWarning"] || null;
        this.legacy = options["legacy"] || false;
        this.json = options["json"] || false;
        this.listener = options["listener"] || null;
        this.implicitTypes = this.schema.compiledImplicit;
        this.typeMap = this.schema.compiledTypeMap;
        this.length = input.length;
        this.position = 0;
        this.line = 0;
        this.lineStart = 0;
        this.lineIndent = 0;
        this.firstTabInLine = -1;
        this.documents = [];
      }
      function generateError(state, message) {
        var mark = {
          name: state.filename,
          buffer: state.input.slice(0, -1),
          position: state.position,
          line: state.line,
          column: state.position - state.lineStart
        };
        mark.snippet = makeSnippet(mark);
        return new YAMLException(message, mark);
      }
      function throwError(state, message) {
        throw generateError(state, message);
      }
      function throwWarning(state, message) {
        if (state.onWarning) {
          state.onWarning.call(null, generateError(state, message));
        }
      }
      var directiveHandlers = {
        YAML: function handleYamlDirective(state, name, args) {
          var match, major, minor;
          if (state.version !== null) {
            throwError(state, "duplication of %YAML directive");
          }
          if (args.length !== 1) {
            throwError(state, "YAML directive accepts exactly one argument");
          }
          match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
          if (match === null) {
            throwError(state, "ill-formed argument of the YAML directive");
          }
          major = parseInt(match[1], 10);
          minor = parseInt(match[2], 10);
          if (major !== 1) {
            throwError(state, "unacceptable YAML version of the document");
          }
          state.version = args[0];
          state.checkLineBreaks = minor < 2;
          if (minor !== 1 && minor !== 2) {
            throwWarning(state, "unsupported YAML version of the document");
          }
        },
        TAG: function handleTagDirective(state, name, args) {
          var handle, prefix;
          if (args.length !== 2) {
            throwError(state, "TAG directive accepts exactly two arguments");
          }
          handle = args[0];
          prefix = args[1];
          if (!PATTERN_TAG_HANDLE.test(handle)) {
            throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
          }
          if (_hasOwnProperty.call(state.tagMap, handle)) {
            throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
          }
          if (!PATTERN_TAG_URI.test(prefix)) {
            throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
          }
          try {
            prefix = decodeURIComponent(prefix);
          } catch (err) {
            throwError(state, "tag prefix is malformed: " + prefix);
          }
          state.tagMap[handle] = prefix;
        }
      };
      function captureSegment(state, start, end, checkJson) {
        var _position, _length, _character, _result;
        if (start < end) {
          _result = state.input.slice(start, end);
          if (checkJson) {
            for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
              _character = _result.charCodeAt(_position);
              if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
                throwError(state, "expected valid JSON character");
              }
            }
          } else if (PATTERN_NON_PRINTABLE.test(_result)) {
            throwError(state, "the stream contains non-printable characters");
          }
          state.result += _result;
        }
      }
      function mergeMappings(state, destination, source, overridableKeys) {
        var sourceKeys, key, index, quantity;
        if (!common.isObject(source)) {
          throwError(state, "cannot merge mappings; the provided source object is unacceptable");
        }
        sourceKeys = Object.keys(source);
        for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
          key = sourceKeys[index];
          if (!_hasOwnProperty.call(destination, key)) {
            destination[key] = source[key];
            overridableKeys[key] = true;
          }
        }
      }
      function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
        var index, quantity;
        if (Array.isArray(keyNode)) {
          keyNode = Array.prototype.slice.call(keyNode);
          for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
            if (Array.isArray(keyNode[index])) {
              throwError(state, "nested arrays are not supported inside keys");
            }
            if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
              keyNode[index] = "[object Object]";
            }
          }
        }
        if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
          keyNode = "[object Object]";
        }
        keyNode = String(keyNode);
        if (_result === null) {
          _result = {};
        }
        if (keyTag === "tag:yaml.org,2002:merge") {
          if (Array.isArray(valueNode)) {
            for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
              mergeMappings(state, _result, valueNode[index], overridableKeys);
            }
          } else {
            mergeMappings(state, _result, valueNode, overridableKeys);
          }
        } else {
          if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
            state.line = startLine || state.line;
            state.lineStart = startLineStart || state.lineStart;
            state.position = startPos || state.position;
            throwError(state, "duplicated mapping key");
          }
          if (keyNode === "__proto__") {
            Object.defineProperty(_result, keyNode, {
              configurable: true,
              enumerable: true,
              writable: true,
              value: valueNode
            });
          } else {
            _result[keyNode] = valueNode;
          }
          delete overridableKeys[keyNode];
        }
        return _result;
      }
      function readLineBreak(state) {
        var ch;
        ch = state.input.charCodeAt(state.position);
        if (ch === 10) {
          state.position++;
        } else if (ch === 13) {
          state.position++;
          if (state.input.charCodeAt(state.position) === 10) {
            state.position++;
          }
        } else {
          throwError(state, "a line break is expected");
        }
        state.line += 1;
        state.lineStart = state.position;
        state.firstTabInLine = -1;
      }
      function skipSeparationSpace(state, allowComments, checkIndent) {
        var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            if (ch === 9 && state.firstTabInLine === -1) {
              state.firstTabInLine = state.position;
            }
            ch = state.input.charCodeAt(++state.position);
          }
          if (allowComments && ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 10 && ch !== 13 && ch !== 0);
          }
          if (is_EOL(ch)) {
            readLineBreak(state);
            ch = state.input.charCodeAt(state.position);
            lineBreaks++;
            state.lineIndent = 0;
            while (ch === 32) {
              state.lineIndent++;
              ch = state.input.charCodeAt(++state.position);
            }
          } else {
            break;
          }
        }
        if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
          throwWarning(state, "deficient indentation");
        }
        return lineBreaks;
      }
      function testDocumentSeparator(state) {
        var _position = state.position, ch;
        ch = state.input.charCodeAt(_position);
        if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
          _position += 3;
          ch = state.input.charCodeAt(_position);
          if (ch === 0 || is_WS_OR_EOL(ch)) {
            return true;
          }
        }
        return false;
      }
      function writeFoldedLines(state, count) {
        if (count === 1) {
          state.result += " ";
        } else if (count > 1) {
          state.result += common.repeat("\n", count - 1);
        }
      }
      function readPlainScalar(state, nodeIndent, withinFlowCollection) {
        var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
        ch = state.input.charCodeAt(state.position);
        if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
          return false;
        }
        if (ch === 63 || ch === 45) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            return false;
          }
        }
        state.kind = "scalar";
        state.result = "";
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
        while (ch !== 0) {
          if (ch === 58) {
            following = state.input.charCodeAt(state.position + 1);
            if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
              break;
            }
          } else if (ch === 35) {
            preceding = state.input.charCodeAt(state.position - 1);
            if (is_WS_OR_EOL(preceding)) {
              break;
            }
          } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
            break;
          } else if (is_EOL(ch)) {
            _line = state.line;
            _lineStart = state.lineStart;
            _lineIndent = state.lineIndent;
            skipSeparationSpace(state, false, -1);
            if (state.lineIndent >= nodeIndent) {
              hasPendingContent = true;
              ch = state.input.charCodeAt(state.position);
              continue;
            } else {
              state.position = captureEnd;
              state.line = _line;
              state.lineStart = _lineStart;
              state.lineIndent = _lineIndent;
              break;
            }
          }
          if (hasPendingContent) {
            captureSegment(state, captureStart, captureEnd, false);
            writeFoldedLines(state, state.line - _line);
            captureStart = captureEnd = state.position;
            hasPendingContent = false;
          }
          if (!is_WHITE_SPACE(ch)) {
            captureEnd = state.position + 1;
          }
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, captureEnd, false);
        if (state.result) {
          return true;
        }
        state.kind = _kind;
        state.result = _result;
        return false;
      }
      function readSingleQuotedScalar(state, nodeIndent) {
        var ch, captureStart, captureEnd;
        ch = state.input.charCodeAt(state.position);
        if (ch !== 39) {
          return false;
        }
        state.kind = "scalar";
        state.result = "";
        state.position++;
        captureStart = captureEnd = state.position;
        while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          if (ch === 39) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (ch === 39) {
              captureStart = state.position;
              state.position++;
              captureEnd = state.position;
            } else {
              return true;
            }
          } else if (is_EOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
          } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            throwError(state, "unexpected end of the document within a single quoted scalar");
          } else {
            state.position++;
            captureEnd = state.position;
          }
        }
        throwError(state, "unexpected end of the stream within a single quoted scalar");
      }
      function readDoubleQuotedScalar(state, nodeIndent) {
        var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch !== 34) {
          return false;
        }
        state.kind = "scalar";
        state.result = "";
        state.position++;
        captureStart = captureEnd = state.position;
        while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          if (ch === 34) {
            captureSegment(state, captureStart, state.position, true);
            state.position++;
            return true;
          } else if (ch === 92) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (is_EOL(ch)) {
              skipSeparationSpace(state, false, nodeIndent);
            } else if (ch < 256 && simpleEscapeCheck[ch]) {
              state.result += simpleEscapeMap[ch];
              state.position++;
            } else if ((tmp = escapedHexLen(ch)) > 0) {
              hexLength = tmp;
              hexResult = 0;
              for (; hexLength > 0; hexLength--) {
                ch = state.input.charCodeAt(++state.position);
                if ((tmp = fromHexCode(ch)) >= 0) {
                  hexResult = (hexResult << 4) + tmp;
                } else {
                  throwError(state, "expected hexadecimal character");
                }
              }
              state.result += charFromCodepoint(hexResult);
              state.position++;
            } else {
              throwError(state, "unknown escape sequence");
            }
            captureStart = captureEnd = state.position;
          } else if (is_EOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
          } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            throwError(state, "unexpected end of the document within a double quoted scalar");
          } else {
            state.position++;
            captureEnd = state.position;
          }
        }
        throwError(state, "unexpected end of the stream within a double quoted scalar");
      }
      function readFlowCollection(state, nodeIndent) {
        var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = Object.create(null), keyNode, keyTag, valueNode, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch === 91) {
          terminator = 93;
          isMapping = false;
          _result = [];
        } else if (ch === 123) {
          terminator = 125;
          isMapping = true;
          _result = {};
        } else {
          return false;
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = _result;
        }
        ch = state.input.charCodeAt(++state.position);
        while (ch !== 0) {
          skipSeparationSpace(state, true, nodeIndent);
          ch = state.input.charCodeAt(state.position);
          if (ch === terminator) {
            state.position++;
            state.tag = _tag;
            state.anchor = _anchor;
            state.kind = isMapping ? "mapping" : "sequence";
            state.result = _result;
            return true;
          } else if (!readNext) {
            throwError(state, "missed comma between flow collection entries");
          } else if (ch === 44) {
            throwError(state, "expected the node content, but found ','");
          }
          keyTag = keyNode = valueNode = null;
          isPair = isExplicitPair = false;
          if (ch === 63) {
            following = state.input.charCodeAt(state.position + 1);
            if (is_WS_OR_EOL(following)) {
              isPair = isExplicitPair = true;
              state.position++;
              skipSeparationSpace(state, true, nodeIndent);
            }
          }
          _line = state.line;
          _lineStart = state.lineStart;
          _pos = state.position;
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          keyTag = state.tag;
          keyNode = state.result;
          skipSeparationSpace(state, true, nodeIndent);
          ch = state.input.charCodeAt(state.position);
          if ((isExplicitPair || state.line === _line) && ch === 58) {
            isPair = true;
            ch = state.input.charCodeAt(++state.position);
            skipSeparationSpace(state, true, nodeIndent);
            composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
            valueNode = state.result;
          }
          if (isMapping) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
          } else if (isPair) {
            _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
          } else {
            _result.push(keyNode);
          }
          skipSeparationSpace(state, true, nodeIndent);
          ch = state.input.charCodeAt(state.position);
          if (ch === 44) {
            readNext = true;
            ch = state.input.charCodeAt(++state.position);
          } else {
            readNext = false;
          }
        }
        throwError(state, "unexpected end of the stream within a flow collection");
      }
      function readBlockScalar(state, nodeIndent) {
        var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch === 124) {
          folding = false;
        } else if (ch === 62) {
          folding = true;
        } else {
          return false;
        }
        state.kind = "scalar";
        state.result = "";
        while (ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
          if (ch === 43 || ch === 45) {
            if (CHOMPING_CLIP === chomping) {
              chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
            } else {
              throwError(state, "repeat of a chomping mode identifier");
            }
          } else if ((tmp = fromDecimalCode(ch)) >= 0) {
            if (tmp === 0) {
              throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
            } else if (!detectedIndent) {
              textIndent = nodeIndent + tmp - 1;
              detectedIndent = true;
            } else {
              throwError(state, "repeat of an indentation width identifier");
            }
          } else {
            break;
          }
        }
        if (is_WHITE_SPACE(ch)) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (is_WHITE_SPACE(ch));
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (!is_EOL(ch) && ch !== 0);
          }
        }
        while (ch !== 0) {
          readLineBreak(state);
          state.lineIndent = 0;
          ch = state.input.charCodeAt(state.position);
          while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
          if (!detectedIndent && state.lineIndent > textIndent) {
            textIndent = state.lineIndent;
          }
          if (is_EOL(ch)) {
            emptyLines++;
            continue;
          }
          if (state.lineIndent < textIndent) {
            if (chomping === CHOMPING_KEEP) {
              state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            } else if (chomping === CHOMPING_CLIP) {
              if (didReadContent) {
                state.result += "\n";
              }
            }
            break;
          }
          if (folding) {
            if (is_WHITE_SPACE(ch)) {
              atMoreIndented = true;
              state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            } else if (atMoreIndented) {
              atMoreIndented = false;
              state.result += common.repeat("\n", emptyLines + 1);
            } else if (emptyLines === 0) {
              if (didReadContent) {
                state.result += " ";
              }
            } else {
              state.result += common.repeat("\n", emptyLines);
            }
          } else {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          }
          didReadContent = true;
          detectedIndent = true;
          emptyLines = 0;
          captureStart = state.position;
          while (!is_EOL(ch) && ch !== 0) {
            ch = state.input.charCodeAt(++state.position);
          }
          captureSegment(state, captureStart, state.position, false);
        }
        return true;
      }
      function readBlockSequence(state, nodeIndent) {
        var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
        if (state.firstTabInLine !== -1)
          return false;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = _result;
        }
        ch = state.input.charCodeAt(state.position);
        while (ch !== 0) {
          if (state.firstTabInLine !== -1) {
            state.position = state.firstTabInLine;
            throwError(state, "tab characters must not be used in indentation");
          }
          if (ch !== 45) {
            break;
          }
          following = state.input.charCodeAt(state.position + 1);
          if (!is_WS_OR_EOL(following)) {
            break;
          }
          detected = true;
          state.position++;
          if (skipSeparationSpace(state, true, -1)) {
            if (state.lineIndent <= nodeIndent) {
              _result.push(null);
              ch = state.input.charCodeAt(state.position);
              continue;
            }
          }
          _line = state.line;
          composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
          _result.push(state.result);
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
          if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
            throwError(state, "bad indentation of a sequence entry");
          } else if (state.lineIndent < nodeIndent) {
            break;
          }
        }
        if (detected) {
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = "sequence";
          state.result = _result;
          return true;
        }
        return false;
      }
      function readBlockMapping(state, nodeIndent, flowIndent) {
        var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
        if (state.firstTabInLine !== -1)
          return false;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = _result;
        }
        ch = state.input.charCodeAt(state.position);
        while (ch !== 0) {
          if (!atExplicitKey && state.firstTabInLine !== -1) {
            state.position = state.firstTabInLine;
            throwError(state, "tab characters must not be used in indentation");
          }
          following = state.input.charCodeAt(state.position + 1);
          _line = state.line;
          if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
            if (ch === 63) {
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = true;
              allowCompact = true;
            } else if (atExplicitKey) {
              atExplicitKey = false;
              allowCompact = true;
            } else {
              throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
            }
            state.position += 1;
            ch = following;
          } else {
            _keyLine = state.line;
            _keyLineStart = state.lineStart;
            _keyPos = state.position;
            if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
              break;
            }
            if (state.line === _line) {
              ch = state.input.charCodeAt(state.position);
              while (is_WHITE_SPACE(ch)) {
                ch = state.input.charCodeAt(++state.position);
              }
              if (ch === 58) {
                ch = state.input.charCodeAt(++state.position);
                if (!is_WS_OR_EOL(ch)) {
                  throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
                }
                if (atExplicitKey) {
                  storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
                  keyTag = keyNode = valueNode = null;
                }
                detected = true;
                atExplicitKey = false;
                allowCompact = false;
                keyTag = state.tag;
                keyNode = state.result;
              } else if (detected) {
                throwError(state, "can not read an implicit mapping pair; a colon is missed");
              } else {
                state.tag = _tag;
                state.anchor = _anchor;
                return true;
              }
            } else if (detected) {
              throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          }
          if (state.line === _line || state.lineIndent > nodeIndent) {
            if (atExplicitKey) {
              _keyLine = state.line;
              _keyLineStart = state.lineStart;
              _keyPos = state.position;
            }
            if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
              if (atExplicitKey) {
                keyNode = state.result;
              } else {
                valueNode = state.result;
              }
            }
            if (!atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            skipSeparationSpace(state, true, -1);
            ch = state.input.charCodeAt(state.position);
          }
          if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
            throwError(state, "bad indentation of a mapping entry");
          } else if (state.lineIndent < nodeIndent) {
            break;
          }
        }
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
        }
        if (detected) {
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = "mapping";
          state.result = _result;
        }
        return detected;
      }
      function readTagProperty(state) {
        var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch !== 33)
          return false;
        if (state.tag !== null) {
          throwError(state, "duplication of a tag property");
        }
        ch = state.input.charCodeAt(++state.position);
        if (ch === 60) {
          isVerbatim = true;
          ch = state.input.charCodeAt(++state.position);
        } else if (ch === 33) {
          isNamed = true;
          tagHandle = "!!";
          ch = state.input.charCodeAt(++state.position);
        } else {
          tagHandle = "!";
        }
        _position = state.position;
        if (isVerbatim) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && ch !== 62);
          if (state.position < state.length) {
            tagName = state.input.slice(_position, state.position);
            ch = state.input.charCodeAt(++state.position);
          } else {
            throwError(state, "unexpected end of the stream within a verbatim tag");
          }
        } else {
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            if (ch === 33) {
              if (!isNamed) {
                tagHandle = state.input.slice(_position - 1, state.position + 1);
                if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                  throwError(state, "named tag handle cannot contain such characters");
                }
                isNamed = true;
                _position = state.position + 1;
              } else {
                throwError(state, "tag suffix cannot contain exclamation marks");
              }
            }
            ch = state.input.charCodeAt(++state.position);
          }
          tagName = state.input.slice(_position, state.position);
          if (PATTERN_FLOW_INDICATORS.test(tagName)) {
            throwError(state, "tag suffix cannot contain flow indicator characters");
          }
        }
        if (tagName && !PATTERN_TAG_URI.test(tagName)) {
          throwError(state, "tag name cannot contain such characters: " + tagName);
        }
        try {
          tagName = decodeURIComponent(tagName);
        } catch (err) {
          throwError(state, "tag name is malformed: " + tagName);
        }
        if (isVerbatim) {
          state.tag = tagName;
        } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
          state.tag = state.tagMap[tagHandle] + tagName;
        } else if (tagHandle === "!") {
          state.tag = "!" + tagName;
        } else if (tagHandle === "!!") {
          state.tag = "tag:yaml.org,2002:" + tagName;
        } else {
          throwError(state, 'undeclared tag handle "' + tagHandle + '"');
        }
        return true;
      }
      function readAnchorProperty(state) {
        var _position, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch !== 38)
          return false;
        if (state.anchor !== null) {
          throwError(state, "duplication of an anchor property");
        }
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (state.position === _position) {
          throwError(state, "name of an anchor node must contain at least one character");
        }
        state.anchor = state.input.slice(_position, state.position);
        return true;
      }
      function readAlias(state) {
        var _position, alias, ch;
        ch = state.input.charCodeAt(state.position);
        if (ch !== 42)
          return false;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (state.position === _position) {
          throwError(state, "name of an alias node must contain at least one character");
        }
        alias = state.input.slice(_position, state.position);
        if (!_hasOwnProperty.call(state.anchorMap, alias)) {
          throwError(state, 'unidentified alias "' + alias + '"');
        }
        state.result = state.anchorMap[alias];
        skipSeparationSpace(state, true, -1);
        return true;
      }
      function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
        var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type, flowIndent, blockIndent;
        if (state.listener !== null) {
          state.listener("open", state);
        }
        state.tag = null;
        state.anchor = null;
        state.kind = null;
        state.result = null;
        allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
        if (allowToSeek) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          }
        }
        if (indentStatus === 1) {
          while (readTagProperty(state) || readAnchorProperty(state)) {
            if (skipSeparationSpace(state, true, -1)) {
              atNewLine = true;
              allowBlockCollections = allowBlockStyles;
              if (state.lineIndent > parentIndent) {
                indentStatus = 1;
              } else if (state.lineIndent === parentIndent) {
                indentStatus = 0;
              } else if (state.lineIndent < parentIndent) {
                indentStatus = -1;
              }
            } else {
              allowBlockCollections = false;
            }
          }
        }
        if (allowBlockCollections) {
          allowBlockCollections = atNewLine || allowCompact;
        }
        if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
          if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
            flowIndent = parentIndent;
          } else {
            flowIndent = parentIndent + 1;
          }
          blockIndent = state.position - state.lineStart;
          if (indentStatus === 1) {
            if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
              hasContent = true;
            } else {
              if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
                hasContent = true;
              } else if (readAlias(state)) {
                hasContent = true;
                if (state.tag !== null || state.anchor !== null) {
                  throwError(state, "alias node should not have any properties");
                }
              } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
                hasContent = true;
                if (state.tag === null) {
                  state.tag = "?";
                }
              }
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
            }
          } else if (indentStatus === 0) {
            hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
          }
        }
        if (state.tag === null) {
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        } else if (state.tag === "?") {
          if (state.result !== null && state.kind !== "scalar") {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }
          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];
            if (type.resolve(state.result)) {
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (state.tag !== "!") {
          if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
            type = state.typeMap[state.kind || "fallback"][state.tag];
          } else {
            type = null;
            typeList = state.typeMap.multi[state.kind || "fallback"];
            for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
              if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
                type = typeList[typeIndex];
                break;
              }
            }
          }
          if (!type) {
            throwError(state, "unknown tag !<" + state.tag + ">");
          }
          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }
          if (!type.resolve(state.result, state.tag)) {
            throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
          } else {
            state.result = type.construct(state.result, state.tag);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        }
        if (state.listener !== null) {
          state.listener("close", state);
        }
        return state.tag !== null || state.anchor !== null || hasContent;
      }
      function readDocument(state) {
        var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
        state.version = null;
        state.checkLineBreaks = state.legacy;
        state.tagMap = Object.create(null);
        state.anchorMap = Object.create(null);
        while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
          if (state.lineIndent > 0 || ch !== 37) {
            break;
          }
          hasDirectives = true;
          ch = state.input.charCodeAt(++state.position);
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveName = state.input.slice(_position, state.position);
          directiveArgs = [];
          if (directiveName.length < 1) {
            throwError(state, "directive name must not be less than one character in length");
          }
          while (ch !== 0) {
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 35) {
              do {
                ch = state.input.charCodeAt(++state.position);
              } while (ch !== 0 && !is_EOL(ch));
              break;
            }
            if (is_EOL(ch))
              break;
            _position = state.position;
            while (ch !== 0 && !is_WS_OR_EOL(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            directiveArgs.push(state.input.slice(_position, state.position));
          }
          if (ch !== 0)
            readLineBreak(state);
          if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
            directiveHandlers[directiveName](state, directiveName, directiveArgs);
          } else {
            throwWarning(state, 'unknown document directive "' + directiveName + '"');
          }
        }
        skipSeparationSpace(state, true, -1);
        if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        } else if (hasDirectives) {
          throwError(state, "directives end mark is expected");
        }
        composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
        skipSeparationSpace(state, true, -1);
        if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
          throwWarning(state, "non-ASCII line breaks are interpreted as content");
        }
        state.documents.push(state.result);
        if (state.position === state.lineStart && testDocumentSeparator(state)) {
          if (state.input.charCodeAt(state.position) === 46) {
            state.position += 3;
            skipSeparationSpace(state, true, -1);
          }
          return;
        }
        if (state.position < state.length - 1) {
          throwError(state, "end of the stream or a document separator is expected");
        } else {
          return;
        }
      }
      function loadDocuments(input, options) {
        input = String(input);
        options = options || {};
        if (input.length !== 0) {
          if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
            input += "\n";
          }
          if (input.charCodeAt(0) === 65279) {
            input = input.slice(1);
          }
        }
        var state = new State(input, options);
        var nullpos = input.indexOf("\0");
        if (nullpos !== -1) {
          state.position = nullpos;
          throwError(state, "null byte is not allowed in input");
        }
        state.input += "\0";
        while (state.input.charCodeAt(state.position) === 32) {
          state.lineIndent += 1;
          state.position += 1;
        }
        while (state.position < state.length - 1) {
          readDocument(state);
        }
        return state.documents;
      }
      function loadAll(input, iterator, options) {
        if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
          options = iterator;
          iterator = null;
        }
        var documents = loadDocuments(input, options);
        if (typeof iterator !== "function") {
          return documents;
        }
        for (var index = 0, length = documents.length; index < length; index += 1) {
          iterator(documents[index]);
        }
      }
      function load(input, options) {
        var documents = loadDocuments(input, options);
        if (documents.length === 0) {
          return void 0;
        } else if (documents.length === 1) {
          return documents[0];
        }
        throw new YAMLException("expected a single document in the stream, but found more");
      }
      module.exports.loadAll = loadAll;
      module.exports.load = load;
    }
  });

  // node_modules/js-yaml/lib/dumper.js
  var require_dumper = __commonJS({
    "node_modules/js-yaml/lib/dumper.js"(exports, module) {
      "use strict";
      var common = require_common();
      var YAMLException = require_exception();
      var DEFAULT_SCHEMA = require_default();
      var _toString = Object.prototype.toString;
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      var CHAR_BOM = 65279;
      var CHAR_TAB = 9;
      var CHAR_LINE_FEED = 10;
      var CHAR_CARRIAGE_RETURN = 13;
      var CHAR_SPACE = 32;
      var CHAR_EXCLAMATION = 33;
      var CHAR_DOUBLE_QUOTE = 34;
      var CHAR_SHARP = 35;
      var CHAR_PERCENT = 37;
      var CHAR_AMPERSAND = 38;
      var CHAR_SINGLE_QUOTE = 39;
      var CHAR_ASTERISK = 42;
      var CHAR_COMMA = 44;
      var CHAR_MINUS = 45;
      var CHAR_COLON = 58;
      var CHAR_EQUALS = 61;
      var CHAR_GREATER_THAN = 62;
      var CHAR_QUESTION = 63;
      var CHAR_COMMERCIAL_AT = 64;
      var CHAR_LEFT_SQUARE_BRACKET = 91;
      var CHAR_RIGHT_SQUARE_BRACKET = 93;
      var CHAR_GRAVE_ACCENT = 96;
      var CHAR_LEFT_CURLY_BRACKET = 123;
      var CHAR_VERTICAL_LINE = 124;
      var CHAR_RIGHT_CURLY_BRACKET = 125;
      var ESCAPE_SEQUENCES = {};
      ESCAPE_SEQUENCES[0] = "\\0";
      ESCAPE_SEQUENCES[7] = "\\a";
      ESCAPE_SEQUENCES[8] = "\\b";
      ESCAPE_SEQUENCES[9] = "\\t";
      ESCAPE_SEQUENCES[10] = "\\n";
      ESCAPE_SEQUENCES[11] = "\\v";
      ESCAPE_SEQUENCES[12] = "\\f";
      ESCAPE_SEQUENCES[13] = "\\r";
      ESCAPE_SEQUENCES[27] = "\\e";
      ESCAPE_SEQUENCES[34] = '\\"';
      ESCAPE_SEQUENCES[92] = "\\\\";
      ESCAPE_SEQUENCES[133] = "\\N";
      ESCAPE_SEQUENCES[160] = "\\_";
      ESCAPE_SEQUENCES[8232] = "\\L";
      ESCAPE_SEQUENCES[8233] = "\\P";
      var DEPRECATED_BOOLEANS_SYNTAX = [
        "y",
        "Y",
        "yes",
        "Yes",
        "YES",
        "on",
        "On",
        "ON",
        "n",
        "N",
        "no",
        "No",
        "NO",
        "off",
        "Off",
        "OFF"
      ];
      var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
      function compileStyleMap(schema, map) {
        var result, keys, index, length, tag, style, type;
        if (map === null)
          return {};
        result = {};
        keys = Object.keys(map);
        for (index = 0, length = keys.length; index < length; index += 1) {
          tag = keys[index];
          style = String(map[tag]);
          if (tag.slice(0, 2) === "!!") {
            tag = "tag:yaml.org,2002:" + tag.slice(2);
          }
          type = schema.compiledTypeMap["fallback"][tag];
          if (type && _hasOwnProperty.call(type.styleAliases, style)) {
            style = type.styleAliases[style];
          }
          result[tag] = style;
        }
        return result;
      }
      function encodeHex(character) {
        var string, handle, length;
        string = character.toString(16).toUpperCase();
        if (character <= 255) {
          handle = "x";
          length = 2;
        } else if (character <= 65535) {
          handle = "u";
          length = 4;
        } else if (character <= 4294967295) {
          handle = "U";
          length = 8;
        } else {
          throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
        }
        return "\\" + handle + common.repeat("0", length - string.length) + string;
      }
      var QUOTING_TYPE_SINGLE = 1;
      var QUOTING_TYPE_DOUBLE = 2;
      function State(options) {
        this.schema = options["schema"] || DEFAULT_SCHEMA;
        this.indent = Math.max(1, options["indent"] || 2);
        this.noArrayIndent = options["noArrayIndent"] || false;
        this.skipInvalid = options["skipInvalid"] || false;
        this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
        this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
        this.sortKeys = options["sortKeys"] || false;
        this.lineWidth = options["lineWidth"] || 80;
        this.noRefs = options["noRefs"] || false;
        this.noCompatMode = options["noCompatMode"] || false;
        this.condenseFlow = options["condenseFlow"] || false;
        this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
        this.forceQuotes = options["forceQuotes"] || false;
        this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
        this.implicitTypes = this.schema.compiledImplicit;
        this.explicitTypes = this.schema.compiledExplicit;
        this.tag = null;
        this.result = "";
        this.duplicates = [];
        this.usedDuplicates = null;
      }
      function indentString(string, spaces) {
        var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
        while (position < length) {
          next = string.indexOf("\n", position);
          if (next === -1) {
            line = string.slice(position);
            position = length;
          } else {
            line = string.slice(position, next + 1);
            position = next + 1;
          }
          if (line.length && line !== "\n")
            result += ind;
          result += line;
        }
        return result;
      }
      function generateNextLine(state, level) {
        return "\n" + common.repeat(" ", state.indent * level);
      }
      function testImplicitResolving(state, str) {
        var index, length, type;
        for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
          type = state.implicitTypes[index];
          if (type.resolve(str)) {
            return true;
          }
        }
        return false;
      }
      function isWhitespace(c) {
        return c === CHAR_SPACE || c === CHAR_TAB;
      }
      function isPrintable(c) {
        return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
      }
      function isNsCharOrWhitespace(c) {
        return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
      }
      function isPlainSafe(c, prev, inblock) {
        var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
        var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
        return (inblock ? cIsNsCharOrWhitespace : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar;
      }
      function isPlainSafeFirst(c) {
        return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
      }
      function isPlainSafeLast(c) {
        return !isWhitespace(c) && c !== CHAR_COLON;
      }
      function codePointAt(string, pos) {
        var first = string.charCodeAt(pos), second;
        if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
          second = string.charCodeAt(pos + 1);
          if (second >= 56320 && second <= 57343) {
            return (first - 55296) * 1024 + second - 56320 + 65536;
          }
        }
        return first;
      }
      function needIndentIndicator(string) {
        var leadingSpaceRe = /^\n* /;
        return leadingSpaceRe.test(string);
      }
      var STYLE_PLAIN = 1;
      var STYLE_SINGLE = 2;
      var STYLE_LITERAL = 3;
      var STYLE_FOLDED = 4;
      var STYLE_DOUBLE = 5;
      function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
        var i;
        var char = 0;
        var prevChar = null;
        var hasLineBreak = false;
        var hasFoldableLine = false;
        var shouldTrackWidth = lineWidth !== -1;
        var previousLineBreak = -1;
        var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
        if (singleLineOnly || forceQuotes) {
          for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
            char = codePointAt(string, i);
            if (!isPrintable(char)) {
              return STYLE_DOUBLE;
            }
            plain = plain && isPlainSafe(char, prevChar, inblock);
            prevChar = char;
          }
        } else {
          for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
            char = codePointAt(string, i);
            if (char === CHAR_LINE_FEED) {
              hasLineBreak = true;
              if (shouldTrackWidth) {
                hasFoldableLine = hasFoldableLine || i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
                previousLineBreak = i;
              }
            } else if (!isPrintable(char)) {
              return STYLE_DOUBLE;
            }
            plain = plain && isPlainSafe(char, prevChar, inblock);
            prevChar = char;
          }
          hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
        }
        if (!hasLineBreak && !hasFoldableLine) {
          if (plain && !forceQuotes && !testAmbiguousType(string)) {
            return STYLE_PLAIN;
          }
          return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
        }
        if (indentPerLevel > 9 && needIndentIndicator(string)) {
          return STYLE_DOUBLE;
        }
        if (!forceQuotes) {
          return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
        }
        return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
      }
      function writeScalar(state, string, level, iskey, inblock) {
        state.dump = function() {
          if (string.length === 0) {
            return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
          }
          if (!state.noCompatMode) {
            if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
              return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
            }
          }
          var indent = state.indent * Math.max(1, level);
          var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
          var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
          function testAmbiguity(string2) {
            return testImplicitResolving(state, string2);
          }
          switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
            case STYLE_PLAIN:
              return string;
            case STYLE_SINGLE:
              return "'" + string.replace(/'/g, "''") + "'";
            case STYLE_LITERAL:
              return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
            case STYLE_FOLDED:
              return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
            case STYLE_DOUBLE:
              return '"' + escapeString(string, lineWidth) + '"';
            default:
              throw new YAMLException("impossible error: invalid scalar style");
          }
        }();
      }
      function blockHeader(string, indentPerLevel) {
        var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
        var clip = string[string.length - 1] === "\n";
        var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
        var chomp = keep ? "+" : clip ? "" : "-";
        return indentIndicator + chomp + "\n";
      }
      function dropEndingNewline(string) {
        return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
      }
      function foldString(string, width) {
        var lineRe = /(\n+)([^\n]*)/g;
        var result = function() {
          var nextLF = string.indexOf("\n");
          nextLF = nextLF !== -1 ? nextLF : string.length;
          lineRe.lastIndex = nextLF;
          return foldLine(string.slice(0, nextLF), width);
        }();
        var prevMoreIndented = string[0] === "\n" || string[0] === " ";
        var moreIndented;
        var match;
        while (match = lineRe.exec(string)) {
          var prefix = match[1], line = match[2];
          moreIndented = line[0] === " ";
          result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
          prevMoreIndented = moreIndented;
        }
        return result;
      }
      function foldLine(line, width) {
        if (line === "" || line[0] === " ")
          return line;
        var breakRe = / [^ ]/g;
        var match;
        var start = 0, end, curr = 0, next = 0;
        var result = "";
        while (match = breakRe.exec(line)) {
          next = match.index;
          if (next - start > width) {
            end = curr > start ? curr : next;
            result += "\n" + line.slice(start, end);
            start = end + 1;
          }
          curr = next;
        }
        result += "\n";
        if (line.length - start > width && curr > start) {
          result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
        } else {
          result += line.slice(start);
        }
        return result.slice(1);
      }
      function escapeString(string) {
        var result = "";
        var char = 0;
        var escapeSeq;
        for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
          char = codePointAt(string, i);
          escapeSeq = ESCAPE_SEQUENCES[char];
          if (!escapeSeq && isPrintable(char)) {
            result += string[i];
            if (char >= 65536)
              result += string[i + 1];
          } else {
            result += escapeSeq || encodeHex(char);
          }
        }
        return result;
      }
      function writeFlowSequence(state, level, object) {
        var _result = "", _tag = state.tag, index, length, value;
        for (index = 0, length = object.length; index < length; index += 1) {
          value = object[index];
          if (state.replacer) {
            value = state.replacer.call(object, String(index), value);
          }
          if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
            if (_result !== "")
              _result += "," + (!state.condenseFlow ? " " : "");
            _result += state.dump;
          }
        }
        state.tag = _tag;
        state.dump = "[" + _result + "]";
      }
      function writeBlockSequence(state, level, object, compact) {
        var _result = "", _tag = state.tag, index, length, value;
        for (index = 0, length = object.length; index < length; index += 1) {
          value = object[index];
          if (state.replacer) {
            value = state.replacer.call(object, String(index), value);
          }
          if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
            if (!compact || _result !== "") {
              _result += generateNextLine(state, level);
            }
            if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
              _result += "-";
            } else {
              _result += "- ";
            }
            _result += state.dump;
          }
        }
        state.tag = _tag;
        state.dump = _result || "[]";
      }
      function writeFlowMapping(state, level, object) {
        var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          pairBuffer = "";
          if (_result !== "")
            pairBuffer += ", ";
          if (state.condenseFlow)
            pairBuffer += '"';
          objectKey = objectKeyList[index];
          objectValue = object[objectKey];
          if (state.replacer) {
            objectValue = state.replacer.call(object, objectKey, objectValue);
          }
          if (!writeNode(state, level, objectKey, false, false)) {
            continue;
          }
          if (state.dump.length > 1024)
            pairBuffer += "? ";
          pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
          if (!writeNode(state, level, objectValue, false, false)) {
            continue;
          }
          pairBuffer += state.dump;
          _result += pairBuffer;
        }
        state.tag = _tag;
        state.dump = "{" + _result + "}";
      }
      function writeBlockMapping(state, level, object, compact) {
        var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
        if (state.sortKeys === true) {
          objectKeyList.sort();
        } else if (typeof state.sortKeys === "function") {
          objectKeyList.sort(state.sortKeys);
        } else if (state.sortKeys) {
          throw new YAMLException("sortKeys must be a boolean or a function");
        }
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          pairBuffer = "";
          if (!compact || _result !== "") {
            pairBuffer += generateNextLine(state, level);
          }
          objectKey = objectKeyList[index];
          objectValue = object[objectKey];
          if (state.replacer) {
            objectValue = state.replacer.call(object, objectKey, objectValue);
          }
          if (!writeNode(state, level + 1, objectKey, true, true, true)) {
            continue;
          }
          explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
          if (explicitPair) {
            if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
              pairBuffer += "?";
            } else {
              pairBuffer += "? ";
            }
          }
          pairBuffer += state.dump;
          if (explicitPair) {
            pairBuffer += generateNextLine(state, level);
          }
          if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
            continue;
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += ":";
          } else {
            pairBuffer += ": ";
          }
          pairBuffer += state.dump;
          _result += pairBuffer;
        }
        state.tag = _tag;
        state.dump = _result || "{}";
      }
      function detectType(state, object, explicit) {
        var _result, typeList, index, length, type, style;
        typeList = explicit ? state.explicitTypes : state.implicitTypes;
        for (index = 0, length = typeList.length; index < length; index += 1) {
          type = typeList[index];
          if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
            if (explicit) {
              if (type.multi && type.representName) {
                state.tag = type.representName(object);
              } else {
                state.tag = type.tag;
              }
            } else {
              state.tag = "?";
            }
            if (type.represent) {
              style = state.styleMap[type.tag] || type.defaultStyle;
              if (_toString.call(type.represent) === "[object Function]") {
                _result = type.represent(object, style);
              } else if (_hasOwnProperty.call(type.represent, style)) {
                _result = type.represent[style](object, style);
              } else {
                throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
              }
              state.dump = _result;
            }
            return true;
          }
        }
        return false;
      }
      function writeNode(state, level, object, block, compact, iskey, isblockseq) {
        state.tag = null;
        state.dump = object;
        if (!detectType(state, object, false)) {
          detectType(state, object, true);
        }
        var type = _toString.call(state.dump);
        var inblock = block;
        var tagStr;
        if (block) {
          block = state.flowLevel < 0 || state.flowLevel > level;
        }
        var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
        if (objectOrArray) {
          duplicateIndex = state.duplicates.indexOf(object);
          duplicate = duplicateIndex !== -1;
        }
        if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
          compact = false;
        }
        if (duplicate && state.usedDuplicates[duplicateIndex]) {
          state.dump = "*ref_" + duplicateIndex;
        } else {
          if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
            state.usedDuplicates[duplicateIndex] = true;
          }
          if (type === "[object Object]") {
            if (block && Object.keys(state.dump).length !== 0) {
              writeBlockMapping(state, level, state.dump, compact);
              if (duplicate) {
                state.dump = "&ref_" + duplicateIndex + state.dump;
              }
            } else {
              writeFlowMapping(state, level, state.dump);
              if (duplicate) {
                state.dump = "&ref_" + duplicateIndex + " " + state.dump;
              }
            }
          } else if (type === "[object Array]") {
            if (block && state.dump.length !== 0) {
              if (state.noArrayIndent && !isblockseq && level > 0) {
                writeBlockSequence(state, level - 1, state.dump, compact);
              } else {
                writeBlockSequence(state, level, state.dump, compact);
              }
              if (duplicate) {
                state.dump = "&ref_" + duplicateIndex + state.dump;
              }
            } else {
              writeFlowSequence(state, level, state.dump);
              if (duplicate) {
                state.dump = "&ref_" + duplicateIndex + " " + state.dump;
              }
            }
          } else if (type === "[object String]") {
            if (state.tag !== "?") {
              writeScalar(state, state.dump, level, iskey, inblock);
            }
          } else if (type === "[object Undefined]") {
            return false;
          } else {
            if (state.skipInvalid)
              return false;
            throw new YAMLException("unacceptable kind of an object to dump " + type);
          }
          if (state.tag !== null && state.tag !== "?") {
            tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
            if (state.tag[0] === "!") {
              tagStr = "!" + tagStr;
            } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
              tagStr = "!!" + tagStr.slice(18);
            } else {
              tagStr = "!<" + tagStr + ">";
            }
            state.dump = tagStr + " " + state.dump;
          }
        }
        return true;
      }
      function getDuplicateReferences(object, state) {
        var objects = [], duplicatesIndexes = [], index, length;
        inspectNode(object, objects, duplicatesIndexes);
        for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
          state.duplicates.push(objects[duplicatesIndexes[index]]);
        }
        state.usedDuplicates = new Array(length);
      }
      function inspectNode(object, objects, duplicatesIndexes) {
        var objectKeyList, index, length;
        if (object !== null && typeof object === "object") {
          index = objects.indexOf(object);
          if (index !== -1) {
            if (duplicatesIndexes.indexOf(index) === -1) {
              duplicatesIndexes.push(index);
            }
          } else {
            objects.push(object);
            if (Array.isArray(object)) {
              for (index = 0, length = object.length; index < length; index += 1) {
                inspectNode(object[index], objects, duplicatesIndexes);
              }
            } else {
              objectKeyList = Object.keys(object);
              for (index = 0, length = objectKeyList.length; index < length; index += 1) {
                inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
              }
            }
          }
        }
      }
      function dump(input, options) {
        options = options || {};
        var state = new State(options);
        if (!state.noRefs)
          getDuplicateReferences(input, state);
        var value = input;
        if (state.replacer) {
          value = state.replacer.call({"": value}, "", value);
        }
        if (writeNode(state, 0, value, true, true))
          return state.dump + "\n";
        return "";
      }
      module.exports.dump = dump;
    }
  });

  // node_modules/js-yaml/index.js
  var require_js_yaml = __commonJS({
    "node_modules/js-yaml/index.js"(exports, module) {
      "use strict";
      var loader = require_loader();
      var dumper = require_dumper();
      function renamed(from, to) {
        return function() {
          throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
        };
      }
      module.exports.Type = require_type();
      module.exports.Schema = require_schema();
      module.exports.FAILSAFE_SCHEMA = require_failsafe();
      module.exports.JSON_SCHEMA = require_json();
      module.exports.CORE_SCHEMA = require_core();
      module.exports.DEFAULT_SCHEMA = require_default();
      module.exports.load = loader.load;
      module.exports.loadAll = loader.loadAll;
      module.exports.dump = dumper.dump;
      module.exports.YAMLException = require_exception();
      module.exports.types = {
        binary: require_binary(),
        float: require_float(),
        map: require_map(),
        null: require_null(),
        pairs: require_pairs(),
        set: require_set(),
        timestamp: require_timestamp(),
        bool: require_bool(),
        int: require_int(),
        merge: require_merge(),
        omap: require_omap(),
        seq: require_seq(),
        str: require_str()
      };
      module.exports.safeLoad = renamed("safeLoad", "load");
      module.exports.safeLoadAll = renamed("safeLoadAll", "loadAll");
      module.exports.safeDump = renamed("safeDump", "dump");
    }
  });

  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var tasks = new Set();
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i];
      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
  }
  function select_value(select) {
    const selected_option = select.querySelector(":checked") || select.options[0];
    return selected_option && selected_option.__value;
  }
  var HtmlTag = class {
    constructor(anchor = null) {
      this.a = anchor;
      this.e = this.n = null;
    }
    m(html, target, anchor = null) {
      if (!this.e) {
        this.e = element(target.nodeName);
        this.t = target;
        this.h(html);
      }
      this.i(anchor);
    }
    h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert(this.t, this.n[i], anchor);
      }
    }
    p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
    d() {
      this.n.forEach(detach);
    }
  };
  var active_docs = new Set();
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var flushing = false;
  var seen_callbacks = new Set();
  function flush() {
    if (flushing)
      return;
    flushing = true;
    do {
      for (let i = 0; i < dirty_components.length; i += 1) {
        const component = dirty_components[i];
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  var boolean_attributes = new Set([
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]);
  function mount_component(component, target, anchor, customElement) {
    const {fragment, on_mount, on_destroy, after_update} = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(parent_component ? parent_component.$$.context : options.context || []),
      callbacks: blank_object(),
      dirty,
      skip_bound: false
    };
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: "open"});
      }
      connectedCallback() {
        const {on_mount} = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // polymorph.svelte
  function add_css() {
    var style = element("style");
    style.id = "svelte-t9nwzm-style";
    style.textContent = ".top-bar.svelte-t9nwzm{display:flex;justify-content:flex-end}.card.svelte-t9nwzm{padding:10px 20px;border:solid 1px grey;border-radius:10px}";
    append(document.head, style);
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[19] = list[i];
    return child_ctx;
  }
  function create_if_block_2(ctx) {
    let button;
    let t0_value = (ctx[3] ? "Hide" : "Edit") + "";
    let t0;
    let t1;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = text(" Props");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
        if (!mounted) {
          dispose = listen(button, "click", ctx[6]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 8 && t0_value !== (t0_value = (ctx2[3] ? "Hide" : "Edit") + ""))
          set_data(t0, t0_value);
      },
      d(detaching) {
        if (detaching)
          detach(button);
        mounted = false;
        dispose();
      }
    };
  }
  function create_each_block(ctx) {
    let option;
    let t_value = ctx[19] + "";
    let t;
    let option_value_value;
    return {
      c() {
        option = element("option");
        t = text(t_value);
        option.__value = option_value_value = ctx[19];
        option.value = option.__value;
      },
      m(target, anchor) {
        insert(target, option, anchor);
        append(option, t);
      },
      p(ctx2, dirty) {
        if (dirty & 16 && t_value !== (t_value = ctx2[19] + ""))
          set_data(t, t_value);
        if (dirty & 16 && option_value_value !== (option_value_value = ctx2[19])) {
          option.__value = option_value_value;
          option.value = option.__value;
        }
      },
      d(detaching) {
        if (detaching)
          detach(option);
      }
    };
  }
  function create_if_block_1(ctx) {
    let textarea;
    let mounted;
    let dispose;
    return {
      c() {
        textarea = element("textarea");
      },
      m(target, anchor) {
        insert(target, textarea, anchor);
        set_input_value(textarea, ctx[1]);
        if (!mounted) {
          dispose = listen(textarea, "input", ctx[8]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 2) {
          set_input_value(textarea, ctx2[1]);
        }
      },
      d(detaching) {
        if (detaching)
          detach(textarea);
        mounted = false;
        dispose();
      }
    };
  }
  function create_else_block(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = "\u{1F44B}\xA0 Hello, I am the polymorph. Select a component from the bookshop above.";
        attr(p, "class", "card svelte-t9nwzm");
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(p);
      }
    };
  }
  function create_if_block(ctx) {
    let html_tag;
    let html_anchor;
    return {
      c() {
        html_anchor = empty();
        html_tag = new HtmlTag(html_anchor);
      },
      m(target, anchor) {
        html_tag.m(ctx[2], target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 4)
          html_tag.p(ctx2[2]);
      },
      d(detaching) {
        if (detaching)
          detach(html_anchor);
        if (detaching)
          html_tag.d();
      }
    };
  }
  function create_fragment(ctx) {
    let div;
    let t0;
    let select;
    let option;
    let t1;
    let t2;
    let if_block2_anchor;
    let mounted;
    let dispose;
    let if_block0 = ctx[0] !== "nothing" && create_if_block_2(ctx);
    let each_value = ctx[4];
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    let if_block1 = ctx[3] && create_if_block_1(ctx);
    function select_block_type(ctx2, dirty) {
      if (ctx2[2])
        return create_if_block;
      return create_else_block;
    }
    let current_block_type = select_block_type(ctx, -1);
    let if_block2 = current_block_type(ctx);
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        select = element("select");
        option = element("option");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t1 = space();
        if (if_block1)
          if_block1.c();
        t2 = space();
        if_block2.c();
        if_block2_anchor = empty();
        option.__value = "nothing";
        option.value = option.__value;
        if (ctx[0] === void 0)
          add_render_callback(() => ctx[7].call(select));
        attr(div, "class", "top-bar svelte-t9nwzm");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t0);
        append(div, select);
        append(select, option);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(select, null);
        }
        select_option(select, ctx[0]);
        insert(target, t1, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t2, anchor);
        if_block2.m(target, anchor);
        insert(target, if_block2_anchor, anchor);
        if (!mounted) {
          dispose = listen(select, "change", ctx[7]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (ctx2[0] !== "nothing") {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_2(ctx2);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & 16) {
          each_value = ctx2[4];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(select, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (dirty & 17) {
          select_option(select, ctx2[0]);
        }
        if (ctx2[3]) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_1(ctx2);
            if_block1.c();
            if_block1.m(t2.parentNode, t2);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2.d(1);
          if_block2 = current_block_type(ctx2);
          if (if_block2) {
            if_block2.c();
            if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
          }
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block0)
          if_block0.d();
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(t1);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t2);
        if_block2.d(detaching);
        if (detaching)
          detach(if_block2_anchor);
        mounted = false;
        dispose();
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let componentList;
    var {Liquid, Tokenizer} = require_liquid_browser_umd();
    const engine = new Liquid({root: "/components", extname: ".html"});
    const toml = require_toml();
    const yaml = require_js_yaml();
    let {components: components2 = {}} = $$props;
    let selectedComponent = "nothing";
    let outputHTML = "";
    let yamlProps = "# Nothing";
    let editYaml = false;
    const render = async (c, p) => {
      if (c === "nothing")
        return;
      const props = yaml.load(p) ?? {};
      const newSource = rewriteIncludes(components2[c]?.source);
      const o = await engine.parseAndRender(newSource || "", props);
      $$invalidate(2, outputHTML = o);
    };
    const updateComponent = async (c) => {
      if (c === "nothing")
        return;
      let curUrl = new URL(window.location);
      curUrl.hash = c;
      window.history.replaceState({}, "", curUrl);
      $$invalidate(1, yamlProps = yaml.dump(processProps(toml.parse(components2[c]?.config)?.defaults) || ""));
      console.log(toml.parse(components2[c]?.config));
    };
    const processProps = (obj) => {
      for (const key of Object.keys(obj)) {
        if (/--/.test(key)) {
          const newkey = key.split("--")[0];
          const keyType = key.split("--")[1];
          let newval;
          switch (keyType) {
            case "check":
            case "inline-check":
            case "radio":
            case "inline-radio":
            case "select":
            case "multi-select":
              newval = obj[key][Object.keys(obj[key])[0]];
              obj[newkey] = newval;
              delete obj[key];
              break;
            case "repeat":
              newval = [{...obj[key]}, {...obj[key]}, {...obj[key]}];
              obj[newkey] = newval;
              delete obj[key];
              break;
          }
        }
      }
      return obj;
    };
    const rewriteIncludes = function(text2) {
      text2 = text2.toString();
      let tokenizer = new Tokenizer(text2);
      let output = tokenizer.readTopLevelTokens();
      output.reverse().forEach((tag) => {
        text2 = rewriteTag(tag, text2);
      });
      return `${text2}`;
    };
    const rewriteTag = function(token, src) {
      let raw = token.getText();
      let length = raw.length;
      if (token.kind === 16)
        return src;
      if (token.name && token.name.match(/^end/))
        return src;
      if (token.name && token.name === "include_cached")
        raw = raw.replace(/include_cached/, "include");
      if (token.name && token.name === "component") {
        token.name = "include";
        raw = raw.replace(/component (\S+)/, (_, component) => {
          let cpath = component.split("/");
          let cname = cpath[cpath.length - 1];
          return `include ${component}/${cname}.jekyll.html`;
        });
      }
      if (token.name && token.name.match(/^include/)) {
        raw = raw.replace(/=/g, ": ");
        raw = raw.replace(/include\s([^"'][^\s]+)/gi, 'include "$1"');
      }
      raw = raw.replace(/\binclude\./gi, "");
      return [src.substr(0, token.begin), raw, src.substr(token.end)].join("");
    };
    onMount(() => {
      let curUrl = new URL(window.location);
      if (curUrl.hash) {
        $$invalidate(0, selectedComponent = curUrl.hash.replace(/^#/, ""));
      }
    });
    const click_handler = () => $$invalidate(3, editYaml = !editYaml);
    function select_change_handler() {
      selectedComponent = select_value(this);
      $$invalidate(0, selectedComponent);
      $$invalidate(4, componentList), $$invalidate(5, components2);
    }
    function textarea_input_handler() {
      yamlProps = this.value;
      $$invalidate(1, yamlProps);
    }
    $$self.$$set = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(5, components2 = $$props2.components);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 32) {
        $:
          $$invalidate(4, componentList = Object.keys(components2));
      }
      if ($$self.$$.dirty & 1) {
        $:
          updateComponent(selectedComponent);
      }
      if ($$self.$$.dirty & 3) {
        $:
          render(selectedComponent, yamlProps);
      }
    };
    return [
      selectedComponent,
      yamlProps,
      outputHTML,
      editYaml,
      componentList,
      components2,
      click_handler,
      select_change_handler,
      textarea_input_handler
    ];
  }
  var Polymorph = class extends SvelteComponent {
    constructor(options) {
      super();
      if (!document.getElementById("svelte-t9nwzm-style"))
        add_css();
      init(this, options, instance, create_fragment, safe_not_equal, {components: 5});
    }
  };
  var polymorph_default = Polymorph;

  // import-glob:./../../../CC/cc-marketing/packages/component-library/components/**/*.jekyll.html
  var jekyll_exports = {};
  __export(jekyll_exports, {
    default: () => jekyll_default,
    filenames: () => filenames
  });

  // ../../../CC/cc-marketing/packages/component-library/components/accordion/accordion.jekyll.html
  var accordion_jekyll_exports = {};
  __export(accordion_jekyll_exports, {
    default: () => accordion_jekyll_default
  });
  var accordion_jekyll_default = `{% svelte accordion bind=include baseurl=site.baseurl %}
    <div class="{{ 'c-accordion' | addmods: two_columns:include.two_columns }}">
        <div class="c-accordion__container">
            {% assign title_length = include.title | size %}

            <div class="{% if include.two_columns == true %} c-accordion__item-container-even {% endif %}">
                {% for item in include.accordion_items %}
                    <div class="c-accordion__item-container {{ '' | addstates: open:item.is_open }}">
                        {% assign id_counter = id_counter | plus: 1 %}
                        <button class="c-accordion__button" aria-controls="{{include.id}}-{{id_counter}}" {% if item.is_open == true %} aria-expanded="true" {% endif %}>
                            {{ item.heading }}
                            {% if item.open %}
                                <div class="cc-helper-hidden">
                                    Close
                                </div>
                            {% elsif item.closed %}
                                <div class="c-accordion__icon" style="-webkit-mask-image: url('{{ site.baseurl }}/assets/tick.svg'); mask-image: url('{{ site.baseurl }}/assets/tick.svg');"></div>
                                <div class="cc-helper-hidden">
                                    Open
                                </div>
                            {% endif %}
                        </button>

                        <p class="c-accordion__item-content" id="{{include.id}}-{{id_counter}}" {% if item.is_open == false %} aria-hidden="true" {% endif %}>
                            {{ item.content }}
                        </p>
                    </div>
                {% endfor %}
            </div>

            {% if include.two_columns == true %}
                <div class="{% if include.two_columns == true %} c-accordion__item-container-odd {% endif %}">
                    {% for item in include.accordion_items %}
                        <div class="c-accordion__item-container {{ '' | addstates: open:item.is_open }}">
                            {% assign id_counter = id_counter | plus: 1 %}
                            <button class="c-accordion__button" aria-controls="{{include.id}}-{{id_counter}}" {% if item.is_open == true %} aria-expanded="true" {% endif %}>
                                {{ item.heading }}
                                {% if item.open %}
                                    <div class="cc-helper-hidden">
                                        Close
                                    </div>
                                {% elsif item.closed %}
                                    <div class="c-accordion__icon" style="-webkit-mask-image: url('{{ site.baseurl }}/assets/tick.svg'); mask-image: url('{{ site.baseurl }}/assets/tick.svg');"></div>
                                    <div class="cc-helper-hidden">
                                        Open
                                    </div>
                                {% endif %}
                            </button>

                            <p class="c-accordion__item-content" id="{{include.id}}-{{id_counter}}" {% if item.is_open == false %} aria-hidden="true" {% endif %}>
                                {{ item.content }}
                            </p>
                        </div>
                    {% endfor %}
                </div>
            {% endif %}

        </div>
    </div>
{% endsvelte %}`;

  // ../../../CC/cc-marketing/packages/component-library/components/address/card/card.jekyll.html
  var card_jekyll_exports = {};
  __export(card_jekyll_exports, {
    default: () => card_jekyll_default
  });
  var card_jekyll_default = `<div class="c-address-card">

    <div class="c-address-card__image-container" style="background-image: url('{{ site.baseurl }}{{ include.image_path }}');" ></div>
    <div class="c-address-card__body-container">
        <div class="c-address-card__sub-text">
            {{ include.sub_text }}
        </div>
        <div class="c-address-card__title-container">
            <div class="cc-helper__h4 c-address-card__heading">
                {{ include.title }}
            </div>
            <div class="c-address-card__icon-container">
                {% for item in include.icon_list %}
                <a href={{item.icon_url}} rel="noopener" target="_blank">
                    <div class="cc-helper-hidden">
                        {{item.icon_alt}}
                    </div>
                    <div class="c-address-card__icon-link" style="-webkit-mask-image: url('{{site.baseurl}}{{item.icon_path}}'); mask-image: url('{{site.baseurl}}{{item.icon_path}};"></div>
                </a>
                {% endfor %}
            </div>
        </div>
        <div>
            {{ include.content }}
        </div>
        <ul class="c-address-card__list-container">
            {% for item in include.list %}
                <li class="c-address-card__list-item">

                    <div class="c-address-card__icon" style="-webkit-mask-image: url('{{site.baseurl}}/{{item.icon_path}}'); mask-image: url('{{site.baseurl}}{{include.icon_path}};"></div>
                    <div>
                        {{ item.content_markdown | markdownify }}
                    </div>
                </li>
            {% endfor %}
        </ul>
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/address/group/group.jekyll.html
  var group_jekyll_exports = {};
  __export(group_jekyll_exports, {
    default: () => group_jekyll_default
  });
  var group_jekyll_default = '<div class="c-address-card-group">\n    {% for card in include.address_cards %}\n        {% component address/card bind=card %}\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/archive-card/archive-card.jekyll.html
  var archive_card_jekyll_exports = {};
  __export(archive_card_jekyll_exports, {
    default: () => archive_card_jekyll_default
  });
  var archive_card_jekyll_default = '<div class="c-archive-card">\n    <div class="c-archive-card__heading cc-helper__h3">\n        {{include.heading}}\n    </div>\n    <div class="c-archive-card__image-container">\n        <img class="c-archive-card__image" src="{{ site.baseurl }}{{include.image_path}}" alt="{{include.image_alt}}">\n    </div>\n    <div class="c-archive-card__content">\n        {% component link url=include.link_url content=include.link_content show_icon=true %}\n        {{ include.description}}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/blog/card/card.jekyll.html
  var card_jekyll_exports2 = {};
  __export(card_jekyll_exports2, {
    default: () => card_jekyll_default2
  });
  var card_jekyll_default2 = `<span class="{{ 'c-blog-card' | addmods: tiny:include.tiny, featured:include.featured, compact:include.compact }}">

    <a href="/blog{{ include.link_url }}" class="c-blog-card__image-container">
        {% if include.compact %}
            <img src="/blog{{include.image_path}}" class="c-blog-card__compact-image" alt="{{include.image_alt}}"/>
        {% else %}
            <div role="img" alt="{{include.image_alt}}" class="c-blog-card__image" style="background: url(/blog{{include.image_path}}); background-repeat: no-repeat; background-position: center; background-size: cover;"></div>
        {% endif %}
    </a>

    <div class="c-blog-card__text-container">
        <div class="c-blog-card__tag-container">
            {% for tag in include.categories %}
                {% assign url = site.baseurl | append: "/archived/" | append: tag | downcase %}
                {% component tag content=tag style="default" is_link=true link_url=url %}
                <div class="c-blog-card__tag-divider">|</div>
            {% endfor %}
        </div>
        
        <a href="/blog{{ include.link_url }}" class="c-blog-card__text-container">
            <div class="cc-helper__h4 c-blog-card__heading">
                {{ include.heading }}
            </div>
            <div class="c-blog-card__date-container">
                {{ include.author }} | {{ include.date | date_to_long_string }}
            </div>
        </a>
    </div>
</span>
`;

  // ../../../CC/cc-marketing/packages/component-library/components/blog/group/group.jekyll.html
  var group_jekyll_exports2 = {};
  __export(group_jekyll_exports2, {
    default: () => group_jekyll_default2
  });
  var group_jekyll_default2 = `<div class="{{ 'c-blog-group' | addmods: vertical:include.vertical }} ">
    {% assign column = include.column | plus: 0 %}
    {% if include.title %}
        {% case include.heading_type %}
        {% when "h2" %}
            <h2 class="c-blog-group__heading cc-helper__h3">
                {{ include.title }}
            </h2>
        {% when "h3" %}
            <h3 class="c-blog-group__heading cc-helper__h3">
                {{ include.title }} 
            </h3>
        {% when "h4" %}
            <h4 class="c-blog-group__heading cc-helper__h3">
                {{ include.title }} 
            </h4>
        {% endcase %}
    {% endif %}
    <div class="c-blog-group__blog-group">
        {% for blog in include.blogs %}
            {% if forloop.index <= include.column %}
                <div class="c-blog-group__blog">
                    {% component blog/card bind=blog %}
                </div>
            {% endif %}
        {% endfor %}
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/br/br.jekyll.html
  var br_jekyll_exports = {};
  __export(br_jekyll_exports, {
    default: () => br_jekyll_default
  });
  var br_jekyll_default = '<div class="c-br">\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/button/button.jekyll.html
  var button_jekyll_exports = {};
  __export(button_jekyll_exports, {
    default: () => button_jekyll_default
  });
  var button_jekyll_default = `<button id="{{ include.id }}" class="cc-helper__button {{ 'c-button' | addmods: disabled:include.disabled, link:include.link, inline:include.inline, right_icon:include.right_icon, left_icon:include.left_icon }} {% if include.style %} cc-helper__button--{{include.style}} {% endif %}" {% if include.submit %} type="submit" {% endif %}>
    {% if include.left_icon %}
        <div class="cc-button__icon" aria-hidden="true" style="height: {{include.icon_size_number }}; width: {{include.icon_size_number}}; -webkit-mask-image: url('{{ site.baseurl }}{{include.icon_path}}'); mask-image: url('{{ site.baseurl }}{{include.icon_path}}');"></div>
    {% endif %}
    
    {{ include.content }}
    
    {% if include.right_icon %}
        <div class="cc-button__icon" aria-hidden="true" style="height: {{include.icon_size_height_number }}; width: {{include.icon_size_width_number}}; -webkit-mask-image: url('{{ site.baseurl }}{{include.icon_path}}'); mask-image: url('{{ site.baseurl }}{{include.icon_path}}');"></div>
    {% endif %}
</button>`;

  // ../../../CC/cc-marketing/packages/component-library/components/category-card/category-card.jekyll.html
  var category_card_jekyll_exports = {};
  __export(category_card_jekyll_exports, {
    default: () => category_card_jekyll_default
  });
  var category_card_jekyll_default = '\n<div class="c-category-card">\n    <div class="c-category-card__link">\n        {% assign url = include.link_url | downcase %}\n        {% component link content=include.category show_icon=true url=url %}\n    </div>\n    <img class="c-category-card__image" src="{{ site.baseurl }}{{include.image_path}}" alt="{{include.image_alt}}">\n    {% for item in include.blogs %}\n        <div class="c-category-card__blog-link-item">\n            {% assign updated_link = site.baseurl | append: item.link_url %}\n            {% component link content=item.heading url=updated_link %}\n        </div>\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/code-block/code-block.jekyll.html
  var code_block_jekyll_exports = {};
  __export(code_block_jekyll_exports, {
    default: () => code_block_jekyll_default
  });
  var code_block_jekyll_default = `<div class="c-code-block">
    <div class="c-code-block__heading" >
        <div class="c-code-block__icon" >
            {% assign shell_languages = 'console, powershell, shell' | remove: ' ' | split: ',' %}
            {% if shell_languages contains include.language %}
                <svg height="16" viewBox="0 0 24 24">
                    <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
                </svg>
            {% else %}
                {% case include.language %}
                {% when "javascript" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
                    </svg>
                {% when "json" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M11 8H9V10C9 11.1 8.1 12 7 12C8.1 12 9 12.9 9 14V16H11V18H9C7.9 18 7 17.1 7 16V15C7 13.9 6.1 13 5 13V11C6.1 11 7 10.1 7 9V8C7 6.9 7.9 6 9 6H11V8M19 13C17.9 13 17 13.9 17 15V16C17 17.1 16.1 18 15 18H13V16H15V14C15 12.9 15.9 12 17 12C15.9 12 15 11.1 15 10V8H13V6H15C16.1 6 17 6.9 17 8V9C17 10.1 17.9 11 19 11V13Z" />
                    </svg>
                {% when "toml" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M6,6V18H10V16H8V8H10V6H6M16,16H14V18H18V6H14V8H16V16Z" />
                    </svg>
                {% when "yaml" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M10,13.6H14v3.3H10 M10,7.1H14v3.3H10 M5,3C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5z">
                    </svg>
                {% when "markdown" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6H20.56C21.35 6 22 6.63 22 7.41V16.59C22 17.37 21.35 18 20.56 18M6.81 15.19V11.53L8.73 13.88L10.65 11.53V15.19H12.58V8.81H10.65L8.73 11.16L6.81 8.81H4.89V15.19H6.81M19.69 12H17.77V8.81H15.85V12H13.92L16.81 15.28L19.69 12Z" />
                    </svg>
                {% when "plaintext" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
                    </svg>
                {% when "html" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                    </svg>
                {% when "java" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M16.5,6.08C16.5,6.08 9.66,7.79 12.94,11.56C13.91,12.67 12.69,13.67 12.69,13.67C12.69,13.67 15.14,12.42 14,10.82C12.94,9.35 12.14,8.62 16.5,6.08M12.03,7.28C16.08,4.08 14,2 14,2C14.84,5.3 11.04,6.3 9.67,8.36C8.73,9.76 10.13,11.27 12,13C11.29,11.3 8.78,9.84 12.03,7.28M9.37,17.47C6.29,18.33 11.25,20.1 15.16,18.43C14.78,18.28 14.41,18.1 14.06,17.89C12.7,18.2 11.3,18.26 9.92,18.07C8.61,17.91 9.37,17.47 9.37,17.47M14.69,15.79C12.94,16.17 11.13,16.26 9.35,16.05C8.04,15.92 8.9,15.28 8.9,15.28C5.5,16.41 10.78,17.68 15.5,16.3C15.21,16.19 14.93,16 14.69,15.79M18.11,19.09C18.11,19.09 18.68,19.56 17.5,19.92C15.22,20.6 8.07,20.81 6.09,19.95C5.38,19.64 6.72,19.21 7.14,19.12C7.37,19.06 7.6,19.04 7.83,19.04C7.04,18.5 2.7,20.14 5.64,20.6C13.61,21.9 20.18,20 18.11,19.09M15.37,14.23C15.66,14.04 15.97,13.88 16.29,13.74C16.29,13.74 14.78,14 13.27,14.14C11.67,14.3 10.06,14.32 8.46,14.2C6.11,13.89 9.75,13 9.75,13C8.65,13 7.57,13.26 6.59,13.75C4.54,14.75 11.69,15.2 15.37,14.23M16.27,16.65C16.25,16.69 16.23,16.72 16.19,16.75C21.2,15.44 19.36,12.11 16.96,12.94C16.83,13 16.72,13.08 16.65,13.19C16.79,13.14 16.93,13.1 17.08,13.07C18.28,12.83 20,14.7 16.27,16.65M16.4,21.26C13.39,21.78 10.31,21.82 7.28,21.4C7.28,21.4 7.74,21.78 10.09,21.93C13.69,22.16 19.22,21.8 19.35,20.1C19.38,20.11 19.12,20.75 16.4,21.26Z" />
                    </svg>
                {% when "docker" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M21.81 10.25C21.75 10.21 21.25 9.82 20.17 9.82C19.89 9.82 19.61 9.85 19.33 9.9C19.12 8.5 17.95 7.79 17.9 7.76L17.61 7.59L17.43 7.86C17.19 8.22 17 8.63 16.92 9.05C16.72 9.85 16.84 10.61 17.25 11.26C16.76 11.54 15.96 11.61 15.79 11.61H2.62C2.28 11.61 2 11.89 2 12.24C2 13.39 2.18 14.54 2.58 15.62C3.03 16.81 3.71 17.69 4.58 18.23C5.56 18.83 7.17 19.17 9 19.17C9.79 19.17 10.61 19.1 11.42 18.95C12.54 18.75 13.62 18.36 14.61 17.79C15.43 17.32 16.16 16.72 16.78 16C17.83 14.83 18.45 13.5 18.9 12.35H19.09C20.23 12.35 20.94 11.89 21.33 11.5C21.59 11.26 21.78 10.97 21.92 10.63L22 10.39L21.81 10.25M3.85 11.24H5.61C5.69 11.24 5.77 11.17 5.77 11.08V9.5C5.77 9.42 5.7 9.34 5.61 9.34H3.85C3.76 9.34 3.69 9.41 3.69 9.5V11.08C3.7 11.17 3.76 11.24 3.85 11.24M6.28 11.24H8.04C8.12 11.24 8.2 11.17 8.2 11.08V9.5C8.2 9.42 8.13 9.34 8.04 9.34H6.28C6.19 9.34 6.12 9.41 6.12 9.5V11.08C6.13 11.17 6.19 11.24 6.28 11.24M8.75 11.24H10.5C10.6 11.24 10.67 11.17 10.67 11.08V9.5C10.67 9.42 10.61 9.34 10.5 9.34H8.75C8.67 9.34 8.6 9.41 8.6 9.5V11.08C8.6 11.17 8.66 11.24 8.75 11.24M11.19 11.24H12.96C13.04 11.24 13.11 11.17 13.11 11.08V9.5C13.11 9.42 13.05 9.34 12.96 9.34H11.19C11.11 9.34 11.04 9.41 11.04 9.5V11.08C11.04 11.17 11.11 11.24 11.19 11.24M6.28 9H8.04C8.12 9 8.2 8.91 8.2 8.82V7.25C8.2 7.16 8.13 7.09 8.04 7.09H6.28C6.19 7.09 6.12 7.15 6.12 7.25V8.82C6.13 8.91 6.19 9 6.28 9M8.75 9H10.5C10.6 9 10.67 8.91 10.67 8.82V7.25C10.67 7.16 10.61 7.09 10.5 7.09H8.75C8.67 7.09 8.6 7.15 8.6 7.25V8.82C8.6 8.91 8.66 9 8.75 9M11.19 9H12.96C13.04 9 13.11 8.91 13.11 8.82V7.25C13.11 7.16 13.04 7.09 12.96 7.09H11.19C11.11 7.09 11.04 7.15 11.04 7.25V8.82C11.04 8.91 11.11 9 11.19 9M11.19 6.72H12.96C13.04 6.72 13.11 6.65 13.11 6.56V5C13.11 4.9 13.04 4.83 12.96 4.83H11.19C11.11 4.83 11.04 4.89 11.04 5V6.56C11.04 6.64 11.11 6.72 11.19 6.72M13.65 11.24H15.41C15.5 11.24 15.57 11.17 15.57 11.08V9.5C15.57 9.42 15.5 9.34 15.41 9.34H13.65C13.57 9.34 13.5 9.41 13.5 9.5V11.08C13.5 11.17 13.57 11.24 13.65 11.24" />
                    </svg>
                {% when "css" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
                    </svg>
                {% when "sass" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M10,15.33C10.16,15.87 10.14,16.37 10,16.83C10,16.88 9.96,16.93 9.94,17C9.92,17 9.9,17.07 9.87,17.12C9.76,17.36 9.6,17.59 9.41,17.79C8.83,18.43 8,18.67 7.67,18.47C7.29,18.25 7.5,17.35 8.16,16.64C8.88,15.88 9.92,15.38 9.92,15.38V15.38L10,15.33M18.27,6.28C17.82,4.5 14.87,3.92 12.09,4.91C10.43,5.5 8.63,6.42 7.34,7.63C5.81,9.07 5.56,10.32 5.66,10.84C6,12.68 8.54,13.89 9.58,14.78V14.79C9.28,14.94 7.04,16.07 6.5,17.23C5.96,18.45 6.6,19.33 7,19.45C8.34,19.81 9.69,19.16 10.41,18.07C11.11,17.03 11.06,15.68 10.75,15C11.17,14.9 11.66,14.85 12.28,14.92C14.04,15.13 14.38,16.22 14.31,16.68C14.25,17.14 13.88,17.39 13.76,17.47C13.64,17.54 13.6,17.57 13.61,17.63C13.62,17.71 13.68,17.71 13.78,17.69C13.93,17.66 14.71,17.32 14.74,16.47C14.78,15.39 13.75,14.19 11.93,14.22C11.18,14.24 10.71,14.31 10.37,14.44L10.29,14.35C9.16,13.15 7.08,12.3 7.17,10.68C7.2,10.09 7.4,8.55 11.17,6.67C14.25,5.13 16.72,5.55 17.15,6.5C17.76,7.83 15.83,10.32 12.63,10.68C11.41,10.82 10.76,10.34 10.6,10.17C10.43,10 10.41,9.97 10.35,10C10.24,10.07 10.31,10.23 10.35,10.33C10.44,10.58 10.84,11 11.5,11.24C12.09,11.43 13.53,11.54 15.26,10.87C17.2,10.12 18.72,8.03 18.27,6.28Z" />
                    </svg>
                {% when "scss" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M10,15.33C10.16,15.87 10.14,16.37 10,16.83C10,16.88 9.96,16.93 9.94,17C9.92,17 9.9,17.07 9.87,17.12C9.76,17.36 9.6,17.59 9.41,17.79C8.83,18.43 8,18.67 7.67,18.47C7.29,18.25 7.5,17.35 8.16,16.64C8.88,15.88 9.92,15.38 9.92,15.38V15.38L10,15.33M18.27,6.28C17.82,4.5 14.87,3.92 12.09,4.91C10.43,5.5 8.63,6.42 7.34,7.63C5.81,9.07 5.56,10.32 5.66,10.84C6,12.68 8.54,13.89 9.58,14.78V14.79C9.28,14.94 7.04,16.07 6.5,17.23C5.96,18.45 6.6,19.33 7,19.45C8.34,19.81 9.69,19.16 10.41,18.07C11.11,17.03 11.06,15.68 10.75,15C11.17,14.9 11.66,14.85 12.28,14.92C14.04,15.13 14.38,16.22 14.31,16.68C14.25,17.14 13.88,17.39 13.76,17.47C13.64,17.54 13.6,17.57 13.61,17.63C13.62,17.71 13.68,17.71 13.78,17.69C13.93,17.66 14.71,17.32 14.74,16.47C14.78,15.39 13.75,14.19 11.93,14.22C11.18,14.24 10.71,14.31 10.37,14.44L10.29,14.35C9.16,13.15 7.08,12.3 7.17,10.68C7.2,10.09 7.4,8.55 11.17,6.67C14.25,5.13 16.72,5.55 17.15,6.5C17.76,7.83 15.83,10.32 12.63,10.68C11.41,10.82 10.76,10.34 10.6,10.17C10.43,10 10.41,9.97 10.35,10C10.24,10.07 10.31,10.23 10.35,10.33C10.44,10.58 10.84,11 11.5,11.24C12.09,11.43 13.53,11.54 15.26,10.87C17.2,10.12 18.72,8.03 18.27,6.28Z" />
                    </svg>
                {% when "ruby" %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M18.8,2.07C21.32,2.5 22.04,4.23 22,6.04V6L20.86,20.93L6.08,21.94H6.09C4.86,21.89 2.13,21.77 2,17.95L3.37,15.45L6.14,21.91L8.5,14.29L8.45,14.3L8.47,14.28L16.18,16.74L14.19,8.96L21.54,8.5L15.75,3.76L18.8,2.06V2.07M2,17.91V17.93L2,17.91V17.91M6.28,6.23C9.24,3.28 13.07,1.54 14.54,3.03C16,4.5 14.46,8.12 11.5,11.06C8.5,14 4.73,15.84 3.26,14.36C1.79,12.87 3.3,9.17 6.27,6.23H6.28Z" />
                    </svg>
                {% else %}
                    <svg height="16" viewBox="0 0 24 24">
                        <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
                    </svg>
                {% endcase %}
            {% endif %}
        </div>
        <div class="c-code-block__source" >
            {{ include.source }}
        </div>
        
        {% svelte code-block-copy-button code=include.code_block %}{% endsvelte %}
    </div>
    <div class="c-code-block__code" >
        {% case include.language %}
        {% when "apache" %}
            {% highlight apache %}{{ include.code_block }}{% endhighlight %}
        {% when "applescript" %}
            {% highlight applescript %}{{ include.code_block }}{% endhighlight %}
        {% when "awk" %}
            {% highlight awk %}{{ include.code_block }}{% endhighlight %}
        {% when "c" %}
            {% highlight c %}{{ include.code_block }}{% endhighlight %}
        {% when "clojure" %}
            {% highlight clojure %}{{ include.code_block }}{% endhighlight %}
        {% when "coffeescript" %}
            {% highlight coffeescript %}{{ include.code_block }}{% endhighlight %}
        {% when "common_lisp" %}
            {% highlight common_lisp %}{{ include.code_block }}{% endhighlight %}
        {% when "console" %}
            {% highlight console %}{{ include.code_block }}{% endhighlight %}
        {% when "cpp" %}
            {% highlight cpp %}{{ include.code_block }}{% endhighlight %}
        {% when "csharp" %}
            {% highlight csharp %}{{ include.code_block }}{% endhighlight %}
        {% when "css" %}
            {% highlight css %}{{ include.code_block }}{% endhighlight %}
        {% when "dart" %}
            {% highlight dart %}{{ include.code_block }}{% endhighlight %}
        {% when "docker" %}
            {% highlight docker %}{{ include.code_block }}{% endhighlight %}
        {% when "dot" %}
            {% highlight dot %}{{ include.code_block }}{% endhighlight %}
        {% when "erb" %}
            {% highlight erb %}{{ include.code_block }}{% endhighlight %}
        {% when "go" %}
            {% highlight go %}{{ include.code_block }}{% endhighlight %}
        {% when "graphql" %}
            {% highlight graphql %}{{ include.code_block }}{% endhighlight %}
        {% when "haml" %}
            {% highlight haml %}{{ include.code_block }}{% endhighlight %}
        {% when "handlebars" %}
            {% highlight handlebars %}{{ include.code_block }}{% endhighlight %}
        {% when "haskell" %}
            {% highlight haskell %}{{ include.code_block }}{% endhighlight %}
        {% when "html" %}
            {% highlight html %}{{ include.code_block }}{% endhighlight %}
        {% when "java" %}
            {% highlight java %}{{ include.code_block }}{% endhighlight %}
        {% when "javascript" %}
            {% highlight javascript %}{{ include.code_block }}{% endhighlight %}
        {% when "json" %}
            {% highlight json %}{{ include.code_block }}{% endhighlight %}
        {% when "jsx" %}
            {% highlight jsx %}{{ include.code_block }}{% endhighlight %}
        {% when "liquid" %}
            {% highlight liquid %}{{ include.code_block }}{% endhighlight %}
        {% when "markdown" %}
            {% highlight markdown %}{{ include.code_block }}{% endhighlight %}
        {% when "nginx" %}
            {% highlight nginx %}{{ include.code_block }}{% endhighlight %}
        {% when "objective_c" %}
            {% highlight objective_c %}{{ include.code_block }}{% endhighlight %}
        {% when "pascal" %}
            {% highlight pascal %}{{ include.code_block }}{% endhighlight %}
        {% when "perl" %}
            {% highlight perl %}{{ include.code_block }}{% endhighlight %}
        {% when "php" %}
            {% highlight php %}{{ include.code_block }}{% endhighlight %}
        {% when "plaintext" %}
            {% highlight plaintext %}{{ include.code_block }}{% endhighlight %}
        {% when "powershell" %}
            {% highlight powershell %}{{ include.code_block }}{% endhighlight %}
        {% when "python" %}
            {% highlight python %}{{ include.code_block }}{% endhighlight %}
        {% when "ruby" %}
            {% highlight ruby %}{{ include.code_block }}{% endhighlight %}
        {% when "rust" %}
            {% highlight rust %}{{ include.code_block }}{% endhighlight %}
        {% when "sass" %}
            {% highlight sass %}{{ include.code_block }}{% endhighlight %}
        {% when "scala" %}
            {% highlight scala %}{{ include.code_block }}{% endhighlight %}
        {% when "scss" %}
            {% highlight scss %}{{ include.code_block }}{% endhighlight %}
        {% when "sed" %}
            {% highlight sed %}{{ include.code_block }}{% endhighlight %}
        {% when "shell" %}
            {% highlight shell %}{{ include.code_block }}{% endhighlight %}
        {% when "sql" %}
            {% highlight sql %}{{ include.code_block }}{% endhighlight %}
        {% when "toml" %}
            {% highlight toml %}{{ include.code_block }}{% endhighlight %}
        {% when "typescript" %}
            {% highlight typescript %}{{ include.code_block }}{% endhighlight %}
        {% when "vue" %}
            {% highlight vue %}{{ include.code_block }}{% endhighlight %}
        {% when "xml" %}
            {% highlight xml %}{{ include.code_block }}{% endhighlight %}
        {% when "yaml" %}
            {% highlight yaml %}{{ include.code_block }}{% endhighlight %}
        {% else %}
            {% highlight text %}{{ include.code_block }}{% endhighlight %}
        {% endcase %}
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/coloured-cards/coloured-cards.jekyll.html
  var coloured_cards_jekyll_exports = {};
  __export(coloured_cards_jekyll_exports, {
    default: () => coloured_cards_jekyll_default
  });
  var coloured_cards_jekyll_default = '<div class="c-coloured-cards">\n    {% for card in include.coloured-cards %}\n        <div class="c-coloured-cards__card" style="box-shadow: 0px 16px 52px -12px {{card.shadow_colour_rgba}}; border: 2px solid {{card.main_colour}};">\n            <div>\n                <img class="c-coloured-cards__icon" src="{{site.baseurl}}{{card.icon_path}}" alt="{{card.icon_alt}}">\n                {% case include.heading_type %}\n                {% when "h3" %}\n                <h3 class="c-coloured-cards__heading">\n                    {{ card.heading }}\n                </h3>\n                {% when "h4" %}\n                <h4 class="c-coloured-cards__heading">\n                    {{ card.heading }}\n                </h4>\n                {% endcase %}\n                <div class="c-coloured-cards__content">\n                    {{ card.content_markdown }}\n                </div>\n            </div>\n            <div class="c-coloured-cards__link">\n                {% component link content=card.link_content url=card.link_url show_icon=true %}\n            </div>\n        </div>\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/contact-cta/contact-cta.jekyll.html
  var contact_cta_jekyll_exports = {};
  __export(contact_cta_jekyll_exports, {
    default: () => contact_cta_jekyll_default
  });
  var contact_cta_jekyll_default = '<div class="c-contact-cta">\n    <div class="c-contact-cta__heading cc-helper__h2">\n        {{ include.heading }}\n    </div>\n    {% if include.content %}\n        <p class="c-contact-cta__content">\n            {{ include.content }}\n        </p>\n    {% endif %}\n    {% if include.link_content %}\n        <div class="c-contact-cta__link">\n            {% component link url=include.link_url content=include.link_content open_in_new_tab=include.link_open_in_new_tab style="dark" %}\n        </div>\n    {% endif %}\n    </div>\n';

  // ../../../CC/cc-marketing/packages/component-library/components/contact-form/contact-form.jekyll.html
  var contact_form_jekyll_exports = {};
  __export(contact_form_jekyll_exports, {
    default: () => contact_form_jekyll_default
  });
  var contact_form_jekyll_default = `{% if page.title %}
    {% assign title=page.title %}
{% endif %}
{% svelte contact-form bind=include title=title baseurl=site.baseurl %}
    <div class="c-contact-form">
        <img class="c-contact-form__image-laptop" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}">
        <div class="c-contact-form__body-container">
            {% if include.heading_type == "h1" %}
                <h1 class="c-contact-form__heading">
                    {{ include.heading }}
                </h1>
            {% elsif include.heading_type == "h2" %}
                <h2 class="c-contact-form__heading">
                    {{ include.heading }}
                </h2>
            {% endif %}
            <p class="c-contact-form__content">
                {{ include.content }}
            </p>
            <img class="c-contact-form__image-mobile" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}">
            <form method="post" action="{{ include.success_page }}">
                {% if include.hook_value %}
                    <input type="hidden" name="_hook" value="{{include.hook_value}}">
                {% endif %}
                {% for item in include.form_items %}
                    <div class="{% if item.input_type == 'submit' %} c-contact-form__submit {% endif %}">
                        {% component input bind=item %}
                    </div>
                {% endfor %}
            </form>
        </div>
    </div>
{% endsvelte %}`;

  // ../../../CC/cc-marketing/packages/component-library/components/content-grid/content-grid.jekyll.html
  var content_grid_jekyll_exports = {};
  __export(content_grid_jekyll_exports, {
    default: () => content_grid_jekyll_default
  });
  var content_grid_jekyll_default = '<div class="c-content-grid">\n    {% assign column = include.column | plus: 0 %}\n\n    {% case include.heading_type %}\n    {% when "h1" %}\n        <h1>\n            {{ include.heading }}\n        </h1>\n    {% when "h2" %}\n        <h2>\n            {{ include.heading }}\n        </h2>\n    {% when "h3" %}\n        <h3>\n            {{ include.heading }}\n        </h3>\n    {% endcase %}\n    <div class="c-content-grid__group">\n        {% for item in include.content_grid_item %}\n        <div class="c-content-grid__item {% unless item.image_path %} c-content-grid__item--no-image {% endunless %} c-content-grid__item--{{include.column}}">\n            {% if item.image_path %}\n                <img class="c-content-grid__image c-content-grid__image--{{ include.image_size }}" src="{{ site.baseurl }}{{ item.image_path }}" {% if item.image_alt %} alt="{{ item.image_alt }}" {% else %} aria-hidden="true" {% endif %} />\n            {% endif %}\n            <div>\n                {% case item.heading_type %}\n                {% when "h3" %}\n                    <div class="cc-helper__h3">\n                        {{ item.heading }}\n                    </div>\n                {% when "h4" %}\n                    <div class="cc-helper__h4">\n                        {{ item.heading }}\n                    </div>\n                {% when "h5" %}\n                    <div class="cc-helper__h5">\n                        {{ item.heading }}\n                    </div>\n                {% endcase %}\n\n                <p class="c-content-grid__body-text">\n                    {{ item.content }}\n                </p>\n            </div>\n        </div>\n        {% endfor %}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/cta/cta.jekyll.html
  var cta_jekyll_exports = {};
  __export(cta_jekyll_exports, {
    default: () => cta_jekyll_default
  });
  var cta_jekyll_default = `<div class="c-cta" style="background-image:url('/assets/cta-illustration.svg');">
    <div class="c-cta__heading cc-helper__h2">
        {{ include.heading }}
    </div>
    {% if include.content %}
        <p class="c-cta__content">
            {{ include.content }}
        </p>
    {% endif %}
    {% if include.link_content %}
        <div class="c-cta__link">
            {% component link url=include.link_url content=include.link_content open_in_new_tab=include.link_open_in_new_tab style="light" %}
        </div>
    {% endif %}
</div>
`;

  // ../../../CC/cc-marketing/packages/component-library/components/data-reference/data-reference.jekyll.html
  var data_reference_jekyll_exports = {};
  __export(data_reference_jekyll_exports, {
    default: () => data_reference_jekyll_default
  });
  var data_reference_jekyll_default = '<div class="c-data-reference">\n	{% for row in include.rows %}\n	<div class="c-data-reference__item" role="tablist" aria-label="{label}">\n		<code class="c-data-reference__key">{{ row.key }}</code>\n		<div class="c-data-reference__type">{{ row.type_markdown | markdownify }}</div>\n		<div class="c-data-reference__description">{{ row.description_markdown | markdownify }}</div>\n	</div>\n	{% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/docs-image/docs-image.jekyll.html
  var docs_image_jekyll_exports = {};
  __export(docs_image_jekyll_exports, {
    default: () => docs_image_jekyll_default
  });
  var docs_image_jekyll_default = '{% assign generated_image_width = site.data._image-sizes[include.image_path].width %}\n{% assign generated_image_height = site.data._image-sizes[include.image_path].height %}\n{% assign generated_retina_image_width = site.data._image-sizes[include.retina_image_path].width %}\n\n{% assign srcset_image_width = generated_image_width %}\n{% unless srcset_image_width %}\n    {% assign srcset_image_width = include.image_width | default: 800 %}\n{% endunless %}\n\n{% assign srcset_retina_image_width = generated_retina_image_width %}\n{% unless srcset_retina_image_width %}\n    {% assign srcset_retina_image_width = include.retina_image_width | default: 1600 %}\n{% endunless %}\n\n<div class="c-docs-image__wrapper"\n    style="--placeholder-width: {{ generated_image_width | default: 3 }}; --placeholder-height: {{ generated_image_height | default: 2 }};">\n{% svelte docs-image       bind=include       baseurl=site.baseurl       main_width=generated_image_width       main_height=generated_image_height       srcset_main_width=srcset_image_width       srcset_retina_width=srcset_retina_image_width %}\n{% assign retina_path_size = include.retina_image_path | trim | size %}\n<div class="c-docs-image c-docs-image--type-{{ include.image_type }}">\n    <img class="c-docs-image__image"\n        alt="{{ include.image_alt }}"\n        src="{{ site.baseurl }}{{ include.image_path }}"\n        {% if generated_image_width %}\n        width="{{generated_image_width}}"\n        {% endif %}\n        {% if generated_image_height %}\n        height="{{generated_image_height}}"\n        {% endif %}\n        {% if retina_path_size > 0 %}\n        srcset="{{ site.baseurl }}{{ include.image_path }} {{ generated_image_width | default: 800 }}w, {{ site.baseurl }}{{ include.retina_image_path }} {{ generated_retina_image_width | default: 1600 }}w"\n        {% endif %}>\n</div>\n{% endsvelte %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/docs-tabs/docs-tabs.jekyll.html
  var docs_tabs_jekyll_exports = {};
  __export(docs_tabs_jekyll_exports, {
    default: () => docs_tabs_jekyll_default
  });
  var docs_tabs_jekyll_default = `{% assign doc_tab_unique_counter = doc_tab_unique_counter | plus: 1 %}
<div class="c-docs-tabs">
	{% svelte docs-tabs bind=include counter=doc_tab_unique_counter %}
	<div class="c-docs-tabs__nav" role="tablist" aria-label="{label}">
		{% for tab in include.tabs %}
			<button class="c-docs-tabs__tab"
				role="tab" 
				{% if forloop.first and include.closed != true %}
					aria-selected="true"
				{% else %}
					aria-selected="false"
				{% endif %}
				aria-controls="docs-tabs-panel-{{doc_tab_unique_counter}}-{{forloop.index}}" 
				id="docs-tabs-tab-{{doc_tab_unique_counter}}-{{forloop.index}}">
				{{ tab.tab_name }}
			</button>
		{% endfor %}
	</div>
	{% endsvelte %}

	{% for tab in include.tabs %}
	<div class="{{'c-docs-tabs__item' | addstates: active:forloop.first }}"
		id="docs-tabs-panel-{{doc_tab_unique_counter}}-{{forloop.index}}"
		role="tabpanel" 
		tabindex="0"
		aria-labelledby="docs-tabs-tab-{{doc_tab_unique_counter}}-{{forloop.index}}"
		{% unless forloop.first and include.closed != true %}hidden{% endunless %}>
		{% for c in tab.doc_blocks %}
			{% component {{c._component_type}} bind=c %}
		{% endfor %}
	</div>
	{% endfor %}
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/editor-input-docs/editor-input-docs.jekyll.html
  var editor_input_docs_jekyll_exports = {};
  __export(editor_input_docs_jekyll_exports, {
    default: () => editor_input_docs_jekyll_default
  });
  var editor_input_docs_jekyll_default = `{% assign c = 'c-editor-input-docs' %}
<div class="{{ c | addmods:  | addstates: }}">

    <div class="{{c}}__title">
        {% if include.icon_svg_image %}<img class="{{c}}__icon" src="{{site.baseurl}}{{include.icon_svg_image}}" alt="{{ include.name }} icon">{% endif %}
        <h3 class="{{c}}__name indexable" id="{{ include.name | slugify }}">{{ include.name }}</h3>
    </div>

    {% capture tabsLabel %}More info about the {{ include.name }} input{% endcapture %}
    {% capture tabsStore %}editing-input-{{ include.name | slugify }}{% endcapture %}
    {% component docs-tabs closable=false closed=false label=tabsLabel store=tabsStore tabs=include.tabs _wrapper=true %}
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/employee-frame/employee-frame.jekyll.html
  var employee_frame_jekyll_exports = {};
  __export(employee_frame_jekyll_exports, {
    default: () => employee_frame_jekyll_default
  });
  var employee_frame_jekyll_default = `<div class="c-employee-frame">
    {% case include.heading_type %}
    {% when "h2" %}
        <h2>
            {{ include.heading }}
        </h2>
    {% when "h3" %}
        <h3>
            {{ include.heading }}
        </h3>
    {% endcase %}

    <div class="c-employee-frame__image-container c-employee-frame__image-container--col-{{include.col}}">
        {% for item in include.image_block %}
            <div class="c-employee-frame__image-and-text">
                <div class="c-employee-frame__aspect-container">

                    <div class="c-employee-frame__image c-employee-frame__image--top" style="background-image: url('{{ site.baseurl }}{{item.image_path}}');"></div>
                    <div class="c-employee-frame__image c-employee-frame__image--bottom" style="background-image: url('{{ site.baseurl }}{{item.hover_image_path}}');"></div>
                </div>
                <div class="c-employee-frame__caption-title">
                    {{ item.caption_title }}
                </div>
                <div class="c-employee-frame__caption-supporting-text">
                    {{ item.caption_supporting_text }}
                </div>
            </div>
        {% endfor %}
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/heading-and-text/heading-and-text.jekyll.html
  var heading_and_text_jekyll_exports = {};
  __export(heading_and_text_jekyll_exports, {
    default: () => heading_and_text_jekyll_default
  });
  var heading_and_text_jekyll_default = '<div class="c-heading-and-text c-heading-and-text--{{include.alignment}} c-heading-and-text--{{include.width}} {% unless include.content_markdown %} cc-helper__no-margin-top-and-bottom {% endunless %}">\n    {% assign column = include.col | plus: 0 %}\n    {% case include.heading_type %}\n    {% when "h1" %}\n        <h1 class="c-heading-and-text__heading {% unless include.content_markdown %} cc-helper__no-margin-top-and-bottom {% endunless %}" id="{{ include.heading | slugify }}">\n            {{ include.heading }}\n        </h1>\n    {% when "h2" %}\n        <h2 class="c-heading-and-text__heading {% unless include.content_markdown %} cc-helper__no-margin-top-and-bottom {% endunless %}" id="{{ include.heading | slugify }}">\n            {{ include.heading }}\n        </h2>\n    {% when "h3" %}\n        <h3 class="c-heading-and-text__heading {% unless include.content_markdown %} cc-helper__no-margin-top-and-bottom {% endunless %}" id="{{ include.heading | slugify }}">\n            {{ include.heading }}\n        </h3>\n    {% when "h4" %}\n        <h4 class="c-heading-and-text__heading {% unless include.content_markdown %} cc-helper__no-margin-top-and-bottom {% endunless %}" id="{{ include.heading | slugify }}">\n            {{ include.heading }}\n        </h4>\n    {% endcase %}\n    <div class="c-heading-and-text__text--{{include.alignment}} c-heading-and-text__text--{{include.width}} c-heading-and-text__text c-heading-and-text__text--{{- column -}}" >\n        {{ include.content_markdown | markdownify }}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/heading-with-link/heading-with-link.jekyll.html
  var heading_with_link_jekyll_exports = {};
  __export(heading_with_link_jekyll_exports, {
    default: () => heading_with_link_jekyll_default
  });
  var heading_with_link_jekyll_default = `{% assign c = 'c-heading-with-link' %}
<div class="{{ c | addmods:  | addstates: }}">

    <div class="c-heading-with-link__heading-container">
        {% case include.heading_type %}
        {% when "h2" %}
        <h2 class="c-heading-with-link__heading">
            {{ include.heading }}
        </h2>
        {% when "h3" %}
        <h3 class="c-heading-with-link__heading">
            {{ include.heading }}
        </h3>
        {% endcase %}
    </div>
    <div class="c-heading-with-link__link-container">
        <a href="{{include.link_url}}"  class="c-heading-with-link__link">{{include.link_text}}</a>
    </div>

</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/hero/hero.jekyll.html
  var hero_jekyll_exports = {};
  __export(hero_jekyll_exports, {
    default: () => hero_jekyll_default
  });
  var hero_jekyll_default = `{% assign align = include.alignment | default: "left" %}

<div class="{{ 'c-hero' | addmods: blog:include.blog }} c-hero--{{align}} {% unless include.image_path %} c-hero--no-image {% endunless %}">
    {% if include.image_path %}
        <div role="img" alt="{{ include.image_alt }}" class="c-hero__image" style="background: url('{{ site.baseurl }}{{include.image_path}}'); background-size: contain; background-repeat: no-repeat;"></div>
    {% endif %}
    <div class="c-hero__content-container">
        {% if include.title_image_path %}
            <img class="c-hero__logo-image" src="{{ site.baseurl }}{{ include.title_image_path }}" {% if include.title_image_alt %} alt="{{ include.title_image_alt }}" {% else %} aria-hidden="true" {% endif %}>
        {% endif %}
        {% if include.heading %}
            <h1 class="c-hero__heading">
                {{ include.heading }}
            </h1>
        {% endif %}
        {% if include.blog %}
            <span class="c-hero__blog-categories">
                {% for tag in include.categories %}
                {% assign url = include.tag_baseurl | append: tag | downcase | append: '/' %}
                    {% component tag content=tag style="default" link_url=url is_link=true %} <div class="c-hero__tag-divider">|</div>
                    {% endfor %}
            </span>
        
            {% if include.author %}
                <div class="c-hero__blog-author-container">
                    <img class="c-hero__blog-author-image" src="{{ site.baseurl }}{{ include.author_image_path }}"alt="{{ include.author_image_alt }}">
                    <div class="c-hero__blog-body-container">
                        <div class="c-hero__blog-inline-block">
                            <span class="c-hero__blog-author-name">
                                {{ include.author }}
                            </span>
                        </div>
                        {% if include.date %}
                        <div class="c-hero__blog-date-block">
                            {{ include.date | date_to_long_string }} | {{ include.time_to_read }}
                        </div>
                        {% endif %}
                    </div>
                </div>
            {% endif %}
        {% elsif include.author %}
            <div class="c-hero__author-supporting-text">
                {{ include.author_supporting_text }}
            </div>
            <div class="c-hero__author">
                {{ include.author }}{% if include.author_job %}, {{include.author_job}} {% endif %}
            </div>
        {% endif %}
        
        {% if include.text %}
            <p class="c-hero__text">
                {{ include.text }}
            </p>
        {% endif %}

        {% if include.links %}
            <div class="c-hero__link-container">
                {% for link in include.links %}

                    {% unless link.page_jump %}
                        {% assign show_icon=true %}
                    {% endunless %}

                    {% component link url=link.link_url content=link.link_content show_icon=show_icon open_in_new_tab=link.open_in_new_tab style=link.link_style %}
                    <div class=c-hero__link-divider-container>
                        {% unless link.link_style %}
                            <div class=c-hero__link-divider></div>
                        {% endunless %}
                    </div>
                {% endfor %}
            </div>
        {% endif %}
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/hidden-h1/hidden-h1.jekyll.html
  var hidden_h1_jekyll_exports = {};
  __export(hidden_h1_jekyll_exports, {
    default: () => hidden_h1_jekyll_default
  });
  var hidden_h1_jekyll_default = '<h1 class="c-hidden-h1 cc-helper-hidden">\n    {{ include.heading }}\n</h1>';

  // ../../../CC/cc-marketing/packages/component-library/components/image-container/image-container.jekyll.html
  var image_container_jekyll_exports = {};
  __export(image_container_jekyll_exports, {
    default: () => image_container_jekyll_default
  });
  var image_container_jekyll_default = '<div class="t-image-container t-image-container--col-{{include.col}}">\n    {% for image in include.images %}\n        {% component docs-image bind=image %}\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/image-tab/image-tab.jekyll.html
  var image_tab_jekyll_exports = {};
  __export(image_tab_jekyll_exports, {
    default: () => image_tab_jekyll_default
  });
  var image_tab_jekyll_default = '{% svelte image-tab bind=include %}\n<div class="c-image-tab">\n\n    <div class="c-image-tab__mobile">\n        {% for item in include.tab_items %}\n            <div class="c-image-tab__tab-item-container">\n                <div class="c-image-tab__content-container">\n\n                    {% case include.heading_type %}\n                    {% when "h3" %}\n                    <h3 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h3>\n                    {% when "h4" %}\n                    <h4 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h4>\n                    {% when "h5" %}\n                    <h5 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h5>\n                    {% endcase %}\n                    <div class="c-image-tab__content">\n                        {{ item.content_markdown | markdownify }}\n                    </div>\n                </div>\n                <div class="c-image-tab__image-container">\n                    <img class="c-image-tab__image" src="{{item.image_path}}" alt="{{item.image_alt}}">\n                </div>\n            </div>\n        {% endfor %}\n    </div>\n\n    <div class="c-image-tab__desktop">\n        <div class="c-image-tab__tab-item-container">\n            {% for item in include.tab_items %}\n                <div class="cc-helper-hidden">\n                    {% case include.heading_type %}\n                    {% when "h3" %}\n                    <h3 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h3>\n                    {% when "h4" %}\n                    <h4 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h4>\n                    {% when "h5" %}\n                    <h5 class="c-image-tab__heading">\n                        {{ item.heading }}\n                    </h5>\n                    {% endcase %}\n                </div>\n                <div class="c-image-tab__content-container">\n                    <span class=" cc-helper__h4">\n                        {{ item.heading }}\n                    </span>\n                    <span class="c-image-tab__content">\n                        {{ item.content_markdown | markdownify }}\n                    </span>\n                </div>\n            {% endfor %}\n        </div>\n        <div class="c-image-tab__image-container">\n        {% for image_item in include.tab_items %}\n            <img class="c-image-tab__image c-image-tab__image--jekyll" src="{{image_item.image_path}}" alt="{{image_item.image_alt}}">\n            {% endfor %}\n        </div>\n    </div>\n\n</div>\n{% endsvelte %}';

  // ../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/group/group.jekyll.html
  var group_jekyll_exports3 = {};
  __export(group_jekyll_exports3, {
    default: () => group_jekyll_default3
  });
  var group_jekyll_default3 = '<div class="c-image-text-stepper-group">\n    {% if include.heading_type == "h1" %}\n        <h1 class="c-image-text-stepper-group__header">\n            {{ include.heading }}\n        </h1>\n    {% elsif include.heading_type == "h2" %}\n        <h2 class="c-image-text-stepper-group__header">\n            {{ include.heading }}\n        </h2>\n    {% elsif include.heading_type == "h3" %}\n        <h3 class="c-image-text-stepper-group__header">\n            {{ include.heading }}\n        </h3>\n    {% endif %}\n\n    {% for item in include.items %}\n    <div class="c-image-text-stepper-group__stepper-item">\n        {% component image-text-stepper/item bind=item %}\n    </div>\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/item/item.jekyll.html
  var item_jekyll_exports = {};
  __export(item_jekyll_exports, {
    default: () => item_jekyll_default
  });
  var item_jekyll_default = '<div class="c-image-text-stepper-item">\n    <div class="c-image-text-stepper-item__content-container">\n\n        <div class="c-image-text-stepper-item__image-container">\n            <img class="c-image-text-stepper-item__image" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}">\n        </div>\n        <div class="c-image-text-stepper-item__text-container">\n\n            {% if include.heading_type == "h2" %}\n            <h2 class="cc-helper__h4">\n                {{ include.heading }}\n            </h2>\n            {% elsif include.heading_type == "h3" %}\n            <h3 class="cc-helper__h4">\n                {{ include.heading }}\n            </h3>\n            {% elsif include.heading_type == "h4" %}\n            <h4 class="cc-helper__h4">\n                {{ include.heading }}\n            </h4>\n            {% endif %}\n            <p>\n                {{ include.content_markdown | markdownify }}\n            </p>\n        </div>\n    </div>\n    {% if include.arrow_image_path %}\n        <div class="c-image-text-stepper-item__arrow">\n            <img class="c-image-text-stepper-item__arrow-image" src="{{ site.baseurl }}{{ include.arrow_image_path }}" aria-hidden=true>\n        </div>\n    {% endif %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/info-bar/info-bar.jekyll.html
  var info_bar_jekyll_exports = {};
  __export(info_bar_jekyll_exports, {
    default: () => info_bar_jekyll_default
  });
  var info_bar_jekyll_default = '<div class="c-info-bar">\n    <div class="c-info-bar__container">\n        {% for item in include.info_box %}\n            <div class="c-info-bar__content-container">\n                <div class="c-info-bar__title">\n                    {{ item.title }}\n                </div>\n                <div class="c-info-bar__content">\n                    {{ item.content }}\n                </div>\n            </div>\n        {% endfor %}\n    </div>\n    <span class="c-info-bar__link">\n        {% component link content=include.link_content url=include.link_url style="light" %}\n    </span>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/info-box/info-box.jekyll.html
  var info_box_jekyll_exports = {};
  __export(info_box_jekyll_exports, {
    default: () => info_box_jekyll_default
  });
  var info_box_jekyll_default = `<div class="{{ 'c-info-box' | addmods: note:include.note, important:include.important }}">
    <div class="c-info-box__heading-container">
        {% if include.important %}
            <img class="c-info-box__icon" src="{{ site.baseurl }}/assets/important.svg" aria-hidden="true">
            Important
        {% elsif include.note %}
            <img class="c-info-box__icon" src="{{ site.baseurl }}/assets/note.svg" aria-hidden="true">
            Note
        {% elsif include.code %}
            <img class="c-info-box__icon" src="{{ site.baseurl }}/assets/icons/comand-line.svg" aria-hidden="true">
            Note
        {% endif %}
    </div>
    <div>
        {{ include.content_markdown | markdownify }}
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/input/input.jekyll.html
  var input_jekyll_exports = {};
  __export(input_jekyll_exports, {
    default: () => input_jekyll_default
  });
  var input_jekyll_default = '{% svelte input bind=include %}\n    <div class="c-input">\n        {% if include.input_type != "submit" %}\n            <label class="c-input__label" for="{{ id }}">{{ include.label }}</label>\n            {% if include.input_type == "textarea" %}\n                <textarea id="{{ include.id }}" class="c-input__input c-input__input--text-area" name="{{ include.name }}" rows="6" placeholder="{{ include.placeholder }}" value="{{ include.default_value }}" {% if include.is_required %} required {% endif %}></textarea>\n            {% else %}\n                <input id="{{ include.id }}" class="c-input__input" name="{{ include.name }}" type="{{ include.input_type }}" placeholder="{{ include.placeholder }}" value="{{ include.default_value }}" {% if include.is_required %} required {% endif %}/>\n            {% endif %}\n\n        {% elsif include.input_type == "submit" %}\n            <input class="c-input__submit cc-helper__button {% if include.button_dark %} cc-helper__button--dark {% endif %} {% if include.button_light %} cc-helper__button--light {% endif %}" type="submit" value="{{ include.default_value }}"/>\n        {% endif %}\n    </div>\n{% endsvelte %}';

  // ../../../CC/cc-marketing/packages/component-library/components/job-advert-title/job-advert-title.jekyll.html
  var job_advert_title_jekyll_exports = {};
  __export(job_advert_title_jekyll_exports, {
    default: () => job_advert_title_jekyll_default
  });
  var job_advert_title_jekyll_default = '<div class="c-job-advert-title">\n    {% if include.heading_type == "h1" %}\n        <h1 class="c-job-advert-title__heading">\n            {{ include.title }}\n        </h1>\n    {% elsif include.heading_type == "h2" %}\n        <h2 class="cc-helper__h1 c-job-advert-title__heading">\n            {{ include.title }}\n        </h2>\n    {% endif %}\n    <div class="c-job-advert-title__info-box">\n       {% for item in include.icon_and_text %}\n       <span class="c-job-advert-title__info-box-item">\n            <img class="c-job-advert-title__icon" src="{{ site.baseurl }}{{ item.icon_path }}" alt="" aria-hidden="true">\n            <div class="c-job-advert-title__content">\n                {{ item.content }}\n            </div>\n       </span>\n\n        {% endfor %}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perk-block/job-perk-block.jekyll.html
  var job_perk_block_jekyll_exports = {};
  __export(job_perk_block_jekyll_exports, {
    default: () => job_perk_block_jekyll_default
  });
  var job_perk_block_jekyll_default = '<div class="c-job-perk-block">\n    <img class="c-job-perk-block__icon" src="{{ site.baseurl }}/assets/perks-icons/{{- include.icon -}}.svg" aria-hidden="true" />\n    {{ include.title }}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perks-container/job-perks-container.jekyll.html
  var job_perks_container_jekyll_exports = {};
  __export(job_perks_container_jekyll_exports, {
    default: () => job_perks_container_jekyll_default
  });
  var job_perks_container_jekyll_default = '<div class="c-job-perks-container">\n    {% if heading_type == h2 %}\n        <h2>\n            {{ include.heading }}\n        </h2>\n    {% elsif heading_type == h3 %}\n        <h3>\n            {{ include.heading }}\n        </h3>\n    {% elsif heading_type == h4 %}\n        <h4>\n            {{ include.heading }}\n        </h4>\n    {% endif %}\n        \n    <div class="c-job-perks-container__block">\n        {% for item in include.perks %}\n            <div class="c-job-perks-container__block-item">\n                {% component job-listing/job-perk-block bind=item %}\n            </div>\n        {% endfor %}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/table/table.jekyll.html
  var table_jekyll_exports = {};
  __export(table_jekyll_exports, {
    default: () => table_jekyll_default
  });
  var table_jekyll_default = `<div class="c-job-listing-table">

  {% if include.job_adverts.size > 0 %}
    <table class="c-job-listing-table__table">
      <caption class="c-job-listing-table__caption cc-helper__{{include.heading_type}}">{{ include.heading }}</caption>
      {% for advert in include.job_adverts %}
        <tr class="c-job-listing-table__tr">
          <td class="c-job-listing-table__title-td">
            <a class="c-job-listing-table__link" href="{{ advert.url }}">
              {{ advert.title }}
            </a>
          </td>
          <td class="c-job-listing-table__body-td">{{ advert.department }}</td>
          <td class="c-job-listing-table__body-td">{{ advert.status }}</td>
          <td class="c-job-listing-table__body-td">{{ advert.location}}</td>
        </tr>
      {% endfor %}
    </table>

  {% else %}
    {% case include.heading_type %}
    {% when "h2" %}
        <h2 class="c-job-listing-table__heading">
            {{ include.heading }}
        </h2>
    {% when "h3" %}
        <h3 class="c-job-listing-table__heading">
            {{ include.heading }}
        </h3>
    {% when "h4" %}
        <h4 class="c-job-listing-table__heading">
            {{ include.heading }}
        </h4>
    {% endcase %}
    <hr>
    <div class="c-job-listing-table__centered-text cc-helper__h4">
      We're not actively hiring at the moment
    </div>
    <div class="c-job-listing-table__centered-text c-job-listing-table__centered-text--supporting cc-helper__p">
      Check back in some other time
    </div>
    <hr>
  {% endif %}
</div>
`;

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-block/left-right-block.jekyll.html
  var left_right_block_jekyll_exports = {};
  __export(left_right_block_jekyll_exports, {
    default: () => left_right_block_jekyll_default
  });
  var left_right_block_jekyll_default = '{% assign align = include.alignment | default: next-alignment | default: "left" %}\n{% if align == "left" %}\n    {% assign next-alignment = "right" %}\n{% else %}\n    {% assign next-alignment = "left" %}\n{% endif %}\n\n<div class="c-left-right-block c-left-right-block--{{align}}">\n    <div class="c-left-right-block__content">\n        <div class="c-left-right-block__paragraph-content">\n            {% if include.tag_content %}\n            <div class="c-left-right-block__tag">\n                {% component tag content=include.tag_content disabled=include.tag_disabled url=include.tag_url is_link=true %}\n            </div>\n            {% endif %}\n            {% if include.heading_type == "h1" %}\n                <h1 class="c-left-right-block__heading">\n                    {{ include.heading }}\n                </h1>\n            {% elsif include.heading_type == "h2" %}\n                <h2 class="c-left-right-block__heading">\n                    {{ include.heading }}\n                </h2>\n            {% elsif include.heading_type == "h3" %}\n                <h3 class="c-left-right-block__heading">\n                    {{ include.heading }}\n                </h3>\n            {% endif %}\n            {% if include.info_and_description %}\n            <div class="c-left-right-block__info-and-description-container">\n                {% for item in include.info_and_description %}\n                <div class="c-left-right-block__info-and-description-title-container">\n                    <span class="c-left-right-block__info-and-description-title">\n                        {{ item.title }}\n                    </span>\n                    <span>\n                        {{ item.description }}\n                    </span>\n                </div>\n                {% endfor %}\n            </div>\n            {% endif %}\n            <div class="c-left-right-block__markdown-content">\n                {{ include.content_markdown | markdownify }}\n            </div>\n            {% if include.link_content and include.link_url %}\n                <div class="c-left-right-block__link">\n                    {% if include.hide_link_icon == true %}\n                        {% assign show_icon = false %}\n                    {% else %}\n                        {% assign show_icon = true %}\n                    {% endif %}\n                    {% component link url=include.link_url content=include.link_content show_icon=true open_in_new_tab=include.link_open_in_new_tab style=include.link_style show_icon=show_icon %}\n                </div>\n            {% endif %}\n        </div>\n\n    </div>\n    <img class="c-left-right-block__image" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}"/>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-list-block/left-right-list-block.jekyll.html
  var left_right_list_block_jekyll_exports = {};
  __export(left_right_list_block_jekyll_exports, {
    default: () => left_right_list_block_jekyll_default
  });
  var left_right_list_block_jekyll_default = '{% assign align = include.alignment | default: next-alignment | default: "left" %}\n{% if align == "left" %}\n    {% assign next-alignment = "right" %}\n{% else %}\n    {% assign next-alignment = "left" %}\n{% endif %}\n\n<div class="c-left-right-list-block c-left-right-list-block--{{align}}">\n    <div class="c-left-right-list-block__content">\n        <div class="c-left-right-list-block__paragraph-content">\n            {% if include.heading_type == "h2" %}\n                <h2 class="c-left-right-list-block__heading">\n                    {{ include.heading }}\n                </h2>\n            {% elsif include.heading_type == "h3" %}\n                <h3 class="c-left-right-list-block__heading">\n                    {{ include.heading }}\n                </h3>\n            {% endif %}\n            <div class="c-left-right-list-block__markdown-content">\n                {{ include.content_markdown | markdownify }}\n            </div>\n            <ul class="c-left-right-list-block__list">\n                {% for item in include.list_items %}\n                    <li class="c-left-right-list-block__list-item">\n                        <img class="c-left-right-list-block__list-icon" src="{{baseurl}}{{item.icon_path}}" alt="{{item.alt}}">\n                        {{ item.content_markdown | markdownify }}\n                    </li>\n                {% endfor %}\n                </ul>\n            {% if include.link_content and include.link_url %}\n                <div class="c-left-right-list-block__link">\n                    {% component link url=include.link_url content=include.link_content show_icon=true open_in_new_tab=include.link_open_in_new_tab %}\n                </div>\n            {% endif %}\n        </div>\n\n    </div>\n    {% if include.lottie_animation %}\n    <div style="width: 100%;">\n        {% component lottie-animation bind=include.animation %}\n    </div>\n    {% else %}\n        <img class="c-left-right-list-block__image" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}"/>\n    {% endif %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-quote/left-right-quote.jekyll.html
  var left_right_quote_jekyll_exports = {};
  __export(left_right_quote_jekyll_exports, {
    default: () => left_right_quote_jekyll_default
  });
  var left_right_quote_jekyll_default = '{% assign align = include.alignment | default: next-alignment | default: "left" %}\n{% if align == "left" %}\n    {% assign next-alignment = "right" %}\n{% else %}\n    {% assign next-alignment = "left" %}\n{% endif %}\n\n<div class="c-left-right-quote c-left-right-quote--{{align}}">\n    <div class="c-left-right-quote__content">\n        <div class="c-left-right-quote__paragraph-content">\n            {% if include.heading_type == "h1" %}\n                <h1 class="cc-helper__h2 c-left-right-quote__heading">\n                    {{ include.heading }}\n                </h1>\n            {% elsif include.heading_type == "h2" %}\n                <h2 class="c-left-right-quote__heading">\n                    {{ include.heading }}\n                </h2>\n            {% elsif include.heading_type == "h3" %}\n                <h3 class="c-left-right-quote__heading">\n                    {{ include.heading }}\n                </h3>\n            {% endif %}\n            {{ include.content_markdown | markdownify }}\n        </div>\n    </div>\n    <div class="c-left-right-quote__quote cc-helper__h4">\n        "{{ include.quote }}"\n        <img class="c-left-right-quote__quote-svg" src="/assets/icons/bottom-line-quote.svg" aria-hidden="true">\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/lesson-card/lesson-card.jekyll.html
  var lesson_card_jekyll_exports = {};
  __export(lesson_card_jekyll_exports, {
    default: () => lesson_card_jekyll_default
  });
  var lesson_card_jekyll_default = '<div class="c-lesson-card">\n\n    <div class="c-lesson-card__image-container">\n        <div role="img" alt="{{include.image_alt}}" class="c-lesson-card__image" style="background: url({{site.baseurl}}{{include.image_path}}); background-size: cover;     background-position: center;"></div>\n    </div>\n    <div class="c-lesson-card__text-container">\n        <div class="c-lesson-card__tag-container">\n            {% assign url = site.baseurl | append: include.tag_url %}\n            {% component tag content=include.tag_content disabled=include.tag_disabled style="default" is_link=true link_url=url %}\n        </div>\n        \n        <div class="cc-helper__h4">\n            {{ include.heading }}\n        </div>\n        <p>\n            {{ include.content }}\n        </p>\n        {% component link content=include.link_content url=include.link_url show_icon=true %}\n    </div>\n</span>\n';

  // ../../../CC/cc-marketing/packages/component-library/components/lesson-stepper/lesson-stepper.jekyll.html
  var lesson_stepper_jekyll_exports = {};
  __export(lesson_stepper_jekyll_exports, {
    default: () => lesson_stepper_jekyll_default
  });
  var lesson_stepper_jekyll_default = `{% assign url = site.baseurl %}
{% svelte lesson-stepper bind=include baseurl=url %}
    <div class="c-lesson-stepper">
        <div class="c-lesson-stepper__left">
            <div class="c-lesson-stepper__tick" style="height: 30px; width: 30px; -webkit-mask-image: url('{{ site.baseurl }}/assets/icons/tick.svg'); mask-image: url('{{ site.baseurl }}/assets/icons/tick.svg');"></div>
            <div class="c-lesson-stepper__circle"></div>
            <h2 class="c-lesson-stepper__heading">
                {% case include.heading_type %}
                {% when "h2" %}
                    <h2 class="c-lesson-stepper__heading">
                        {{ include.heading }}
                    </h2>
                {% when "h3" %}
                    <h3 class="c-lesson-stepper__heading">
                        {{ include.heading }}
                    </h3>
                {% endcase %}
            </h2>
            {% component link show_icon=true content=include.link_content url=include.link_url %}
        </div>
        <div class="c-lesson-stepper__description">
            {{ include.description_markdown | markdownify }}
        </div>
    </div>
{% endsvelte %}`;

  // ../../../CC/cc-marketing/packages/component-library/components/link-with-image/card/card.jekyll.html
  var card_jekyll_exports3 = {};
  __export(card_jekyll_exports3, {
    default: () => card_jekyll_default3
  });
  var card_jekyll_default3 = '<div class="c-link-with-image-card--{{include.alignment}} c-link-with-image-card">\n    {% unless include.inline_image %}\n        {% if include.image_path %}\n            <img class="c-link-with-image-card__image {% if include.image_as_icon %} c-link-with-image-card__image--as_icon {% endif %}" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}">\n        {% endif %}\n    {% endunless %}\n    <div class="{% if include.link_as_heading %} c-link-with-image-card__link-as-heading {% endif %}">\n        {% if include.tags %}\n        <div class="c-link-with-image-card__tag-container">\n            {% for tag in include.tags %}\n            <div class="c-link-with-image-card__tag">\n                {% component tag content=tag.tag_content is_link=true link_url=tag.link_url disabled=tag.tag_disabled %}\n            </div>\n            <div class="c-link-with-image-card__tag-divider">|</div>\n            {% endfor %}\n        </div>\n        {% endif %}\n        <div class="c-link-with-image-card__heading-container">\n            {% if include.inline_image %}\n            <img class="c-link-with-image-card__image c-link-with-image-card__image--inline c-link-with-image-card__image--{{include.inline_image_size}}" src="{{ site.baseurl }}{{ include.image_path }}" alt="{{ include.image_alt }}">\n            {% endif %}\n            <div class="cc-helper__{{include.heading_type}} c-link-with-image-card__heading">{{ include.heading }}</div>\n        </div>\n        <p class="c-link-with-image-card__p">\n            {{ include.content }}\n        </p>\n        <div class="{% if include.link_style %} c-link-with-image-card__icon-button-container {% endif %} {% if include.link_as_heading %} c-link-with-image-card__link-as-heading-{{include.heading_type}} {% endif %}">\n            {% component link show_icon=include.show_link_icon content=include.link_content url=include.link_url style=include.link_style %}\n        </div>\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/link-with-image/group/group.jekyll.html
  var group_jekyll_exports4 = {};
  __export(group_jekyll_exports4, {
    default: () => group_jekyll_default4
  });
  var group_jekyll_default4 = '<div class="c-link-with-image-group">\n    {% assign column = include.column | plus: 0 %}\n    {% case include.heading_type %}\n    {% when "h2" %}\n        <h2>\n            {{ include.heading }}\n        </h2>\n    {% when "h3" %}\n        <h3>\n            {{ include.heading }}\n        </h3>\n    {% when "h4" %}\n        <h4>\n            {{ include.heading }}\n        </h4>\n    {% endcase %}\n\n    <div class="c-link-with-image-group__card-group c-link-with-image-group__card-group--{{column}}">\n        {% for card in include.cards %}\n            <div class="c-link-with-image-group__card">\n                {% component link-with-image/card bind=card %}\n            </div>\n        {% endfor %}\n    </div>\n        \n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/link/link.jekyll.html
  var link_jekyll_exports = {};
  __export(link_jekyll_exports, {
    default: () => link_jekyll_default
  });
  var link_jekyll_default = `{% svelte link bind=include %}
    <a class="c-link {% if include.style %} cc-helper__button cc-helper__button--{{include.style}} {% endif %}"
    href="{{ include.url }}"
    {% if include.open_in_new_tab %}
    rel="noopener" target="_blank"
    {% endif %}>
        {{ include.content }}
        {% if include.show_icon %}
            <span class="c-link__link-svg cc-button__icon"
                aria-hidden="true"
                style="-webkit-mask-image: url('{{ site.baseurl }}/assets/chevron_right-18px.svg'); mask-image: url('{{ site.baseurl }}/assets/chevron_right-18px.svg');"></span>
        {% endif %}
    </a>
{% endsvelte %}`;

  // ../../../CC/cc-marketing/packages/component-library/components/list/list.jekyll.html
  var list_jekyll_exports = {};
  __export(list_jekyll_exports, {
    default: () => list_jekyll_default
  });
  var list_jekyll_default = `<div class="c-list c-list--col-{{include.lists_col}}">
    {% if include.include_id %}
        {% assign heading_id = include.heading | slugify %}
    {% endif %}

    {% for item in include.lists %}
    <div>
        {% if item.heading %}
            {% case include.heading_type %}
            {% when "h2" %}
                <h2>
                    {{ item.heading }}
                </h2>
            {% when "h3" %}
                <h3 >
                    {{ item.heading }}
                </h3>
            {% when "h4" %}
                <h4>
                    {{ item.heading }}
                </h4>
            {% endcase %}
        {% endif %}
        <ul class="c-list__li-container c-list__li-container--col-{{include.list_item_col}}">
            {% for list in item.list_group %}
                <li class="c-list__li">
                    {% if item.global_icon_path %}
                        <div class="c-list__icon c-list__icon--{{include.icon_size}}" style="-webkit-mask-image: url('{{site.baseurl}}{{item.global_icon_path}}'); mask-image: url('{{site.baseurl}}{{item.global_icon_path}}'); background-color: {{item.icon_color}};"></div>
                    {% else %}
                        <img class="c-list__image" src="{{site.baseurl}}{{list.individual_list_image_path}}" aria-hidden="true">
                    {% endif %}

                    {{ list.text_markdown | markdownify }}
                </li>
            {% endfor %}
        </ul>
    </div>
    {% endfor %}
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/logo-ticker/logo-ticker.jekyll.html
  var logo_ticker_jekyll_exports = {};
  __export(logo_ticker_jekyll_exports, {
    default: () => logo_ticker_jekyll_default
  });
  var logo_ticker_jekyll_default = `<div class="{{'c-logo-ticker' | addmods: flex:include.flex, is_grey_background:include.is_grey_background }}">
    <div class="c-logo-ticker__heading">
        {{ include.heading }}
    </div>
    <div class="c-logo-ticker__container">
        {% for logo in include.logos %}
            {% if logo.is_link %}
                <div class="c-logo-ticker__single-logo-container">
                    <a href="{{logo.link_url}}">
                        <span class="cc-helper-hidden">
                            {{logo.link_content}}
                        </span>
                        <div class="c-logo-ticker__image-top-link" style="-webkit-mask-image: url('{{ site.baseurl }}{{logo.logo_path}}'); mask-image: url('{{ site.baseurl }}{{logo.logo_path}}');"></div>
                        <div class="c-logo-ticker__image c-logo-ticker__image--link" style="background-image: url('{{ site.baseurl }}{{logo.logo_path}}');"></div>
                    </a>
                    {% if logo.content %}
                        <div class="c-logo-ticker__content">
                            {{ logo.content }}
                        </div>
                    {% endif %}
                </div>
            {% else %}
                <div class="c-logo-ticker__single-logo-container">
                    <div class="c-logo-ticker__image-top" style="-webkit-mask-image: url('{{site.baseurl}}{{logo.logo_path}}'); mask-image: url('{{site.baseurl}}{{logo.logo_path}}');"></div>
                    {% if logo.content %}
                        <div class="c-logo-ticker__content">
                            {{ logo.content }}
                        </div>
                    {% endif %}
                </div>
            {% endif %}
        {% endfor %}
    </div>
</div>
`;

  // ../../../CC/cc-marketing/packages/component-library/components/lottie-animation/lottie-animation.jekyll.html
  var lottie_animation_jekyll_exports = {};
  __export(lottie_animation_jekyll_exports, {
    default: () => lottie_animation_jekyll_default
  });
  var lottie_animation_jekyll_default = '{% svelte lottie-animation baseurl=site.baseurl bind=include %}\n    <div class="c-lottie-animation">\n        {% if include.static_image_path %}\n            <img class="c-lottie-animation__static-image" src="{{site.baseurl}}{{include.static_image_path}}" alt="{{include.static_image_alt}}">\n        {% endif %}\n    </div>\n{% endsvelte %}';

  // ../../../CC/cc-marketing/packages/component-library/components/mailing-list-cta/mailing-list-cta.jekyll.html
  var mailing_list_cta_jekyll_exports = {};
  __export(mailing_list_cta_jekyll_exports, {
    default: () => mailing_list_cta_jekyll_default
  });
  var mailing_list_cta_jekyll_default = '<div id="mc_embed_signup" class="c-mailing-list-cta">\n\n    \n    <div class="c-mailing-list-cta__cta-container">\n        <div class="c-mailing-list-cta__heading cc-helper__h3">\n            {{ include.heading }}\n        </div>\n        <div class="c-mailing-list-cta__description">\n            {{ include.description }}\n        </div>\n        <form action="{{include.form_action}}" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate c-mailing-list-cta__form" target="_blank" novalidate>\n\n            <div class="c-mailing-list-cta__input">\n                {% component input label=include.email_label placeholder=include.email_placeholder input_type="email" id="mce-EMAIL" name="EMAIL" %}\n            </div>\n            <div id="mce-responses" class="clear">\n                <div class="response" id="mce-error-response" style="display:none"></div>\n                <div class="response" id="mce-success-response" style="display:none"></div>\n            </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups -->\n            <div style="position: absolute; left: -5000px;" aria-hidden="true">\n                <input type="text" name="{{include.input_validation_name}}" tabindex="-1" value="">\n            </div>\n            <div class="c-mailing-list-cta__button-container">\n                {% component input default_value=include.button_default_value input_type="submit" name="subscribe" label=include.button_label button_light=true submit=true %}\n            </div>\n        </form>\n    </div>\n\n    <div class="c-mailing-list-cta__image-container">\n        <img class="c-mailing-list-cta__image" src="{{site.baseurl}}{{include.image_path}}" alt="{{include.image_alt}}">\n    </div>\n\n</div>\n';

  // ../../../CC/cc-marketing/packages/component-library/components/mark-as-completed/mark-as-completed.jekyll.html
  var mark_as_completed_jekyll_exports = {};
  __export(mark_as_completed_jekyll_exports, {
    default: () => mark_as_completed_jekyll_default
  });
  var mark_as_completed_jekyll_default = '{% svelte mark-as-completed bind=include %}\n<div class="mark-as-completed">\n\n</div>\n{% endsvelte %}';

  // ../../../CC/cc-marketing/packages/component-library/components/notice/notice.jekyll.html
  var notice_jekyll_exports = {};
  __export(notice_jekyll_exports, {
    default: () => notice_jekyll_default
  });
  var notice_jekyll_default = '<div class="c-notice c-notice--{{include.info_type}}">\n    <div class="c-notice__heading-container">\n        {% if include.info_type == "important" %}\n            <img src="{{ site.baseurl }}/assets/important.svg" aria-hidden="true">\n            Important\n        {% elsif include.info_type == "note" %}\n            <img src="{{ site.baseurl }}/assets/note.svg" aria-hidden="true">\n            Note\n        {% elsif include.info_type == "info" %}\n            <img src="{{ site.baseurl }}/assets/info.svg" aria-hidden="true">\n        {% elsif include.info_type == "code" %}\n            <img src="/assets/icons/comand-line.svg" aria-hidden="true">\n            Code\n        {% endif %}\n    </div>\n    <div>\n        {{ include.content_markdown | markdownify }}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-block/prev-next-block.jekyll.html
  var prev_next_block_jekyll_exports = {};
  __export(prev_next_block_jekyll_exports, {
    default: () => prev_next_block_jekyll_default
  });
  var prev_next_block_jekyll_default = '<div class="c-prev-next-block">\n	<div class="c-prev-next-block__item c-prev-next-block__item--previous">\n		{% if include.previous %}\n			<div class="c-prev-next-block__heading c-prev-next-block__heading--previous">\n				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n					<path d="M22 10.875L6.7875 10.875L13.775 4.58625L12 3L2 12L12 21L13.7625 19.4137L6.7875 13.125L22 13.125L22 10.875Z"/>\n					</svg>\n				Previous\n			</div>\n			{% component prev-next/prev-next-button bind=include.previous %}\n		{% endif %}\n	</div>\n	<div class="c-prev-next-block__item c-prev-next-block__item--next">\n		{% if include.next %}\n			<div class="c-prev-next-block__heading c-prev-next-block__heading--next">\n				Next\n				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n					<path d="M2 13.125L17.2125 13.125L10.225 19.4137L12 21L22 12L12 3L10.2375 4.58625L17.2125 10.875L2 10.875L2 13.125Z"/>\n				</svg>\n			</div>\n			{% component prev-next/prev-next-button bind=include.next %}\n		{% endif %}\n	</div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-button/prev-next-button.jekyll.html
  var prev_next_button_jekyll_exports = {};
  __export(prev_next_button_jekyll_exports, {
    default: () => prev_next_button_jekyll_default
  });
  var prev_next_button_jekyll_default = '<a class="c-prev-next-button" href="{{ include.url }}">\n	<div class="c-prev-next-button__body">\n		{{ include.title }}\n	</div>\n	<div class="c-prev-next-button__header">\n		{% if include.icon %}\n			<img class="c-prev-next-button__icon" src="{{ include.icon }}" aria-hidden="true" alt="logo">\n		{% endif %}\n		<div class="c-prev-next-button__category">\n			{{ include.category_text }}\n		</div>\n	</div>\n</a>';

  // ../../../CC/cc-marketing/packages/component-library/components/pricing-table/pricing-table.jekyll.html
  var pricing_table_jekyll_exports = {};
  __export(pricing_table_jekyll_exports, {
    default: () => pricing_table_jekyll_default
  });
  var pricing_table_jekyll_default = `    
{% assign table_data = site.data.pricing_table %}

<div class="c-pricing-table">
    {% component heading-and-text bind=include.heading %}
    <table class="c-pricing-table__table">
        <caption class="cc-helper-hidden">{{ table_data.caption }}</caption>
        <thead class="c-pricing-table__table--cta">
            <tr class="c-pricing-table__tr">
                <th class="c-pricing-table__th c-pricing-table__th--left-heading" scope="col">
                    <div class=" cc-helper__h4">
                        {{ table_data.heading}}
                    </div>
                </th>
                {% for header in table_data.table_headings %}
                    <th class="c-pricing-table__heading__flex c-pricing-table__heading c-pricing-table__th" scope="col">
                        <div class="c-pricing-table__cta-heading cc-helper__h4">
                            {{ header.title }}
                        </div>
                        <div class="c-pricing-table__cta-cash cc-helper__h3"> 
                            {{ header.price_monthly }}
                        </div>
                        <div class="c-pricing-table__cta-button">
                            {% component link url=header.link_url content=header.link_content style="button" %}
                        </div>
                    </th>
                {% endfor %}
            </tr>
        </thead>


        <tbody>
            {% for row in table_data.table_rows %}
                <tr class="c-pricing-table__tr">
                    {% for item in row %}
                        {% if item.heading %}
                            <th class="c-pricing-table__th c-pricing-table__th--left-heading" scope="row">
                                <div class="c-pricing-table__th-content">
                                    <div>
                                        {{ item.heading.title }}
                                    </div>
                                    <div class="c-pricing-table__row-tooltip">
                                        {{ item.heading.tooltip }}
                                    </div>
                                </div>
                            </th>
                        {% elsif item.body %}

                            {% for cells in item.body %}
                                {% if cells == true %}
                                <td class="c-pricing-table__td">
                                    <div class="c-pricing-table__tick" style="-webkit-mask-image: url('{{ site.baseurl }}/assets/pricing/check.svg'); mask-image: url('{{ site.baseurl }}/assets/pricing/check.svg');"></div>
                                    <p class="cc-helper-hidden">Included</p>
                                </td>
                                {% elsif cells == false %}
                                <td class="c-pricing-table__td">
                                    <div class="c-pricing-table__cross" style="-webkit-mask-image: url('{{ site.baseurl }}/assets/pricing/remove.svg'); mask-image: url('{{ site.baseurl }}/assets/pricing/remove.svg');"></div>
                                    <p class="cc-helper-hidden">Not table_datad</p>
                                </td>
                                {% else %}
                                <td class="cc-helper__p c-pricing-table__td">{{ cells }}</td>
                                {% endif %}
                            {% endfor %}
                        {% endif %}
                    {% endfor %}
                </tr>
            {% endfor %}
        </tbody>
    </table>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/pricing/block/block.jekyll.html
  var block_jekyll_exports = {};
  __export(block_jekyll_exports, {
    default: () => block_jekyll_default
  });
  var block_jekyll_default = '<div class="c-pricing-block {% if include.heading_and_text %} c-pricing-block--heading-and-text {% endif %}">\n    {% if include.image_path %}\n        <div class="c-pricing-block__image-container">\n            <img class="c-pricing-block__image" src="{{site.baseurl}}{{include.image_path}}" alt="{{include.image_alt}}"/>\n        </div>\n    {% endif %}\n    <div class="c-pricing-block__card">\n        <span class="c-pricing-block__heading {% if include.heading_and_text %} cc-helper__h3 {% endif %}">\n            {{include.heading}}\n        </span>\n        <div class="c-pricing-block__pricing-block-container">\n            {% if include.price_before_text %}\n                <div class="c-pricing-block__before-pricing-text">\n                    {{ include.price_before_text }}\n                </div>\n            {% endif %}\n            <div class="c-pricing-block__pricing-main-container">\n                <div class="c-pricing-block__price">\n                    {{ include.price_monthly }}\n                </div>\n                <div class="c-pricing-block__after-pricing-text">\n                    {{ include.price_secondary_text_markdown | markdownify }}\n                </div>\n            </div>\n        </div>\n        <div class="c-pricing-block__description">\n            {{ include.description_markdown | mardownify }}\n        </div>\n        {% if include.list %}\n            <div class="c-pricing-block__list-and-button-container">\n                <div class="c-pricing-block__list-container">\n                    {{ include.list_name }}\n                    <ul class="c-pricing-block__ul">\n                        {% for item in include.list %}\n                        <li class="c-pricing-block__li">\n                            <img class="c-pricing-block__li-image" src="{{site.baseurl}}{{item.icon_url}}" alt="{{item.icon_alt}}">\n                            {{ item.list_item }}\n                        </li>\n                        {% endfor %}\n                    </ul>\n                </div>\n                <div class="c-pricing-block__link">\n                    {% component link content=include.link_content url=include.link_url open_in_new_tab=false show_icon=false style=include.link_style %}\n                </div>\n            </div>\n        {% endif %}\n        {% if include.heading_and_text %}\n            {{ include.content_markdown | markdownify }}\n            {% component link content=include.link_content url=include.link_url open_in_new_tab=false show_icon=false style=include.link_style show_icon=include.show_link_icon %}\n        {% endif %}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/pricing/group/group.jekyll.html
  var group_jekyll_exports5 = {};
  __export(group_jekyll_exports5, {
    default: () => group_jekyll_default5
  });
  var group_jekyll_default5 = '<div class="c-pricing-group c-pricing-group--column-{{include.column}}">\n    {% for card in include.pricing_block %}\n    <div class="c-pricing-group__card">\n        {% component pricing/block bind=card %}\n    </div>\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/read-more/card/card.jekyll.html
  var card_jekyll_exports4 = {};
  __export(card_jekyll_exports4, {
    default: () => card_jekyll_default4
  });
  var card_jekyll_default4 = `<a href="{{ site.baseurl }}{{ include.link_url }}" {% if link_open_in_new_tab %} target="_blank" rel="noopener" {% endif %} class="c-read-more-card__link">
    <div class="c-read-more-card">

        <div class="c-read-more-card__image-container" style="background-image: url('{{ site.baseurl }}{{ include.image_path }}');" ></div>
        <div class="c-read-more-card__body-container">
            
            {% if include.title_image_path %}
                <img class="c-read-more-card__logo-image" src="{{ site.baseurl }}{{ include.title_image_path }}" alt="{{ include.title_image_alt }}">
                {% endif %}
                {% if include.tags %}
                    <div class="c-read-more-card__tag-group">
                        {% for tag in include.tags %}
                            <div class="c-read-more-card__tag">
                                {% component tag disabled=true content=tag is_link=false %}
                            </div>
                            <div class="c-read-more-card__tag-divider">|</div>
                        {% endfor %}
                    </div>
                {% endif %}
                <div class="c-read-more-card__title cc-helper__h5">
                    {{ include.title }}
                </div>
                {% if include.content %}
                <p class="c-read-more-card__p">
                    {{ include.content }}
                </p>
            {% endif %}
        </div>
    </div>
</a>`;

  // ../../../CC/cc-marketing/packages/component-library/components/read-more/group/group.jekyll.html
  var group_jekyll_exports6 = {};
  __export(group_jekyll_exports6, {
    default: () => group_jekyll_default6
  });
  var group_jekyll_default6 = '<div class="c-read-more-group">\n    {% unless include.title_as_card %}\n        {% if include.heading_type == "h1" %}\n            <h1 class="cc-helper__h2">\n                {{ include.title }}\n            </h1>\n        {% elsif include.heading_type == "h2" %}\n            <h2>\n                {{ include.title }}\n            </h2>\n        {% elsif include.heading_type == "h3" %}\n            <h3>\n                {{ include.title }}\n            </h3>\n        {% endif %}\n    {% endunless %}\n\n    {% if include.category_filter %}\n    {% assign collection_group = site[include.site_collection] | where: "categories", include.category_filter %}\n\n    <div class="c-read-more-group__component-group">\n        {% if include.title_as_card %}\n            <div>\n                {% if include.heading_type == "h1" %}\n                    <h1 class="cc-helper__h2">\n                        {{ include.title }}\n                    </h1>\n                {% elsif include.heading_type == "h2" %}\n                    <h2>\n                        {{ include.title }}\n                    </h2>\n                {% elsif include.heading_type == "h3" %}\n                    <h3>\n                        {{ include.title }}\n                    </h3>\n                {% endif %}\n                {% if include.content_markdown %}\n                    {{ include.content_markdown | markdownify }}\n                {% endif %}\n                {% if include.link_content %}\n                <div class="c-read-more-group__link">\n                    {% component link content=include.link_content url=include.link_url show_icon=include.show_link_icon %}\n                </div>\n                {% endif %}\n            </div>\n        {% endif %}\n        {% for card in collection_group limit: 2 %}\n            <div class="c-read-more-group__card">\n                {% component read-more/card title=card.title tags=card.categories image_path=card.image image_alt=card.image_alt link_url=card.url %}\n            </div>\n            {% endfor %}\n        </div>\n    {% else %}\n        <div class="c-read-more-group__component-group">\n            {% for card in include.read_more_card limit: 3 %}\n                <div class="c-read-more-group__card">\n                    {% component read-more/card bind=card %}\n                </div>\n            {% endfor %}\n        </div>\n    {% endif %}\n</div>\n';

  // ../../../CC/cc-marketing/packages/component-library/components/search-result/search-result.jekyll.html
  var search_result_jekyll_exports = {};
  __export(search_result_jekyll_exports, {
    default: () => search_result_jekyll_default
  });
  var search_result_jekyll_default = `<div class="{{ c-search-result | addmods:  | addstates: }}">

    <div class="c-search-result__image-box" aria-hidden="true">
        <a href="{{ include.url }}#keyword:{{ include.highlight }}" tabindex="-1">
            <img class="c-search-result__image" src="{{include.image}}" alt="{{include.title}}">
        </a>
    </div>

    <div class="c-search-result__content">
        {% component tag content=include.bucket style="label" %}

        <h3 class="c-search-result__title cc-helper__h4">
            <a href="{{ include.url }}#keyword:{{ include.highlight }}">{{include.title}}</a>
        </h3>
    
        <div class="c-search-result__breadcrumb">
            {% if include.date %}{{ include.date | date: "%b %d, %Y" }}&nbsp;&nbsp;\u2022&nbsp;&nbsp;{% endif %}{{include.breadcrumb}}
        </div>
    
    {% if include.excerpt and include.excerpt != '' %}
        <p class="c-search-result__excerpt">
            {{include.excerpt}}
        </p>
    {% else if include.tags %}
        <div class="c-search-result__tag-box">
            <svg class="c-search-result__tag-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="#707070" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span class="c-search-result__tag-keyword">Tags:</span>
            <ul class="c-search-result__tags">
            {% for tag in include.tags %}
                <li class="c-search-result__tag">
                    {% component tag content=tag style="small" %}
                </li>
            {% endfor %}
            </ul>
        </div>
    {% else if include.keywords %}
        <div class="c-search-result__tag-box">
            <svg class="c-search-result__tag-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="#707070" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span class="c-search-result__tag-keyword">Keywords:</span>
            <ul class="c-search-result__tags">
            {% for tag in include.keywords %}
                <li class="c-search-result__tag">
                    {% component tag content=tag style="keyword" %}
                </li>
            {% endfor %}
            </ul>
        </div>
    {% endif %}
    </div>

</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/search/search.jekyll.html
  var search_jekyll_exports = {};
  __export(search_jekyll_exports, {
    default: () => search_jekyll_default
  });
  var search_jekyll_default = '{% svelte search bind=include %}\n<div class="c-search">\n\n    <div class="c-search__input-region">\n		<input \n			type="text" \n			class="c-search__input"\n			name="Search CloudCannon"\n            autocomplete="off"\n			placeholder="{{include.placeholder}}" >\n    </div>\n\n    <div class="c-search__tabs">\n    {% for bucket in include.search_buckets %}\n        <button class="c-search__tab">{{bucket.label}}</button>\n    {% endfor %}\n    </div>\n\n    <div class="c-search__results">\n		<div class="c-search__empty is-searching">\n            <div class="c-search__search-dot"></div>\n            <div class="c-search__search-dot"></div>\n            <div class="c-search__search-dot"></div>\n		</div>\n    </div>\n\n</div>\n{% endsvelte %}\n\n<div class="c-search__preload">\n    <img src="{{include.no_results_copy.image_path}}" alt="{{include.no_results_copy.heading}}">\n    <img src="{{include.landing_copy.image_path}}" alt="{{include.landing_copy.heading}}">\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/show-all-header/show-all-header.jekyll.html
  var show_all_header_jekyll_exports = {};
  __export(show_all_header_jekyll_exports, {
    default: () => show_all_header_jekyll_default
  });
  var show_all_header_jekyll_default = '<div class="c-show-all-header">\n    {% case include.heading_type %}\n    {% when "h2" %}\n        <h2 class="c-show-all-header__heading">\n            {{ include.heading }}\n        </h2>\n    {% when "h3" %}\n        <h3 class="c-show-all-header__heading">\n            {{ include.heading }}\n        </h3>\n    {% endcase %}\n\n    <a class="c-show-all-header__link" href="{{ include.link_url }}">\n        {{ include.link_content }}\n    </a>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/social-block/social-block.jekyll.html
  var social_block_jekyll_exports = {};
  __export(social_block_jekyll_exports, {
    default: () => social_block_jekyll_default
  });
  var social_block_jekyll_default = `{% assign cloudcannon_url = "" %}
<div class="{{'c-social-block' | addmods: full_width:include.full_width }}">
  <div class="c-social-block__container">
    <span class="c-social-block__text">
      {{ include.text }}
    </span>
    <div class="c-social-block__social-icons">
      {% if site.url and page.url %}
        {% assign cloudcannon_url = site.url | append: site.baseurl  | append: page.url %}
      {% endif %}
      {% for item in include.social_sharing %}
        {% if item == "facebook" %}
        {% assign share_url = "https://www.facebook.com/sharer.php?u=" | append: cloudcannon_url %}
        {% elsif item == "linkedin" %}
        {% assign share_url = "http://www.linkedin.com/shareArticle?mini=true&url=" | append: cloudcannon_url %}
        {% elsif item == "twitter" %}
        {% assign share_url = "https://twitter.com/share?url=" | append: cloudcannon_url %}
        {% elsif item == "email" %}
        {% assign share_url = "mailto:?subject=Have a look at this page I found on CloudCannon&amp;body=You might be interested in this: " | append: cloudcannon_url %}
        {% endif %}
        <a href="{{ share_url }}" target="_blank" rel="noopener">
          <div class="cc-helper-hidden">
            Share via {{ item }}
          </div>
          <div class="c-social-block__social-icons-item c-social-block__svg--{{- item -}}" aria-hidden="true" style="-webkit-mask-image: url('{{ site.baseurl }}/assets/{{- item -}}-icon.svg'); mask-image: url('{{ site.baseurl }}/assets/{{- item -}}-icon.svg');"></div>
        </a>
      {% endfor %}
    </div>
    
    {% if include.link_content %}
      <div class="c-social-block__link">
        {% component link url=include.link_url content=include.link_content button=true open_in_new_tab=include.open_in_new_tab style="dark" %}
      </div>
    {% endif %}
    
  </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/spacing/spacing.jekyll.html
  var spacing_jekyll_exports = {};
  __export(spacing_jekyll_exports, {
    default: () => spacing_jekyll_default
  });
  var spacing_jekyll_default = '{% assign mobile = include.mobile_unit_number | times: 8 %}\n{% assign tablet = include.tablet_unit_number | times: 8 %}\n{% assign laptop = include.laptop_unit_number | times: 8 %}\n\n<div class="c-spacing c-spacing__mobile" style="margin-bottom: {{mobile}}px;"></div>\n<div class="c-spacing c-spacing__tablet" style="margin-bottom: {{tablet}}px;"></div>\n<div class="c-spacing c-spacing__laptop" style="margin-bottom: {{laptop}}px;"></div>';

  // ../../../CC/cc-marketing/packages/component-library/components/stats-blocks/stats-blocks.jekyll.html
  var stats_blocks_jekyll_exports = {};
  __export(stats_blocks_jekyll_exports, {
    default: () => stats_blocks_jekyll_default
  });
  var stats_blocks_jekyll_default = '{% assign column = include.column | plus: 0 %}\n<div class="c-stats-blocks c-stats-blocks--{{include.column}}">\n\n    {% for stat in include.stats %}\n        <div class="c-stats-blocks__container">\n            <div class="c-stats-blocks__item">\n                {% if stat.title %}\n                <div class="c-stats-blocks__title cc-helper__h1">\n                    {{ stat.title }}\n                </div>\n                {% elsif stat.image_path %}\n                <div class="c-stats-blocks__image">\n                    <img src="{{site.baseurl}}{{stat.image_path}}" alt="{{stat.image_alt}}">\n                </div>\n                {% endif %}\n                <div class="c-stats-blocks__description">\n                    {{ stat.description }}\n                </div>\n            </div>\n        </div>\n    {% endfor %}\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/table/table.jekyll.html
  var table_jekyll_exports2 = {};
  __export(table_jekyll_exports2, {
    default: () => table_jekyll_default2
  });
  var table_jekyll_default2 = '<div class="c-table">\n    <table class="c-table__table">\n        <caption class="cc-helper-hidden">{{ include.caption }}</caption>\n        <tr {% if include.show_table_headings == false %} class="cc-helper-hidden" {% endif %}>\n            {% for header in include.table_headings %}\n                <th class="c-table__heading" scope="col">{{ header }}</th>\n            {% endfor %}\n        </tr>\n        {% for row in include.table_rows %}\n            <tr class="c-table__tr">\n                {% for cell in row.row %}\n                <td class="cc-helper__p">{{ cell }}</td>\n                {% endfor %}\n            </tr>\n        {% endfor %}\n    </table>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/tag/tag.jekyll.html
  var tag_jekyll_exports = {};
  __export(tag_jekyll_exports, {
    default: () => tag_jekyll_default
  });
  var tag_jekyll_default = `<div class="{{ 'c-tag' | addmods: disabled:include.disabled }} c-tag--{{include.style}}">
    {% if include.disabled %}
        {{ include.content }}
    {% elsif include.is_link %}
        <a href="{{include.link_url}}">
            {{include.content}}
        </a>
    {% else %}
        {{ include.content }}
    {% endif %}
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/testimonial/testimonial.jekyll.html
  var testimonial_jekyll_exports = {};
  __export(testimonial_jekyll_exports, {
    default: () => testimonial_jekyll_default
  });
  var testimonial_jekyll_default = `<div class="c-testimonial">
    <img class="c-testimonial__image--mobile" src="{{site.baseurl}}{{include.image_path}}" alt="{{include.image_alt}}">
    <div class="c-testimonial__image--desktop" style="background: url('{{site.baseurl}}{{include.image_path}}'); background-size: cover; background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
    <div class="c-testimonial__body-container">
        <div>
            <img class="c-testimonial__logo" src="{{site.baseurl}}{{include.logo_path}}" alt="{{include.logo_alt}}">
            <blockquote class="cc-helper__h3 c-testimonial__blockquote">
                <img class="c-testimonial__quote-before c-testimonial__quote" src="/assets/icons/quote-before.svg" aria-hidden="true">
                {{include.quote}}
                <img class="c-testimonial__quote-after c-testimonial__quote" src="/assets/icons/quote-after.svg" aria-hidden="true">
            </blockquote>
        </div>
        <div class="c-testimonial__author">
            {{include.author}}
        </div>
        <div>
            {{include.supporting_text}}
        </div>
        <div class="c-testimonial__link">
            {% component link show_icon=true content=include.link_content url=include.link_url %}
        </div>
    </div>
</div>`;

  // ../../../CC/cc-marketing/packages/component-library/components/text/text.jekyll.html
  var text_jekyll_exports = {};
  __export(text_jekyll_exports, {
    default: () => text_jekyll_default
  });
  var text_jekyll_default = '<div class="c-heading-and-text">\n    {% assign column = include.col | plus: 0 %}\n    <div class="c-heading-and-text__text c-heading-and-text__text--{{- column -}}" >\n        {{ include.content_markdown | markdownify }}\n    </div>\n</div>';

  // ../../../CC/cc-marketing/packages/component-library/components/themed-headline/themed-headline.jekyll.html
  var themed_headline_jekyll_exports = {};
  __export(themed_headline_jekyll_exports, {
    default: () => themed_headline_jekyll_default
  });
  var themed_headline_jekyll_default = `<div class="c-themed-headline">
    <div class="c-themed-headline__content-container">
        <div class="c-themed-headline__content">
            {% if include.heading %}
                <h1 class="c-themed-headline__heading">
                    {{ include.heading }}
                </h1>
            {% endif %}
            {% if include.text %}
                <div class="c-themed-headline__text">
                    {{ include.text }}
                </div>
            {% endif %}
        </div>
        {% if include.image_path %}
            <div role="img" alt="{{ include.image_alt }}" class="c-themed-headline__image" style="background-image: url('{{ site.baseurl }}{{ include.image_path }}');"></div>
        {% endif %}
    </div>


    {% if include.cta_url %}
        <div class="c-themed-headline__cta">
            <div class="c-themed-headline__cta-content">
                {{ include.cta_description_markdown | markdownify }}
            </div>
            {% component link url=include.cta_url content=include.cta_link_text style="light" %}
        </div>
    {% endif %}
</div>

`;

  // ../../../CC/cc-marketing/packages/component-library/components/toggle/toggle.jekyll.html
  var toggle_jekyll_exports = {};
  __export(toggle_jekyll_exports, {
    default: () => toggle_jekyll_default
  });
  var toggle_jekyll_default = `{% svelte toggle bind=include %}
    <div class="{{ 'c-toggle' | addstates: disabled:include.disabled }}">
        <div class="c-toggle__labels c-toggle__labels--left">
            {{ include.left_text }}
            <div class="c-toggle__sub-text">
                {{ include.left_subtext }}
            </div>
        </div>
        <label class="c-toggle__switch">
            <div class="cc-helper-hidden">
                {{ include.label }}
            </div>
            <input id="{{ include.id }}" class="cc-helper-hidden" {% if include.disabled %}disabled {% endif %} type="checkbox">
            <span class="c-toggle__slider">
                <span class="c-toggle__slider-active"></span>
            </span>
        </label>
        <div class="c-toggle__labels">
            {{ include.right_text }}
            <div class="c-toggle__sub-text">
                {{ include.right_subtext }}
            </div>
        </div>
    </div>
{% endsvelte %}`;

  // import-glob:./../../../CC/cc-marketing/packages/component-library/components/**/*.jekyll.html
  var modules = [accordion_jekyll_exports, card_jekyll_exports, group_jekyll_exports, archive_card_jekyll_exports, card_jekyll_exports2, group_jekyll_exports2, br_jekyll_exports, button_jekyll_exports, category_card_jekyll_exports, code_block_jekyll_exports, coloured_cards_jekyll_exports, contact_cta_jekyll_exports, contact_form_jekyll_exports, content_grid_jekyll_exports, cta_jekyll_exports, data_reference_jekyll_exports, docs_image_jekyll_exports, docs_tabs_jekyll_exports, editor_input_docs_jekyll_exports, employee_frame_jekyll_exports, heading_and_text_jekyll_exports, heading_with_link_jekyll_exports, hero_jekyll_exports, hidden_h1_jekyll_exports, image_container_jekyll_exports, image_tab_jekyll_exports, group_jekyll_exports3, item_jekyll_exports, info_bar_jekyll_exports, info_box_jekyll_exports, input_jekyll_exports, job_advert_title_jekyll_exports, job_perk_block_jekyll_exports, job_perks_container_jekyll_exports, table_jekyll_exports, left_right_block_jekyll_exports, left_right_list_block_jekyll_exports, left_right_quote_jekyll_exports, lesson_card_jekyll_exports, lesson_stepper_jekyll_exports, card_jekyll_exports3, group_jekyll_exports4, link_jekyll_exports, list_jekyll_exports, logo_ticker_jekyll_exports, lottie_animation_jekyll_exports, mailing_list_cta_jekyll_exports, mark_as_completed_jekyll_exports, notice_jekyll_exports, prev_next_block_jekyll_exports, prev_next_button_jekyll_exports, pricing_table_jekyll_exports, block_jekyll_exports, group_jekyll_exports5, card_jekyll_exports4, group_jekyll_exports6, search_result_jekyll_exports, search_jekyll_exports, show_all_header_jekyll_exports, social_block_jekyll_exports, spacing_jekyll_exports, stats_blocks_jekyll_exports, table_jekyll_exports2, tag_jekyll_exports, testimonial_jekyll_exports, text_jekyll_exports, themed_headline_jekyll_exports, toggle_jekyll_exports];
  var jekyll_default = modules;
  var filenames = ["./../../../CC/cc-marketing/packages/component-library/components/accordion/accordion.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/address/card/card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/address/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/archive-card/archive-card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/blog/card/card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/blog/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/br/br.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/button/button.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/category-card/category-card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/code-block/code-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/coloured-cards/coloured-cards.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/contact-cta/contact-cta.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/contact-form/contact-form.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/content-grid/content-grid.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/cta/cta.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/data-reference/data-reference.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/docs-image/docs-image.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/docs-tabs/docs-tabs.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/editor-input-docs/editor-input-docs.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/employee-frame/employee-frame.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/heading-and-text/heading-and-text.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/heading-with-link/heading-with-link.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/hero/hero.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/hidden-h1/hidden-h1.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/image-container/image-container.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/image-tab/image-tab.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/item/item.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/info-bar/info-bar.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/info-box/info-box.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/input/input.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/job-advert-title/job-advert-title.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perk-block/job-perk-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perks-container/job-perks-container.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/table/table.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/left-right-block/left-right-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/left-right-list-block/left-right-list-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/left-right-quote/left-right-quote.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/lesson-card/lesson-card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/lesson-stepper/lesson-stepper.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/link-with-image/card/card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/link-with-image/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/link/link.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/list/list.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/logo-ticker/logo-ticker.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/lottie-animation/lottie-animation.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/mailing-list-cta/mailing-list-cta.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/mark-as-completed/mark-as-completed.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/notice/notice.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-block/prev-next-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-button/prev-next-button.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/pricing-table/pricing-table.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/pricing/block/block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/pricing/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/read-more/card/card.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/read-more/group/group.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/search-result/search-result.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/search/search.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/show-all-header/show-all-header.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/social-block/social-block.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/spacing/spacing.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/stats-blocks/stats-blocks.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/table/table.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/tag/tag.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/testimonial/testimonial.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/text/text.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/themed-headline/themed-headline.jekyll.html", "./../../../CC/cc-marketing/packages/component-library/components/toggle/toggle.jekyll.html"];

  // import-glob:./../../../CC/cc-marketing/packages/component-library/components/**/*.stories.toml
  var stories_exports = {};
  __export(stories_exports, {
    default: () => stories_default,
    filenames: () => filenames2
  });

  // ../../../CC/cc-marketing/packages/component-library/components/accordion/accordion.stories.toml
  var accordion_stories_exports = {};
  __export(accordion_stories_exports, {
    default: () => accordion_stories_default
  });
  var accordion_stories_default = `[meta]
array_structures = ["content_blocks"]
label="Accordion"
description="Accordion description"
icon="expand"
tags=["list","text","interactive"]

[defaults]
id = "faq" # This has to be unique and can not be used in any other accordions (A11y)
two_columns = true

[defaults.accordion_items--repeat]
heading = "Can I try CloudCannon free?"
content = "Play riveting piece on synthesizer keyboard mark territory, and bird bird bird bird bird bird human why take bird out i could have eaten that but my water bowl is clean and freshly replenished, so i'll drink from the toilet. Scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food."
is_open = false

[standard]

`;

  // ../../../CC/cc-marketing/packages/component-library/components/address/card/card.stories.toml
  var card_stories_exports = {};
  __export(card_stories_exports, {
    default: () => card_stories_default
  });
  var card_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = " Address card"\ndescription = "Address card description"\nicon = "bookmark_outline"\ntags = ["text"]\n\n[defaults]\ntitle = "Empowering marketers"\nsub_text = ""\ncontent = "To push content without involving developers"\nimage_path = ""\nimage_alt = ""\n\n[defaults.icon_list--repeat]\nicon_path = ""\nicon_alt = ""\nicon_url = ""\n\n[defaults.list--repeat]\nicon_path = ""\ncontent_markdown = ""\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/address/group/group.stories.toml
  var group_stories_exports = {};
  __export(group_stories_exports, {
    default: () => group_stories_default
  });
  var group_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Address card group"\ndescription = "Address Group description"\nicon = "collections_bookmark"\ntags = ["text"]\n\n[defaults]\n\n[defaults.address_cards--repeat]\ntitle = "Empowering marketers"\nsub_text = ""\ncontent = "To push content without involving developers"\nimage_path = ""\nimage_alt = ""\nicon_list = [{icon_path= "", icon_alt= "", icon_url=""}]\nlist = [{icon_path = "", content_markdown = ""}]\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/archive-card/archive-card.stories.toml
  var archive_card_stories_exports = {};
  __export(archive_card_stories_exports, {
    default: () => archive_card_stories_default
  });
  var archive_card_stories_default = '[defaults]\nheading = "All Posts"\n\nimage_path = "assets/ducks.jpg"\nimage_alt = "I am an alt text"\nlink_content = "Archived"\nlink_url = "/archived/"\ndescription = "See all of CloudCannon\u2019s posts. Even the ones from way back"\n\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/blog/card/card.stories.toml
  var card_stories_exports2 = {};
  __export(card_stories_exports2, {
    default: () => card_stories_default2
  });
  var card_stories_default2 = `[meta]
array_structures = ["content_blocks"]
label = "Single Blog"
description = "Single Blog description"
icon = "featured_play_list"
tags = ["blog", "card", "featured"]
[defaults]

link_url = "/blog"
image_path = "/assets/doggo.jpg" # 16:10 aspect ratio
image_alt = "I am some alt text"
heading = "G Suite Authenticated Sites with CloudCannon and SAML"
time_to_read = "7 Min read"
date = "2020-02-10"
author = "Farrel Burns"
categories = ['CMS', 'Jekyll']
content = "I am content"
compact = false
featured = false
tiny = false


[standard]

[compact]
compact = true

[featured]
featured = true

[tiny]
tiny = true`;

  // ../../../CC/cc-marketing/packages/component-library/components/blog/group/group.stories.toml
  var group_stories_exports2 = {};
  __export(group_stories_exports2, {
    default: () => group_stories_default2
  });
  var group_stories_default2 = `[meta]
array_structures = ["content_blocks"]
label = "Blog group"
description = "Blog group description"
icon = "featured_play_list"
tags = ["blog", "card", "featured"]

[defaults]
title = "Featured"
vertical = false 

[defaults.blogs--repeat]
link_url = "/blog"
image_path = "/assets/doggo.jpg"
image_alt = "I am some alt text"
heading = "G Suite Authenticated Sites with CloudCannon and SAML"
time_to_read = "7 Min read"
date = "2020-02-10"
categories = ['CMS', 'Jekyll']
description = "Internally at CloudCannon, we use G Suite to manage all of our emails. This allows us to work together on products like Google Drive and Google Meet. When a new member joins our team, they need to access all of the relevant documentation."
content = "content"
compact = false
featured = false
tiny = false

[defaults.column--select]
1 = "1"
2 = "2"
3 = "3"
4 = "4"


[defaults.heading_type--select]
h1 = "h1"
h2 = "h2"
h3 = "h3"
h4 = "h4"
h5 = "h5"

[standard]

[vertical]
vertical = true`;

  // ../../../CC/cc-marketing/packages/component-library/components/br/br.stories.toml
  var br_stories_exports = {};
  __export(br_stories_exports, {
    default: () => br_stories_default
  });
  var br_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel="Line Break"\ndescription="Line Break description"\nicon="border_horizontal"\ntags=["text"]\n\n[defaults]\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/button/button.stories.toml
  var button_stories_exports = {};
  __export(button_stories_exports, {
    default: () => button_stories_default
  });
  var button_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Button"\ndescription = "Button description"\nicon = "smart_button"\ntags = ["text","interactive"]\n\n[defaults]\nid = "button_id"\ndisabled = false\nlink = false\ncontent = "Press me"\nright_icon = false\nleft_icon = false\nsubmit = false # Allows the button to submit a form\nicon_path = "/assets/chevron_right-18px.svg"\nicon_size_width_number = "12px"\nicon_size_height_number = "12px"\ninline = false\n\n[defaults.style--select]\nbutton = "button"\nlight = "light"\ndark = "dark"\n\n[standard]\n\n[left_icon]\nleft_icon = true\n\n[right_icon]\nright_icon = true\n\n[disabled]\ndisabled = true\n\n[link]\nlink = true\ninline = true\n';

  // ../../../CC/cc-marketing/packages/component-library/components/category-card/category-card.stories.toml
  var category_card_stories_exports = {};
  __export(category_card_stories_exports, {
    default: () => category_card_stories_default
  });
  var category_card_stories_default = '[defaults]\n\ncategory = "Features"\nimage_path = "assets/ducks.jpg"\nlink_url = "/blog/hello/"\nimage_alt = "Two ducks sitting and looking cute in a park"\n\n[defaults.blogs--repeat]\nlink_url = "/blog"\nheading = "G Suite Authenticated Sites with CloudCannon and SAML"\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/code-block-copy-button/code-block-copy-button.stories.toml
  var code_block_copy_button_stories_exports = {};
  __export(code_block_copy_button_stories_exports, {
    default: () => code_block_copy_button_stories_default
  });
  var code_block_copy_button_stories_default = `[meta]
array_structures = []
label="Code Block Copy"
description="Code Block Copy description"
icon="content_copy"
tags=["text"]

[defaults]

code = """
def foo
  puts 'foo'
end
"""

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/code-block/code-block.stories.toml
  var code_block_stories_exports = {};
  __export(code_block_stories_exports, {
    default: () => code_block_stories_default
  });
  var code_block_stories_default = `[meta]
array_structures = ["content_blocks", "doc_blocks"]
label="Code Block"
description="Code Block description"
icon="code"
tags=["text"]

[defaults]

source = "config.yml"
language = "ruby"
code_block = """
def foo
  puts 'foo'
end
"""

[defaults.language--select]
apache = "apache"
applescript = "applescript"
awk = "awk"
c = "c"
clojure = "clojure"
coffeescript = "coffeescript"
common_lisp = "common_lisp"
console = "console"
cpp = "cpp"
csharp = "csharp"
css = "css"
dart = "dart"
docker = "docker"
dot = "dot"
erb = "erb"
go = "go"
graphql = "graphql"
haml = "haml"
handlebars = "handlebars"
haskell = "haskell"
html = "html"
java = "java"
javascript = "javascript"
json = "json"
jsx = "jsx"
liquid = "liquid"
markdown = "markdown"
nginx = "nginx"
objective_c = "objective_c"
pascal = "pascal"
perl = "perl"
php = "php"
plaintext = "plaintext"
powershell = "powershell"
python = "python"
ruby = "ruby"
rust = "rust"
sass = "sass"
scala = "scala"
scss = "scss"
sed = "sed"
shell = "shell"
sql = "sql"
toml = "toml"
typescript = "typescript"
vue = "vue"
xml = "xml"
yaml = "yaml"

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/coloured-cards/coloured-cards.stories.toml
  var coloured_cards_stories_exports = {};
  __export(coloured_cards_stories_exports, {
    default: () => coloured_cards_stories_default
  });
  var coloured_cards_stories_default = `[meta]
array_structures = ["content_blocks"]
label = "coloured-cards"
description = "coloured-cards description"
icon = "fiber_new"
tags = ["uncategorized"]

[defaults]

[defaults.heading_type--select]
h3 = "h3"
h4 = "h4"

[defaults.coloured-cards--repeat]
main_colour = '#fff'
shadow_colour_rgba = '#eee'
icon_path = "thing"
icon_alt = "meowl"
heading = "heading"
content_markdown = "markdoownnn"
link_content = "Link content"
link_url = "http://meowl.com"

[standard]

`;

  // ../../../CC/cc-marketing/packages/component-library/components/contact-cta/contact-cta.stories.toml
  var contact_cta_stories_exports = {};
  __export(contact_cta_stories_exports, {
    default: () => contact_cta_stories_default
  });
  var contact_cta_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Contact CTA"\ndescription = "Contact CTA description"\nicon = "smart_button"\ntags = ["text"]\n\n[defaults]\nheading = "Everything you need to build, host and update Jekyll websites."\ncontent = "This is why you should sign up by clicking the button down below. You can use CloudCannon for free. Isn\u2019t that great?"\nlink_content = "Sign Up Free"\nlink_url = "https://hello.com"\nlink_open_in_new_tab = false\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/contact-form/contact-form.stories.toml
  var contact_form_stories_exports = {};
  __export(contact_form_stories_exports, {
    default: () => contact_form_stories_default
  });
  var contact_form_stories_default = `[meta]
array_structures = ["content_blocks"]
label = "Contact Form"
description = "Contact Form description"
icon = "forum"
tags = ["text", "interactive"]

[defaults]
heading = "Let's talk"
content = "Have questions about CloudCannon, Jekyll or something else? Send us a message and we'll get back to you."
image_path = "/assets/people-sending-mail.svg"
image_alt = "I am an alt text"
success_page = "/success/"
hook_value = "http://url-here.com"
_cloudcannon_encrypted_details = true # This field acts as a flag for our JS to inject encrypted details into props
recaptcha_id = ""
form_id = "unique_id"

[defaults.heading_type--select]
h1 = "h1"
h2 = "h2"
h3 = "h3"
h4 = "h4"
h5 = "h5"

[defaults.form_items--repeat]
label = "First name"
default_value = "First name"
invalid_helper_text = "You need to give us a name please"
is_required = false
name = "hello"
input_type = "submit"
placeholder = "I am some placeholder"

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/content-grid/content-grid.stories.toml
  var content_grid_stories_exports = {};
  __export(content_grid_stories_exports, {
    default: () => content_grid_stories_default
  });
  var content_grid_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel = "Content Grid"\ndescription = "Content Grid description"\nicon = "grid_view"\ntags = ["text", "grid"]\n\n[defaults]\nheading = "More hosting features" \n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\n\n[defaults.column--select]\n2 = "2"\n3 = "3"\n4 = "4"\n\n[defaults.image_size--select]\nsmall = "small"\nmedium = "medium"\n\n[defaults.content_grid_item--repeat]\nimage_path = "/assets/magnifying-glass.png"\nimage_alt = "I am some alt text"\nheading = "Audit Log"\ncontent = "Keep track of everything your team members change, when it was made and by who."\nheading_type = "h4"\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/cta/cta.stories.toml
  var cta_stories_exports = {};
  __export(cta_stories_exports, {
    default: () => cta_stories_default
  });
  var cta_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "CTA"\ndescription = "CTA description"\nicon = "smart_button"\ntags = ["text"]\n\n[defaults]\nheading = "Everything you need to build, host and update Jekyll websites."\ncontent = "This is why you should sign up by clicking the button down below. You can use CloudCannon for free. Isn\u2019t that great?"\nlink_content = "Sign Up Free"\nlink_url = "https://hello.com"\nlink_open_in_new_tab = false\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/data-reference/data-reference.stories.toml
  var data_reference_stories_exports = {};
  __export(data_reference_stories_exports, {
    default: () => data_reference_stories_default
  });
  var data_reference_stories_default = '[meta]\narray_structures = ["doc_blocks"]\nlabel="Data reference"\ndescription="Data reference description"\nicon="article"\ntags=["text"]\n\n[defaults]\n[defaults.rows--repeat]\nkey = "_sort_key"\ntype_markdown = "String"\ndescription_markdown = "This does **stuff**"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/docs-image/docs-image.stories.toml
  var docs_image_stories_exports = {};
  __export(docs_image_stories_exports, {
    default: () => docs_image_stories_default
  });
  var docs_image_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks", "docs_images"]\nlabel="Docs Image"\ndescription="Docs Image description"\nicon="image"\ntags = ["image"]\n\n[defaults]\n\nimage_path = "/assets/pricing-page-business.png"\nimage_alt = "I am an alt text"\nimage_width = 800\nretina_image_path = "/assets/pricing-page-business.png"\nretina_image_width = 1600\n\n[defaults.image_type--select]\nregular = "regular"\nscreenshot = "screenshot"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/docs-tabs/docs-tabs.stories.toml
  var docs_tabs_stories_exports = {};
  __export(docs_tabs_stories_exports, {
    default: () => docs_tabs_stories_default
  });
  var docs_tabs_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel="Docs Tabs"\ndescription="Docs Tabs description"\nicon="article"\ntags=["text"]\n\n[defaults]\nlabel = "Languages" # Name of the tab grouping for accessibility\nstore = "unique_key" # Key to pair docs tabs together when changing tab\nclosable = false\nclosed = false\n_wrapper = true\n\n[defaults.tabs--repeat]\ntab_name = "Jekyll"\ndoc_blocks = [{_component_type = "code-block", source = "test.file", language = "ruby", code = "p ok"}]\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/editor-input-docs/editor-input-docs.stories.toml
  var editor_input_docs_stories_exports = {};
  __export(editor_input_docs_stories_exports, {
    default: () => editor_input_docs_stories_default
  });
  var editor_input_docs_stories_default = '[meta]\n_hidden = false\narray_structures = []\nlabel = "Editor Input Docs"\ndescription = "Documenting the inputs for the Edit/Inputs documentation page"\nicon = "fiber_new"\ntags = ["uncategorized"]\n\n[defaults]\nname = "Input Name"\nicon_svg_image = "/assets/icons/reset.svg"\npreview_image = "/assets/ducks.jpg"\ninfers_from_value = false\ndescription_markdown = "Description **markdown**"\nsuffixes = ["input", "_input"]\ndoc_blocks = [{_component_type = "code-block", source = "index.md", language = "yaml", code = "input: \\"input\\""}]\n\n[defaults.input_value_type--preview]\nstring = "String"\ndate = "Date"\nboolean = "Boolean"\nnumber = "Number"\narray = "Array"\nobject = "Object"\n\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/employee-frame/employee-frame.stories.toml
  var employee_frame_stories_exports = {};
  __export(employee_frame_stories_exports, {
    default: () => employee_frame_stories_default
  });
  var employee_frame_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Employee frame"\ndescription = "Employee frame description"\nicon = "account_box"\ntags = ["image"]\n[defaults]\n\nheading = "Check out our people"\n\n[defaults.col--select]\n3 = "3"\n4 = "4"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[defaults.image_block--repeat]\ncaption_title = "Mel O Sauras"\ncaption_supporting_text = "Developer"\nimage_path = "/assets/mel1.jpg"\nhover_image_path = "/assets/mel2.jpg"\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/heading-and-text/heading-and-text.stories.toml
  var heading_and_text_stories_exports = {};
  __export(heading_and_text_stories_exports, {
    default: () => heading_and_text_stories_default
  });
  var heading_and_text_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel = "Heading and Text"\ndescription = "Heading and Text description"\nicon = "article"\ntags = ["text"]\n\n[defaults]\n\nheading = "I am a heading"\ncontent_markdown = "Doggo ipsum shibe corgo maximum borkdrive very hand that feed shibe many pats, boof tungg. Long doggo heckin angery woofer lotsa pats doggo puggorino, boofers smol. noodle horse long doggo you are doin me a concern. Borkf ruff maximum borkdrive snoot super chub tungg, vvv borkf mlem such treat big ol boof, noodle horse length boy smol borking doggo with a long snoot for pats pupper. Doggo porgo heckin good boys and girls mlem blop wow very biscit very good spot, length boy doggo mlem boof. Bork borkdrive heckin angery woofer fluffer wow very biscit, aqua doggo length boy snoot boof, clouds such treat puggo. Puggorino bork blep bork dat tungg tho, such treat heckin good boys. Dat tungg tho shooberino porgo sub woofer maximum borkdrive h*ck doing me a frighten, yapper very jealous pupper super chub borkdrive h*ck. Fat boi long bois ur givin me a spook boofers heck long water shoob very hand that feed shibe you are doing me the shock, pupper sub woofer ur givin me a spook vvv many pats. Boof you are doing me the shock stop it fren boof what a nice floof noodle horse porgo, heck fat boi aqua doggo heckin good boys. Pats doing me a frighten heckin good boys I am bekom fat puggorino, very hand that feed shibe wow very biscit. Very hand that feed shibe noodle horse fluffer heckin good boys dat tungg tho big ol pupper, you are doing me the shock yapper heckin good boys. Sub woofer very jealous pupper heckin wow such tempt, aqua doggo bork. mlem the neighborhood pupper corgo. You are doing me a frighten many pats wow very biscit, h*ck. He made many woofs heckin good boys borkf super chub boofers borking doggo aqua doggo, boofers he made many woofs doggorino dat tungg tho much ruin diet borkdrive, long water shoob borkf dat tungg tho boofers vvv. Long woofer blop much ruin diet, doggo."\n\n[defaults.alignment--select]\nleft = "left"\ncenter = "center"\nright = "right"\n\n[defaults.width--select]\nlong = "long"\nmedium = "medium"\nshort = "short"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n\n[defaults.col--select]\n1 = "1"\n2 = "2"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/heading-with-link/heading-with-link.stories.toml
  var heading_with_link_stories_exports = {};
  __export(heading_with_link_stories_exports, {
    default: () => heading_with_link_stories_default
  });
  var heading_with_link_stories_default = '[meta]\n_hidden = false\narray_structures = []\nlabel = "heading-with-link"\ndescription = "heading-with-link description"\nicon = "fiber_new"\ntags = ["uncategorized"]\n\n[defaults]\n\nheading = "Showcases"\nlink_path = "/community/something/"\nlink_text = "Show all"\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/hero/hero.stories.toml
  var hero_stories_exports = {};
  __export(hero_stories_exports, {
    default: () => hero_stories_default
  });
  var hero_stories_default = `[meta]
array_structures = [ "content_blocks" ]
label = "Hero"
description = "Hero description"
icon = "title"
tags = [ "text", "heading" ]

[defaults]
blog = false
image_path = "/assets/people-imagining-future.png" # 3:2 aspect ratio
image_alt = "I am an alt text"
heading = "Protect your private content"
text = "Not everything on your website needs to be publicly accessible. Restrict public access to portions of, or your entire site using CloudCannon Edge authentication."

title_image_path = "assets/twitch.png"
title_image_alt = "Twitch"

author_supporting_text = "With"
author = "Nathan Kennedy, Development Intern"
author_job = "Development Intern"

blog_categories = ['CMS', 'Jekyll']
time_to_read = ""

logo_path = "/uploads/hnry-grey.svg"
logo_alt = "Hnry Logo"

[standard]

[defaults.links--repeat]
link_content = "I am a link"
link_url = "http://hello.com"
page_jump = true
open_in_new_tab = false
link_style = ""

[defaults.alignment--inline-radio]
left = "left"
right = "right"

[blog]
blog = true
categories = ['CMS', 'Jekyll']
tag_baseurl = ""
author = "Kubo"
time_to_read = "7 Min read"
date = "2020-02-10"
author_image_path = "/assets/nathan.png"
author_image_alt = "I am some alt text"

`;

  // ../../../CC/cc-marketing/packages/component-library/components/hidden-h1/hidden-h1.stories.toml
  var hidden_h1_stories_exports = {};
  __export(hidden_h1_stories_exports, {
    default: () => hidden_h1_stories_default
  });
  var hidden_h1_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Hidden H1"\ndescription = "Hidden H1 description"\nicon = "visibility_off"\ntags = ["text","heading"]\n\n[defaults]\n\nheading = "I am a hidden heading"\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/image-container/image-container.stories.toml
  var image_container_stories_exports = {};
  __export(image_container_stories_exports, {
    default: () => image_container_stories_default
  });
  var image_container_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Image container"\ndescription = "Image container"\nicon = "view_carousel"\ntags = ["text"]\n\n[defaults]\n\n[defaults.image--repeat]\nimage_path = "/images/templates/aperture/1.jpeg"\nimage_alt = "Image alt"\n\n[defaults.col--select]\n1 = "1"\n2 = "2"\n3 = "3"\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/image-tab/image-tab.stories.toml
  var image_tab_stories_exports = {};
  __export(image_tab_stories_exports, {
    default: () => image_tab_stories_default
  });
  var image_tab_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "image-tab"\ndescription = "image-tab description"\nicon = "fiber_new"\ntags = ["uncategorized"]\n\n[defaults]\n\n[defaults.tab_items--repeat]\nid = "id"\nheading = "heading"\ncontent_markdown = "I am some content"\nimage_path = "https://placedog.net/500/280"\nimage_alt = "I am some alt text"\n\n[defaults.heading_type--select]\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/group/group.stories.toml
  var group_stories_exports3 = {};
  __export(group_stories_exports3, {
    default: () => group_stories_default3
  });
  var group_stories_default3 = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Image Text Stepper"\ndescription = "Image Text Stepper description"\nicon = "vertical_split"\ntags = ["text"]\n\n[defaults]\nheading = "Your Jekyll workflow with CloudCannon"\n\n[defaults.items--repeat]\nheading = "1. Sync your content"\ncontent_markdown = "Connect your GitHub, Gitlab or Bitbucket repository."\nimage_path = "uploads/1-sync.svg"\nimage_alt = "baking"\narrow_image_path = "uploads/1st-arrow.svg"\nheading_type = "h2"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/item/item.stories.toml
  var item_stories_exports = {};
  __export(item_stories_exports, {
    default: () => item_stories_default
  });
  var item_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Image Text Stepper"\ndescription = "Image Text Stepper description"\nicon = "vertical_split"\ntags = ["text"]\n\n[defaults]\n\nheading = "1. Sync your content"\ncontent_markdown = "Connect your GitHub, Gitlab or Bitbucket repository."\nimage_path = "uploads/1-sync.svg"\nimage_alt = "baking"\n\narrow_image_path = "uploads/1st-arrow.svg"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/info-bar/info-bar.stories.toml
  var info_bar_stories_exports = {};
  __export(info_bar_stories_exports, {
    default: () => info_bar_stories_default
  });
  var info_bar_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Info Sidebar"\ndescription = "Info Bar description"\nicon = "view_sidebar"\ntags = ["text"]\n\n[defaults]\n\nlink_content = "Start Free"\nlink_url = "/login"\n\n[defaults.info_box--repeat]\ntitle = "Customer Since"\ncontent = "2008"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/info-box/info-box.stories.toml
  var info_box_stories_exports = {};
  __export(info_box_stories_exports, {
    default: () => info_box_stories_default
  });
  var info_box_stories_default = '[defaults]\nnote = true\nimportant = false\ncode = false\n\ncontent_markdown = "If the site is synced with a storage provider, CloudCannon pushes the files there as well."\n\n[standard]\n\n[note]\nnote = true\nimportant = false\ncode = false\n\n[important]\nimportant = true\nnote = false\ncode = false\n\n[code]\nimportant = false\nnote = false\ncode = true\n';

  // ../../../CC/cc-marketing/packages/component-library/components/input/input.stories.toml
  var input_stories_exports = {};
  __export(input_stories_exports, {
    default: () => input_stories_default
  });
  var input_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Input"\ndescription = "Input description"\nicon = "create"\ntags = ["text","interactive"]\n\n[defaults]\nlabel = "Email"\ndefault_value = ""\nplaceholder = "Email"\ninvalid_helper_text = "Email is not valid"\nis_required = true\nbutton_dark = false\nbutton_light = false\nname = "name"\nid = "cta-id" # This has to be unique across the whole site\n\n[defaults.input_type--select]\nemail = "email"\ntextarea = "textarea"\ntext = "text"\npassword = "password"\nsubmit = "submit"\ntelephone = "tel"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/job-advert-title/job-advert-title.stories.toml
  var job_advert_title_stories_exports = {};
  __export(job_advert_title_stories_exports, {
    default: () => job_advert_title_stories_default
  });
  var job_advert_title_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel="Job Advert Title"\ndescription="Job Advert Title description"\nicon="work"\ntags=["text"]\n\n[defaults]\n\ntitle = "Technical Support Engineer"\n\n[defaults.icon_and_text--repeat]\nicon_path = "/assets/location.svg"\ncontent = "Dunedin, New Zealand"\n\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perk-block/job-perk-block.stories.toml
  var job_perk_block_stories_exports = {};
  __export(job_perk_block_stories_exports, {
    default: () => job_perk_block_stories_default
  });
  var job_perk_block_stories_default = '[meta]\narray_structures = []\nlabel="Job Perk Block"\ndescription="Job Perk Block description"\nicon="work"\ntags=["text"]\n\n[defaults]\n\ntitle = "Want a perk eh?"\n\n[defaults.icon--select]\nbeach-access = "beach-access"\ndesktop-windows = "desktop-windows"\nlocal-cafe = "local-cafe"\nmood = "mood"\npie-chart = "pie-chart"\ntoday = "today"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perks-container/job-perks-container.stories.toml
  var job_perks_container_stories_exports = {};
  __export(job_perks_container_stories_exports, {
    default: () => job_perks_container_stories_default
  });
  var job_perks_container_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel="Job Perks Container"\ndescription="Job Perks Container description"\nicon="work"\ntags=["text"]\n\n[defaults]\nheading = "Benefits and Perks"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n\n[defaults.perks--repeat]\ntitle = "Want a perk eh?"\nicon = "beach-access"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/job-listing/table/table.stories.toml
  var table_stories_exports = {};
  __export(table_stories_exports, {
    default: () => table_stories_default
  });
  var table_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Job Table"\ndescription = "Job Table description"\nicon = "work"\ntags = ["text"]\n\n[defaults]\n\nheading = "Job openings"\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\n\n[defaults.job_adverts--repeat]\njob_description = "Front end developer"\nurl = "www.cloudcannon.com/apply/"\ndepartment = "Services"\nstatus = "default"\nlocation = "Dunedin"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-block/left-right-block.stories.toml
  var left_right_block_stories_exports = {};
  __export(left_right_block_stories_exports, {
    default: () => left_right_block_stories_default
  });
  var left_right_block_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Left Right Block"\ndescription = "Left Right Block description"\nicon = "vertical_split"\ntags = ["text"]\n\n[defaults]\ntag_url = "/tag/"\ntag_content = "tag"\ntag_disabled = true\n\nimage_path = "/uploads/person-globe.svg"\nimage_alt = "I am some alt text"\nheading = "Watch your build in realtime"\ncontent_markdown = "Pull in data from external sources, check your output for broken links, optimise the assets on your site. All of these are possible by using or building your own CloudCannon Pipeline plugins."\n\nlink_url = "https://cloudcannon.com"\nlink_content = "I am a link"\nlink_open_in_new_tab = false\nhide_link_icon = false\n\n[defaults.info_and_description--repeat]\ntitle = "thing"\ndescription = "other thing"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[defaults.link_style--select]\nlink = false\nbutton = "button"\nlight = "light"\ndark = "dark"\n\n[defaults.alignment--inline-radio] # If no value is included the blocks will alternate alignment\nleft = "left"\nright = "right"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-list-block/left-right-list-block.stories.toml
  var left_right_list_block_stories_exports = {};
  __export(left_right_list_block_stories_exports, {
    default: () => left_right_list_block_stories_default
  });
  var left_right_list_block_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Left Right List Block"\ndescription = "Left Right List Block description"\nicon = "vertical_split"\ntags = ["text"]\n\n[defaults]\n\nimage_path = "/uploads/person-globe.svg"\nimage_alt = "I am some alt text"\nlottie_animation = false\n\nheading = "Watch your build in realtime"\ncontent_markdown = "Pull in data from external sources, check your output for broken links, optimise the assets on your site. All of these are possible by using or building your own CloudCannon Pipeline plugins."\n\nlink_url = "https://cloudcannon.com"\nlink_content = "I am a link"\nlink_open_in_new_tab = false\n\n[defaults.animation]\nstatic_image_path = ""\nstatic_image_alt = ""\nanimation_path = ""\nid = ""\nloop = false\nhas_shadows = false\nauto_play = true\n\n[defaults.list_items--repeat]\nicon_path = "hello"\nicon_alt = "tick"\ncontent_markdown = "long list"\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[defaults.alignment--inline-radio] # If no value is included the blocks will alternate alignment\nleft = "left"\nright = "right"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/left-right-quote/left-right-quote.stories.toml
  var left_right_quote_stories_exports = {};
  __export(left_right_quote_stories_exports, {
    default: () => left_right_quote_stories_default
  });
  var left_right_quote_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Left Right Quote"\ndescription = "Left Right Quote description"\nicon = "vertical_split"\ntags = ["text"]\n\n[defaults]\nheading = "Watch your build in realtime"\ncontent_markdown = "Pull in data from external sources, check your output for broken links, optimise the assets on your site. All of these are possible by using or building your own CloudCannon Pipeline plugins."\n\nquote = "I am a quote how coooolll"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n\n[defaults.alignment--inline-radio] # If no value is included the blocks will alternate alignment\nleft = "left"\nright = "right"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/lesson-card/lesson-card.stories.toml
  var lesson_card_stories_exports = {};
  __export(lesson_card_stories_exports, {
    default: () => lesson_card_stories_default
  });
  var lesson_card_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Lesson card"\ndescription = "Lesson card description"\nicon = "featured_play_list"\ntags = ["lesson", "card"]\n\n[defaults]\n\nlink_content = "Start my lesson"\nlink_url = "/blog"\nimage_path = "/assets/doggo.jpg" # 16:10 aspect ratio\nimage_alt = "I am some alt text"\nheading = "G Suite Authenticated Sites with CloudCannon and SAML"\n\ntag_url = "/hello"\ntag_disabled = true\ntag_content = "meow"\ncontent = "I am content"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/lesson-stepper/lesson-stepper.stories.toml
  var lesson_stepper_stories_exports = {};
  __export(lesson_stepper_stories_exports, {
    default: () => lesson_stepper_stories_default
  });
  var lesson_stepper_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Lesson stepper"\ndescription = "Lesson stepper description"\nicon = "create"\ntags = [ "text","interactive" ]\n\n[defaults]\nstore = "Hello"\nheading = "I am a heading"\ndescription_markdown = "I am a descripton"\n\nlink_url = "/link"\nlink_content = "Link content"\nis_completed = false\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"';

  // ../../../CC/cc-marketing/packages/component-library/components/link-with-image/card/card.stories.toml
  var card_stories_exports3 = {};
  __export(card_stories_exports3, {
    default: () => card_stories_default3
  });
  var card_stories_default3 = '[defaults]\n\nheading = "1. Connect your repository"\nimage_path = "assets/file-syncing.png"\nimage_alt = "I am an alt tag"\nlink_as_heading = false\ninline_image = false\nimage_as_icon = false\nlink_content = "Learn more"\nlink_url = "http://connect-your-repository.com"\ncontent = "Sync your GitHub. Bitbucket or GitLab repository."\n\n[defaults.inline_image_size]\nsmall = "small"\nlarge = "large"\n\n[defaults.tags--repeat]\ntag_url = "url"\ntag_disabled = true\ntag_content = "Tag"\nshow_link_icon = true\n\n[defaults.heading_type--select]\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n[defaults.alignment--select]\nleft = "left"\ncenter = "center"\nright = "right"\n\n[defaults.link_style--select]\nnone = false\nbutton = "button"\nlight = "light"\ndark = "dark"\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/link-with-image/group/group.stories.toml
  var group_stories_exports4 = {};
  __export(group_stories_exports4, {
    default: () => group_stories_default4
  });
  var group_stories_default4 = `[meta]
array_structures = ["content_blocks"]
label = "Link with Card group"
description = "Link with Card group description"
icon = "featured_play_list"
tags = ["card", "link"]

[defaults]
heading = "Your website, supercharged"

[defaults.cards--repeat]
heading = "1. Connect your repository"
image_path = "assets/file-syncing.png"
image_alt = "I am an alt tag"
link_as_heading = false
inline_image = false
image_as_icon = false
link_content = "Learn more"
link_url = "http://connect-your-repository.com"
content = "Sync your GitHub. Bitbucket or GitLab repository."
link_style = ""
heading_type = 'h3'
alignment = "left"
show_link_icon = true
tags = [{tag_url = "Thing", tag_disabled = true, tag_content = ""}]

[defaults.column--select]
2 = "2"
3 = "3"
4 = "4"

[defaults.heading_type--select]
h1 = "h1"
h2 = "h2"
h3 = "h3"
h4 = "h4"
h5 = "h5"


[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/link/link.stories.toml
  var link_stories_exports = {};
  __export(link_stories_exports, {
    default: () => link_stories_default
  });
  var link_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Link"\ndescription = "Link description"\nicon = "add_link"\ntags = ["text"]\n\n[defaults]\ncontent = "I am a link"\nurl = "http://cloudcannon.com"\nshow_icon = false\nopen_in_new_tab = true\n\n[defaults.style--select]\nnone = false\nbutton = "button"\nlight = "light"\ndark = "dark"\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/list/list.stories.toml
  var list_stories_exports = {};
  __export(list_stories_exports, {
    default: () => list_stories_default
  });
  var list_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "List"\ndescription = "List description"\nicon = "view_carousel"\ntags = ["text"]\n\n[defaults]\n\nicon_color = "#034ad8"\nglobal_icon_path = "/asset/icon.svg"\nicon_size = "small"\n\n[defaults.icon_size--select]\nsmall = "small"\nlarge = "large"\n\n[defaults.lists--repeat]\nheading = "I am a heading"\nlist_group = [{individual_list_image_path = "", text_markdown = "list 1"}]\n\n[defaults.lists_col--select]\n1 = "1"\n2 = "2"\n3 = "3"\n\n[defaults.list_item_col--select]\n1 = "1"\n2 = "2"\n3 = "3"\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\n';

  // ../../../CC/cc-marketing/packages/component-library/components/logo-ticker/logo-ticker.stories.toml
  var logo_ticker_stories_exports = {};
  __export(logo_ticker_stories_exports, {
    default: () => logo_ticker_stories_default
  });
  var logo_ticker_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Logo Ticker"\ndescription = "Logo Ticker description"\nicon = "view_carousel"\ntags = ["text"]\n\n[defaults]\n\nheading = "Featured Customers:"\nis_grey_background = false\nflex = true\n\n[defaults.logos--repeat]\nlogo_path = "assets/twitch.png"\nlogo_alt = "I am an alt"\ncontent = "Beta"\nis_link = true\nlink_url = "www.link"\nlink_content = "thing"\n\n[standard]\n\n[flex]\nflex = true\n';

  // ../../../CC/cc-marketing/packages/component-library/components/mailing-list-cta/mailing-list-cta.stories.toml
  var mailing_list_cta_stories_exports = {};
  __export(mailing_list_cta_stories_exports, {
    default: () => mailing_list_cta_stories_default
  });
  var mailing_list_cta_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Mailing List CTA"\ndescription = "Mailing List CTA description"\nicon = "create"\ntags = ["input","interactive", "form"]\n\n[defaults]\n\nheading = "Never miss a single thing"\ndescription = "CloudCannon news freshly delivered to your inbox"\n_cloudcannon_encrypted_details = false\n\nimage_path = ""\nimage_alt = "image_alt"\nform_action = "https://cloudcannon.us12.list-manage.com/subscribe/post?u=c2598ec08fca5843b980a7d3f&amp;id=16297bb754"\ninput_validation_name = "b_c2598ec08fca5843b980a7d3f_16297bb754"\n\nsuccess_page = "/success/"\nhook_value = "http://url-here.com"\n\nemail_label = "Email"\nemail_placeholder = "Email"\n\nbutton_default_value = "Subscribe"\nbutton_label = "button"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/mark-as-completed/mark-as-completed.stories.toml
  var mark_as_completed_stories_exports = {};
  __export(mark_as_completed_stories_exports, {
    default: () => mark_as_completed_stories_default
  });
  var mark_as_completed_stories_default = '[defaults]\n\nlink_url = "hello"\nstore = "store"\n\n[standard]';

  // ../../../CC/cc-marketing/packages/component-library/components/notice/notice.stories.toml
  var notice_stories_exports = {};
  __export(notice_stories_exports, {
    default: () => notice_stories_default
  });
  var notice_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel = "Notice"\ndescription = "Notice description"\nicon = "info_outline"\ntags = ["text"]\n\n[defaults]\n\ncontent_markdown = "If the site is synced with a storage provider, CloudCannon pushes the files there as well."\n\n[defaults.info_type--select]\nnote = "note"\ninfo = "info"\nimportant = "important"\ncode = "code"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-block/prev-next-block.stories.toml
  var prev_next_block_stories_exports = {};
  __export(prev_next_block_stories_exports, {
    default: () => prev_next_block_stories_default
  });
  var prev_next_block_stories_default = `[meta]
array_structures = []
label = "Prev Next Block"
description = "Prev Next Block description"
icon = "article"
tags = ["text"]

[defaults]

[defaults.previous]
icon = '/assets/icons/hosting-icon.svg'
category_text = 'Host / General'
title = 'Introduction'

[defaults.next]
icon = '/assets/icons/hosting-icon.svg'
category_text = 'Host / General'
title = 'Extensionless URLs'

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-button/prev-next-button.stories.toml
  var prev_next_button_stories_exports = {};
  __export(prev_next_button_stories_exports, {
    default: () => prev_next_button_stories_default
  });
  var prev_next_button_stories_default = `[meta]
array_structures = []
label="Prev Next Button"
description="Prev Next Button description"
icon="article"
tags=["text"]

[defaults]
url = '/'
icon = '/assets/icons/cms-icon.svg'
category_text = 'Host / General'
title = 'Introduction'

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/pricing-table/pricing-table.stories.toml
  var pricing_table_stories_exports = {};
  __export(pricing_table_stories_exports, {
    default: () => pricing_table_stories_default
  });
  var pricing_table_stories_default = `[meta]
array_structures = []
label="Desktop Pricing Table"
description="Desktop Pricing Table description"
icon="money"
tags=["text"]

[defaults]
caption = "Description for table" # Important for A11y


table_rows = [[{heading = {title = "Support", tooltip = "Kubo is the best doggo"}}, { body = ["basic", "Basic", "advanced"] }], [{heading = {title = "Meow support", tooltip = "Kubo is the best doggo"}}, { body = [true, true, false] }]]

[defaults.table_headings--repeat]
title = "Enterprise"
price_text_before = "From"
price_monthly = "$250/m"
link_content = "Talk to us"
link_url = 'https://app.cloudcannon.com/contact'
open_in_new_tab = false

[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/pricing/block/block.stories.toml
  var block_stories_exports = {};
  __export(block_stories_exports, {
    default: () => block_stories_default
  });
  var block_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Pricing Block"\ndescription = "Pricing Block description"\nicon = "local_atm"\ntags = ["text"]\n\n[defaults]\nimage_path = "/assets/pricing-page-business.png"\nimage_alt = "I am an alt text"\nheading = "Business"\n\nlink_content = "Choose plan"\nlink_url = "http://hello.com"\nprice_monthly = "$0"\nprice_secondary_text_markdown = "/ Month (USD)"\ndescription_markdown = "For organizations with an in-house web team looking to build remarkable web experiences."\n\nlist_name = "Included:"\n\n[defaults.list--repeat]\nlist_item = "Buy more beans"\nicon_url = ""\nicon_alt = ""\n\n[defaults.link_style--select]\nlink = false\nbutton = "button"\nlight = "light"\ndark = "dark"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/pricing/group/group.stories.toml
  var group_stories_exports5 = {};
  __export(group_stories_exports5, {
    default: () => group_stories_default5
  });
  var group_stories_default5 = `[meta]
array_structures = ["content_blocks"]
label = "Pricing Group"
description = "Pricing Group description"
icon = "money"
tags = ["text"]

[defaults]

[defaults.column--select]
2 = "2"
3 = "3"

[defaults.pricing_block--repeat]
image_path = "/assets/pricing-page-business.png"
image_alt = "I am an alt text"
heading = "Business"
link_content = "Choose plan"
link_url = "http://hello.com"
link_style = ""
price_monthly = "$0"
price_secondary_text_markdown = "/ Month (USD)"
description_markdown = "For organizations with an in-house web team looking to build remarkable web experiences."
list_name = "Included:"
list = [{list_item = 'Single user', icon_url = "", icon_alt = "", show_link_icon=true }, {list_item = 'Single user', icon_url = "", icon_alt = ""}, {list_item = 'Single user', icon_url = "", icon_alt = ""}]
content_markdown = ""
heading_and_text = false
[standard]
`;

  // ../../../CC/cc-marketing/packages/component-library/components/read-more/card/card.stories.toml
  var card_stories_exports4 = {};
  __export(card_stories_exports4, {
    default: () => card_stories_default4
  });
  var card_stories_default4 = '[meta]\narray_structures = []\nlabel="Read More Card"\ndescription="Read More Card description"\nicon="bookmark_outline"\ntags=["text"]\n\n[defaults]\n\ntitle = "Empowering marketers"\ncontent = "To push content without involving developers"\n\ntitle_image_path = "assets/twitch.png"\ntitle_image_alt = "Twitch"\n\nimage_path = "assets/square-image.png"\nimage_alt = "Lady looking happy infront of a netflix logo"\n\nlink_url = "https://cloudcannon.com"\nlink_content = "I am a link"\nlink_open_in_new_tab = false\ntags = []\nimage_offset_percentage_number = 0\n\n[defaults.image_format--select]\nsquare = "square"\nrectangle = "rectangle"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/read-more/group/group.stories.toml
  var group_stories_exports6 = {};
  __export(group_stories_exports6, {
    default: () => group_stories_default6
  });
  var group_stories_default6 = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Read More Group"\ndescription = "Read More Group description"\nicon = "collections_bookmark"\ntags = ["text"]\n\n[defaults]\n\ntitle = "See how other teams use CloudCannon"\ncontent_markdown = "Content markdown"\ntitle_as_card = false\nlink_content = ""\nlink_url = ""\nshow_link_icon = ""\ncategory_filter = "Documentation"\nsite_collection = "customers"\n\n[defaults.heading_type--select]\nh1 = "h1"\nh2 = "h2"\nh3 = "h3"\nh4 = "h4"\nh5 = "h5"\n\n\n[defaults.read_more_card--repeat]\ntitle = "Empowering marketers"\ncontent = "To push content without involving developers"\ntitle_image_path = "assets/twitch.png"\ntitle_image_alt = "Twitch"\nimage_path = "assets/square-image.png"\nimage_alt = "Lady looking happy infront of a netflix logo"\nlink_url = "https://cloudcannon.com"\nlink_content = "I am a link"\nlink_open_in_new_tab = false\nimage_horizontal_position = 0\nimage_format = "rectangle"\ntags = []\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/search-result/search-result.stories.toml
  var search_result_stories_exports = {};
  __export(search_result_stories_exports, {
    default: () => search_result_stories_default
  });
  var search_result_stories_default = '[meta]\n_hidden = false\narray_structures = []\nlabel = "search-result"\ndescription = "search-result description"\nicon = "fiber_new"\ntags = ["uncategorized"]\n\n[defaults]\nimage = "/assets/ducks.jpg"\nbucket = "Documentation"\ntitle = "Wow, look at the ducks"\ndate = "2014-07-25 00:00:00"\nbreadcrumb = "/blog/ducks/cool-post-slug"\nexcerpt = "This is some content about the <b>ducks</b> that matches the search term"\ntags = ["duck", "feet", "waddle"]\nkeywords = ["duck", "feet", "waddle"]\n\n[standard]\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/search/search.stories.toml
  var search_stories_exports = {};
  __export(search_stories_exports, {
    default: () => search_stories_default
  });
  var search_stories_default = `[meta]
_hidden = false
array_structures = []
label = "search"
description = "search description"
icon = "fiber_new"
tags = ["uncategorized"]

[defaults]
placeholder = "Search"
fallback_image_path = "/assets/ducks.jpg"

[defaults.landing_copy]
heading = "Search for anything"
description = "Description. Starting typing in the search bar above or something along those lines."
image_path = "/assets/light-bulb.png"

[defaults.no_results_copy]
heading = "Yeah nah couldn't find it."
description = "Try searching for something that actually exists."
image_path = "/assets/box.png"

[defaults.search_buckets--repeat]
search_url = "/assets/example-search-results.json"
label = "Example"

[standard]

[preview]
preview = true

[active]
active = true


`;

  // ../../../CC/cc-marketing/packages/component-library/components/show-all-header/show-all-header.stories.toml
  var show_all_header_stories_exports = {};
  __export(show_all_header_stories_exports, {
    default: () => show_all_header_stories_default
  });
  var show_all_header_stories_default = '[meta]\narray_structures = []\nlabel = "Show all header"\ndescription = "Show all header description"\nicon = "local_atm"\ntags = ["text"]\n\nheading = "Hello"\nlink_url = "/thing"\nlink_content = "Show all"\n\n[defaults.heading_type--select]\nh2 = "h2"\nh3 = "h3"';

  // ../../../CC/cc-marketing/packages/component-library/components/social-block/social-block.stories.toml
  var social_block_stories_exports = {};
  __export(social_block_stories_exports, {
    default: () => social_block_stories_default
  });
  var social_block_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Social Block"\ndescription = "Social Block description"\nicon = "emoji_people"\ntags = ["text"]\n\n[defaults]\n\ntext = "Share:"\nlink_content = "Apply Now"\nlink_url = "http://cloudcannon.com"\nopen_in_new_tab = false\nfull_width = false\n\n[defaults.social_sharing--multi-select] # Multi select of key = value\nfacebook = "facebook"\nlinkedin = "linkedin"\ntwitter = "twitter"\nemail = "email"\n\n[standard]\n\n[full_width]\nfull_width = true';

  // ../../../CC/cc-marketing/packages/component-library/components/spacing/spacing.stories.toml
  var spacing_stories_exports = {};
  __export(spacing_stories_exports, {
    default: () => spacing_stories_default
  });
  var spacing_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel = "Spacing"\ndescription = "Spacing description"\nicon = "border_horizontal"\ntags = ["spacing"]\n\n[defaults]\nmobile_unit_number = 3\ntablet_unit_number = 3\nlaptop_unit_number = 3\n\n[standard]\n\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/stats-blocks/stats-blocks.stories.toml
  var stats_blocks_stories_exports = {};
  __export(stats_blocks_stories_exports, {
    default: () => stats_blocks_stories_default
  });
  var stats_blocks_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel = "Stats Block"\ndescription = "Stats Block description"\nicon = "emoji_people"\ntags = ["text"]\n\n[defaults]\n\n[defaults.stats--repeat]\ntitle = "4000"\nimage_path = "thing"\nimage_alt = "I am a thing"\ndescription = "doggos loved"\n\n[defaults.column--select]\n3 = "3"\n4 = "4"\n5 = "5"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/table/table.stories.toml
  var table_stories_exports2 = {};
  __export(table_stories_exports2, {
    default: () => table_stories_default2
  });
  var table_stories_default2 = `[meta]
array_structures = ["content_blocks", "doc_blocks"]
label="Table"
description="Table description"
icon="table_chart"
tags=["text"]

[defaults]

caption = "Description for table" # Important for A11y
table_headings = ["Method", "HTTP request", "Description"]
show_table_headings = true

[defaults.table_rows--repeat]
row = ["create","POST /userId/ setting forwardAddresses", "Creates a forwarding address. If ownership verification is required, a message will be sent to the recipient and the resource\u2019s verification status will be set to pending; otherwise, the resource will be created with verification status set <a href='thing'> to accepted</a>.This method is only available to service account clients that have been delegated domain-wide authority."]

[standard]



`;

  // ../../../CC/cc-marketing/packages/component-library/components/tag/tag.stories.toml
  var tag_stories_exports = {};
  __export(tag_stories_exports, {
    default: () => tag_stories_default
  });
  var tag_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Tag"\ndescription = "Tag description"\nicon = "local_offer"\ntags = ["text", "interactive"]\n\n[defaults]\ndisabled = false\ncontent = "I am some content"\nis_link = true\nlink_url = "/blog/"\n\n[defaults.style--select]\ndefault = "default"\nsecondary = "secondary"\nkeyword = "keyword"\nlabel = "label"\n\n[standard]\n\n[disabled]\ndisabled = true\n\n\n';

  // ../../../CC/cc-marketing/packages/component-library/components/testimonial/testimonial.stories.toml
  var testimonial_stories_exports = {};
  __export(testimonial_stories_exports, {
    default: () => testimonial_stories_default
  });
  var testimonial_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Testimonial"\ndescription = "Testimonial description"\nicon = "format_quote"\ntags = ["text"]\n\n[defaults]\n\nimage_path = "/assets/testimonial.svg"\nimage_alt = "I am an alt text"\nquote = "With CloudCannon, I give developers access to the code while keeping the visual editor for marketers"\n\nlink_url = "http://readmore.com"\nlink_content = "Read more"\n\nauthor = "Sam Harnack"\nsupporting_text = "Developer"\n\nlogo_path = ""\nlogo_alt = ""\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/text/text.stories.toml
  var text_stories_exports = {};
  __export(text_stories_exports, {
    default: () => text_stories_default
  });
  var text_stories_default = '[meta]\narray_structures = ["content_blocks", "doc_blocks"]\nlabel="Text"\ndescription="Text description"\nicon="article"\ntags=["text"]\n\n[defaults]\n\ncontent_markdown = "Doggo ipsum shibe corgo maximum borkdrive very hand that feed shibe many pats, boof tungg. Long doggo heckin angery woofer lotsa pats doggo puggorino, boofers smol. noodle horse long doggo you are doin me a concern. Borkf ruff maximum borkdrive snoot super chub tungg, vvv borkf mlem such treat big ol boof, noodle horse length boy smol borking doggo with a long snoot for pats pupper. Doggo porgo heckin good boys and girls mlem blop wow very biscit very good spot, length boy doggo mlem boof. Bork borkdrive heckin angery woofer fluffer wow very biscit, aqua doggo length boy snoot boof, clouds such treat puggo. Puggorino bork blep bork dat tungg tho, such treat heckin good boys. Dat tungg tho shooberino porgo sub woofer maximum borkdrive h*ck doing me a frighten, yapper very jealous pupper super chub borkdrive h*ck. Fat boi long bois ur givin me a spook boofers heck long water shoob very hand that feed shibe you are doing me the shock, pupper sub woofer ur givin me a spook vvv many pats. Boof you are doing me the shock stop it fren boof what a nice floof noodle horse porgo, heck fat boi aqua doggo heckin good boys. Pats doing me a frighten heckin good boys I am bekom fat puggorino, very hand that feed shibe wow very biscit. Very hand that feed shibe noodle horse fluffer heckin good boys dat tungg tho big ol pupper, you are doing me the shock yapper heckin good boys. Sub woofer very jealous pupper heckin wow such tempt, aqua doggo bork. mlem the neighborhood pupper corgo. You are doing me a frighten many pats wow very biscit, h*ck. He made many woofs heckin good boys borkf super chub boofers borking doggo aqua doggo, boofers he made many woofs doggorino dat tungg tho much ruin diet borkdrive, long water shoob borkf dat tungg tho boofers vvv. Long woofer blop much ruin diet, doggo."\n\n[defaults.col--select]\n1 = "1"\n2 = "2"\n\n[standard]\n';

  // ../../../CC/cc-marketing/packages/component-library/components/themed-headline/themed-headline.stories.toml
  var themed_headline_stories_exports = {};
  __export(themed_headline_stories_exports, {
    default: () => themed_headline_stories_default
  });
  var themed_headline_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel = "Themed headline"\ndescription = "Themed headline description"\nicon = "title"\ntags = ["text","heading"]\n\n[defaults]\nimage_path = "/assets/community.png"\nimage_alt = "I am an alt text"\nheading = "CloudCannon Blog"\ntext = "We\u2019re here to help with free tips, resources and inspiration to help you build sites the Jamstack way. "\n\ncta_url = "http://app.cloudcannon.com/register"\ncta_link_text = "Join us"\ncta_description_markdown = "Become a part of the community free of charge, and get the latest news in the biz."';

  // ../../../CC/cc-marketing/packages/component-library/components/toggle/toggle.stories.toml
  var toggle_stories_exports = {};
  __export(toggle_stories_exports, {
    default: () => toggle_stories_default
  });
  var toggle_stories_default = '[meta]\narray_structures = ["content_blocks"]\nlabel="Toggle"\ndescription="Toggle description"\nicon="toggle_on"\ntags=["interactive"]\n\n[defaults]\nid = "1" # Needs to be a unique ID\nlabel = "Toggle billing cycle payment options" # Needed for A11y to describe the toggle\nleft_text = "BILLED MONTHLY"\nleft_subtext = ""\nstore = "pricing"\n\nright_text = "BILLED ANNUALLY"\nright_subtext = "(Save 12%)"\ndisabled = false\n\n[standard]\n\n\n\n';

  // import-glob:./../../../CC/cc-marketing/packages/component-library/components/**/*.stories.toml
  var modules2 = [accordion_stories_exports, card_stories_exports, group_stories_exports, archive_card_stories_exports, card_stories_exports2, group_stories_exports2, br_stories_exports, button_stories_exports, category_card_stories_exports, code_block_copy_button_stories_exports, code_block_stories_exports, coloured_cards_stories_exports, contact_cta_stories_exports, contact_form_stories_exports, content_grid_stories_exports, cta_stories_exports, data_reference_stories_exports, docs_image_stories_exports, docs_tabs_stories_exports, editor_input_docs_stories_exports, employee_frame_stories_exports, heading_and_text_stories_exports, heading_with_link_stories_exports, hero_stories_exports, hidden_h1_stories_exports, image_container_stories_exports, image_tab_stories_exports, group_stories_exports3, item_stories_exports, info_bar_stories_exports, info_box_stories_exports, input_stories_exports, job_advert_title_stories_exports, job_perk_block_stories_exports, job_perks_container_stories_exports, table_stories_exports, left_right_block_stories_exports, left_right_list_block_stories_exports, left_right_quote_stories_exports, lesson_card_stories_exports, lesson_stepper_stories_exports, card_stories_exports3, group_stories_exports4, link_stories_exports, list_stories_exports, logo_ticker_stories_exports, mailing_list_cta_stories_exports, mark_as_completed_stories_exports, notice_stories_exports, prev_next_block_stories_exports, prev_next_button_stories_exports, pricing_table_stories_exports, block_stories_exports, group_stories_exports5, card_stories_exports4, group_stories_exports6, search_result_stories_exports, search_stories_exports, show_all_header_stories_exports, social_block_stories_exports, spacing_stories_exports, stats_blocks_stories_exports, table_stories_exports2, tag_stories_exports, testimonial_stories_exports, text_stories_exports, themed_headline_stories_exports, toggle_stories_exports];
  var stories_default = modules2;
  var filenames2 = ["./../../../CC/cc-marketing/packages/component-library/components/accordion/accordion.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/address/card/card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/address/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/archive-card/archive-card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/blog/card/card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/blog/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/br/br.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/button/button.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/category-card/category-card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/code-block-copy-button/code-block-copy-button.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/code-block/code-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/coloured-cards/coloured-cards.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/contact-cta/contact-cta.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/contact-form/contact-form.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/content-grid/content-grid.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/cta/cta.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/data-reference/data-reference.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/docs-image/docs-image.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/docs-tabs/docs-tabs.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/editor-input-docs/editor-input-docs.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/employee-frame/employee-frame.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/heading-and-text/heading-and-text.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/heading-with-link/heading-with-link.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/hero/hero.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/hidden-h1/hidden-h1.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/image-container/image-container.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/image-tab/image-tab.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/image-text-stepper/item/item.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/info-bar/info-bar.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/info-box/info-box.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/input/input.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/job-advert-title/job-advert-title.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perk-block/job-perk-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/job-perks-container/job-perks-container.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/job-listing/table/table.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/left-right-block/left-right-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/left-right-list-block/left-right-list-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/left-right-quote/left-right-quote.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/lesson-card/lesson-card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/lesson-stepper/lesson-stepper.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/link-with-image/card/card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/link-with-image/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/link/link.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/list/list.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/logo-ticker/logo-ticker.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/mailing-list-cta/mailing-list-cta.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/mark-as-completed/mark-as-completed.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/notice/notice.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-block/prev-next-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/prev-next/prev-next-button/prev-next-button.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/pricing-table/pricing-table.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/pricing/block/block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/pricing/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/read-more/card/card.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/read-more/group/group.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/search-result/search-result.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/search/search.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/show-all-header/show-all-header.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/social-block/social-block.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/spacing/spacing.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/stats-blocks/stats-blocks.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/table/table.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/tag/tag.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/testimonial/testimonial.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/text/text.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/themed-headline/themed-headline.stories.toml", "./../../../CC/cc-marketing/packages/component-library/components/toggle/toggle.stories.toml"];

  // app.js
  console.log("hello there, bookshop is loading.");
  var {default: componentsArray, filenames: componentFilenames} = jekyll_exports;
  var {default: configsArray, filenames: configFilenames} = stories_exports;
  var components = {};
  componentFilenames?.forEach((filename, i) => {
    componentName = filename.split("components/")[1]?.replace(/\/[^\/]+$/, "");
    if (componentName) {
      components[componentName] = {
        source: componentsArray[i]?.default
      };
    }
  });
  configFilenames?.forEach((filename, i) => {
    componentName = filename.split("components/")[1]?.replace(/\/[^\/]+$/, "");
    if (componentName && components[componentName]) {
      components[componentName].config = configsArray[i]?.default;
    }
  });
  console.log(components);
  var renderSpot = document.querySelector("[data-bookshop-polymorph]");
  renderSpot.innerHTML = "";
  polymorph = new polymorph_default({
    target: renderSpot,
    props: {
      components
    }
  });
})();
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
