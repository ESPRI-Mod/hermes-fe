(function (APP, Cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var _OPTS = {
            expires: 3650
        },

        formatName = function (name) {
            return "hermes-fe--" + APP.version + "--" + name;
        };

    // Set cookie value.
    APP.setCookie = function (name, value) {
        name = formatName(name);
        Cookies.set(name, value, _OPTS);
    };

    // Set cookie default value.
    APP.setCookieDefault = function (name, defaultValue) {
        name = formatName(name);
        Cookies.set(name, Cookies.get(name) || defaultValue, _OPTS);
    };

    // Get cookie value.
    APP.getCookie = function (name) {
        name = formatName(name);
        return Cookies.get(name);
    };
}(
    this.APP,
    this.Cookies
));
