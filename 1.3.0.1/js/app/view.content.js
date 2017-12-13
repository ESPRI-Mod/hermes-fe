// --------------------------------------------------------
// app/view.content.js
// Application content view.
// --------------------------------------------------------
(function(APP, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var View = Backbone.View.extend({
        className: "container app-content"
    });

    // Extend app views.
    APP.views.ContentView = View;

}(this.APP, this.$jq, this._, this.Backbone));