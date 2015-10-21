(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var mapSimulation, mapJob;

    // Controlled vocabularies loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("setup:cvDataLoaded", function (data) {
        // Update module state.
        MOD.state.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Initialise filter cv terms sets.
        MOD.initFilterCvTermsets();

        // Fetch timeslice.
        MOD.fetchTimeSlice(MOD.defaults.timeslice);
    });

    // Returns a mapped simulation.
    mapSimulation = function (i) {
        return {
            accountingProject: i[0],
            activity: i[1],
            activityRaw: i[2],
            computeNode: i[3],
            computeNodeRaw: i[4],
            computeNodeLogin: i[5],
            computeNodeLoginRaw: i[6],
            computeNodeMachine: i[7],
            computeNodeMachineRaw: i[8],
            executionEndDate: i[9],
            executionStartDate: i[10],
            experiment: i[11],
            experimentRaw: i[12],
            isError: i[13],
            hashid: i[14],
            model: i[15],
            modelRaw: i[16],
            name: i[17],
            outputEndDate: i[18],
            outputStartDate: i[19],
            space: i[20],
            spaceRaw: i[21],
            tryID: i[22],
            uid: i[23]
        };
    };

    // Returns a mapped job.
    mapJob = function (i) {
        return {
            executionEndDate: i[0],
            executionStartDate: i[1],
            isComputeEnd: i[2],
            isError: i[3],
            jobUID: i[4],
            simulationUID: i[5],
            typeof: i[6]
        };
    };

    // Timeslice loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("state:timesliceLoaded", function (data) {
        // Map tuples to JSON objects.
        data.simulationList = _.map(data.simulationList, mapSimulation);
        data.jobList = _.map(data.jobList, mapJob);
        MOD.log("timeslice unpacked");

        // Update module state.
        MOD.state.simulationList = data.simulationList;
        MOD.state.simulationSet = _.indexBy(data.simulationList, "uid");
        MOD.log("timeslice assigned");

        // Parse timeslice.
        MOD.parser.parseTimeslice(data.simulationList, data.jobList);
        MOD.log("timeslice parsed");

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        if (MOD.view) {
            MOD.events.trigger("state:simulationListUpdate", this);
        } else {
            MOD.events.trigger("setup:complete", this);
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
