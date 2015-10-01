(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        // Connect to web-socket channel.
        MOD.ws.connect();
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.$
));
