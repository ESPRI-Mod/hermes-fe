// --------------------------------------------------------
// api.proxy.js - Metric API proxy.
// To use this script do the following:
//      1.  Embed it into your web page.
//      2.  Call one of the following methods with the relevant parameters:
//          2.1 METRIC_API.fetch
//              2.1.1   group - id of metric group to be retrieved;
//              2.1.2   callback - function to invoke whent he API response is received.
//          2.2 METRIC_API.fetchCount (group, callback)
//              2.2.1   group - id of metric group to be retrieved;
//              2.2.2   callback - function to invoke whent he API response is received.
//          2.3 METRIC_API.fetchColumns (group, callback)
//              2.3.1   group - id of metric group to be retrieved;
//              2.3.3   callback - function to invoke whent he API response is received.
//          2.4 METRIC_API.fetchList
//              2.4.1   callback - function to invoke whent he API response is received.
//          2.5 METRIC_API.fetchSetup
//              2.5.1   group - id of metric group to be retrieved;
//              2.5.2   callback - function to invoke whent he API response is received.
// --------------------------------------------------------
(function (root, window, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var api = {},

        // Set of constants.
        constants = {
            // HTTP protocol.
            HTTP_PROTOCOL: "http",

            // API URL's.
            URLS: {
                fetch: 'fetch?group={0}',
                fetchColumns: 'fetch_columns?group={0}',
                fetchCount: 'fetch_count?group={0}',
                fetchList: 'fetch_list',
                fetchSetup: 'fetch_setup?group={0}'
            }
        },

        // Returns an endpoint address.
        // @ep          Endpoint to be invoked.
        // @protocol    Communications protocol (ws | http).
        getEndPoint = function (ep, protocol) {
            // Set default protocol.
            if (_.isUndefined(protocol)) {
                protocol = constants.HTTP_PROTOCOL;
            }

            // Append protocol suffix for secure endpoints.
            if (window.location.protocol.indexOf("s") !== -1) {
                protocol += "s";
            }

            // Derive endpoint.
            return "{0}://{1}/api/1/metric/{2}"
                .replace("{0}", protocol)
                .replace("{1}", window.location.host)
                .replace("{2}", ep);
        },

        // Invokes remote API.
        invokeAPI = function (url, callback, payload) {
            var ajaxOptions;

            // Initialize ajax request options.
            ajaxOptions = {
                dataType: "json",
                success: callback,
                url: getEndPoint(url)
            };
            if (payload) {
                _.extend(ajaxOptions, {
                    type: "POST",
                    contentType: "application/json",
                    data: payload
                })
            }

            $.ajax(ajaxOptions);

            // $.getJSON(url, callback);
        };

    // Fetches a group of metrics.
    // @group           ID of a metrics group.
    // @query           Metrics query filter.
    // @callback        Function to invoke when API returns.
    api.fetch = function (group, query, callback) {
        var url;

        // Set target URL.
        url = constants.URLS.fetch;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback, query);
    };

    // Fetches count of lines within a group of metrics.
    // @group           ID of a metrics group.
    // @query           Metrics query filter.
    // @callback        Function to invoke when API returns.
    api.fetchCount = function (group, query, callback) {
        var url;

        // Set target URL.
        url = constants.URLS.fetchCount;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback, query);
    };

    // Fetches list of columns within a group of metrics.
    // @group           ID of a metrics group.
    // @callback        Function to invoke when API returns.
    api.fetchColumns = function (group, callback) {
        var url;

        // Set target URL.
        url = constants.URLS.fetchColumns;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Returns a list of metric groups.
    // @callback        Function to invoke when API returns.
    api.fetchList = function (callback) {
        var url;

        // Set target URL.
        url = constants.URLS.fetchList;

        // Invoke API.
        invokeAPI(url, callback);
    };

    // Fetches list of columns within a group of metrics.
    // @group           ID of a metrics group.
    // @query           Metrics query filter.
    // @callback        Function to invoke when API returns.
    api.fetchSetup = function (group, query, callback) {
        var url;

        // Set target URL.
        url = constants.URLS.fetchSetup;
        url = url.replace("{0}", group);

        // Invoke API.
        invokeAPI(url, callback, query);
    };

    // Expose module.
    root.METRIC_API = api;

}(this, this.window, this.$, this._));
