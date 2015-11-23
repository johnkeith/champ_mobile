'use strict';

var controllers = angular.module('ChampControllers', []);

controllers.controller('AuthenticatedController', ['$scope', '$state', 'User',
	function($scope, $state, User){
		if(User == null){
			$state.go('unauthenticated');
		}

		$scope.user = User;
	}
]);