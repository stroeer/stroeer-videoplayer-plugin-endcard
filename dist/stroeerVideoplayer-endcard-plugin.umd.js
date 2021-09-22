(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StroeerVideoplayerEndcardPlugin = factory());
}(this, (function () { 'use strict';

    var noop = function () {
        return false;
    };

    var debugMode = false;
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        if (window.localStorage.getItem('StroeerVideoplayerDebugMode') !== null) {
            debugMode = true;
        }
    }
    var logger = {
        log: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (debugMode) {
                console.log.apply(console, args);
            }
        }
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    // https://www.carlrippon.com/fetch-with-async-await-and-typescript/
    function fetchAPI(request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, body, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(request)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: " + response.status);
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        logger.log('Something went wrong with fetching api!', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, body];
                }
            });
        });
    }
    var transformData = function (data, keyMap) {
        var _loop_1 = function (newKey, oldKey) {
            data.forEach(function (item) {
                if (!item[oldKey])
                    return;
                item[newKey] = item[oldKey];
            });
        };
        for (var _i = 0, _a = Object.entries(keyMap); _i < _a.length; _i++) {
            var _b = _a[_i], newKey = _b[0], oldKey = _b[1];
            _loop_1(newKey, oldKey);
        }
        return data;
    };

    var getTile = function (index, obj, revolverplayTime) {
        var template = "\n    <style>\n      .plugin-endcard-tile-" + index + " .plugin-endcard-thumbnail {\n        background-image: url(" + obj.image_small + ");\n      }\n\n      @media only screen and (min-width: 769px) {\n        .plugin-endcard-tile-" + index + " .plugin-endcard-thumbnail {\n          background-image: url(" + (index === 0 ? obj.image_large : obj.image_medium) + ");\n        }\n      }\n    </style>\n    <div class=\"plugin-endcard-tile plugin-endcard-tile-" + index + "\" data-idx=\"" + index + "\" data-role=\"plugin-endcard-tile\">\n      " + (index === 0 && revolverplayTime !== 0
            ? '<button class="plugin-endcard-button-pause" data-role="plugin-endcard-pause">Anhalten</button>'
            : '') + "  \n      <div class=\"plugin-endcard-thumbnail\"></div>\n      <div class=\"plugin-endcard-overlay\">\n        " + (index === 0
            ? "\n          <svg class=\"plugin-endcard-revolverplay-icon\" data-role=\"plugin-endcard-revolverplay-icon\" width=\"103\" height=\"75\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <g filter=\"url(#filter0_d)\">\n              <path d=\"M62.073 37.89l-20-13.333A1.334 1.334 0 0040 25.667v26.666a1.334 1.334 0 002.073 1.11l20-13.334a1.335 1.335 0 000-2.218z\" fill=\"#fff\"/>\n            </g>\n            " + (revolverplayTime !== 0
                ? "\n              <circle class=\"plugin-endcard-progress-meter\" cx=\"48\" cy=\"39\" r=\"30.667\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.667\"/>\n              <circle class=\"plugin-endcard-progress-value\" data-role=\"plugin-endcard-progress-value\" cx=\"48\" cy=\"39\" r=\"30.667\" transform=\"rotate(-90 48 39)\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.667\" stroke-dasharray=\"192.686\" stroke-dashoffset=\"192.686\" />\n            "
                : '') + "\n            <defs>\n              <filter id=\"filter0_d\" x=\"-5.333\" y=\"-1\" width=\"112\" height=\"112\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n                <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n                <feColorMatrix in=\"SourceAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/>\n                <feOffset dy=\"16\"/><feGaussianBlur stdDeviation=\"20\"/>\n                <feColorMatrix values=\"0 0 0 0 0.490196 0 0 0 0 0.596078 0 0 0 0 0.698039 0 0 0 0.2 0\"/>\n                <feBlend mode=\"multiply\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"/>\n                <feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"/>\n              </filter>\n            </defs>\n          </svg> \n        "
            : "\n        <svg class=\"plugin-endcard-play-icon\" width=\"22\" height=\"29\" viewBox=\"0 0 17 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n          <path d=\"M16.555 10.168L1.555 0.168C1.248 -0.0359995 0.853 -0.0559995 0.529 0.118001C0.203 0.292001 0 0.631001 0 1V21C0 21.369 0.203 21.708 0.528 21.882C0.676 21.961 0.838 22 1 22C1.194 22 1.388 21.943 1.555 21.832L16.555 11.832C16.833 11.646 17 11.334 17 11C17 10.666 16.833 10.354 16.555 10.168Z\" fill=\"white\"/>\n        </svg>\n        ") + "\n        <p class=\"plugin-endcard-title\">\n          " + (index === 0 ? '<span class="plugin-endcard-title-pre">Nächstes Video</span>' : '') + "\n          " + obj.title + "\n        </p>\n      </div>\n    </div>\n\n  ";
        return template;
    };
    var getTileReplay = function (imageUrl, classes) {
        if (classes === void 0) { classes = ''; }
        var template = "\n    <div class=\"plugin-endcard-tile-replay " + classes + "\" data-role=\"plugin-endcard-tile-replay\">\n      <div class=\"plugin-endcard-thumbnail\" style=\"background-image: url(" + imageUrl + ");\"></div>\n      <div class=\"plugin-endcard-overlay\">\n        <svg class=\"plugin-endcard-replay-icon\" width=\"26\" height=\"21\" viewBox=\"0 0 20 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n          <path d=\"M19 16H1C0.447715 16 0 15.5523 0 15V10C0 9.44772 0.447715 9 1 9C1.55228 9 2 9.44772 2 10V14H18V5H8V8L3 4L8 0V3H19C19.553 3 20 3.447 20 4V15C20 15.553 19.553 16 19 16Z\" fill=\"white\"/>\n        </svg>\n        <p class=\"plugin-endcard-replay-title\">Video wiederholen</p>\n      </div>\n    </div>\n  ";
        return template;
    };

    var getCircleProgress = function (value) {
        var radius = 30.667; // this is radius value of svg circle
        var circumference = 2 * Math.PI * radius;
        var p = value / 100;
        var dashOffset = circumference * (1 - p);
        return dashOffset;
    };
    var updateCircleStyle = function (el, value) {
        el.style.strokeDashoffset = String(value);
    };
    var ticker = function (time, remainingTime, el, cb) {
        var value = ((time - remainingTime) / time) * 100;
        updateCircleStyle(el, getCircleProgress(value));
        if (remainingTime < 0) {
            cb();
        }
    };

    var EndcardPlugin = /** @class */ (function () {
        function EndcardPlugin(stroeervideoplayer, opts) {
            var _this = this;
            if (opts === void 0) { opts = {}; }
            this.getEndcardUrl = function () {
                var url = _this.videoElement.dataset.endcardUrl;
                return url !== undefined ? url : '';
            };
            this.setEndcardUrl = function (url) {
                _this.videoElement.dataset.endcardUrl = url;
            };
            this.reset = function () {
                _this.clearRevolverplayTimer();
                _this.removeClickEvents();
                _this.endcardContainer.innerHTML = '';
                _this.hide();
            };
            this.revolverplay = function () {
                if (_this.revolverplayTime === 0 || _this.showFallback)
                    return;
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                var progressSvgCircle = _this.endcardContainer.querySelector('[data-role="plugin-endcard-progress-value"]');
                var remainingTime = _this.revolverplayTime;
                var revolverplayTicker = function () {
                    ticker(_this.revolverplayTime, remainingTime, progressSvgCircle, function () {
                        _this.play(0, true);
                        _this.onRevolverplayCallback();
                    });
                    remainingTime--;
                };
                revolverplayTicker();
                _this.intervalTicker = setInterval(revolverplayTicker, 1000);
            };
            this.clearRevolverplayTimer = function () {
                if (_this.intervalTicker !== null) {
                    clearInterval(_this.intervalTicker);
                }
            };
            this.replay = function () {
                _this.videoplayer.play();
            };
            this.play = function (idx, autoplay) {
                _this.setEndcardUrl(_this.transformedData[idx].endpoint);
                _this.videoplayer.replaceAndPlay(_this.transformedData[idx], autoplay);
            };
            this.clickToPlay = function (e) {
                e.preventDefault();
                var el = e.target.closest('[data-role="plugin-endcard-tile"]');
                var idx = el !== null ? el.getAttribute('data-idx') : null;
                if (idx === null)
                    return;
                _this.play(parseInt(idx), false);
                _this.onClickToPlayCallback();
            };
            this.clickToReplay = function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.replay();
                _this.onClickToReplayCallback();
            };
            this.clickToPause = function (e) {
                var circles = _this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-revolverplay-icon"] circle');
                var target = e.currentTarget;
                e.preventDefault();
                e.stopPropagation();
                _this.onRevolverplayPauseCallback();
                _this.clearRevolverplayTimer();
                if (target !== null) {
                    target.remove();
                }
                circles.forEach(function (circle) {
                    circle.remove();
                });
            };
            this.addClickEvents = function () {
                var tiles = _this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]');
                var pauseButton = _this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]');
                var replayTile = _this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]');
                tiles.forEach(function (tile) {
                    tile.addEventListener('click', _this.clickToPlay);
                });
                if (replayTile !== null) {
                    replayTile.addEventListener('click', _this.clickToReplay);
                }
                if (pauseButton !== null) {
                    pauseButton.addEventListener('click', _this.clickToPause);
                }
            };
            this.removeClickEvents = function () {
                var tiles = _this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]');
                var pauseButton = _this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]');
                var replayTile = _this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]');
                tiles.forEach(function (tile) {
                    tile.removeEventListener('click', _this.clickToPlay);
                });
                if (replayTile !== null) {
                    replayTile.removeEventListener('click', _this.clickToReplay);
                }
                if (pauseButton !== null) {
                    pauseButton.removeEventListener('click', _this.clickToPause);
                }
            };
            this.renderFallback = function () {
                var replayTemplate = getTileReplay(_this.videoplayer.getPosterImage(), 'plugin-endcard-tile-single');
                _this.endcardContainer.innerHTML += replayTemplate;
            };
            this.render = function () {
                var endpoint = _this.getEndcardUrl();
                if (endpoint === null || _this.showFallback) {
                    _this.showFallback = true;
                    _this.renderFallback();
                    return;
                }
                fetchAPI(endpoint)
                    .then(function (data) {
                    _this.transformedData = transformData(data, _this.dataKeyMap);
                    logger.log(_this.transformedData);
                    for (var i = 0; i < 5; i++) {
                        var tileTemplate = getTile(i, _this.transformedData[i], _this.revolverplayTime);
                        var replayTemplate = getTileReplay(_this.videoplayer.getPosterImage());
                        if (i === 3) {
                            _this.endcardContainer.innerHTML += replayTemplate;
                        }
                        _this.endcardContainer.innerHTML += tileTemplate;
                    }
                })
                    .catch(function (err) {
                    logger.log('Something went wrong with fetching api!', err);
                    _this.showFallback = true;
                    _this.renderFallback();
                });
            };
            this.hide = function () {
                if (_this.uiEl.classList.contains('plugin-endcard-ui-small')) {
                    _this.uiEl.classList.remove('plugin-endcard-ui-small');
                }
                _this.endcardContainer.classList.add('hidden');
            };
            this.show = function () {
                _this.uiEl.classList.add('plugin-endcard-ui-small');
                if (typeof _this.videoplayer.exitFullscreen === 'function') {
                    _this.videoplayer.exitFullscreen();
                }
                _this.endcardContainer.classList.remove('hidden');
                _this.onLoadedCallback();
            };
            this.videoplayer = stroeervideoplayer;
            this.videoElement = stroeervideoplayer.getVideoEl();
            this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop;
            this.transformedData = [];
            this.showFallback = opts.showFallback !== undefined ? opts.showFallback : false;
            this.revolverplayTime = opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5;
            this.intervalTicker = null;
            this.onLoadedCallback = opts.onLoadedCallback !== undefined ? opts.onLoadedCallback : noop;
            this.onClickToPlayCallback = opts.onClickToPlayCallback !== undefined ? opts.onClickToPlayCallback : noop;
            this.onClickToReplayCallback = opts.onClickToReplayCallback !== undefined ? opts.onClickToReplayCallback : noop;
            this.onRevolverplayCallback = opts.onRevolverplayCallback !== undefined ? opts.onRevolverplayCallback : noop;
            this.onRevolverplayPauseCallback = opts.onRevolverplayPauseCallback !== undefined ? opts.onRevolverplayPauseCallback : noop;
            this.uiEl = stroeervideoplayer.getUIEl();
            this.endcardContainer = document.createElement('div');
            this.endcardContainer.classList.add('plugin-endcard-container', 'hidden');
            this.videoElement.after(this.endcardContainer);
            return this;
        }
        return EndcardPlugin;
    }());

    var version = "0.11.0";

    var endcardPlugin;
    var onVideoElPlay = function (e) {
        endcardPlugin.reset();
        if (e.target !== null)
            e.target.removeEventListener('play', onVideoElPlay);
    };
    var onVideoElFirstQuartile = function () {
        endcardPlugin.render();
    };
    var onVideoElEnd = function (e) {
        if (e.target !== null)
            e.target.addEventListener('play', onVideoElPlay);
        endcardPlugin.addClickEvents();
        endcardPlugin.show();
        endcardPlugin.revolverplay();
    };
    var plugin = {
        pluginName: 'Endcard',
        init: function (stroeervideoplayer, opts) {
            if (opts === void 0) { opts = {}; }
            logger.log('opts', opts);
            var videoEl = stroeervideoplayer.getVideoEl();
            endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts);
            videoEl.addEventListener('contentVideoFirstQuartile', onVideoElFirstQuartile);
            videoEl.addEventListener('contentVideoEnded', onVideoElEnd);
        },
        deinit: function (stroeervideoplayer) {
            var videoEl = stroeervideoplayer.getVideoEl();
            var endcardContainer = stroeervideoplayer.getRootEl().querySelector('.plugin-endcard-container');
            if (endcardContainer !== undefined) {
                videoEl.removeEventListener('contentVideoFirstQuartile', onVideoElFirstQuartile);
                videoEl.removeEventListener('contentVideoEnded', onVideoElEnd);
                endcardPlugin.reset();
                endcardContainer.remove();
            }
        },
        version: version
    };

    return plugin;

})));
//# sourceMappingURL=stroeerVideoplayer-endcard-plugin.umd.js.map
