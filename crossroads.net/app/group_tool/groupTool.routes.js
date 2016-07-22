GroupToolRouter.$inject = ['$httpProvider', '$stateProvider'];

export default function GroupToolRouter($httpProvider, $stateProvider) {
  $httpProvider.defaults.useXDomain = true;

  //TODO: I think this is done globally, not needed here, I think the above needs to be done globally
  $httpProvider.defaults.headers.common['X-Use-The-Force'] = true;

  $stateProvider
    .state('grouptool', {
      parent: 'noSideBar',
      abstract: true,
    })
    .state('grouptool.mygroups', {
      parent: 'noSideBar',
      url: '/groups/mygroups',
      template: '<my-groups></my-groups>',
      data: {
        isProtected: true,
        meta: {
          title: 'My Groups',
          description: ''
        }
      }
    })
    .state('grouptool.create', {
      parent: 'noSideBar',
      url: '/groups/create',
      template: '<create-group></create-group>',
      resolve:{
        stateList: (CreateGroupService, GroupService) =>{
          return GroupService.getStates().then((data) => {
            CreateGroupService.statesLookup = data;
          })
        },
        profile: (CreateGroupService, GroupService) => {
          return GroupService.getProfileData().then((data) => {
            CreateGroupService.profileData = data;   
          })
        }
      },
      data: {
        isProtected: true,
        meta: {
          title: 'Create a Group',
          description: ''
        }
      }
    })
    .state('grouptool.create.preview', {
      url: '/groups/create/preview',
      parent: 'noSideBar',
      template: '<create-group-preview> </create-group-preview>',
      data: {
        isProtected: true,
        meta: {
          title: 'Preview a Group',
          description: ''
        }
      }
    })
    .state('grouptool.detail', {
      parent: 'noSideBar',
      url: '/groups/mygroups/detail/{groupId:int}',
      params: {
        groupId: {
          value: null,
          squash: true
        }
      },
      template: '<group-detail></group-detail>',
      data: {
        isProtected: true,
        meta: {
          title: 'Group Detail',
          description: ''
        }
      }
    })
    .state('grouptool.detail.about', {
      url: '/about',
      template: '<group-detail-about></group-detail-about>'
    })
    .state('grouptool.detail.participants', {
      url: '/participants',
      template: '<group-detail-participants></group-detail-participants>'
    })
    .state('grouptool.detail.requests', {
      url: '/requests',
      template: '<group-detail-requests></group-detail-requests>'
    });
}
