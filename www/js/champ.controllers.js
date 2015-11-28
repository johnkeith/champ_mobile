'use strict';

var controllers = angular.module('ChampControllers', []);

controllers.controller('AuthenticatedController', ['$scope', '$state', 'User',
	function($scope, $state, User){
		if(User == null || User == undefined){
			$state.go('unauthenticated');
		}

		$scope.user = User;
	}
]);