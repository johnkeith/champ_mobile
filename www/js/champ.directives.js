'use strict';

var directives = angular.module('ChampDirectives', []);

directives.directive('openInSafari', [function(){
	return {
		restrict: "A",
		link: function($scope){
			$scope.openInSafari = function(href){
				window.open(href, '_system');
			}
		}
	}
}]);

directives.directive('fitbitAuthButton', ['FitbitAuthService',
	function(FitbitAuthService){
		return {
			restrict: 'E',
			template: '<button type="button">Sign Up with Fitbit</button>',
			link: function(scope, element){
				element.bind('click', function(){
					// have to encode the hashbang with a %23
					window.open(FitbitAuthService.auth_uri('?state=http://localhost:8100/%23/authenticated'), '_system');
				});
			}
		}
	}
]);