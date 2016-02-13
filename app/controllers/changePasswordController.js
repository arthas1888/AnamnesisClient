'use strict';

app.controller('changePasswordController', ['$scope', '$location', '$timeout', 'authService', 'isAuthorizeService',
    function ($scope, $location, $timeout, authService, isAuthorizeService) {

        $scope.message = "";

        $scope.model = {
            OldPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
        };

        $scope.submit = function () {

            authService.post("api/Account/ChangePassword", $scope.model).then(function (response) {
                
                $scope.message = "La contraseña ha sido actualizada satisfactoriamente";
            },
            function (error) {            
                var errors = [];
                for (var key in error.data.ModelState) {
                    for (var i = 0; i < error.data.ModelState[key].length; i++) {
                        errors.push(error.data.ModelState[key][i]);
                    }
                }
                $scope.message = "Fallo para cambiar la contraseña debido a: " + errors.join(' ');
            });
             
        };

        

    }]);