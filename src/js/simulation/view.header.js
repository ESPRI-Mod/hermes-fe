(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.HeaderView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "header",

        // Backbone: view CSS class.
        className: "bg-primary",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header, {
                APP: APP,
                MOD: MOD,
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
