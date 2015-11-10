angular.module('champ', ['ionic'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

// what I've learned about the fb api
// I will use implicit grant flow
// store client_id in distributed app code is okay!
// need to make requests with correct authorization headers - a bash 64 hash of client id and client secret
// need to set expiry time of token on client side - hopefully can set lifetime

