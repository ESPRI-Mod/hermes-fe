(function (APP, MOD, WebSocket, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare variables.
    var buffering = true,
        buffer = [],
        dispatchEvent,
        ws,
        log,
        onClosed,
        onError,
        onMessage,
        onOpen;

    // Logging helper function.
    log = function (msg) {
        MOD.log("WS :: " + msg);
    };

    // Send a ws event module notification.
    dispatchEvent = function (ei) {
        log("triggering event :: " + ei.eventType);
        MOD.events.trigger(ei.eventType, ei);
    };

    // On ws connection opened event handler.
    onOpen = function () {
        log("connection opened @ " + new Date());
    };

    // On ws connection closed event handler.
    onClosed = function () {
        log("connection closed @ " + new Date());
        MOD.events.trigger("ws:socketClosed");
    };

    // On ws message received event handler.
    onMessage = function (e) {
        var ei;

        // Filter out keep-alive pongs.
        if (e.data === "pong") {
            log("PONG PONG PONG @ " + new Date());
            return;
        }

        // Log.
        // log("message received :: {0}".replace("{0}", e.data));

        // Get event info.
        ei = JSON.parse(e.data);
        ei.eventType = "ws:" + ei.eventType;

        // Send module notifcation.
        if (buffering) {
            buffer.push(ei);
        } else {
            dispatchEvent(ei);
        }
    };

    // On ws error event handler.
    onError = function (e) {
        log("ws error :: {0}".replace("{0}", e.data));
    };

    // UI initialized event handler.
    MOD.events.on("ui:initialized", function () {
        // Stop buffering.
        buffering = false;

        // Empty buffer.
        _.each(buffer, dispatchEvent);

        // Reset buffer.
        buffer = [];
    });

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        var ep;

        // Create socket.
        ep = APP.utils.getEndPoint(MOD.urls.WS, APP.constants.protocols.WS);
        log("binding to :: {0}.".replace('{0}', ep));
        ws = new WebSocket(ep);

        // Bind socket event listeners.
        ws.onerror = onError;
        ws.onopen = onOpen;
        ws.onclose = onClosed;
        ws.onmessage = onMessage;

        // Fire event.
        MOD.events.trigger("ws:initialized");
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.WebSocket,
    this._
));
