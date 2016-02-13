'use strict';
app.controller('accountsListController', ['$scope', 'authService', '$mdDialog', '$location', 'userService', '$q', '$filter', 'smartTableService',
    function ($scope, authService, $mdDialog, $location, userService, $q, $filter, smartTableService) {


        $scope.getListUsers = function () {
            authService.getList("api/Account/Users").then(function (response) {                
                $scope.objectList = response['data'];
                $scope.pagedItems = smartTableService.search($scope.objectList);
            });
        }

        $scope.alert = '';
        $scope.showAlert = function (ev, _id) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog

            $scope.result = {};

            for (var i = 0; i < $scope.objectList.length; i++) {
                if ($scope.objectList[i].Id === _id) {
                    $scope.result = $scope.objectList[i];
                    break;
                }
            }

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/dialog_user_details.html',
                targetEvent: ev,
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                resolve: {
                    user: function () {
                        return $scope.result;
                    }
                }
            })
               .then(function (answer) {
                   $scope.alert = 'You said the information was "' + answer + '".';
               }, function () {
                   $scope.alert = 'You cancelled the dialog.';
               });
        };

        $scope.showAlertRemoveAccount = function (ev, user) {            
            var confirm = $mdDialog.confirm()               
               .title('Alerta Elminacion de cuenta de Usuario')
               .content('Desea eliminar esta cuenta de usuario: ' + user.UserName)
               .ariaLabel('Delete Account')
               .ok('Eliminar')
               .cancel('Cancelar')
               .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                $scope.deleteAccount(user.Id);
            }, function () {
                
            });
        };

        $scope.deleteAccount = function (id) {
            $scope.model = {
                Id: id,
            }
            authService.delete("api/Account/Delete", $scope.model).then(function (response) {
                console.log(response['data']);
                $scope.getListUsers();
            });
        }

        $scope.editAccount = function (user) {
            userService.setUser(user);
            $location.path('/accounts/edit');
        }

        $scope.sort = {
            sortType: 'Name',
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

        $scope.filename = "users";

        $scope.getHeader = function () { return ["ID", "Nombre", "Apellido", "User", "Email", "Ciudad", "Direccion", "Telefono", "Rol", "Fecha de creacion"] };


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