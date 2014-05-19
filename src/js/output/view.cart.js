// --------------------------------------------------------
// output/view.cart.js
// View over the output shopping cart.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var View = Backbone.View.extend({		
		render : function () {
			this.$el.text("Cart view goes here");

			return this;
		}
	});

	// Extend module.
	MOD.views.CartView = View;

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));