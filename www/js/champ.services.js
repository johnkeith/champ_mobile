'use strict';

var services = angular.module('ChampServices', []);

services.factory('FitbitAuthService', ['$http', 'LocalStorage',
	function($http, LocalStorage){
		// var champApiAuthRequest = {
		// 	method: 'GET',
		// 	url: 'http://localhost:9393/api/v1/fitbit/auth/',
		// 	headers: {
		// 	 'client_secret': 'V2UgYXJlIGdvaW5nIHRvIGhhdmUgYSBiYWJ5'
		// 	}
		// }

		var baseAuthUri = 'http://localhost:9393/api/v1/fitbit/auth';

		var service = {};

		// service.authenticate = function(){
		// 	$http(champApiAuthRequest).then(function success(response){
		// 		LocalStorage.set('auth', response.data)
		// 		console.log(response);
		// 	}, function error(response){
		// 		console.log('something happend!');
		// 		console.log(response);
		// 	});
		// };

		service.auth_uri = function(url_params){
			return baseAuthUri + url_params;
		}

		return service;
	}
]);