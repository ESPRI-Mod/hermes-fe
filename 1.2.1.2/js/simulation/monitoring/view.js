(function (document, APP, MOD, STATE, EVENTS, PAGING, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view event handlers.
        events : {
            // Open simulation detail page.
            'click table tbody tr td:not(.monitoring):not(.inter-monitoring)' : function (e) {
                var sUID;

                sUID = this._getSimulationUID(e);
                if (sUID) {
                    APP.utils.openURL(this._getSimulationDetailURL(sUID), true);
                }
            },

            // Open monitoring page.
            'click table tbody tr td.monitoring' : function (e) {
                var s;

                s = this._getSimulation(this._getSimulationUID(e));
                if (s) {
                    EVENTS.trigger("m:open", s);
                }
            },

            // Toggle inter-monitoring selection.
            'change table tbody tr td.inter-monitoring > input' : function (e) {
                var s;

                s = this._getSimulation(this._getSimulationUID(e));
                if (s) {
                    EVENTS.trigger("im:toggleSimulation", s);
                }
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
                    EVENTS.trigger('simulationPageUpdate');
                }
            },

            // Pager: navigate to first page.
            'click .pagination-first' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = _.first(PAGING.pages);
                    EVENTS.trigger('simulationPageUpdate');
                }
            },

            // Pager: navigate to previous page.
            'click .pagination-previous' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id - 2];
                    EVENTS.trigger('simulationPageUpdate');
                }
            },

            // Pager: navigate to next page.
            'click .pagination-next' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id];
                    EVENTS.trigger('simulationPageUpdate');
                }
            },

            // Pager: navigate to last page.
            'click .pagination-last' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = _.last(PAGING.pages);
                    EVENTS.trigger('simulationPageUpdate');
                }
            },

            // Pager: page-size change.
            'change .pagination-page-size' : function (e) {
                EVENTS.trigger('state:pageSizeChange', $(e.target).val());
            },

            // Sorting: change sort field.
            'change #sort-field-selector' : function (e) {
                EVENTS.trigger('state:sortFieldChange', $(e.target).val());
            },

            // Sorting: change sort direction.
            'change #sort-direction-selector' : function (e) {
                EVENTS.trigger('state:sortDirectionChange', $(e.target).val());
            },

            // Reopen page when web socket closed.
            'click #ws-close-dialog-refresh-page-button' : function () {
                var baseURL, url;

                // Construct URL.
                url = baseURL = APP.utils.getBaseURL();
                _.each(STATE.filters, function (filter) {
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
                document.querySelector('#permalink').select();
                document.execCommand('copy');
            },

            // Permalink close button click.
            'click #btn-permalink-close': function (e) {
                window.getSelection().removeAllRanges();
                $("#grid-permalink-row").addClass('hidden');
                $("#grid-stats-pager-row").removeClass('hidden');
            },

            'keyup #text-filter': function (e) {
                EVENTS.trigger('textFilter:updated', $(e.target).val());
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // UI initialisation events.
            EVENTS.on("view:initialized", this._initIMContextMenu, this);
            EVENTS.on("view:initialized", function () {
                _.each(STATE.filters, this._setFilterSelector, this);
            }, this);

            // Sorting events.
            EVENTS.on("simulationListSorted", this._updateGrid, this);
            EVENTS.on("simulationListSorted", this._updateGridPager, this);
            EVENTS.on("simulationListSorted", this._updatePermlink, this);

            // Pagination events.
            EVENTS.on("simulationPageUpdate", this._updateGrid, this);
            EVENTS.on("simulationPageUpdate", this._updateGridPager, this);

            // Filter events.
            EVENTS.on("filterOptionsUpdate", this._setFilterSelector, this);
            EVENTS.on("filtersUpdated", this._updatePermlink, this);

            // Simulation timeslice updated event.
            EVENTS.on("simulationTimesliceUpdated", this._updateStatisticsInfo, this);
            EVENTS.on("simulationTimesliceUpdated", this._updateGrid, this);
            EVENTS.on("simulationTimesliceUpdated", this._updateGridPager, this);
            EVENTS.on("simulationTimesliceUpdated", this._updateIMMenu, this);

            // Web-socket events.
            EVENTS.on("ws:closed", this._displayWebSocketClosedDialog, this);
            EVENTS.on("ws:jobUpdated", this._updateNotificationInfo, this);
            EVENTS.on("ws:jobUpdated", this._updateGridRow, this);
            EVENTS.on("ws:jobPeriodUpdated", this._updateNotificationInfo, this);
            EVENTS.on("ws:jobPeriodUpdated", this._updateGridRow, this);
            EVENTS.on("ws:simulationUpdated", this._updateNotificationInfo, this);

            // Inter-monitoring events.
            EVENTS.on("im:postInterMonitorForm", this._openInterMonitoringPage, this);
            EVENTS.on("im:simulationListUpdated", this._onIMSelectionUpdate, this);
            EVENTS.on("im:simulationListCleared", this._onIMSelectionClear, this);
        },

        // Backbone: view renderer.
        render : function () {
            _.each([
                "notification-info-template",
                "filter-panel-template",
                "grid-template",
                "ws-close-dialog-template"
                ], function (templateID) {
                APP.utils.renderTemplate(templateID, STATE, this);
            }, this);

            return this;
        },

        _updateIMMenu: function () {
            var $menu = $('th.im-context-menu small');
            if (STATE.simulationListForIMTargets.length === 0) {
                $menu.contextMenu(false).removeClass('btn-sm btn-info');
            } else {
                $menu.contextMenu(true).addClass('btn-sm btn-info');
                // $menu.contextMenu()
            }
        },

        _initIMContextMenu: function () {
            $.contextMenu({
                selector: 'th.im-context-menu small',
                trigger: 'left',
                build: function($triggerElement, e) {
                    return {
                        callback: function(key) {
                            EVENTS.trigger('im:' + key);
                        },
                        items: {
                            open: {
                                name: 'Open inter-monitoring',
                                disabled: STATE.simulationListForIM.length == 0
                            },
                            clear: {
                                name: 'Clear selections',
                                disabled: STATE.simulationListForIM.length == 0
                            },
                            toggle: {
                                name: (STATE.monitoredSimulationsOnly ? 'Display' : 'Hide') + ' unmonitored simulations',
                                disabled: false
                            }
                        }
                    };
                }
            });

            this._updateIMMenu();
        },

        _onIMSelectionUpdate: function () {
            // TODO - set menu commands enablement state.

        },

        _onIMSelectionClear: function () {
            $("td.inter-monitoring > input").prop("checked", false);
            // TODO - set menu commands enablement state.
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

        _updateNotificationInfo: function (ei) {
            if (ei.simulation) {
                ei.simulationDetailURL = this._getSimulationDetailURL(ei.simulation.uid);
                ei.eventTypeDescription = MOD.getEventDescription(ei);
            }
            ei.simulationList = STATE.simulationList;
            ei.simulationListFiltered = STATE.simulationListFiltered;
            this._replaceNode('#notification-info', 'notification-info-template', ei);
        },

        _updateStatisticsInfo: function () {
            this.$('.' + 'total-simulation-count').text(STATE.simulationList.length);
            this.$('.' + 'filtered-simulation-count').text(STATE.simulationListFiltered.length);
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
            this._replaceNode('tbody', 'grid-body-template', STATE);
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
            var permalink = MOD.getPermalink();
            $("#permalink").val(permalink);
            EVENTS.trigger("view:permalinkUpdated", permalink);
        },

        _displayWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
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

        _getSimulationUID: function (e) {
            var cell;

            // Depending on where in the cell the user clicks the simulation id is derived differently.
            cell = $(e.target);
            return cell.parent().attr("id") ||
                   cell.parent().parent().attr("id") ||
                   cell.parent().parent().parent().attr("id") ||
                   cell.parent().parent().parent().parent().attr("id");
        },

        _getSimulation: function (uid) {
            if (_.isUndefined(uid) === false) {
                return _.find(STATE.paging.current.data, function (s) {
                    return s.uid === uid;
                });
            };
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
    this.APP.modules.monitoring.state,
    this.APP.modules.monitoring.events,
    this.APP.modules.monitoring.state.paging,
    this._,
    this.Backbone,
    this.$
));
