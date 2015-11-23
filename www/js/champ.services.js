'use strict';

var services = angular.module('ChampServices', []);

services.factory('FitbitAuthService', ['$http', '$q', 'LocalStorage',
	function($http, $q, LocalStorage){
		function buildSecondStepUri(base, code, callback){
			return base + '?code=' + code + '&state=' + callback;
		}

		function buildSecondStepRequest(code){
			return {
				method: 'POST',
				url: buildSecondStepUri(baseAuthUri, code, firstStepCallbackUri)
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
			var req = buildSecondStepRequest(code);

			$http(req).then(function success(response){
				LocalStorage.setObject('FitbitUser', response.data)
				deferred.resolve(response.data);
			}, function error(response){
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		return service;
	}
]);