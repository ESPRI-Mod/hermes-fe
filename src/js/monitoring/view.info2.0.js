(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Inner view.
    var InnerView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "alert bg-primary",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.Info2StatsView,
                MOD.views.InfoPagerView
            ], {}, this);

            return this;
        }
    });

    // Secondary view.
    MOD.views.InfoView2 = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render(InnerView, {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates, this.Backbone));
