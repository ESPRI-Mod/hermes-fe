(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a grid table row.
    MOD.views.GridTableRowView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view CSS class.
        className : function () {
            return MOD.statesCSS[this.model.executionState];
        },

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                id: 'simulation-' + this.model.uid
            };
        },

        // Backbone: view event handlers.
        events : {
            'click > td.monitoring' : function () {
                MOD.events.trigger("im:openMonitor", this.model);
            },
            'change > td.interMonitoring > input' : function () {
                this.model.isSelectedForIM = !this.model.isSelectedForIM;
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.row, this.model, this);
            if (this.model.isSelectedForIM) {
                this.$('.interMonitoring > input').attr('checked', true);
            }

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates.grid, this.Backbone));