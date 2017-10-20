'use strict';

angular.module('videogular.plugins.vimeo', [])
  .directive('vgVimeo', ['VG_STATES', function (VG_STATES) {
      return {
        restrict: 'A',
        require: '^videogular',
        link: function (scope, elem, attr, API) {
          var player, videoWidth, videoHeight, currentTime, duration, paused, volume;

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
            Object.defineProperties(API.mediaElement[0], {
                'currentTime': {
                  get: function () {
                    return currentTime;
                  },
                  set: function (value) {
                    currentTime = value;
                    player.vimeo('seekTo', value);
                  },
                  enumerable : true,
				  configurable: true
                },
                'duration': {
                  get: function () {
                    return duration;
                  },
                  enumerable : true,
				  configurable: true
                },
                'paused': {
                  get: function () {
                    return paused;
                  },
                  enumerable : true,
				  configurable: true
                },
                'videoWidth': {
                  get: function () {
                    return videoWidth;
                  },
                  enumerable : true,
				  configurable: true
                },
                'videoHeight': {
                  get: function () {
                    return videoHeight;
                  },
                  enumerable : true,
				  configurable: true
                },
                'volume': {
                  get: function () {
                    return volume;
                  },
                  set: function (value) {
                    volume = value;
                    player.vimeo('setVolume', value);
                  },
                  enumerable : true,
				  configurable: true
                }
              }
            );

            API.mediaElement[0].play = function () {
              player.vimeo('play');
            };
            API.mediaElement[0].pause = function () {
              player.vimeo('pause');
            };

            player
              .vimeo('getVolume', function (value) {
                volume = value;
                API.onVolumeChange();
              })
              .vimeo('getCurrentTime', function (value) {
                currentTime = value;
                updateMetadata();
              })
              .vimeo('getDuration', function (value) {
                duration = value;
                updateMetadata();
              });

              paused = true;
              updateTime();

              if (API.currentState !== VG_STATES.PLAY) {
                // Trigger canplay event
                var event = new CustomEvent("canplay");
                API.mediaElement[0].dispatchEvent(event);
              }
              else {
                  //AutoPlay
                  player.vimeo('play');
              }
          }

          function createVimeoIframe(id) {
            var iframe = document.createElement('iframe');
            iframe.src = '//player.vimeo.com/video/' + id + '?api=1&player_id=vimeoplayer';
            iframe.frameBorder = 0;
            iframe.scrolling = 'no';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            return angular.element(iframe);
          }

          function updateTime() {
              API.onUpdateTime({
                  target: API.mediaElement[0]
              });
          }

          function wirePlayer() {
            player
              .on('ready', function () {
                configurePlayer();
              })
              .on('play', function () {
                paused = false;
                var event = new CustomEvent('playing');
                API.mediaElement[0].dispatchEvent(event);
                API.setState(VG_STATES.PLAY);
              })
              .on('pause', function () {
                paused = true;
                var event = new CustomEvent('pause');
                API.mediaElement[0].dispatchEvent(event);
                API.setState(VG_STATES.PAUSE);
              })
              .on('finish', function () {
                API.onComplete();
              })
              .on('playProgress', function (event, data) {
                currentTime = data.seconds;
                duration = data.duration;
                updateTime();
              })
              .on('loadProgress', function (event, data) {
                  // Trigger onStartBuffering event
                  var event = new CustomEvent("waiting");
                  API.mediaElement[0].dispatchEvent(event);
              });
          }

          function onSourceChange(url) {
            if (!url) {
              if (player) {
                player.destroy();
              }
              return
            }
            var id = getVideoId(url);
            if (!id) {
              return;
            }
            player = createVimeoIframe(id);
            // Swap video element with Vimeo iFrame
            $(API.mediaElement[0]).replaceWith(player);
            wirePlayer(player);
          }

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