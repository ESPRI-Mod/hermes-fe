// --------------------------------------------------------
// monitoring/templates.js
// Set of module templates.
// --------------------------------------------------------
(function(MOD) {

	// ECMAScript 5 Strict Mode
	"use strict";

	_.extend(MOD.templates, {
		info: {
			pagerItem: "<a href='#'><%- id %></ a>"
		},

		grid: {
			header: "<tr class='bg-primary'>\n\
						<th title='Activity'>Activity</th>\n\
						<th title='Name' class='col-md-2'>Name</th>\n\
						<th title='Node - Machine'>Node - Machine</th>\n\
						<th title='Login'>Login</th>\n\
						<th title='Tag / Model'>Tag / Model</th>\n\
						<th title='Space'>Space</th>\n\
						<th title='Experiment' class='col-md-2'>Experiment</th>\n\
						<th title='Start'>Start</th>\n\
						<th title='End'>End</th>\n\
					</tr>",

			row: "<td class='activity' title='<%= activity %>'><%= activity %></td>\n\
	 			  <td class='name' title='<%= name %>'><%= name %></td>\n\
				  <td class='computeNodeMachine' title='<%= computeNodeMachine %>'><%= computeNodeMachine %></td>\n\
				  <td class='computeNodeLogin' title='<%= computeNodeLogin %>'><%= computeNodeLogin %></td>\n\
				  <td class='model' title='<%= model %>'><%= model %></td>\n\
				  <td class='space' title='<%= space %>'><%= space %></td>\n\
				  <td class='experiment' title='<%= experiment %>'><%= experiment %></td>\n\
				  <td class='executionStartDate' title='<%= executionStartDate %>'><%= executionStartDate %></td>\n\
				  <td class='executionEndDate' title='<%= executionEndDate %>'><%= executionEndDate %></td>"
		},
	});

}(this.APP.modules.monitoring));
