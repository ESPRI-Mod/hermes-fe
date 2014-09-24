(function (root, $, _, Backbone, api) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Root Application module.
    var APP = root.APP = {
        // App Event dispatcher.
        events: _.extend({}, Backbone.Events),

        // App sub-views placeholder.
        views: {},

        // App state.
        state: {
            groups: [""],
            group: undefined,
            endpoints: [
                {
                    name: "",
                    uiName: ""
                },
                {
                    name: "fetch",
                    uiName: "Fetch"
                },
                {
                    name: "fetchCount",
                    uiName: "Fetch Count"
                },
                {
                    name: "fetchColumns",
                    uiName: "Fetch Columns"
                },
                {
                    name: "fetchSetup",
                    uiName: "Fetch Setup"
                }
            ],
            endpoint: undefined
        }
    };

    // Utility functions.
    APP.utils = {
        // Renders a view.
        // @type          View type.
        // @options       View options.
        // @container     View container.
        render: function (types, options, container) {
            var typeset, view, rendered = [];

            typeset = _.isArray(types) ? types : [types];
            _.each(typeset, function (Type) {
                view = new Type(options).render();
                rendered.push(view);
                if (!_.isUndefined(container)) {
                    if (_.has(container, '$el')) {
                        container.$el.append(view.$el);
                    } else {
                        container.append(view.$el);
                    }
                }
            }, this);

            return typeset.length === 1 ? rendered[0] : rendered;
        }
    };

    // Application initializer.
    APP.init = function (data) {
        var view;

        // Update application state.
        APP.state.endpoint = APP.state.endpoints[0];
        APP.state.groups = _.union(APP.state.groups, data.groups);
        APP.state.group = APP.state.groups[0];

        // Build endpoint selector view.
        view = new APP.views.EndpointListView({
            el: $("#endpointList")
        });
        view.render();

        // Build group selector view.
        view = new APP.views.GroupListView({
            el: $("#groupList")
        });
        view.render();

        // Trigger event.
        APP.events.trigger("state:initialized");
    };

    // Set API invocation state.
    APP.setInvokeAPIState = function () {
        if (APP.state.group === "" ||
            APP.state.endpoint.name === "") {
            $("#invokeAPI").attr("disabled", "disabled")
        } else {
            $("#invokeAPI").removeAttr("disabled")
        }
    };

    // Set API response.
    APP.setAPIResponse = function (apiResponse) {
        $("#apiResponse").removeClass("hidden");
        $("pre").text(JSON.stringify(apiResponse, null, "  "));
    };

    // Application event handlers.
    APP.events.on("group:selected", APP.setInvokeAPIState);
    APP.events.on("endpoint:selected", APP.setInvokeAPIState);

    // Invoke API button click event handler.
    $("#invokeAPI").click(function () {
        switch (APP.state.endpoint.name)
        {
            case "fetch":
                api.fetch(APP.state.group, false, APP.setAPIResponse);
                break;

            case "fetchCount":
                api.fetchCount(APP.state.group, APP.setAPIResponse);
                break;

            case "fetchColumns":
                api.fetchColumns(APP.state.group, false, APP.setAPIResponse);
                break;

            case "fetchSetup":
                api.fetchSetup(APP.state.group, APP.setAPIResponse);
                break;
        }
    });

    // Document ready event handler.
    $(document).ready(function() {
        api.fetchList(APP.init);
    });

}(this, this.$, this._, this.Backbone, this.METRIC_API));
