// --------------------------------------------------------
// output/main.js
// Module entry point.
// --------------------------------------------------------
(function(APP, utils, constants, $) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Declare module.
	var MOD = APP.registerModule("output", {
		// Module title.
		title: "Simulation Output",

		// Module short title.
		shortTitle: "Output",

		// Module version.
		version : "0.1.0",

		// Module key aliases.
		keyAliases: ["search"]
	});

	// Module ready event handler.
	MOD.events.on("module:ready", function () {
		// TODO Load setup data & fire event.
		MOD.events.trigger("state:setupDataLoaded", {});
	});

	// State initialization event handler.
	MOD.events.on("state:initialized", function () {
		// Render view.
		MOD.view = new MOD.views.MainView();
		MOD.view.render();

		// Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire event.
		MOD.events.trigger("ui:initialized");		
	});

}(this.APP, this.APP.utils, this.APP.constants, this.$jq));