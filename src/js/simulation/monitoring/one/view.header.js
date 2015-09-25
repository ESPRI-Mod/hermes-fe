(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.HeaderView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "header",

        // Backbone: view CSS class.
        className: "bg-primary",

        events: {
            'click .inter-monitoring' : function () {
                MOD.events.trigger("im:openMonitor", MOD.state.simulation);
            },
            'click .simulation-messages' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_MESSAGES_PAGE);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header, {
                simulation: MOD.state.simulation
            }, this);

            return this;
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
