// --------------------------------------------------------
// output/view.filter.js
// View over the output filter.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	MOD.views.FilterView = Backbone.View.extend({		
		render : function () {
			this.$el.text("Filter view goes here");

			return this;
		}
	});

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));