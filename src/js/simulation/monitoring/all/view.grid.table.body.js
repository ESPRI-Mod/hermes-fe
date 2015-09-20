(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table body.
    MOD.views.GridTableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view renderer.
        render : function () {
            _.each(_.range(APP.constants.paging.itemsPerPage), function (rowID) {
                APP.utils.render(MOD.views.GridTableRowView, {
                    model: rowID
                }, this);
            }, this);
            
            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
