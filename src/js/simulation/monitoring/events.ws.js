(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var
        // Job event handler.
        // @data    Event information received from server.
        processJobEvent = function (data) {
            var simulation, jobList;

            // Map event data.
            data.job = MOD.mapJob(data.job);

            // Escape if simulation is not in memory.
            if (_.has(MOD.state.simulationSet, data.job.simulationUID) === false) {
                return;
            }

            // Update module state.
            simulation = MOD.state.simulationSet[data.job.simulationUID];
            jobList = _.filter(simulation.jobs.all, function (j) {
                return j.jobUID !== data.job.jobUID;
            });
            jobList.push(data.job);

            // Parse event data.
            MOD.parser.parseEvent(simulation, jobList);

            // Fire event.
            data.simulation = simulation;
            MOD.events.trigger("state:jobUpdate", data);
        },

        // Simulation event handler.
        // @data    Event information received from server.
        processSimulationEvent = function (data) {
            // Map event data.
            data.jobList = _.map(data.jobList, MOD.mapJob);

            // Escape if a later try is already in memory.
            if (_.has(MOD.state.simulationHashSet, data.simulation.hashid) &&
                (MOD.state.simulationHashSet[data.simulation.hashid].tryID > data.simulation.tryID)) {
                return;
            }

            // Update module state.
            MOD.updateFilterCvTermsets(data.cvTerms);
            MOD.state.simulationList = _.filter(MOD.state.simulationList, function (s) {
                return s.hashid !== data.simulation.hashid;
            });
            MOD.state.simulationList.push(data.simulation);
            MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "uid");
            MOD.state.simulationHashSet = _.indexBy(MOD.state.simulationList, "hashid");

            // Parse event data.
            MOD.parser.parseEvent(data.simulation, data.jobList);

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
    MOD.events.on("ws:simulationComplete", processSimulationEvent);
    MOD.events.on("ws:simulationError", processSimulationEvent);
    MOD.events.on("ws:simulationStart", processSimulationEvent);

}(
    this.APP.modules.monitoring,
    this._
));
