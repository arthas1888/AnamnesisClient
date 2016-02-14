var app = angular.module('AngularAuthApp', ['ngRoute', 'ngMaterial', 'ngTable', 'ngMessages', 'kendo.directives',
'ngSanitize', 'ngCsv', 'LocalStorageModule', 'mdo-angular-cryptography', 'gridshore.c3js.chart', 'angular-jwt']);


app.config(function ($routeProvider, $httpProvider, $mdThemingProvider, $cryptoProvider) {

    $mdThemingProvider.theme('default')

         .primaryPalette('purple', {
             'default': '800', // by default use shade 400 from the pink palette for primary intentions
      
         })
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('grey');
        
        //.primaryPalette('green', {
        //    'default': '500', // by default use shade 400 from the pink palette for primary intentions
        //    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        //    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        //    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        //})
        //// If you specify less than all of the keys, it will inherit from the
        //// default shades
        //.accentPalette('lime', {
        //    'default': '600' // use shade 200 for default, and keep all other shades the same
        //});

    
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/accounts/new", {
        controller: "signupController",
        templateUrl: "/app/views/registerAccount.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.when("/accounts/list", {
        controller: "accountsListController",
        templateUrl: "/app/views/accounts_list.html"
    });

    $routeProvider.when("/accounts/edit", {
        controller: "editUserController",
        templateUrl: "/app/views/accounts_edit.html"
    });

    $routeProvider.when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "/app/views/dashboard.html"
    });

    $routeProvider.when("/accounts/change/password", {
        controller: "changePasswordController",
        templateUrl: "/app/views/change_password.html"
    });

    $routeProvider.when("/accounts/logout", {
        controller: "logoutController",
        templateUrl: "/app/views/logout.html"
    });

    $routeProvider.when("/pacientes/list", {
        controller: "pacientesListController",
        templateUrl: "/app/views/pacientes_list.html"
    });

    $routeProvider.when("/pacientes/new", {
        controller: "pacientesNewController",
        templateUrl: "/app/views/pacientes_form.html"
    });

    $routeProvider.when("/pacientes/edit", {
        controller: "pacientesEditController",
        templateUrl: "/app/views/pacientes_form.html"
    });

    $routeProvider.when("/log", {
        controller: "logsListController",
        templateUrl: "/app/views/logs_list.html"
    });

    $routeProvider.when("/unauthorized", {
        controller: "unauthorizedController",
        templateUrl: "/app/views/unauthorized.html"
    });

    $routeProvider.otherwise({ redirectTo: "/dashboard" });

    $httpProvider.interceptors.push('authInterceptorService');

    $cryptoProvider.setCryptographyKey('ABCD123');

});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.run(function ($rootScope, $location, localStorageService, jwtHelper, authService) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        
        var authData = localStorageService.get('authorizationData');

        if (authData) {
            
            //var isTokenExpired = jwtHelper.isTokenExpired(authData.token);
            //if (isTokenExpired) {                
            //    authService.logOut();
            //    $location.path('/login');
            //}
        } else {
            
            if ($location.path() != "/home" && $location.path() != "/login") {
                authService.logOut();
                $location.path('/login');
            }
           
        }

    });
});

app.directive('parentSection', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {

            element.on('click', function (event) {
                
                var elementFocus = angular.element(event.target);
                var elementFocusParent = angular.element(event.target.parentNode);
                var elementFocusParentAttr = elementFocusParent[0];
                var elementsActive = element[0].querySelectorAll('.active');


                if (elementFocus[0]["type"] == 'logout' || elementFocusParentAttr["type"] == 'logout') {
                    
                    angular.forEach(elementsActive, function (elementChild) {
                        (angular.element(elementChild)).removeClass('active');
                    });
                    var activeSection = element[0].querySelectorAll('.active-section');
                    
                    angular.forEach(activeSection, function (elementChild) {
                        //console.log(angular.element(elementChild.parentNode)[0].children[1]);
                        (angular.element(elementChild)).removeClass('active-section');
                        (angular.element(angular.element(elementChild.parentNode)[0].children[1])).css('height', '0px');
                    });
                    return;
                }

                if (elementFocusParentAttr["type"] == "link" || elementFocus[0]["type"] == "link") {
                    angular.forEach(elementsActive, function (elementChild) {
                        (angular.element(elementChild)).removeClass('active');
                    });
                }
                if (elementFocusParentAttr["tagName"] == "A" && elementFocusParentAttr["type"] == "link") {
                    elementFocusParent.addClass('active');
                } else if (elementFocus[0]["type"] == "link") {
                    elementFocus.addClass('active');
                }

            });
        }

    }
});


