'use strict';

var services = angular.module('ChampServices', []);

services.factory('FitbitDataService', ['$http', '$q', 
	function($http, $q){
		// https://api.fitbit.com/1/user/[user-id]/activities.json
		function userLifetimeStatsUri(userId, accessToken){
			return baseDataUri +'/lifetime_stats?user_id=' + userId + '&access_token=' + accessToken;
		}

		function userLifetimeStatsRequest(userId, accessToken){
			return {
				method: 'GET',
				url: userLifetimeStatsUri(userId, accessToken)
			}
		}

		var baseDataUri = 'http://localhost:9393/api/v1/fitbit/data';

		var service = {};

		service.getLifetimeStats = function(userId, accessToken){
			var deferred = $q.defer();
			var req = userLifetimeStatsRequest(userId, accessToken);

			$http(req).then(function success(response){
				deferred.resolve(response.data);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		return service;
	}
]);

services.factory('FitbitAuthService', ['$http', '$q', 'LocalStorage', 'FitbitDataService',
	function($http, $q, LocalStorage, FitbitDataService){
		function buildAuthSecondStepUri(base, code, callback){
			return base + '?code=' + code + '&state=' + callback;
		}

		function buildAuthSecondStepRequest(code){
			return {
				method: 'POST',
				url: buildAuthSecondStepUri(baseAuthUri, code, firstStepCallbackUri)
			}
		}

		function buildAuthRefreshTokenUri(base, token){
			return base + '/refresh?refresh_token=' + token;
		}

		function buildAuthRefreshTokenRequest(token){
			return {
				method: 'POST',
				url: buildAuthRefreshTokenUri(base, token)
			}
		}

		function setUser(userObj){
			LocalStorage.setObject('FitbitUser', userObj)
			user = userObj;
		}

		var baseAuthUri = 'http://localhost:9393/api/v1/fitbit/auth';
		var firstStepCallbackUri = 'http://localhost:8100/%23/authenticated'
		var clientSecret = 'V2UgYXJlIGdvaW5nIHRvIGhhdmUgYSBiYWJ5'
		
		var user = LocalStorage.getObject('FitbitUser');

		var service = {};

		service.firstStepUri = function(){
			return baseAuthUri + '?state=' + firstStepCallbackUri;
		}

		service.secondStepRequest = function(code){
			var deferred = $q.defer();
			var req = buildAuthSecondStepRequest(code);

			$http(req).then(function success(response){
				var userObj = response.data.data;

				setUser(userObj);
				deferred.resolve(userObj);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		service.refreshTokenRequest = function(token){
			var deferred = $q.defer();
			var req = buildAuthRefreshTokenRequest(token);

			$http(req).then(function success(response){
				var userObj = response.data.data;

				setUser(userObj);
				deferred.resolve(userObj);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		service.getUser = function(){
			return user;
		}

		service.refreshOrReturnUser = function(savedUser){

			// need to make request with current User
			// if it is good - continue on
			// if not, then refresh token and resave user
			// NB - also need ability to refresh on any request
		}

		return service;
	}
]);