// --------------------------------------------------------
// app/view.footer.js
// Application footer view.
// --------------------------------------------------------
(function(APP, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Module helper vars.
	var templates = APP.templates.footer;

	// View over the application copyright statement.
	var CopyrightView = Backbone.View.extend({
		className: "pull-left",

		render : function () {
			APP.utils.renderHTML(templates.copyright, APP, this);

			return this;
		}
	});

	// View over the application title.
	var TitleView = Backbone.View.extend({
		className: "pull-right",

		render : function () {
			APP.utils.renderHTML(templates.title, APP, this);

			return this;
		}
	});

	// Application footer view.
	APP.views.FooterView = Backbone.View.extend({
		className: "container app-footer",

		render : function () {
			var subViews = [
				CopyrightView,
				TitleView
			];
			
			APP.utils.render(subViews, {}, this)

			return this;
		}
	});

}(this.APP, this.$jq, this._, this.Backbone));