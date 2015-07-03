// --------------------------------------------------------
// output/view.scripts.js
// View over the output scripts.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var View = Backbone.View.extend({		
		render : function () {
			this.$el.text("Scripts view goes here");

			return this;
		}
	});

	// Extend module.
	MOD.views.ScriptsView = View;

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));