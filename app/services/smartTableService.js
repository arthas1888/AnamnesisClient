'use strict';
app.factory('smartTableService', ['$q',  function ($q) {

    var smartTableServiceFactory = {};

    var currentPage = 0;
    var gap = 7;
    var pagedItems = [];



    var filteredItems = [];
    var groupedItems = [];
    var itemsPerPage = 10;

    var _init = function (pagedItem) {
        pagedItems = pagedItem;
    };

    // init the filtered items
    var _search = function (items) {
        filteredItems = items;
        currentPage = 0;
        return groupToPages();
    };

    // calculate page in place
    var groupToPages = function () {
        pagedItems = [];

        for (var i = 0; i < filteredItems.length; i++) {
            if (i % itemsPerPage === 0) {
                pagedItems[Math.floor(i / itemsPerPage)] = [filteredItems[i]];
            } else {
                pagedItems[Math.floor(i / itemsPerPage)].push(filteredItems[i]);
            }
        }
        return pagedItems;
    };

    var _range = function (size, start, end) {
        var ret = [];
        //console.log(size,start, end);

        if (size < end) {
            end = size;
            start = size - gap;
        }
        if (start < 1) {
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        //console.log(ret);        
        return ret;
    };

    var _prevPage = function () {
        if (currentPage > 0) {
            currentPage--;
        }
        return currentPage;
    };

    var _nextPage = function () {
        if (currentPage < pagedItems.length - 1) {
            currentPage++;
        }
        return currentPage;
    };

    var _setPage = function (n) {
        currentPage = n;
        return currentPage;
    };

    var _itemsPerPage = function (n) {
        itemsPerPage = n;
    };


    smartTableServiceFactory.range = _range;
    smartTableServiceFactory.prevPage = _prevPage;
    smartTableServiceFactory.nextPage = _nextPage;
    smartTableServiceFactory.setPage = _setPage;
    smartTableServiceFactory.init = _init;
    smartTableServiceFactory.search = _search;
    smartTableServiceFactory.itemsPerPage = _itemsPerPage;

    return smartTableServiceFactory;

}]);


app.directive("customSort", function () {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            sort: '=',
            order: '=',
        },
        template:
            '<a style="cursor: pointer;" ng-click="sort_by(order)">' +
            '   <span ng-transclude></span>' +
            '   <i ng-class="selectedCls(order)"></i>' +
            '</a>',
        link: function (scope) {

            // change sorting order
            scope.sort_by = function (newSortingOrder) {
                //console.log(newSortingOrder, scope.sort);
                var sort = scope.sort;

                if (sort.sortType == newSortingOrder) {
                    sort.sortReverse = !sort.sortReverse;
                }

                sort.sortType = newSortingOrder;
            };

            scope.selectedCls = function (column) {
                if (column == scope.sort.sortType) {
                    return ('fa fa-caret-' + ((scope.sort.sortReverse) ? 'down' : 'up'));
                }
            };

        }
    }
});