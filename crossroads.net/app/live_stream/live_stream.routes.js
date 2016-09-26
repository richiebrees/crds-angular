LiveStreamRouter.$inject = ['$httpProvider', '$stateProvider'];

export default function LiveStreamRouter($httpProvider, $stateProvider) {
  $httpProvider.defaults.useXDomain = true;

  $stateProvider
    .state('live-v1', {
      parent: 'screenWidth',
      url: '/live-v1',
      template: '<landing></landing>',
      data: {
        meta: {
          title: 'Live',
          description: ''
        }
      }
    })
  ;
}
