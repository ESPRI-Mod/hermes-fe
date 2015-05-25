(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a grid table row.
    MOD.views.GridTableRowView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view CSS class.
        className : function () {
            return MOD.statesCSS[this.model.ext.executionState];
        },

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                id: 'simulation-' + this.model.uid
            };
        },

        // Backbone: view event handlers.
        events : {
            'click > td.row-link' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_PAGE);
                url = url.replace("{uid}", this.model.uid);
                APP.utils.openURL(url, true);
            },
            'click > td.monitoring' : function () {
                MOD.events.trigger("im:openMonitor", this.model);
            },
            'change > td.interMonitoring > input' : function () {
                this.model.ext.isSelectedForIM = !this.model.ext.isSelectedForIM;
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.row, this.model, this);
            if (this.model.ext.isSelectedForIM) {
                this.$('.interMonitoring > input').attr('checked', true);
            }

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates.grid, this.Backbone));
