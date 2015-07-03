// --------------------------------------------------------
// output/view1.js
// Module level main view.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var View = Backbone.View.extend({
		tagName: "h1",
		render : function () {
			this.$el.text("TODO : build view for output");

			return this;
		}
	});

	// Extend module.
	MOD.views.MainView = View;	

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));