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
				deferred.resolve(response.data.data);
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
				url: buildAuthRefreshTokenUri(baseAuthUri, token)
			}
		}

		function setUser(userObj){
			LocalStorage.setObject('FitbitUser', userObj)
			user = userObj;
		}

		function setOrClearUser(userObj){
			if(userObj.access_token){
				setUser(userObj);
			} else {
				setUser(undefined)
			}
		}

		var baseAuthUri = 'http://localhost:9393/api/v1/fitbit/auth';
		var firstStepCallbackUri = 'champ://'
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

				setOrClearUser(userObj)
				deferred.resolve(user);
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

				setOrClearUser(userObj)
				deferred.resolve(user);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		service.getUser = function(){
			return user;
		}

		service.openFirstStepUriInBrowser = function(){
			window.open(service.firstStepUri(), '_system');
		}

		return service;
	}
]);