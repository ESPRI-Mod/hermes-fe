(function (APP, MOD, TEMPLATES, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table header.
    MOD.views.GridTableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view event handlers.
        events : {
            'mouseup > tr > th.interMonitoring': _.debounce(function(e) {
                if (this.doucleckicked) {
                    this.doucleckicked = false;
                } else {
                    MOD.events.trigger("im:openInterMonitor");
                }
            }, 300),
            'dblclick > tr > th.interMonitoring': function(e) {
                _.each(MOD.state.simulationList, function (simulation) {
                    simulation.isSelectedForIM = false;
                });
                $("td.interMonitoring > input").attr("checked", false);
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header, {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates.grid, this.jq, this._, this.Backbone));
