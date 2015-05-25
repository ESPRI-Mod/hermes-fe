(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the set of jobs run during the lifetime of a simulation.
    MOD.views.JobHistoryView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory, {
                APP: APP,
                MOD: MOD,
                simulation: MOD.state.simulation
            }, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.simulation,
    this.APP.modules.simulation.templates,
    this.Backbone
));
