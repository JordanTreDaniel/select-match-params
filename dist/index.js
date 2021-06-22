"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whichPath = exports.getMatchParams = exports.getCurrentPath = exports.configurePaths = void 0;

var _reselect = require("reselect");

var _connectedReactRouter = require("connected-react-router");

var _intersection = _interopRequireDefault(require("lodash/intersection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var paths = {};

var configurePaths = function configurePaths(pathsByKey) {
  paths = pathsByKey;
};

exports.configurePaths = configurePaths;

var getCurrentPath = function getCurrentPath(state) {
  var pathname = state.router.location.pathname;
  return pathname;
};

exports.getCurrentPath = getCurrentPath;
var getMatchParams = (0, _reselect.createSelector)(getCurrentPath, function (state) {
  return state;
}, function (currentPath, state) {
  var routePattern = whichPath(currentPath);
  var match = (0, _connectedReactRouter.createMatchSelector)(routePattern)(state);
  return match && match.params || {};
}); // whichPath - Takes the current location path, and matches it to a route pattern
// NOTE - I'm positive this algorithm could be improved

exports.getMatchParams = getMatchParams;

var whichPath = function whichPath(path) {
  var splitPath = path.split('/').filter(function (s) {
    return s.length;
  });
  var routePatterns = Object.values(paths);
  var results = {};
  routePatterns.forEach(function (pattern) {
    var paramSlots = (pattern.match(/:/g) || []).length;
    var splitPattern = pattern.split('/').filter(function (s) {
      return s.length;
    });
    var variations = 0; //A variation is when the path contains a string the pattern does not.
    //We can only allow this as many times as there are variables within the pattern.

    splitPath.forEach(function (pieceOfPath) {
      var m = pattern.match(pieceOfPath);

      if (!m) {
        variations++;
      }
    });
    results[pattern] = {
      intersection: (0, _intersection["default"])(splitPath, splitPattern).length,
      lengthDifference: Math.abs(splitPath.length - splitPattern.length),
      tooManyVariations: variations > paramSlots
    };
  });
  var chosenOne = {
    path: '',
    intersection: 0,
    lengthDifference: 0
  };
  Object.entries(results).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        pattern = _ref2[0],
        counts = _ref2[1];

    if (!counts.tooManyVariations && counts.intersection > chosenOne.intersection || counts.lengthDifference < chosenOne.lengthDifference) {
      chosenOne = _objectSpread({
        path: pattern
      }, counts);
    }
  });
  return chosenOne.path;
};

exports.whichPath = whichPath;