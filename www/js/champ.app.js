'use strict';

angular.module('champ', [
	'ionic',
	'ChampDirectives',
	'ChampServices',
	'LocalStorageService'
])
.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

 //  $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
 //   console.log(toState);
 //   if (toState.name === 'root') {
 //     // $state.go('account.main');
 //   }  
 // });
})
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){    
    $urlRouterProvider.otherwise('/unauthenticated');

    $stateProvider
      .state('unauthenticated', {
        url: '/unauthenticated'
      })
      .state('authenticated', {
        url: "/authenticated?code",
        resolve: {
          'User' : ['$stateParams', 'FitbitAuthService', 
            function($stateParams, FitbitAuthService){
              console.log($stateParams);
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
        }
      });
  }
]);

