// --------------------------------------------------------
// Simulation monitor - ws.js
// Monitoring websocket handler.
// --------------------------------------------------------
(function(APP, MOD) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Forward declare variables.
	var ws, 
		log, 
		notify, 
		onOpen, 
		onClosed, 
		onMessage, 
		buffering = true, 
		buffer = [];

	// Logging helper function.
	log = function (msg) {
		MOD.log("WS :: " + msg);
	};

	// Send a ws event module notification.
	notify = function (ei) {
		// Format event info where appropriate.
		if (ei.eventType === "ws:stateChange") {
			ei.state = ei.state.toUpperCase();
		}

		// Fire event.
		log("triggering event :: " + ei.eventType);
		MOD.events.trigger(ei.eventType, ei);			
	};

	// On ws connection opened event handler.
	onOpen = function (e) {
		log("connection opened");
	};

	// On ws connection closed event handler.
	onClosed = function (e) {
		log("connection closed");
	};

	// On ws message received event handler.
	onMessage = function (e) {
		var ei, msg, s, fire=true;

		// Log.
		log("message received :: {0}".replace("{0}", e.data));

		// Get event info.
		ei = JSON.parse(e.data);
		ei.eventType = "ws:" + ei.eventType;

		// Send module notifcation.		
		if (buffering) {
			buffer.push(ei);
		} else {
			notify(ei);
		}
	};

	// UI initialized event handler.
	MOD.events.on("ui:initialized", function() {
		// Stop buffering.
		buffering = false;

		// Empty buffer.
		_.each(buffer, notify);
		buffer = [];
	});

	// UI ready event handler.
	MOD.events.on("module:ready", function() {
		var ep;

		// Create socket.
		ep = APP.utils.getEndPoint(APP.constants.urls.MONITORING_WS, APP.constants.protocols.WS);
		log("binding to :: {0}.".replace('{0}', ep));
		ws = new WebSocket(ep);

		// Bind socket event listeners.
		ws.onopen = onOpen;
		ws.onclose = onClosed;
		ws.onmessage = onMessage;

		// Fire event.
		MOD.events.trigger("ws:initialized");
	});

}(this.APP, this.APP.modules.monitoring));
