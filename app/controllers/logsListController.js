'use strict';
app.controller('logsListController', ['$scope', 'authService', '$mdDialog', '$location', '$log', '$timeout', '$q', '$filter', 'smartTableService',
    function ($scope, authService, $mdDialog, $location, $log, $timeout, $q, $filter, smartTableService) {
        

        $scope.sort = {
            sortType: 'dateTime',
            sortReverse: false
        };
        $scope.currentFilter = 'dateTime';
        $scope.gap = 7;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 10;
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        $scope.users = {};

        $scope.params = {
            fromDate: "",
            toDate: "",
            user: null
        }

        $scope.getList = function () {
            authService.get("api/Logs").then(function (response) {
                
                $scope.objectList = response['data'];
                $scope.pagedItems = smartTableService.search($scope.objectList);
                $scope.sortObject();
            });
        }

        $scope.alert = '';
        $scope.showDetails = function (ev, _object) {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/log_details.html',
                targetEvent: ev,
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                resolve: {
                    user: function () {
                        return _object;
                    }
                }
            })
               .then(function (answer) {
                   
               }, function () {
                   
               });
        };

        

        $scope.submitFilter = function () {
            
            authService.get("api/Logs", $scope.params).then(function (response) {
              
                $scope.objectList = response['data'];
                $scope.pagedItems = smartTableService.search($scope.objectList);
                $scope.sort = {
                    sortType: 'dateTime',
                    sortReverse: false
                };
                $scope.sortObject();
                $("body").animate({ scrollTop: 600 }, "slow");
            });
        }

        $scope.validDate = function () {
            return $scope.toDateObject >= $scope.fromDateObject;
        }


        $scope.filename = "log";
        $scope.isDisabled = false;
        $scope.noCache = true;
        $scope.searchText = "";

        $scope.getHeader = function () { return ["Fecha", "Hora", "Accion", "Objeto", "Usuario", "Rol", "Informacion del Navegador", "Informacion de Request"] };

        $scope.searchTextChange = function (query) {
            //$log.info('Text changed to ' + query);            
        }

        $scope.selectedItemChange = function (item) {
            if (typeof item != "undefined") {
                //$log.info('Item changed to ' + JSON.stringify(item.UserName));
                $scope.params.user = item.UserName;
            } else {
                $scope.params.user = null;
            }
        }

        $scope.queryFilter = {
            value: "",
        }

        $scope.querySearch = function (query) {

            var def = $q.defer();
            $scope.queryFilter.value = query;

            authService.get("api/Account/Usuarios", $scope.queryFilter).success(function (response) {
                $scope.users = response;
                def.resolve(response);
            }).error(function () {
                def.reject("Failed to get list of users");
            });

            return def.promise;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.UserName.indexOf(lowercaseQuery) === 0);
            };
        }
        

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
            console.log("param: " + param);
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

app.directive('valideDate', ['$parse', function ($parse) {
    return {
        require: 'ngModel',
        scope:{
            attrs: "="
        },
        link: function (scope, elem, attr, ngModel) {
            
            attr.$observe("valideDate", function (newValue) {
                var fromDate = new Date(newValue);
                var toDate = new Date(ngModel.$viewValue);
                ngModel.$setValidity('valideDate', fromDate <= toDate);
            });

            ngModel.$parsers.unshift(function (value) {                
                var fromDate = new Date(attr.valideDate);
                var toDate = new Date(value);
                ngModel.$setValidity('valideDate', fromDate <= toDate);
                return value;
            });
        },
       
    }
}]);

