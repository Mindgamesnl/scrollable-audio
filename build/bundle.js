/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _libWebAudio = __webpack_require__(1);
	
	var _libWebAudio2 = _interopRequireDefault(_libWebAudio);
	
	var SectionSounds = (function () {
	    function SectionSounds() {
	        var _this = this;
	
	        _classCallCheck(this, SectionSounds);
	
	        this._bootTime = new Date();
	        // STRING url / Media
	        this._media = {};
	        // list of elements
	        this._elements = [];
	
	        window.onscroll = function () {
	            _this.update();
	        };
	    }
	
	    _createClass(SectionSounds, [{
	        key: "update",
	        value: function update() {
	            var _this2 = this;
	
	            var updatedSources = [];
	
	            for (var elementsKey in this._elements) {
	                if (this._isInViewport(this._elements[elementsKey])) {
	                    updatedSources.push(this._elements[elementsKey].dataset.saudio);
	                }
	            }
	
	            // remove old sounds
	
	            var _loop = function (source) {
	                if (!updatedSources.includes(source)) {
	                    _this2._media[source].setVolume({
	                        volume: 0, fadeTime: 250, onfinish: function onfinish() {
	                            delete _this2._media[source];
	                        }
	                    });
	                }
	            };
	
	            for (var source in this._media) {
	                _loop(source);
	            }
	
	            // start new sounds
	            updatedSources.forEach(function (source) {
	                if (_this2._media[source] == null) {
	                    (function () {
	                        var audio = new _libWebAudio2["default"](source, function () {
	                            audio.setLooping(true);
	                            audio.play();
	                            audio.startDate();
	                            audio.setVolume({ volume: 0 });
	                            audio.setVolume({ volume: 100, fadeTime: 250 });
	                        }, _this2._bootTime);
	                        _this2._media[source] = audio;
	                    })();
	                } else if (_this2._media[source].isFading) {
	                    audio.setVolume({ volume: 100, fadeTime: 250 });
	                }
	            });
	        }
	    }, {
	        key: "registerElement",
	        value: function registerElement(element, source) {
	            element.dataset.saudio = source;
	            this._elements.push(element);
	        }
	    }, {
	        key: "_isInViewport",
	        value: function _isInViewport(elem) {
	            var bounding = elem.getBoundingClientRect();
	            return bounding.top >= 0 && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
	        }
	    }]);
	
	    return SectionSounds;
	})();
	
	window.SectionSounds = SectionSounds;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var WebAudio = (function () {
	  function WebAudio(source, onready, startDate) {
	    _classCallCheck(this, WebAudio);
	
	    this._source = source;
	
	    //audio meta data
	    this.meta = {};
	    this.task = 0;
	    this.onFinishHandlers = [];
	    this.isPlayable = false;
	    this.isFading = false;
	    this.isFirstRun = true;
	    this.volume = 100;
	    this.flag = "DEFAULT";
	    this._onFadeFinish = null;
	    this._distance = -1;
	    this._startDate = startDate;
	    this._maxDistance = -1;
	
	    //reference
	    var that = this;
	
	    //create audio element
	    this.soundElement = document.createElement("audio");
	
	    //set source
	    this.soundElement.src = this._source;
	
	    //set attributes
	    this.soundElement.setAttribute("preload", "auto");
	    this.soundElement.setAttribute("controls", "none");
	    this.soundElement.setAttribute("display", "none");
	
	    //register events
	    this.soundElement.oncanplay = function () {
	      that.isPlayable = true;
	      that.isLoading = true;
	      if (that.isFirstRun) {
	        that.isFirstRun = false;
	        if (onready != null) onready();
	      }
	    };
	
	    this.soundElement.oncanplaythrough = function () {
	      that.isLoading = false;
	    };
	
	    this.soundElement.onended = function () {
	      that.isPlayable = true;
	      that.onFinishHandlers.forEach(function (callback) {
	        return callback();
	      });
	    };
	
	    this.soundElement.onloadstart = function () {
	      that.isLoading = true;
	    };
	
	    this.soundElement.ontimeupdate = function () {
	      if (that.soundElement != null) that.time = that.soundElement.currentTime;
	    };
	  }
	
	  _createClass(WebAudio, [{
	    key: "setTime",
	    value: function setTime(target) {
	      this.soundElement.currentTime = target;
	    }
	  }, {
	    key: "getTime",
	    value: function getTime() {
	      return this.soundElement.currentTime;
	    }
	  }, {
	    key: "setMasterVolume",
	    value: function setMasterVolume(masterVolume) {
	      if (this.isFading) {
	        clearInterval(this.task);
	        this._executeOnFinish();
	      }
	      this.setVolume({ volume: masterVolume });
	    }
	  }, {
	    key: "onFinish",
	    value: function onFinish(callback) {
	      this.onFinishHandlers.push(callback);
	    }
	  }, {
	    key: "_executeOnFinish",
	    value: function _executeOnFinish() {
	      if (this._onFadeFinish != null) this._onFadeFinish();
	      this._onFadeFinish = null;
	    }
	  }, {
	    key: "setVolume",
	    value: function setVolume(_ref) {
	      var _this = this;
	
	      var volume = _ref.volume;
	      var fadeTime = _ref.fadeTime;
	      var onfinish = _ref.onfinish;
	
	      //calculate volume if it is a speaker
	      if (fadeTime == null) {
	        this.soundElement.volume = volume / 100;
	        return;
	      }
	      if (this.isFading) {
	        clearInterval(this.task);
	      }
	      this._onFadeFinish = onfinish;
	      var diff = volume - this.soundElement.volume * 100;
	      var steps = 0;
	
	      if (diff < 0) {
	        steps = Math.abs(diff);
	      } else {
	        steps = diff;
	      }
	
	      if (fadeTime == null) fadeTime = 0;
	
	      var interval = fadeTime / steps;
	      var that = this;
	      var callback = onfinish;
	      var stepsMade = 0;
	
	      this.isFading = true;
	      this.task = setInterval(function () {
	        stepsMade++;
	
	        var cancel = function cancel() {
	          that.isFading = false;
	          if (callback != null) callback();
	          clearInterval(that.task);
	          _this._onFadeFinish = null;
	        };
	
	        if (that.soundElement == null) {
	          cancel();
	          return;
	        }
	
	        if (steps < stepsMade) {
	          cancel();
	          return;
	        }
	
	        if (volume !== Math.floor(that.soundElement.volume * 100)) {
	          //check if it needs to be higher
	          if (diff > 0) {
	            var tVol = Math.ceil(that.soundElement.volume * 100 + 1) / 100;
	            if (tVol > 1 || tVol < 0) {
	              cancel();
	              return;
	            }
	            that.soundElement.volume = tVol;
	          } else if (diff < 0) {
	            var tVol = Math.floor(that.soundElement.volume * 100 - 1) / 100;
	            if (tVol > 1 || tVol < 0) {
	              cancel();
	              return;
	            }
	            that.soundElement.volume = tVol;
	          } else {
	            cancel();
	          }
	        } else {
	          cancel();
	        }
	      }, interval);
	    }
	  }, {
	    key: "startDate",
	    value: function startDate() {
	      var start = new Date();
	      var seconds = Math.abs((start.getTime() - this._startDate.getTime()) / 1000);
	      var length = this.soundElement.duration;
	      if (seconds > length) {
	        //how many times it would have played
	        var times = Math.floor(seconds / length);
	        //remove other repetitions from time
	        seconds = seconds - times * length;
	      }
	      this.setTime(seconds);
	    }
	  }, {
	    key: "pause",
	    value: function pause() {
	      this.soundElement.pause();
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      this.pause();
	      this.soundElement.remove();
	      this.soundElement = null;
	    }
	  }, {
	    key: "play",
	    value: function play() {
	      if (!this.isPlayable) {
	        console.error("Media could not start.");
	        return;
	      }
	      this.soundElement.play();
	    }
	  }, {
	    key: "setSpeakerData",
	    value: function setSpeakerData(maxDistance, distance) {
	      this._maxDistance = maxDistance;
	      this._distance = distance;
	    }
	  }, {
	    key: "updateDistance",
	    value: function updateDistance(distance) {
	      this._distance = distance;
	    }
	  }, {
	    key: "setFlag",
	    value: function setFlag(flag) {
	      this.flag = flag;
	    }
	  }, {
	    key: "getFlag",
	    value: function getFlag() {
	      return this.flag;
	    }
	  }, {
	    key: "setLooping",
	    value: function setLooping(state) {
	      this.soundElement.loop = state;
	    }
	  }]);
	
	  return WebAudio;
	})();
	
	exports["default"] = WebAudio;
	module.exports = exports["default"];

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map