'use strict';
app.controller('homeController', ['$scope', 'authService', '$location',
    function ($scope, authService, $location) {

        var authentication = authService.authentication;
       
        if (authentication.isAuth) {
            $location.path('/dashboard');
        } else {
            $location.path('/home');
        }
}]);

app.controller('dashboardController', ['$scope', 'smartTableService', '$filter', 'authService', '$interval', 'dataService', '$location', '$mdDialog', '$rootScope', 
function ($scope, smartTableService, $filter, authService, $interval, dataService, $location, $mdDialog, $rootScope) {

    $scope.showDialog = function (ev, id) {

        authService.getList("api/Pacientes/" + id).then(function (response) {            
            var _object = response["data"];            
            _object.birthYear = getBirthYear(_object.BirthDate);
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/pacientes_details.html',
                targetEvent: ev,
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                resolve: {
                    user: function () {
                        return _object;
                    }
                }
            })
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

    $rootScope.authentication = authService.authentication;

    $scope.isAuthenticated = function () {
        if (!$rootScope.authentication.isAuth) {
            $location.path('/login');
            authService.logOut();
        }
    }

    $scope.getList = function () {
        authService.getList("api/Pacientes").then(function (response) {

            $scope.objectList = response['data'];
            $scope.pagedItems = smartTableService.search($filter('orderBy')($scope.objectList, "Name"));
            loadData();
        });
    }

    var loadData = function () {
        $scope.datapoint = [
                { "x": 40, "data": $scope.objectList.length }
        ];
    }

    $scope.datapoint = [];
    $scope.datacolumn = [{ "id": "data", "type": "bar", "color": "orange", "name": "Cantidad de Pacientes"}];
    $scope.data_x = { "id": "x" };

    $scope.datapoints = [{ "x": new Date(), "top-1": 54 }, { "x": new Date(), "top-1": 48 }, { "x": new Date().setDate(29), "top-1": 1 }];
    $scope.datacolumns = [{ "id": "top-1", "type": "line", "name": "Top one", "color": "black" }]
                       // { "id": "top-2", "type": "spline", "name": "Top two" }];
    $scope.datax = { "id": "x" };

    //$interval(function () {
    //    dataService.loadData(function (data) {
    //        $scope.datapoints.push(data);
    //    });
    //}, 1000, 10);

    
    $scope.getList();

    $scope.sort = {
        sortType: 'Nombres',
        sortReverse: false
    };
    $scope.gap = 7;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
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

app.controller('logoutController', ['$scope', 'authService', '$location', function ($scope, authService, $location) {
    
    authService.logOut();
    $location.path('/home');
}]);

app.controller('unauthorizedController', ['$scope', function ($scope) {

}]);

app.factory('dataService', function () {
    function DataService() {
        var maxNumber = 200;

        // API methods
        this.loadData = function (callback) {
            callback({ "x": new Date(), "top-1": randomNumber(), "top-2": randomNumber() });
        };

        function randomNumber() {
            return Math.floor((Math.random() * maxNumber) + 1);
        }
    }
    return new DataService();
});

app.directive("ngScroll", function ($window, $document) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            
            var offsetHeight = $document[0].all[37].offsetHeight;
            if ((this.pageYOffset + this.innerHeight) >= offsetHeight) {
                element.css('bottom', '70px');
            } else {
                element.css('bottom', '10px');
            }
        });
    };
});


app.directive("ngScrollUp", function ($window, $document, $timeout) {
    return function (scope, element, attrs) {
        
        angular.element($window).bind("scroll", function () {            
            if (this.pageYOffset >= 100) {
                element.css('display', 'block');
            } else {
                element.css('display', 'none');
            }
        });

        element.bind("click", function () {                       
            scrollTo($document[0].body, 0, 400);
        });

        var scrollTo = function (element, to, duration) {
            if (duration < 0) return;
            var difference = to - element.scrollTop;
            var perTick = difference / duration * 10;

            $timeout(function () {
                element.scrollTop = element.scrollTop + perTick;
                if (element.scrollTop == to) return;
                scrollTo(element, to, duration - 10);
            }, 10);
        }

    };
});


app.directive("ngBack", function ($window, $document, $timeout) {
    return function (scope, element, attrs) {

        element.bind("click", function () {
            $window.history.back();
        });
    };
});

app.directive('ngMatch', [function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=ngMatch"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.ngMatch = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
}]);