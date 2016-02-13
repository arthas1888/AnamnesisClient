'use strict';
app.factory('authorizeService', ['$http', '$scope', function ($http, $scope) {

    var serviceBase = 'http://localhost:52635/';
    var ordersServiceFactory = {};

    var _getOrders = function () {

        return $http.get(serviceBase + 'api/Account/UserInfo').then(function (results) {
            return results;
        });
    };

    ordersServiceFactory.getOrders = _getOrders;

    return ordersServiceFactory;

}]);