(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        // Connect to web-socket channel.
        MOD.ws.connect();
    });

}(
    this.APP.modules.monitoring
));
