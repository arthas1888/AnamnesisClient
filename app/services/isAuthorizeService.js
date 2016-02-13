'use strict';
app.factory('isAuthorizeService', ['$http', function ($http) {

    var serviceBase = 'http://localhost:52635/';
    var serviceFactory = {};

    var _getUSerInfo = function () {

        return $http.get(serviceBase + 'api/Account/UserInfo').then(function (results) {
            return results;
        });
    };

    serviceFactory.getUserInfo = _getUSerInfo;

    return serviceFactory;

}]);