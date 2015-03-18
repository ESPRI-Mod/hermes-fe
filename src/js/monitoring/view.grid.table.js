(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table.
    MOD.views.GridTableView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "table table-hover table-bordered table-condensed monitoring-table",

        // Backbone: view DOM element type.
        tagName : "table",

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
        render : function () {
            var subViews = [
                MOD.views.GridTableHeaderView,
                MOD.views.GridTableBodyView
            ];

            APP.utils.render(subViews, {}, this);

            return this;
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this.$el.show();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$el.show();
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));