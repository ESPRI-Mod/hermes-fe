// --------------------------------------------------------
// monitoring/view.js
// Module level main view.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var View = Backbone.View.extend({
		render : function () {
			var subViews = [
				MOD.views.FilterView,
				MOD.views.InfoView,
				MOD.views.GridView
			];
			
			APP.utils.render(subViews, {}, this)

			return this;
		}
	});

	// Extend module.
	MOD.views.MainView = View;	

}(this.APP, this.APP.modules.monitoring, this.$jq, this._, this.Backbone));