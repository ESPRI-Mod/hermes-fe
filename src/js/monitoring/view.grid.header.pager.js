(function (MOD, PAGING, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid pager view.
    MOD.views.GridHeaderPagerView = Backbone.View.extend({
        // Backbone: view HTML tag name.
        tagName: 'span',

        // Backbone: view CSS class.
        className: 'pagination pull-right',

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                role: 'toolbar'
            };
        },

        // Backbone: view event handlers.
        events : {
            'change .pagination-info' : function () {
                this._onNavManual(this.$('.pagination-info').val());
            },

            'click .pagination-first' : "_onNavToFirst",
            'click .pagination-previous' : "_onNavToPrevious",
            'click .pagination-next' : "_onNavToNext",
            'click .pagination-last' : "_onNavToLast"
        },

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
            MOD.events.on("state:simulationStart", this._onSimulationStart, this);
            MOD.events.on("ui:pagination", this._onPagination, this);
        },

        // Backbone: view renderer.
        render: function () {
            this.$el.append(TEMPLATES.pager());
            this._onSimulationListFiltered();

            return this;
        },

        // Event handler: manual navigatation.
        _onNavManual: function (pageNumber) {
            pageNumber = parseInt(pageNumber, 10);
            if (_.isNaN(pageNumber)) {
                this.$('.pagination-info').val("");
                return;
            }
            if (pageNumber < 1 ||
                pageNumber > PAGING.pages.length) {
                this.$('.pagination-info').val("");
                return;
            }
            if (PAGING.current === PAGING.pages[pageNumber - 1]) {
                this.$('.pagination-info').val("");
                return;
            }

            this.$('.pagination-info').val("");
            PAGING.current = PAGING.pages[pageNumber - 1];
            MOD.events.trigger('ui:pagination');
        },

        // Event handler: navigate to first page.
        _onNavToFirst: function () {
            if (!PAGING.pages) {
                return;
            }
            if (PAGING.current === _.first(PAGING.pages)) {
                return;
            }

            PAGING.current = _.first(PAGING.pages);
            MOD.events.trigger('ui:pagination');
        },

        // Event handler: navigate to previous page.
        _onNavToPrevious: function () {
            if (!PAGING.pages) {
                return;
            }
            if (PAGING.current === _.first(PAGING.pages)) {
                return;
            }

            PAGING.current = PAGING.pages[PAGING.current.id - 2];
            MOD.events.trigger('ui:pagination');
        },

        // Event handler: navigate to next page.
        _onNavToNext: function () {
            if (!PAGING.pages) {
                return;
            }
            if (PAGING.current === _.last(PAGING.pages)) {
                return;
            }

            PAGING.current = PAGING.pages[PAGING.current.id];
            MOD.events.trigger('ui:pagination');
        },

        // Event handler: navigate to last page.
        _onNavToLast: function () {
            if (!PAGING.pages) {
                return;
            }
            if (PAGING.current === _.last(PAGING.pages)) {
                return;
            }

            PAGING.current = _.last(PAGING.pages);
            MOD.events.trigger('ui:pagination');
        },

        // Sets text box displaying current page info.
        _setText: function () {
            var text;

            text = "Page ";
            text += PAGING.current ? PAGING.current.id : '0';
            text += " of ";
            text += PAGING.count;
            this.$('.pagination-info').attr('placeholder', text);
        },

        // Filtered event handler.
        _onSimulationListFiltered : function () {
            // Escape if not required.
            if (PAGING.count < 2) {
                this.$el.hide();
                return;
            }

            this.$el.show();
            this._setText();
        },

        // Null filter event handler.
        _onSimulationListNull: function () {
            this._onSimulationListFiltered();
        },

        // Pagination event handler.
        _onPagination : function () {
            this._setText();
        },

        // Simulation start event handler.
        // @ei      Event information.
        _onSimulationStart: function () {
            this._onSimulationListFiltered();
        }
    });

}(
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state.paging,
    this.APP.modules.monitoring.templates.grid,
    this._,
    this.Backbone
));
