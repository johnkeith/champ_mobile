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
                return savedUser;
              } else if($stateParams.code){
                console.log('I am gonna request the other shit');
                return FitbitAuthService.secondStepRequest($stateParams.code);
              } else {
                console.log('I am gonna go somewhere else');
                return null;
              }
              // if User exists in the local storage
                // just load the damn page
              // else if ?code is attached to the url
                // run the fun ajax call
                // return that shit as the User object
                // save that shit into the local storage db
              // else 
                // go back to the unauthenticated page
            }
          ]
        },
        controller: 'AuthenticatedController'
      });
  }
]);

