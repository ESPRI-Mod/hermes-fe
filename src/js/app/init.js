// --------------------------------------------------------
// app/init.js
// Application initializer.
// --------------------------------------------------------
(function(APP) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Document ready event handler.
	$(document).ready(function() {
		var mainView, 
			moduleName, 
			moduleAliases = {
				monitor: "monitoring"
			};

		// Compile templates.
		APP.utils.compileTemplates(APP.templates);
		_.each(APP.state.moduleList, function (mod) {
			APP.utils.compileTemplates(mod.templates);
		});

		// Set initial module.
		moduleName = APP.utils.getURLParam("module", APP.constants.defaultModule);
		APP.state.module = APP.getModule(moduleName);

		// Render main view.
		mainView = new APP.views.MainView();
		mainView.render();

		// Fire events.
		APP.events.trigger("app:ready");
		APP.events.trigger("module:loading", APP.state.module);

		// Update DOM.
        $("body").append(mainView.$el);
	});

}(this.APP));