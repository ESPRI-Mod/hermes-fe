(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid inter-monitoring context menu.
    MOD.views.GridTableIMContextMenuView = Backbone.View.extend({
        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                id: "imContextMenu"
            };
        },

        // Backbone: view event handlers.
        events: {
            'click .open': function () {
                MOD.events.trigger("im:openInterMonitor");
            },
            'click .clear': function () {
                MOD.events.trigger("im:clear");
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.contextMenu, {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates.grid,
    this.Backbone
));