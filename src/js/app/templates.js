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

		// Progress bar.
        progress:
            "<div class='modal-dialog'>\n\
                <div class='modal-content'>\n\
                    <div class='modal-header'>\n\
                        <h4 class='modal-title'>Prodiguer <span class='feedback-module-title'></span>\n\
                            <small class='feedback-module-version'></small>\n\
                        </h4>\n\
                    </div>\n\
                    <div class='modal-body'>\n\
                        <p><strong id='feedbackText'>Initializing ... please wait<strong></p>\n\
                        <div class='progress'>\n\
                          <div class='progress-bar progress-bar-info progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%;'>\n\
                            <span class='sr-only'>100% Complete</span>\n\
                          </div>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
            </div>",

		// Footer templates.
		footer: {
			copyright: "<span class='app-copyright'>©&nbsp;<%= copyrightYear %>&nbsp;<%= institute.code %></span>",

			title: "<span class='app-title'><%= title %></span>\n\
		    		<span class='module-title'></span>\n\
					<small class='module-version'></small>"
		}
	});

}(this.APP));