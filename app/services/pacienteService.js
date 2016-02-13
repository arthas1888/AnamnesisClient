'use strict';
app.factory('pacienteService', function () {

    var objectModel = {};

    var _setModel = function (data) {
        
        objectModel = data;
    }

    var _getModel = function () {
        return objectModel;
    }

    return {
        setModel: _setModel,
        getModel: _getModel
    }

});