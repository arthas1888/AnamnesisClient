'use strict';
app.controller('pacientesListController', ['$scope', 'authService', '$mdDialog', '$location', 'pacienteService', '$q', '$filter', 'smartTableService',
    function ($scope, authService, $mdDialog, $location, pacienteService, $q, $filter, smartTableService) {  

        $scope.getList = function () {
            authService.getList("api/Pacientes").then(function (response) {
                
                $scope.objectList = response['data'];
                $scope.pagedItems = smartTableService.search($filter('orderBy')($scope.objectList, "Name"));
            });
        }

        $scope.alert = '';
        $scope.showAlert = function (ev, _object) {
            
            _object.birthYear = getBirthYear(_object.BirthDate);
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/pacientes_details.html',
                targetEvent: ev,
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                resolve: {
                    user: function () {
                        return _object;
                    }
                }
            })
               .then(function (answer) {
                   $scope.alert = 'You said the information was "' + answer + '".';
               }, function () {
                   $scope.alert = 'You cancelled the dialog.';
               });
        };

        var getBirthYear = function (birthDate) {
            var birthYear = new Date().getFullYear() - new Date(birthDate).getFullYear();
            if (new Date().getMonth() < new Date(birthDate).getMonth()) {
                birthYear -= 1;               
            } else if (new Date().getMonth() === new Date(birthDate).getMonth()) {
                if (new Date().getDate() < new Date(birthDate).getDate()) {
                    birthYear -= 1;
                }
            }
            return birthYear;
        }

        $scope.showAlertRemoveAccount = function (ev, paciente) {
            var confirm = $mdDialog.confirm()
               .title('Alerta Eliminacion de Paciente')
               .content('Desea eliminar el paciente: ' + paciente.Name + " " + paciente.LastName)
               .ariaLabel('Delete Paciente')
               .ok('Eliminar')
               .cancel('Cancelar')
               .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.deletePaciente(paciente.Id);
            }, function () {

            });
        };

        $scope.deletePaciente = function (id) {
            $scope.model = {
                Id: id,
            }
            authService.delete("api/Pacientes/Delete", $scope.model).then(function (response) {
                
                $scope.getList();
            });
        }

        $scope.edit = function (paciente) {
            pacienteService.setModel(paciente);
            $location.path('/pacientes/edit');
        }

        $scope.sort = {
            sortType: 'Nombres',
            sortReverse: false
        };
        $scope.gap = 7;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        $scope.itemsPerPage = 10;
        smartTableService.itemsPerPage($scope.itemsPerPage);

        $scope.range = function (size, start, end) {
            return smartTableService.range(size, start, end);
        }

        $scope.prevPage = function () {
            $scope.currentPage = smartTableService.prevPage();
        }

        $scope.nextPage = function () {
            $scope.currentPage = smartTableService.nextPage();
        }

        $scope.setPage = function (n) {
            $scope.currentPage = smartTableService.setPage(n);
        }


        $scope.filterObject = function (param) {
            $scope.pagedItems = smartTableService.search($filter('filter')($scope.objectList, param))
        };

        var param = "";

        $scope.sortObject = function () {

            param = $scope.sort.sortType;

            if (param === $scope.currentFilter) {
                param = $scope.sort.sortReverse ? param : "-" + param;
            }
            $scope.currentFilter = param;
            $scope.pagedItems = smartTableService.search($filter('orderBy')($scope.objectList, param))
        };

}]);

function DialogController($scope, $mdDialog, user) {
    
    $scope.user = user;
    
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}