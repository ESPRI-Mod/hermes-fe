// --------------------------------------------------------
// output/view.results.js
// View over the output results.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var View = Backbone.View.extend({		
		render : function () {
			this.$el.text("Results view goes here");

			return this;
		}
	});

	// Extend module.
	MOD.views.ResultsView = View;

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));