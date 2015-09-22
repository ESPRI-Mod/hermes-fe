(function (APP, MOD, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";
    
    // View over previous try select option.
    var PreviousTrySelectOptionView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "option",
        
        attributes: function () {
            return {
                value: this.model                
            };
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.text(this.model ? this.model : "");

            return this;
        }
    });    

    // View over previous try select.
    var PreviousTrySelectView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "select",
        
        // Backbone: view event handlers.
        events: {
            "change": function () {
                this._openPreviousTry(this.$el.val());
            }
        },
        
        // Backbone: view renderer.
        render : function () {
            _.each(_.range(MOD.state.simulation.tryID), function (tryID) {
                APP.utils.render(PreviousTrySelectOptionView, {
                    model: tryID
                }, this);                
            }, this);

            return this;
        },
        
        // Opens the previous try in a new browser tab.
        _openPreviousTry : function (tryID) {
            var url;
            
            if (tryID > 0) {
                url = APP.utils.getPageURL(MOD.urls.SIMULATION_PAGE);
                url = url.replace("{hashid}", MOD.state.simulation.hashid);
                url = url.replace("{tryID}", tryID);
                APP.utils.openURL(url, true);                
            }            
        }
    });    

    // View over simulation details.
    MOD.views.DetailsView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.details, {
                APP: APP,
                MOD: MOD,
                simulation: MOD.state.simulation,
                year: new Date().getFullYear()
            }, this);
            if (MOD.state.simulation.tryID > 1) {
                APP.utils.render(PreviousTrySelectView, {}, this.$('.previous-try'));                
            }
            
            return this;
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this._,
    this.Backbone
));
