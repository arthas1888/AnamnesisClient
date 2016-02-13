'use strict';
app.controller('editUserController', ['$scope', 'authService', 'userService', '$timeout', '$location',
function ($scope, authService, userService, $timeout, $location) {

    $scope.user = userService.getUser();
    if (Object.keys($scope.user).length == 0) {
        $location.path('/accounts/list');
    }
    
    $scope.RolesOption = [
        { value: 1, name: 'Usuario' },
        { value: 2, name: 'Administrador' },
    ];
    
    $scope.editUser = function () {
        authService.edit("api/Account/EditUser", $scope.user).then(function (response) {            
            $scope.message = "Usuario actualizado satisfactoriamente";
            startTimer();
        },
        function (error) {            
            var errors = [];
            for (var key in error.data.ModelState) {
                for (var i = 0; i < error.data.ModelState[key].length; i++) {
                    errors.push(error.data.ModelState[key][i]);
                }
            }
            $scope.message = "Usuario no actualizado debido a: " + errors.join(' ');
        });

    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/accounts/list');
        }, 2000);
    }
    
    
}]);