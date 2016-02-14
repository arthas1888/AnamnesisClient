'use strict';
app.controller('loginController', ['$scope', 'authService', '$location', 'localStorageService', '$rootScope',
    function ($scope, authService, $location, localStorageService, $rootScope) {

    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    //var authentication = authService.authentication;
        
    var authData = localStorageService.get('authorizationData');

    if (authData) {
        $scope.authentication = authService.authentication;
        if ($scope.authentication.isAuth) {
            $location.path('/dashboard');
        }
    } else {
        authService.logOut();
        $rootScope.authentication = {
            isAuth: false,
            userName: ""
        };
        $rootScope.authentication.isAuth = false;
    }

    $scope.login = function ($event) {
        
        authService.login($scope.loginData).then(function (response) {
            
            $location.path(response["data"]["url"]);
        },
        function (error) {
            //console.log(error);
            $scope.loginData.password = "";
            if (error.data.hasOwnProperty('error_description')) {
                
                $scope.message = error.data.error_description;
            } 
                 
            authService.showMessage($event, $scope.message);
        });
    };
}]);