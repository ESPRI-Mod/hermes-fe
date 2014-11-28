(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.FilterView,
                MOD.views.InfoView,
                MOD.views.GridView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));
