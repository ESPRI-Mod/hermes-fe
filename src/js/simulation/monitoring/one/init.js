(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
		MOD.events.trigger("ws:initialized");
    });

    // APP.events.trigger("module:initialized", MOD);
}(
    this.APP,
    this.APP.modules.monitoring,
    this.$
));
