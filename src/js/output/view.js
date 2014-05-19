// --------------------------------------------------------
// metric/view.js
// Module level main view.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	var NavTabsView = Backbone.View.extend({
		render : function () {
			APP.utils.renderHTML(NavTabsView.HTML, {}, this)

			return this;
		}
	}, {
		HTML : _.template("<ul class='nav nav-tabs nav-justified'>\n\
			<li class='active'><a href='#outputFilter' data-toggle='tab'>Filter</a></li>\n\
			<li class=''><a href='#outputResults' data-toggle='tab'>Results</a></li>\n\
			<li class=''><a href='#outputCart' data-toggle='tab'>Cart</a></li>\n\
			<li class=''><a href='#outputScripts' data-toggle='tab'>Scripts</a></li>\n\
		</ul>")
	});

	var TabPanesView = Backbone.View.extend({
		render : function () {
			APP.utils.renderHTML(TabPanesView.HTML, {}, this)

			return this;
		}
	}, {
		HTML : _.template("<div class='tab-content'>\n\
			<div class='tab-pane active' id='outputFilter'><h1>Filter goes here</h1></div>\n\
			<div class='tab-pane' id='outputResults'><h1>Select datasets here</h1></div>\n\
			<div class='tab-pane' id='outputCart'><h1>Cart review goes here</h1></div>\n\
			<div class='tab-pane' id='outputScripts'><h1>Script generator goes here</h1></div>\n\
  		</div>")
	});	

	MOD.views.MainView = Backbone.View.extend({
		render : function () {
			var subViews = [
				NavTabsView,
				TabPanesView,
				// MOD.views.FacetsView,
				// MOD.views.ResultsView,
				// MOD.views.CartView,
				// MOD.views.ScriptsView,
			];

			APP.utils.render(subViews, {}, this);


			return this;
		}
	});

}(this.APP, this.APP.modules.output, this.$jq, this._, this.Backbone));