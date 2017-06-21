(function (APP, _, Cookies) {

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

    // Sync cookies when application version is bumped.
    if (APP.getCookie("meta") === undefined) {
        console.log(new Date() + " :: [INFO] :: " + "HERMES :: syncing cookies");
        _.each(_.keys(Cookies.get()), function (k) {
            console.log(k + " :: " + k.split("--").length);
            if (k.split("--").length !== 3) {
                console.log("removing obsolete : " + k);
                Cookies.remove(k);
            } else if (
                k.split("--")[0] === 'hermes-fe' &&
                k.split("--")[1] !== APP.version) {
                APP.setCookie(k.split("--")[2], Cookies.get(k));
                Cookies.remove(k);
            }
        });
        APP.setCookie("meta", true);
    }

}(
    this.APP,
    this._,
    this.Cookies
));
