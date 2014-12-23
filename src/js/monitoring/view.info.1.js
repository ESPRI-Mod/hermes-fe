(function (APP, MOD, PAGING, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a pager item.
    var PagerItemView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : 'li',

        // Backbone: view CSS class.
        className: function () {
            return 'page-' + this.model.id;
        },

        // Backbone: view event handlers.
        events : {
            'click a' : "_onPageSelect"
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.append(TEMPLATES.pagerItem(this.model));
            if (PAGING.current && PAGING.current.id === this.model.id) {
                this.$el.addClass('active');
            }

            return this;
        },

        // On page select event handler.
        _onPageSelect : function () {
            if (PAGING.current.id !== this.model.id) {
                PAGING.previous = PAGING.current;
                PAGING.current = this.model;
                MOD.events.trigger('ui:pagination');
            }
        },
    });

    // View over the pager.
    MOD.views.InfoPagerView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : 'ul',

        // Backbone: view CSS class.
        className : 'pagination pull-right',

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
            MOD.events.on("ui:pagination", this._onPagination, this);
        },

        // Backbone: view renderer.
        render : function () {
            this._onSimulationListFiltered();

            return this;
        },

        // Null filter event handler.
        _onSimulationListNull: function () {
            this.$('li').remove();
        },

        // Filtered event handler.
        _onSimulationListFiltered : function () {
            // Delete previous.
            this.$('li').remove();

            // Escape if not required.
            if (PAGING.count < 2) {
                return;
            }

            // Append pages.
            _.each(PAGING.pages, function (page) {
                APP.utils.render(PagerItemView, _.defaults({
                    model : page
                }, this.options), this);
            }, this);
        },

        // Pagination event handler.
        _onPagination : function () {
            if (PAGING.previous) {
                this.$('li.page-' + PAGING.previous.id).removeClass('active');
            }
            this.$('li.page-' + PAGING.current.id).addClass('active');
        },

        // New simulation event handler.
        // @ei      Event information.
        _onNewSimulation: function () {
            this._onSimulationListFiltered();
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state.paging,
    this.APP.modules.monitoring.templates.info,
    this._,
    this.Backbone
));
