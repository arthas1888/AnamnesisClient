'use strict';
app.factory('roleService', function () {
    var role = "";
    var serviceFactory = {};

    var _setRole = function (param) {
        role = param;
    };
    var _getRole = function () {
        return role;
    };

    serviceFactory.setRole = _setRole;
    serviceFactory.getRole = _getRole;

    return serviceFactory;
});