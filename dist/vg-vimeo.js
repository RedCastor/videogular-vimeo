/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/******/ (function(modules) { // webpackBootstrap
	    /******/ 	// The module cache
	    /******/ 	var installedModules = {};

	    /******/ 	// The require function
	    /******/ 	function __webpack_require__(moduleId) {

	        /******/ 		// Check if module is in cache
	        /******/ 		if(installedModules[moduleId])
	        /******/ 			return installedModules[moduleId].exports;

	        /******/ 		// Create a new module (and put it into the cache)
	        /******/ 		var module = installedModules[moduleId] = {
	            /******/ 			exports: {},
	            /******/ 			id: moduleId,
	            /******/ 			loaded: false
	            /******/ 		};

	        /******/ 		// Execute the module function
	        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	        /******/ 		// Flag the module as loaded
	        /******/ 		module.loaded = true;

	        /******/ 		// Return the exports of the module
	        /******/ 		return module.exports;
	        /******/ 	}


	    /******/ 	// expose the modules object (__webpack_modules__)
	    /******/ 	__webpack_require__.m = modules;

	    /******/ 	// expose the module cache
	    /******/ 	__webpack_require__.c = installedModules;

	    /******/ 	// __webpack_public_path__
	    /******/ 	__webpack_require__.p = "";

	    /******/ 	// Load entry module and return exports
	    /******/ 	return __webpack_require__(0);
	    /******/ })
	/************************************************************************/
	/******/ ([
	    /* 0 */
	    /***/ (function(module, exports) {

	        'use strict';

	        angular.module('videogular.plugins.vimeo', [])
	            .directive('vgVimeo', ['VG_STATES', function (VG_STATES) {
	                    return {
	                        restrict: 'A',
	                        require: '^videogular',
	                        link: function (scope, elem, attr, API) {
	                            var player;
	                            var videoWidth;
	                            var videoHeight;
	                            var currentTime = 0;
	                            var duration = 0;
	                            var paused = true;
	                            var volume = 0;
	                            var fullscreen = (angular.isDefined(attr.vgVimeoFullscreen)) ? attr.vgVimeoFullscreen : 'true';

	                            var updateTime = function () {
	                                API.onUpdateTime({
	                                    target: API.mediaElement[0]
	                                });
	                            };

	                            var onPlay = function () {

	                                paused = false;
	                                var event = new CustomEvent('playing');
	                                API.mediaElement[0].dispatchEvent(event);
	                                API.setState(VG_STATES.PLAY);
	                            };

	                            var onPause = function onPause() {

	                                paused = true;
	                                var event = new CustomEvent('pause');
	                                API.mediaElement[0].dispatchEvent(event);
	                                API.setState(VG_STATES.PAUSE);
	                            };

	                            var onEnded = function () {

	                                API.onComplete();
	                            };

	                            var onTimeupdate = function (data) {

	                                currentTime = data.seconds;
	                                duration = data.duration;
	                                updateTime();
	                            };

	                            var onProgress = function (data) {

	                                // Trigger onStartBuffering event
	                                var event = new CustomEvent("waiting");
	                                API.mediaElement[0].dispatchEvent(event);
	                            };


	                            function getVideoId(url) {
	                                var vimeoUrlRegExp = /^.+vimeo.com\/(.*\/)?([^#\?]*)/;
	                                var m = url.match(vimeoUrlRegExp);
	                                return m ? m[2] || m[1] : null;
	                            }

	                            function updateMetadata() {
	                                var event = new CustomEvent('loadedmetadata');
	                                API.mediaElement[0].dispatchEvent(event);
	                            }

	                            function configurePlayer() {
	                                Object.defineProperty(API.mediaElement[0], 'currentTime', {
	                                    get: function () {
	                                        return currentTime;
	                                    },
	                                    set: function (value) {
	                                        currentTime = value;
	                                        player.setCurrentTime(currentTime);
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                Object.defineProperty(API.mediaElement[0], 'duration', {
	                                    get: function () {
	                                        return duration;
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                Object.defineProperty(API.mediaElement[0], 'paused', {
	                                    get: function () {
	                                        return paused;
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                Object.defineProperty(API.mediaElement[0], 'videoWidth', {
	                                    get: function () {
	                                        return videoWidth;
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                Object.defineProperty(API.mediaElement[0], 'videoHeight', {
	                                    get: function () {
	                                        return videoHeight;
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                Object.defineProperty(API.mediaElement[0], 'volume', {
	                                    get: function () {
	                                        return volume;
	                                    },
	                                    set: function (value) {
	                                        volume = value;
	                                        player.setVolume(volume);
	                                    },
	                                    enumerable : true,
	                                    configurable: true
	                                });

	                                API.mediaElement[0].play = function () {
	                                    player.play();
	                                };
	                                API.mediaElement[0].pause = function () {
	                                    player.pause();
	                                };

	                                player.getVolume().then(function(value) {
	                                    volume = value;
	                                    API.onVolumeChange();
	                                });

	                                player.getCurrentTime().then(function(seconds) {
	                                    currentTime = seconds;
	                                    updateMetadata();
	                                });

	                                player.getDuration().then(function(value) {
	                                    duration = value;
	                                    updateMetadata();
	                                });

	                                updateTime();

	                                if (API.currentState !== VG_STATES.PLAY) {
	                                    // Trigger canplay event
	                                    var event = new CustomEvent("canplay");
	                                    API.mediaElement[0].dispatchEvent(event);
	                                }
	                                else {
	                                    //AutoPlay
	                                    player.play().then(function() {

	                                    });
	                                }
	                            }

	                            function createVimeoIframe(id) {

	                                if (player) {
	                                    var iframe = player.element;
	                                }
	                                else {
	                                    var iframe = document.createElement('iframe');
	                                    angular.element(API.mediaElement[0]).replaceWith(angular.element(iframe));
	                                }

	                                iframe.src = '//player.vimeo.com/video/' + id + '?player_id=vimeoplayer';
	                                iframe.frameBorder = 0;
	                                iframe.scrolling = 'no';
	                                iframe.style.width = '100%';
	                                iframe.style.height = '100%';

	                                if (scope.$eval(fullscreen)) {
	                                    iframe.setAttribute('webkitallowfullscreen', '');
	                                    iframe.setAttribute('mozallowfullscreen', '');
	                                    iframe.setAttribute('allowfullscreen', '');
	                                }

	                                angular.element(iframe.parentNode.parentNode).find('vg-overlay-play').css('height', 'calc(100% - 50px)');

	                                return new Vimeo.Player(iframe);
	                            }

	                            function onSourceChange(url) {

	                                if (!url) {
	                                    if (player) {
	                                        player.destroy();
	                                    }
	                                    return;
	                                }

	                                var id = getVideoId(url);
	                                if (!id) {
	                                    return;
	                                }

	                                player = createVimeoIframe(id);

	                                player.ready().then(function () {
	                                    configurePlayer();
	                                });

	                                player.on('play', onPlay);
	                                player.on('pause', onPause);
	                                player.on('ended', onEnded);
	                                player.on('timeupdate', onTimeupdate);
	                                player.on('progress', onProgress);
	                            }

	                            //Watching if source change.
	                            scope.$watch(function () {
	                                    return API.sources;
	                                },
	                                function (newVal, oldVal) {
	                                    if (newVal && newVal.length > 0 && newVal[0].src) {
	                                        onSourceChange(newVal[0].src.toString());
	                                    }
	                                    else {
	                                        onSourceChange(null);
	                                    }
	                                }
	                            );
	                        }
	                    };
	                }]
	            );

	        /***/ })
	    /******/ ]);


/***/ })
/******/ ]);