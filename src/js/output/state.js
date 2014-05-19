// --------------------------------------------------------
// output/state.js
// Manages module level state.
// --------------------------------------------------------
(function(APP, MOD) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Module state.
	var state = MOD.state = {
		// Current group.
		group: undefined,

		// List of groups.
		groupList: [],
	};

	// Setup data loaded event handler.
	// @data 	Setup data loaded from remote server.
	MOD.events.on("state:setupDataLoaded", function (data) {
		// TODO Cache setup data.

        // Fire event.
        MOD.events.trigger("state:initialized", this);
	});

}(this.APP, this.APP.modules.output));
