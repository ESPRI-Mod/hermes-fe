(function (document, APP, MOD, PAGING, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view event handlers.
        events : {
            // Open simulation detail page.
            'click table tbody tr td:not(.monitoring):not(.inter-monitoring)' : function (e) {
                this._openSimulationDetailPage($(e.target).parent().attr("id") ||
                                               $(e.target).parent().parent().attr("id"));
            },

            // Open monitoring page.
            'click table tbody tr td.monitoring' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                MOD.events.trigger("im:openMonitor", s);
            },

            // Toggle inter-monitoring selection.
            'change table tbody tr td.inter-monitoring > input' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                s.ext.isSelectedForIM = !s.ext.isSelectedForIM;
            },

            // Open inter-monitoring page.
            'click #inter-monitoring-context-menu a.open' : function () {
                MOD.events.trigger("im:openInterMonitor");
            },

            // Clear inter-monitoring selections.
            'click #inter-monitoring-context-menu a.clear' : function () {
                MOD.events.trigger("im:clearInterMonitor");
            },

            // Pager: navigate to manually chosen page.
            'change .pagination-info' : function (e) {
                var pageNumber;

                pageNumber = parseInt($(e.target).val(), 10);
                $(e.target).val("");
                if (_.isNaN(pageNumber) === false &&
                    pageNumber > 0 &&
                    pageNumber <= PAGING.pages.length &&
                    PAGING.current !== PAGING.pages[pageNumber - 1]) {
                    PAGING.current = PAGING.pages[pageNumber - 1];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },

            // Pager: navigate to first page.
            'click .pagination-first' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = _.first(PAGING.pages);
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },

            // Pager: navigate to previous page.
            'click .pagination-previous' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id - 2];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },

            // Pager: navigate to next page.
            'click .pagination-next' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },

            // Pager: navigate to last page.
            'click .pagination-last' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = _.last(PAGING.pages);
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },

            // Pager: page-size change.
            'change .pagination-page-size' : function (e) {
                MOD.events.trigger('state:pageSizeChange', $(e.target).val());
            },

            // Sorting: change sort field / order.
            'click .sort-target' : function (e) {
                MOD.updateSortedSimulationList(_.find($(e.target).attr('class').split(' '), function (cls) {
                    return cls.startsWith('sort-target-');
                }).slice(12));
            },

            // Reopen page when web socket closed.
            'click #ws-close-dialog-refresh-page-button' : function () {
                var baseURL, url;

                // Construct URL.
                url = baseURL = APP.utils.getBaseURL();
                _.each(MOD.state.filters, function (filter) {
                    if (filter.cvTerms.current && filter.cvTerms.current.name !== '*') {
                        url += url === baseURL ? '?' : '&';
                        url += filter.key;
                        url += '=';
                        url += filter.cvTerms.current.name;
                    }
                });

                // Redirect.
                APP.utils.openURL(url);
            },

            // Filter: select value change.
            'select2:select': function (e) {
                MOD.updateSelectFilterValue($(e.target).attr("id").split("-")[2],
                                            $(e.target).val());
            },

            // Permalink open button click.
            'click #btn-permalink-open': function (e) {
                $("#grid-permalink-row").removeClass('hidden');
                $("#grid-stats-pager-row").addClass('hidden');
            },

            // Permalink copy button click.
            'click #btn-permalink-copy': function (e) {
                var permalink;

                permalink = document.querySelector('#permalink');
                permalink.setSelectionRange(0, permalink.value.length + 1);
                document.execCommand('copy');
            },

            // Permalink close button click.
            'click #btn-permalink-close': function (e) {
                window.getSelection().removeAllRanges();
                $("#grid-permalink-row").addClass('hidden');
                $("#grid-stats-pager-row").removeClass('hidden');
            },

            'keyup #text-filter': function (e) {
                MOD.events.trigger('textFilter:updated', $(e.target).val());
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // UI initialisation events.
            MOD.events.on("ui:initialized", this._setSortColumn, this);
            MOD.events.on("ui:initialized", function () {
                _.each(MOD.state.filters, this._setFilterSelector, this);
            }, this);

            // Sorting events.
            MOD.events.on("state:simulationListSortOrderChanging", this._clearSortColumn, this);
            MOD.events.on("state:simulationListSortOrderChanged", this._setSortColumn, this);
            MOD.events.on("state:simulationListSortOrderToggled", this._toggleSortColumn, this);
            MOD.events.on("state:simulationListSorted", this._updateGrid, this);
            MOD.events.on("state:simulationListSorted", this._updateGridPager, this);

            // Pagination events.
            MOD.events.on("state:simulationPageUpdate", this._updateGrid, this);
            MOD.events.on("state:simulationPageUpdate", this._updateGridPager, this);

            // Filter events.
            MOD.events.on("state:filterOptionsUpdate", this._setFilterSelector, this);
            MOD.events.on("state:filtersUpdated", this._updatePermlink, this);

            // Simulation list filtered event.
            MOD.events.on("state:simulationListUpdate", this._updateStatisticsInfo, this);
            MOD.events.on("state:simulationListUpdate", this._updateGrid, this);
            MOD.events.on("state:simulationListUpdate", this._updateGridPager, this);

            // Simulation update events.
            MOD.events.on("state:simulationUpdate", this._updateNotificationInfo, this);

            // Job update events.
            MOD.events.on("state:jobUpdate", this._updateNotificationInfo, this);
            MOD.events.on("state:jobUpdate", this._updateGridRow, this);

            // Other events.
            MOD.events.on("ws:socketClosed", this._displayWebSocketClosedDialog, this);
            MOD.events.on("im:postInterMonitorForm", this._openInterMonitoringPage, this);
        },

        // Backbone: view renderer.
        render : function () {
            _.each([
                "notification-info-template",
                "filter-panel-template",
                "grid-template",
                "im-context-menu-template",
                "ws-close-dialog-template"
                ], function (template) {
                APP.utils.renderTemplate(template, MOD.state, this);
            }, this);

            return this;
        },

        _setFilterSelector: function (f) {
            if (f.$view) {
                f.$view.select2("destroy");
                f.$view.html("");
            }
            f.$view = $("#filter-selector-" + f.key);
            f.$view.select2({
                allowClear: false,
                minimumResultsForSearch: 8,
                placeholder: "All",
                data: f.cvTerms.active
            });
            f.$view.val(f.cvTerms.current.id).trigger("change");
        },

        _setSortColumn: function () {
            if (MOD.state.sorting.direction === 'asc') {
                this.$('.glyphicon.sort-target-' + MOD.state.sorting.field).addClass('glyphicon-menu-up');
            } else {
                this.$('.glyphicon.sort-target-' + MOD.state.sorting.field).addClass('glyphicon-menu-down');
            }
        },

        _toggleSortColumn: function () {
            this._clearSortColumn();
            this._setSortColumn();
        },

        _clearSortColumn: function () {
            this.$('.glyphicon.sort-target-' + MOD.state.sorting.field).removeClass('glyphicon-menu-up');
            this.$('.glyphicon.sort-target-' + MOD.state.sorting.field).removeClass('glyphicon-menu-down');
        },

        _updateNotificationInfo: function (ei) {
            if (ei.simulation) {
                ei.simulationDetailURL = this._getSimulationDetailURL(ei.simulation.uid);
                ei.eventTypeDescription = MOD.getEventDescription(ei);
            }
            this._replaceNode('#notification-info', 'notification-info-template', ei);
        },

        _updateStatisticsInfo: function () {
            var text;

            text = "Total simulations = ";
            text += MOD.state.simulationList.length;
            text += ". Filtered simulations = ";
            text += MOD.state.simulationListFiltered.length;
            text += ".";
            this.$('.simulation-stats').text(text);
        },

        _updateGridPager: function () {
            var text;

            this.$('.pagination').removeClass('hidden');
            if (PAGING.count < 2) {
                this.$('.pagination').addClass('hidden');
            }
            text = "Page ";
            text += PAGING.current ? PAGING.current.id : '0';
            text += " of ";
            text += PAGING.count;
            this.$('.pagination-info').attr('placeholder', text);
        },

        _updateGrid: function () {
            this._replaceNode('tbody', 'grid-body-template', MOD.state);
        },

        _updateGridRow: function (ei) {
            var s;

            s = this._getSimulation(ei.simulation.uid);
            if (s) {
                this._replaceNode('#' + ei.simulation.uid, "grid-row-template", {
                    s: ei.simulation,
                    MOD: MOD
                });
            }
        },

        _updatePermlink: function () {
            MOD.log("permalink updated: " + MOD.getPersistentURL());
            $("#permalink").val(MOD.getPersistentURL());
        },

        _displayWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
        },

        _openSimulationDetailPage: function (uid) {
            APP.utils.openURL(this._getSimulationDetailURL(uid), true);
        },

        _openInterMonitoringPage: function (urls) {
            var imForm;

            imForm = APP.utils.renderTemplate("im-form-template", {
                httpPostTarget: MOD.urls.IM.httpPostTarget,
                urls: urls
            });
            $(imForm).appendTo('body').submit();
            $("#inter-monitoring-form").remove();
        },

        _getSimulation: function (uid) {
            return _.find(MOD.state.paging.current.data, function (s) {
                return s.uid === uid;
            });
        },

        _getSimulationDetailURL: function (uid) {
            return APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE).replace("{uid}", uid);
        },

        _replaceNode: function (nodeSelector, template, templateData) {
            this.$(nodeSelector).replaceWith(APP.utils.renderTemplate(template, templateData));
        }
    });

}(
    this.document,
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state.paging,
    this._,
    this.Backbone,
    this.$
));
