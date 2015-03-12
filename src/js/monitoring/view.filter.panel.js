(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Inner view.
    var InnerView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "panel-body",

        // Backbone: view renderer.
        render: function () {
            _.each(MOD.state.filters, function (filter) {
                APP.utils.render(MOD.views.FilterItemView, filter, this);
            }, this);

            return this;
        }
    });

    // Outer view.
    MOD.views.FilterPanelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "panel panel-info bg-info",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render(InnerView, this.options, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));