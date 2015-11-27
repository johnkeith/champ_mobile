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
          'User' : ['$state', '$stateParams', 'FitbitAuthService', 'LocalStorage',
            function($state, $stateParams, FitbitAuthService, LocalStorage){
              var savedUser = LocalStorage.get('FitbitUser');

              if(savedUser){
                return FitbitAuthService.refreshOrReturnUser(savedUser);
                return savedUser;
              } else if($stateParams.code){
                return FitbitAuthService.secondStepRequest($stateParams.code);
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

