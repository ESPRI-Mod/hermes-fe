(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        MOD.ws.connect();
    });

}(
    this.APP.modules.monitoring
));
