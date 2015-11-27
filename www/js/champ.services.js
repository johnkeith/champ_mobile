'use strict';

var services = angular.module('ChampServices', []);

services.factory('FitbitAuthService', ['$http', '$q', 'LocalStorage',
	function($http, $q, LocalStorage){
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

		var baseAuthUri = 'http://localhost:9393/api/v1/fitbit/auth';
		var firstStepCallbackUri = 'http://localhost:8100/%23/authenticated'
		var clientSecret = 'V2UgYXJlIGdvaW5nIHRvIGhhdmUgYSBiYWJ5'

		var service = {};

		service.firstStepUri = function(){
			return baseAuthUri + '?state=' + firstStepCallbackUri;
		}

		service.secondStepRequest = function(code){
			var deferred = $q.defer();
			var req = buildAuthSecondStepRequest(code);

			$http(req).then(function success(response){
				LocalStorage.setObject('FitbitUser', response.data)
				deferred.resolve(response.data);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		service.refreshTokenRequest = function(token){
			var deferred = $q.defer();
			var req = buildAuthRefreshTokenRequest(token);

			$http(req).then(function success(response){
				LocalStorage.setObject('FitbitUser', response.data)
				deferred.resolve(response.data);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
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