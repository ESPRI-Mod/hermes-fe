(function (MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter label view.
    MOD.views.FilterItemLabelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-label",

        // Backbone: view DOM element type.
        tagName: "label",

        // Backbone: view renderer.
        render: function () {
            this.$el.text(this.options.displayName);
            this.$el.width('40%');

            return this;
        }
    });

}(this.APP.modules.monitoring, this.Backbone));
