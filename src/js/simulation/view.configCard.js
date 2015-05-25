(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.ConfigCardView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            // this.$el.text(MOD.state.configCard);
            APP.utils.renderHTML(TEMPLATES.configCard, {
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
