
LiveStreamRouter.$inject = ['$httpProvider', '$stateProvider'];

export default function LiveStreamRouter($httpProvider, $stateProvider) {
  $httpProvider.defaults.useXDomain = true;

  $stateProvider
    .state('live', {
      parent: 'screenWidth',
      url: '/live',
      template: '<landing></landing>',
      data: {
        meta: {
          title: 'Live',
          description: ''
        }
      },
      resolve: {
        preloadStreamStatus: StreamStatusService => StreamStatusService.presetStreamStatus()
      }
    })
    .state('livestream', {
      parent: 'noHeaderOrFooter',
      url: '/live/stream',
      template: '<stream></stream>',
      data: {
        meta: {
          title: 'Live',
          description: ''
        }
      },
      resolve: {
        preloadStreamStatus: StreamspotService => StreamspotService.checkBroadcasting()
      }
    })
    .state('livestream-videojs', {
      parent: 'noHeaderOrFooter',
      url: '/live/stream2',
      template: '<stream-videojs></stream-videojs>',
      data: {
        meta: {
          title: 'Live',
          description: ''
        }
      }
    })
  ;
}
