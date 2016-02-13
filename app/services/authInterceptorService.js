'use strict';
app.factory('authInterceptorService', ['$q', '$location', 'localStorageService', 'roleService', 'jwtHelper',
    function ($q, $location, localStorageService, roleService, jwtHelper) {

        var authInterceptorServiceFactory = {};
        
    var _request = function (config) {
        Pace.restart();
        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {

        var authData = localStorageService.get('authorizationData');
        
        if (authData) {
            var role = roleService.getRole();
            if (rejection.status === 401 && role === 'Users') {
                $location.path('/unauthorized');
            } else if (rejection.status === 401){
                removeCredentials();
                //window.open('/#/login', "_self");

                $location.path('/login');
            }
            //var isTokenExpired = jwtHelper.isTokenExpired(authData.token);
            //if (!isTokenExpired) {
            //} else {
            //    removeCredentials();
            //    $location.path('/login');
            //}
        } else {
            removeCredentials();
            //window.open('/#/login', "_self");

            $location.path('/login');
            //$location.path('/login');
        }
        
        return $q.reject(rejection);
    }

    var removeCredentials = function () {
        localStorageService.remove('authorizationData');
        localStorageService.remove('roleUser');       
        roleService.setRole("");
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);