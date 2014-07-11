// public/core.js
var ng3Scape = angular.module('3ScapeMain', []);

ng3Scape.controller('projectController', ['$scope', '$http', 'Global', function($scope, $http, Global) {
	$scope.global = Global;

	$scope.formData = {};

	// when landing on the page, get all projects and show them
	$http.get('/api/projects')
		.success(function(data) {
			$scope.projects = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createProject = function() {
		$http.post('/api/projects', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.projects = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a project after checking it
	$scope.deleteProject = function(id) {
		$http.delete('/api/projects/' + id)
			.success(function(data) {
				$scope.projects = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}])
.controller('headerController', ['$scope', 'Global', function($scope, Global) {
	$scope.global	= Global;
}])
.factory('Global', function(){
	var testVar = "Me!"
	var current_user = window.user;
	return {
	  currentUser: function() {
	    return current_user;
	  },
	  isSignedIn: function() {
	    return !!current_user;
	  }
	};
})