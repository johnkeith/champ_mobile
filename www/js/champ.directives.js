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
					window.open(FitbitAuthService.firstStepUri(), '_system');
				});
			}
		}
	}
]);

directives.directive('statsButton', ['FitbitAuthService', 'FitbitDataService',
	function(FitbitAuthService, FitbitDataService){
		return {
			restrict: 'E',
			template: '<button type="button">Get Lifetime Stats</button>',
			link: function(scope, element){
				element.bind('click', function(){
					var user = FitbitAuthService.getUser();
					FitbitDataService.getLifetimeStats(user.user_id, user.access_token);
				});
			}
		}
	}
]);