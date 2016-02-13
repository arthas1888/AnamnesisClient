'use strict';
app.factory('userService', function () {

    var userModel = {};

    var _setUser = function (data) {
        if (data.Role === "Admin") {
            
            data.Role = 2;
        } else {
            data.Role = 1;
        }
        userModel = data;
    }

    var _getUser = function () {
        return userModel;
    }

    return {
        setUser: _setUser,
        getUser: _getUser
    }

});