(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.FilterGroupView,
                MOD.views.InfoView1,
                // MOD.views.InfoView2,
                MOD.views.GridView,
                MOD.views.InterMonitoringContextMenuView,
                MOD.views.InterMonitoringFormView,
                MOD.views.WebSocketClosedDialogView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));
