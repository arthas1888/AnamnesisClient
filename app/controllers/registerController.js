'use strict';

app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', 'isAuthorizeService',
    function ($scope, $location, $timeout, authService, isAuthorizeService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.dataUser = [];
        
    isAuthorizeService.getUserInfo().then(function (results) {

        $scope.dataUser = results.data;

    }, function (error) {
        console.log(error.data.message);
    });
    

    $scope.registration = {
        Name: "",
        Lastname: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        City: "",
        Address: "",
        Number: "",
        Role: ""
    };
         
    $scope.signUp = function (event) {

        console.log($scope.registration);
        authService.registrationAccount($scope.registration).then(function (response) {
            console.log(response);
            $scope.savedSuccessfully = true;
            $scope.message = "Usuario registrado exitosamente";
            authService.showMessage(event, $scope.message);
            //startTimer();
        },
         function (error) {
             console.log(error);
             var errors = [];
             for (var key in error.data.ModelState) {
                 for (var i = 0; i < error.data.ModelState[key].length; i++) {
                     errors.push(error.data.ModelState[key][i]);
                 }
             }
             $scope.message = "Fallo el registro de usuario debido a: " + errors.join(' ');
             authService.showMessage(event, $scope.message);
         });
        
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

    $scope.loadRoles = function () {

        $scope.RolesOption = [];
        return $timeout(function () {
            $scope.RolesOption = [
                { value: 1, name: 'Usuario' },
                { value: 2, name: 'Administrador' },
            ];
        }, 500);
    };

}]);