(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table header.
    MOD.views.GridTableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.gridHeader, {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
