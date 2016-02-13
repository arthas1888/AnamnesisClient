'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', '$mdSidenav', '$log', 'localStorageService', '$rootScope',
    function ($scope, $location, authService, $mdSidenav, $log, localStorageService, $rootScope) {


        $scope.logOut = function () {
            authService.logOut();
            $rootScope.authentication.isAuth = false;
            $location.path('/home');
        }

        $scope.activeSection = false;
        $scope.activeSectionChildren = false;
        $rootScope.authentication = authService.authentication;
        
        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle()
            .then(function () {
               // $log.debug("toggle left is done");
            });
        };
        $scope.toggleRight = function () {
            $mdSidenav('right').toggle()
            .then(function () {
               // $log.debug("toggle RIGHT is done");
            });
        };


        $scope.close = function (side) {
            $mdSidenav(side).close()
            .then(function () {
               // $log.debug("close is done");
            });
        };


        $scope.menu = [
            {
                name: "Dashboard",
                type: "link",
                url: "/#/dashboard"
            },
            {
                name: "Pacientes",
                type: "heading",
                children: [{
                    name: "Nuevo Paciente",
                    type: "link",
                    url: "/#/pacientes/new"
                }, {
                    name: "Lista de Pacientes",
                    type: "link",
                    url: "/#/pacientes/list"
                }]
            },
            {
                name: "Usuarios",
                type: "heading",
                children: [{
                    name: "Nuevo Usuario",
                    type: "link",
                    url: "/#/accounts/new"
                }, {
                    name: "Lista de Usuarios",
                    type: "link",
                    url: "/#/accounts/list"
                }]
            },
            
            {
                name: "Log",
                type: "link",
                url: "/#/log"
            }
        ]

    }]);
