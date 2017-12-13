(function (APP, MOD, EVENTS, WebSocket, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Flag controlling whether events are buffered or not.
    var buffering = true;

    // Event buffer.
    var buffer = [];

    // Web-socket channel.
    var channel;

    // Sends a ws event module notification.
    var dispatchEvent = function (ei) {
        EVENTS.trigger("ws:" + ei.eventType, ei);
    };

    // On channel message received event handler.
    var onMessage = function (e) {
        var ei;

        // Skip keep-alive pongs.
        if (e.data === "pong") {
            EVENTS.trigger("ws:ponged");
            return;
        }

        // Get event info.
        ei = JSON.parse(e.data);

        // Send module notifcation.
        if (buffering === true) {
            buffer.push(ei);
        } else {
            dispatchEvent(ei);
        }
    };

    // Expose web socket related functions.
    MOD.ws = {
        // Connect to web socket channel.
        connect: function (simulationUID) {
            var ep;

            // Create channel.
            ep = APP.utils.getEndPoint(MOD.urls.WS_ALL, APP.constants.protocols.WS);
            if (simulationUID) {
                ep += "?simulationUID=" + simulationUID;
            }
            channel = new WebSocket(ep);

            // Bind socket event listeners.
            channel.onerror = function (e) {
                EVENTS.trigger("ws:error", e);
            };
            channel.onopen = function () {
                EVENTS.trigger("ws:opened");
            };
            channel.onclose = function () {
                EVENTS.trigger("ws:closed");
            };
            channel.onmessage = onMessage;

            // Fire event.
            EVENTS.trigger("ws:initialized", ep);
        }
    };

    // Web socket buffering event handler.
    EVENTS.on("ws:buffering", function () {
        // Escape if already buffering.
        if (buffering === true) {
            return;
        };

        // Recomment buffering.
        buffering = true;

        // Fire event.
        EVENTS.trigger("ws:buffered");
    });

    // Web socket activating event handler.
    EVENTS.on("ws:activating", function () {
        // Escape if already activated.
        if (buffering === false) {
            return;
        };

        // Stop buffering.
        buffering = false;

        // Empty buffer.
        _.each(buffer, dispatchEvent);

        // Reset buffer.
        buffer = [];

        // Fire event.
        EVENTS.trigger("ws:activated");
    });

    EVENTS.on("ws:activated", function () {
        MOD.log("WS: channel activated");
    });
    EVENTS.on("ws:buffered", function () {
        MOD.log("WS: events buffered");
    });
    EVENTS.on("ws:closed", function () {
        MOD.log("WS: channel closed");
    });
    EVENTS.on("ws:error", function (e) {
        MOD.log("WS: ERROR !!! {0}".replace("{0}", e.data));
    });
    EVENTS.on("ws:initialized", function (ep) {
        MOD.log("WS: channel initialized: {0}".replace("{0}", ep));
    });
    EVENTS.on("ws:opened", function () {
        MOD.log("WS: channel opened");
    });
    EVENTS.on("ws:ponged", function () {
        MOD.log("WS: PONG PONG PONG");
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.events,
    this.WebSocket,
    this.$,
    this._
));
