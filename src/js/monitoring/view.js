(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.FilterPanelView,
                MOD.views.WebSocketNotifications,
                MOD.views.GridHeaderView,
                MOD.views.GridTableView,
                MOD.views.InterMonitoringContextMenuView,
                MOD.views.InterMonitoringFormPostView,
                MOD.views.WebSocketClosedDialogView,
                MOD.views.FooterView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));
