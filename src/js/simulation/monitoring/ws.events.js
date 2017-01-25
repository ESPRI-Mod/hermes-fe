(function (APP, MOD, $, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    var onInitializationEvent = function () {
        $.getJSON(APP.utils.getEndPoint(MOD.urls.FETCH_CV), function (data) {
            MOD.events.trigger("cv:dataFetched", data);
        });
    };

    // Event handler: job start/complete/error.
    // @data    Event information received from server.
    var onJobEvent = function (data) {
        var s, jList;

        // Map event data.
        data.job = MOD.mapJob(data.job);

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationSet, data.job.simulationID) === false) {
            return;
        }

        // Signal.
        MOD.events.trigger("ws:jobUpdating");

        // Update module state.
        s = MOD.state.simulationSet[data.job.simulationID];
        jList = _.filter(s.jobs.all, function (j) {
            return j.id !== data.job.id;
        });
        jList.push(data.job);

        // Parse event data.
        MOD.parseWSEventData(s, jList, undefined);

        // Fire event.
        MOD.events.trigger("ws:jobUpdate", _.extend(data, {
            simulation: s
        }));
    };

    // Job period event handler.
    // @data    Event information received from server.
    var onJobPeriodUpdate = function (data) {
        var s, wasParsed;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationUIDSet, data.simulationUID) === false) {
            return;
        }

        // Signal.
        MOD.events.trigger("ws:jobPeriodUpdating");

        // Parse job period.
        s = MOD.state.simulationUIDSet[data.simulationUID];
        wasParsed = MOD.parseJobPeriod(s, data);

        // Fire event.
        if (wasParsed) {
            MOD.events.trigger("ws:jobPeriodUpdate", _.extend(data, {
                simulation: s
            }));
        }
    };

    // Event handler: simulation start/complete/error.
    // @data    Event information received from server.
    var onSimulationEvent = function (data) {
        var relatedSimulation;

        // Escape if a later try is already in memory.
        if (_.has(MOD.state.simulationHashSet, data.simulation.hashid)) {
            relatedSimulation = MOD.state.simulationHashSet[data.simulation.hashid];
            if (moment(relatedSimulation.executionStartDate) > moment(data.simulation.executionStartDate)) {
                return;
            }
        }

        // Signal.
        MOD.events.trigger("ws:simulationUpdating");

        // Map jobs.
        data.jobList = _.map(data.jobList, MOD.mapJob);

        // Map job period.
        if (data.jobPeriod) {
            data.jobPeriod = {
                startDate: data.jobPeriod.periodDateBegin
            };
        }

        // Update state: cv terms.
        MOD.state.cvTerms = _.union(MOD.state.cvTerms, data.cvTerms);
        _.each(data.cvTerms, function (term) {
            if (_.has(MOD.state.filterSet, term.typeof)) {
                MOD.state.filterSet[term.typeof].cvTerms.all.push(term);
            }
        });

        // Update state: simulations.
        MOD.state.simulationList = _.filter(MOD.state.simulationList, function (s) {
            return s.hashid !== data.simulation.hashid;
        });
        MOD.state.simulationList.push(data.simulation);
        MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "id");
        MOD.state.simulationHashSet = _.indexBy(MOD.state.simulationList, "hashid");
        MOD.state.simulationUIDSet = _.indexBy(MOD.state.simulationList, "uid");

        // Parse event data.
        MOD.parseWSEventData(data.simulation, data.jobList, data.jobPeriod);

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination(MOD.state.paging.current);

        // Fire events.
        MOD.events.trigger("ws:simulationUpdate", data);
        MOD.events.trigger("simulationTimesliceUpdated");
    };

    // Map events to handlers.
    MOD.events.on("ws:initialized", onInitializationEvent);
    MOD.events.on("ws:jobComplete", onJobEvent);
    MOD.events.on("ws:jobError", onJobEvent);
    MOD.events.on("ws:jobPeriodUpdate", onJobPeriodUpdate);
    MOD.events.on("ws:jobStart", onJobEvent);
    MOD.events.on("ws:simulationComplete", onSimulationEvent);
    MOD.events.on("ws:simulationError", onSimulationEvent);
    MOD.events.on("ws:simulationStart", onSimulationEvent);

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$,
    this._,
    this.moment
));
