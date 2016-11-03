(function (APP, MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare.
    var processJobEvent,
        processJobPeriodEvent,
        processSimulationEvent;


    // Job event handler.
    // @data    Event information received from server.
    processJobEvent = function (data) {
        var s, jList;

        // Map event data.
        data.job = MOD.mapJob(data.job);

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationSet, data.job.simulationID) === false) {
            return;
        }

        // Log event processing.
        MOD.log("WS :: job event processing");

        // Update module state.
        s = MOD.state.simulationSet[data.job.simulationID];
        jList = _.filter(s.jobs.all, function (j) {
            return j.id !== data.job.id;
        });
        jList.push(data.job);

        // Parse event data.
        MOD.parseEventData(s, jList, undefined);

        // Fire event.
        MOD.events.trigger("state:jobUpdate", _.extend(data, {
            simulation: s
        }));
    };

    // Job period event handler.
    // @data    Event information received from server.
    processJobPeriodEvent = function (data) {
        var s, wasParsed;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationUIDSet, data.simulationUID) === false) {
            return;
        }

        // Log event processing.
        MOD.log("WS :: job period event processing");

        // Parse job period.
        s = MOD.state.simulationUIDSet[data.simulationUID];
        wasParsed = MOD.parseJobPeriod(s, data);

        // Fire event.
        if (wasParsed) {
            MOD.events.trigger("state:jobPeriodUpdate", _.extend(data, {
                simulation: s
            }));
        }
    };

    // Simulation event handler.
    // @data    Event information received from server.
    processSimulationEvent = function (data) {
        var relatedSimulation;

        // Escape if a later try is already in memory.
        if (_.has(MOD.state.simulationHashSet, data.simulation.hashid)) {
            relatedSimulation = MOD.state.simulationHashSet[data.simulation.hashid];
            if (moment(relatedSimulation.executionStartDate) > moment(data.simulation.executionStartDate)) {
                return;
            }
        }

        // Log event processing.
        MOD.log("WS :: simulation event processing");

        // Map jobs.
        data.jobList = _.map(data.jobList, MOD.mapJob);

        // Map job period.
        if (data.jobPeriod) {
            data.jobPeriod = {
                endDate: data.jobPeriod.periodDateEnd
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
        MOD.parseEventData(data.simulation, data.jobList, data.jobPeriod);

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination(MOD.state.paging.current);

        // Fire events.
        MOD.events.trigger("state:simulationUpdate", data);
        MOD.events.trigger("state:simulationListUpdate");
    };

    // Wire upto events streaming over the web-socket channel.
    MOD.events.on("ws:jobComplete", processJobEvent);
    MOD.events.on("ws:jobError", processJobEvent);
    MOD.events.on("ws:jobStart", processJobEvent);
    MOD.events.on("ws:jobPeriodUpdate", processJobPeriodEvent);
    MOD.events.on("ws:simulationComplete", processSimulationEvent);
    MOD.events.on("ws:simulationError", processSimulationEvent);
    MOD.events.on("ws:simulationStart", processSimulationEvent);

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
