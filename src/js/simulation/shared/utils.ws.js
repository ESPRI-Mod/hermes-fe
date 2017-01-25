(function (APP, MOD, WebSocket, $, _) {

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
        MOD.events.trigger("ws:" + ei.eventType, ei);
    };

    // On channel message received event handler.
    var onMessage = function (e) {
        var ei;

        // Skip keep-alive pongs.
        if (e.data === "pong") {
            MOD.events.trigger("ws:ponged");
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
                MOD.events.trigger("ws:error", e);
            };
            channel.onopen = function () {
                MOD.events.trigger("ws:opened");
            };
            channel.onclose = function () {
                MOD.events.trigger("ws:closed");
            };
            channel.onmessage = onMessage;

            // Fire event.
            MOD.events.trigger("ws:initialized", ep);
        }
    };

    // Web socket buffering event handler.
    MOD.events.on("ws:buffering", function () {
        // Escape if already buffering.
        if (buffering === true) {
            return;
        };

        // Recomment buffering.
        buffering = true;

        // Fire event.
        MOD.events.trigger("ws:buffered");
    });

    // Web socket activating event handler.
    MOD.events.on("ws:activating", function () {
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
        MOD.events.trigger("ws:activated");
    });

    MOD.events.on("ws:activated", function () {
        MOD.log("WS: channel activated");
    });
    MOD.events.on("ws:buffered", function () {
        MOD.log("WS: events buffered");
    });
    MOD.events.on("ws:closed", function () {
        MOD.log("WS: channel closed");
    });
    MOD.events.on("ws:error", function (e) {
        MOD.log("WS: ERROR !!! {0}".replace("{0}", e.data));
    });
    MOD.events.on("ws:initialized", function (ep) {
        MOD.log("WS: channel initialized: {0}".replace("{0}", ep));
    });
    MOD.events.on("ws:opened", function () {
        MOD.log("WS: channel opened");
    });
    MOD.events.on("ws:ponged", function () {
        MOD.log("WS: PONG PONG PONG");
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.WebSocket,
    this.$,
    this._
));
