(function (APP, MOD, WebSocket, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare variables.
    var buffering = true,
        buffer = [],
        dispatchEvent,
        ws,
        log,
        onOpen,
        onClosed,
        onMessage,
        onError;

    // Logging helper function.
    log = function (msg) {
        MOD.log("WS :: " + msg);
    };

    // Send a ws event module notification.
    dispatchEvent = function (ei) {
        log("triggering event :: ws:" + ei.eventType);
        MOD.events.trigger("ws:" + ei.eventType, ei);
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

        // Get event info.
        ei = JSON.parse(e.data);

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

    // Expose web socket related functions.
    MOD.ws = {
        // Connect to web socket channel.
        connect: function (simulationUID) {
            var ep;

            // Create socket.
            ep = APP.utils.getEndPoint(MOD.urls.WS_ALL, APP.constants.protocols.WS);
            if (simulationUID) {
                ep += "?simulationUID=" + simulationUID;
            }
            log("binding to :: {0}.".replace('{0}', ep));
            ws = new WebSocket(ep);

            // Bind socket event listeners.
            ws.onerror = onError;
            ws.onopen = onOpen;
            ws.onclose = onClosed;
            ws.onmessage = onMessage;

            // Fire event.
            MOD.events.trigger("ws:initialized");
        }
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

}(
    this.APP,
    this.APP.modules.monitoring,
    this.WebSocket,
    this._
));
