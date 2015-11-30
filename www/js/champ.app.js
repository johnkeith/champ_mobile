'use strict';

angular.module('champ', [
	'ionic',
	'ChampDirectives',
	'ChampServices',
  'ChampControllers',
	'LocalStorageService'
])
.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $ionicPlatform.on('resume', function(){
      var urlFromCallback = window.localStorage.getItem('load_from_safari');

      if(urlFromCallback){
        var reg = /\?code=(.*)/
        var code = reg.exec(urlFromCallback)[1];

        window.localStorage.removeItem('load_from_safari');

        $state.go('authenticated', { code: code });
      }
    });
  });
})
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){    
    $urlRouterProvider.otherwise('/authenticated');

    $stateProvider
      .state('unauthenticated', {
        url: '/unauthenticated', 
        templateUrl: 'templates/unauthenticated.html'
      })
      .state('authenticated', {
        url: "/authenticated?code",
        templateUrl: 'templates/authenticated.html',
        resolve: {
          'LifetimeStats' : ['FitbitDataService', 'LocalStorage',
            function(FitbitDataService, LocalStorage){
              var savedUser = LocalStorage.getObject('FitbitUser');

              return FitbitDataService.getLifetimeStats(savedUser.user_id, savedUser.access_token);
            }
          ],
          'User' : ['$state', '$stateParams', 'FitbitAuthService', 'LocalStorage', 'LifetimeStats',
            function($state, $stateParams, FitbitAuthService, LocalStorage, LifetimeStats){
              var savedUser = LocalStorage.getObject('FitbitUser');

              if($stateParams.code){
                return FitbitAuthService.secondStepRequest($stateParams.code);
              } else if(LifetimeStats.lifetime){
                return savedUser;
              } else if(LifetimeStats.success == false && savedUser.refresh_token){
                return FitbitAuthService.refreshTokenRequest(savedUser.refresh_token)
              } else {
                return null;
              }
            }
          ]
        },
        controller: 'AuthenticatedController'
      });
  }
]);

var handleOpenURL = function(url) {
  window.localStorage.setItem('load_from_safari', url);
};
