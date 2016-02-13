'use strict';
app.factory('authService', ['$http', '$q', '$mdDialog', 'localStorageService', 'roleService', '$crypto',
    function ($http, $q, $mdDialog, localStorageService, roleService, $crypto) {     

        var serviceBase = 'http://localhost:52635/';
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _getList = function (url, data) {
        
        data = typeof data == "undefined" ? data : {};
        return $http.get(serviceBase + url, data);
    }

    var _registerAccount = function (registration) {

        //_logOut();
        return $http.post(serviceBase + 'api/Account/Register/', registration);

    };

    var _post = function (url, data) {

        return $http.post(serviceBase + url, data);

    };

    var _edit = function (url, data) {

        return $http.post(serviceBase + url, data);

    };

    var _delete = function (url, data) {

        return $http.post(serviceBase + url, data);

    };

    var _get = function (url, data) {

        return $http({
            method: 'GET',
            url: serviceBase + url,
            params: data
        });

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;


        return $http.post(serviceBase + 'Token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
           
            localStorageService.set('roleUser', $crypto.encrypt(response.role));

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.role = response.role;
            roleService.setRole(response.role);
            console.log("user: " + localStorageService.get("authorizationData").userName + " role: " + roleService.getRole());

        }).error(function (err, status) {
            _logOut();
        });


    };

    var _logOut = function () {

        var authData = localStorageService.get("authorizationData");
        
        if (authData) {
            $http.post(serviceBase + 'api/Account/Logout');
            localStorageService.remove('authorizationData');
            localStorageService.remove('roleUser');
            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.role = "";
            roleService.setRole("");
        }

    };

    var _fillAuthData = function () {

        
        var authData = localStorageService.get("authorizationData");
        
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.role = $crypto.decrypt(localStorageService.get("roleUser"));
            
            $http.get(serviceBase + 'api/Account/RoleUser').then(function (results) {
                
                roleService.setRole(results["data"]);
                localStorageService.set('roleUser', $crypto.encrypt(results["data"]));
            });
            
        }

    }

    var _showMessage = function (ev, msg) {
        $mdDialog.show(
            $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('Mensaje')
               .content(msg)
               .ariaLabel('Mensaje')
               .ok('Aceptar')
               .targetEvent(ev)
               
        );
    };

    authServiceFactory.registrationAccount = _registerAccount;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.getList = _getList;
    authServiceFactory.delete = _delete;
    authServiceFactory.edit = _edit;
    authServiceFactory.post = _post;
    authServiceFactory.get = _get;
    authServiceFactory.showMessage = _showMessage;

    return authServiceFactory;
}]);