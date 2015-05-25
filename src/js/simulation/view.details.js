(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.DetailsView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.details, {
                APP: APP,
                MOD: MOD,
                simulation: MOD.state.simulation,
                year: new Date().getFullYear()
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
