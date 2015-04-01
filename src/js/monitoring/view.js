(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        className: 'table-responsive',

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.WebSocketNotifications,
                MOD.views.FilterPanelView,
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

}(
    this.APP,
    this.APP.modules.monitoring,
    this.Backbone
));
