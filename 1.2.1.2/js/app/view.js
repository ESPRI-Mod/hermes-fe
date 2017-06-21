// --------------------------------------------------------
// app/view.js
// Application level main view.
// --------------------------------------------------------
(function(APP, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Primary application view.
    var View = Backbone.View.extend({
        initialize: function () {
            APP.events.on("module:activating", this._onModuleActivating, this);
        },

        render : function () {
            var subViews = [
                APP.views.HeaderView,
                APP.views.ContentView,
                APP.views.ProgressView
            ];

            APP.utils.render(subViews, {}, this)

            return this;
        },

        // On module actviating event handler.
        // @mod   Module being actviated.
        _onModuleActivating: function (mod) {
            var text;

            // Update browser title bar.
            text = "{0} - {1} - {2}";
            text = text.replace("{0}", APP.institute.code);
            text = text.replace("{1}", APP.title);
            text = text.replace("{2}", mod.shortTitle);
            $("head title").text(text);

            // Update module name/version.
            this.$(".module-title").text(mod.title);
            this.$(".module-version").text("v" + mod.version);
        }
    });

    // Extend app views.
    APP.views.MainView = View;

}(this.APP, this.$jq, this._, this.Backbone));