(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobComplete", function (data) {
        MOD.processJobEvent("jobComplete", data);
    });

    // Job error event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobError", function (data) {
        MOD.processJobEvent("jobError", data);
    });

    // Job start event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobStart", function (data) {
        MOD.processJobEvent("jobStart", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
