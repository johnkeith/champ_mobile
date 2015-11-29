'use strict';

var controllers = angular.module('ChampControllers', []);

controllers.controller('AuthenticatedController', ['$scope', '$state', 'LifetimeStats', 'User',
	function($scope, $state, LifetimeStats, User){
		if(User == null || User == undefined){
			$state.go('unauthenticated');
		}

		$scope.user = User;
	}
]);