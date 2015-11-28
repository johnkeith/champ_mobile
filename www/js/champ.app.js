'use strict';

angular.module('champ', [
	'ionic',
	'ChampDirectives',
	'ChampServices',
  'ChampControllers',
	'LocalStorageService'
])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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
              // } else if(LifetimeStats.success == false && LifetimeStats.errors[0].errorType == 'invalid_grant' && savedUser.refresh_token){
              //   return FitbitAuthService.refreshTokenRequest(savedUser.refresh_token)
              // } else if(LifetimeStats.success == false && LifetimeStats.errors[0].errorType == 'invalid_token' && savedUser.refresh_token){
              //   return FitbitAuthService.refreshTokenRequest(savedUser.refresh_token)
              //   // FitbitAuthService.openFirstStepUriInBrowser();
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

