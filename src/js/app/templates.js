// --------------------------------------------------------
// app/templates.js
// Application level templates.
// --------------------------------------------------------
(function(APP) {

	// ECMAScript 5 Strict Mode
	"use strict";

	_.extend(APP.templates, {
		// Header templates.
		header: {
			title: "<span class='app-title'><%= title %></span>\n\
		    		<span class='module-title'></span>",

		    menuItem: "<input type='radio' name='options' /><%= shortTitle %>"		
		},

		// Footer templates.
		footer: {
			copyright: "<span class='app-copyright'>©&nbsp;<%= copyrightYear %>&nbsp;<%= institute.code %></span>",

			title: "<span class='app-title'><%= title %></span>\n\
		    		<span class='module-title'></span>\n\
					<small class='module-version'></small>"
		}
	});

}(this.APP));