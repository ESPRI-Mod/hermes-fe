// --------------------------------------------------------
// api.proxy.js - Metric API proxy.
// To use this script do the following:
//      1.  Embed it into your web page.
//      2.  Call one of the following methods with the relevant parameters:
//          2.1 METRIC_API.fetch
//              2.1.1   group - id of metric group to be retrieved;
//              2.1.2   includeDBCols - flag indicating whether metric columns will also be returned;
//              2.1.3   callback - function to invoke whent he API response is received.
//          2.2 METRIC_API.fetchCount (group, includeDBCols, callback)
//              2.2.1   group - id of metric group to be retrieved;
//              2.2.2   callback - function to invoke whent he API response is received.
//          2.3 METRIC_API.fetchColumns (group, includeDBCols, callback)
//              2.3.1   group - id of metric group to be retrieved;
//              2.3.2   includeDBCols - flag indicating whether metric columns will also be returned;
//              2.3.3   callback - function to invoke whent he API response is received.
//          2.4 METRIC_API.fetchList
//              2.4.1   callback - function to invoke whent he API response is received.
//          2.5 METRIC_API.fetchSetup
//              2.5.1   group - id of metric group to be retrieved;
//              2.5.2   callback - function to invoke whent he API response is received.
// --------------------------------------------------------
(function (root, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare vars.
    var api = root.METRIC_API = {},

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

}(this, this.$, this._));
