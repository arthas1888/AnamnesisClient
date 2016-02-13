'use strict';

app.controller('pacientesNewController', ['$scope', '$location', '$timeout', 'authService', 'isAuthorizeService',
    function ($scope, $location, $timeout, authService, isAuthorizeService) {

        $scope.message = "";
        $scope.option = "Crear";
        $scope.model = {};

        $scope.submit = function ($event) {
            $scope.model.BirthDate = new Date(new Date($scope.model.BirthFecha).setHours(0,0,0,0));
            authService.post("api/Pacientes", $scope.model).then(function (response) {
                console.log(response["data"]);
                $scope.message = "Paciente registrado satisfactoriamente";
                authService.showMessage($event, $scope.message);
            },
             function (error) {
                 if (error.data.hasOwnProperty('ModelState')) {
                     var errors = [];
                     for (var key in error.data.ModelState) {
                         for (var i = 0; i < error.data.ModelState[key].length; i++) {
                             errors.push(error.data.ModelState[key][i]);
                         }
                     }
                     $scope.message = "No se pudo registrar el paciente debido a: " + errors.join(' ');
                 } else {
                     $scope.message = error.data.Message;
                 }
                 
                 authService.showMessage($event, $scope.message);
             });
        };

    }]);

'use strict';
app.controller('pacientesEditController', ['$scope', 'authService', '$timeout', '$location', 'pacienteService',
function ($scope, authService, $timeout, $location, pacienteService) {

    $scope.option = "Editar";
    $scope.modelo = pacienteService.getModel();
    
    $scope.modelo.BirthFecha = new Date($scope.modelo.BirthDate);
    $scope.modelo.Nit = parseInt($scope.modelo.Nit, 10);
    $scope.modelo.PhoneNumber = parseInt($scope.modelo.PhoneNumber, 10);
    $scope.model = $scope.modelo;
    if (Object.keys($scope.model).length == 0) {
        $location.path('/accounts/list');
    }

    $scope.submit = function ($event) {
        $scope.model.BirthDate = new Date(new Date($scope.model.BirthFecha).setHours(0, 0, 0, 0));
        authService.edit("api/Pacientes/Edit", $scope.model).then(function (response) {
            $scope.message = "Paciente actualizado satisfactoriamente";
            authService.showMessage($event, $scope.message);
            startTimer();
        },
        function (error) {
            var errors = [];
            for (var key in error.data.ModelState) {
                for (var i = 0; i < error.data.ModelState[key].length; i++) {
                    errors.push(error.data.ModelState[key][i]);
                }
            }
            $scope.message = "No se pudo actualizar el paciente debido a: " + errors.join(' ');
            authService.showMessage($event, $scope.message);
        });

    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/pacientes/list');
        }, 2000);
    }


}]);