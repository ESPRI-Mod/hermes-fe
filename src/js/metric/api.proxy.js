// --------------------------------------------------------
// metric/api.js
// API interface.
// --------------------------------------------------------
(function (root, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare vars.
    var api = {},

        // API URL's.
        URLS = {
            base: 'http://localhost:8888/api/1/metric/',
            fetch: 'fetch?group={0}&include_db_id={1}',
            fetchColumns: 'fetch_columns?group={0}&include_db_id={1}',
            fetchCount: 'fetch_count?group={0}',
            fetchList: 'fetch_list',
            fetchSetup: 'fetch_setup?group={0}'
        },

        // Invokes remote API.
        invokeAPI = function (url, callback) {
            url = URLS.base + url;

            $.getJSON(url, callback);
        };

    // Fetches a group of metrics.
    // @group           ID of a metrics group.
    // @includeDBCols   Flag indicating whether to include db columns.
    // @callback        Function to invoke when API returns.
    api.fetch = function (group, includeDBCols, callback) {
        var url;

        // Parse inputs.
        includeDBCols = includeDBCols || false;

        // Set target URL.
        url = URLS.fetch;
        url = url.replace("{0}", group);
        url = url.replace("{1}", includeDBCols);

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Fetches count of lines within a group of metrics.
    // @group      ID of a metrics group.
    // @callback        Function to invoke when API returns.
    api.fetchCount = function (group, callback) {
        var url;

        // Set target URL.
        url = URLS.fetchCount;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Fetches list of columns within a group of metrics.
    // @group           ID of a metrics group.
    // @includeDBCols   Flag indicating whether to include db columns.
    // @callback        Function to invoke when API returns.
    api.fetchColumns = function (group, includeDBCols, callback) {
        var url;

        // Parse inputs.
        includeDBCols = includeDBCols || false;

        // Set target URL.
        url = URLS.fetchColumns;
        url = url.replace("{0}", group);
        url = url.replace("{1}", includeDBCols);

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Returns a list of metric groups.
    // @callback        Function to invoke when API returns.
    api.fetchList = function (callback) {
        var url;

        // Set target URL.
        url = URLS.fetchList;

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Fetches list of columns within a group of metrics.
    // @group      ID of a metrics group.
    // @callback        Function to invoke when API returns.
    api.fetchSetup = function (group, callback) {
        var url;

        // Set target URL.
        url = URLS.fetchSetup;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Expose to container.
    root.METRIC_API = api;

}(this, this.$, this._));
