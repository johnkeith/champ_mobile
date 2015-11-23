'use strict';

var services = angular.module('ChampServices', []);

services.factory('FitbitAuthService', ['$http', '$q', 'LocalStorage',
	function($http, $q, LocalStorage){
		function buildSecondStepUri(base, code, callback){
			return base + '?code=' + code + '&state=' + callback;
		}

		var baseAuthUri = 'http://localhost:9393/api/v1/fitbit/auth';
		var firstStepCallbackUri = 'http://localhost:8100/%23/authenticated'
		var clientSecret = 'V2UgYXJlIGdvaW5nIHRvIGhhdmUgYSBiYWJ5'

		var buildSecondStepRequest = function(code){
			return {
				method: 'POST',
				url: buildSecondStepUri(baseAuthUri, code, firstStepCallbackUri)
			}
		}

		var service = {};

		service.auth_uri = function(url_params){
			return baseAuthUri + url_params;
		}

		service.firstStepUri = function(){
			return baseAuthUri + '?state=' + firstStepCallbackUri;
		}

		service.secondStepRequest = function(code){

			var deferred = $q.defer();
			var req = buildSecondStepRequest(code);

			$http(req).then(function success(response){
				// LocalStorage.set('auth', response.data)
				console.log(response);
				deferred.resolve(response.data);
			}, function error(response){
				console.log('something happend!');
				console.log(response);
				deferred.reject(response.statusText || 'Error!!!');
			});

			return deferred.promise;
		}

		return service;
	}
]);

    // var deferred = $q.defer();

    // var req = {
    //   method: 'GET',
    //   url: '/api/v1/loans/' + loanId
    // };

    // $http(req).then(
    //   function complete(result) {
    //     deferred.resolve(result.data.data.attributes);
    //   },
    //   function error(err) {
    //     deferred.reject(err.statusText || 'Error retrieving loan');
    //   }
    // );

    // return deferred.promise;