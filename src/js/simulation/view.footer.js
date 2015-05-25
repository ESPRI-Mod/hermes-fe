(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Secondary view.
    MOD.views.FooterView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "module-footer",

        // Backbone: view HTML tag.
        tagName : "footer",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.footer, {
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
