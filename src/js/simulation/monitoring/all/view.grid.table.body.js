(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table body.
    MOD.views.GridTableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",
        
        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationStart", this._updateRow, this);
            MOD.events.on("state:simulationComplete", this._updateRow, this);
            MOD.events.on("state:simulationError", this._updateRow, this);
            MOD.events.on("state:jobStart", this._updateRow, this);
            MOD.events.on("state:jobComplete", this._updateRow, this);
            MOD.events.on("state:jobError", this._updateRow, this);            
        },                

        // Backbone: view renderer.
        render : function () {
            _.each(_.range(APP.constants.paging.itemsPerPage), function (rowID) {
                APP.utils.render(MOD.views.GridTableRowView, {
                    model: rowID
                }, this);
            }, this);
            
            return this;
        },
        
        // Updates a grid row in response to a web-socket event.
        _updateRow : function (ei) {
            var $row;
            
            
            $row = _.find(MOD.state.gridRowViews, function (rowView) {
                return rowView.simulation && 
                       rowView.simulation.uid == ei.simulation.uid;
            });
            if ($row) {
                $row.simulation = ei.simulation;                
                $row.update(true);              
            }
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
