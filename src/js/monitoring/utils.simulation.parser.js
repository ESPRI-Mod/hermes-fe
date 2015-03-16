(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation) {
        var cvTerm;

        // Set defaults.
        _.defaults(simulation, {
            ext: {
                experiment: undefined,
                isSelectedForIM: false,
                jobCount: 0,
                jobStateHistory: [],
                jobWarningCSS: "",
                modelSynonyms: [],
                state: undefined,
                stateHistory: [],
                statePrevious: undefined,
                threddsServerUrl: undefined,
            }
        });
        simulation.executionStartDate =
            (simulation.executionStartDate || "").substring(0, 10);
        simulation.executionEndDate =
            (simulation.executionEndDate || "").substring(0, 10);

        // Set case sensitive CV related fields.
        _.each(['experiment'], function (field) {
            cvTerm = MOD.cv.getTerm(field, simulation[field]);
            if (cvTerm) {
                simulation.ext[field] = cvTerm.displayName;
            }
        });

        // Set THREDDS server URL.
        if (_.has(MOD.urls.M, simulation.computeNode)) {
            simulation.ext.threddsServerUrl = MOD.urls.M[simulation.computeNode];
        }

        // Set DODS server URL.
        if (_.has(MOD.urls.IM, simulation.computeNode)) {
            simulation.ext.dodsServerUrl = MOD.urls.IM[simulation.computeNode];
        }

        // Set model synonyms.
        cvTerm = MOD.cv.getTerm('model', simulation.model);
        if (cvTerm && cvTerm.synonyms) {
            simulation.ext.modelSynonyms = cvTerm.synonyms.split(", ");
        }

        // Set state history.
        MOD.parseSimulationStateHistory(simulation);
    };

    // Parses simulation state history to detect job errors.
    MOD.parseSimulationStateHistory = function (simulation) {
        // Reset extension fields.
        simulation.ext.jobCount = "--";
        simulation.ext.jobStateHistory = [];
        simulation.ext.jobWarningCSS = "";
        simulation.ext.stateHistory = [];

        // Set histories.
        if (_.has(MOD.state.simulationStateHistory, simulation.uid)) {
            simulation.ext.stateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (stateChange) {
                return stateChange.jobUID === null;
            });
            simulation.ext.stateHistory = _.sortBy(simulation.ext.stateHistory, 'timestamp');
            simulation.ext.jobStateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (stateChange) {
                return stateChange.jobUID !== null;
            });
        }

        // Set current state.
        if (simulation.ext.stateHistory.length) {
            simulation.ext.statePrevious = simulation.ext.state;
            simulation.ext.state = _.last(simulation.ext.stateHistory);
            simulation.executionState = simulation.ext.state.description;
            if (simulation.executionEndDate === "" &&
                _.indexOf(['complete', 'error'], simulation.executionState) > -1) {
                simulation.executionEndDate = simulation.ext.state.timestamp.substring(0, 10);
            }
        }

        // Set job count.
        if (simulation.ext.jobStateHistory.length) {
            var jsh  = _.groupBy(simulation.ext.jobStateHistory, 'jobUID');
            console.log("Job count was: " + simulation.ext.jobCount);
            simulation.ext.jobCount = _.keys(_.groupBy(simulation.ext.jobStateHistory, 'jobUID')).length;
            console.log("Job count is: " + simulation.ext.jobCount);
        }

        // Set job warning.
        _.each(simulation.ext.jobStateHistory, function (stateChange) {
            var complete;

            if (stateChange.state !== 'running') {
                return;
            }
            complete = _.filter(simulation.ext.jobStateHistory, function (sc) {
                return sc.jobUID === stateChange.jobUID &&
                       sc.state !== 'running' &&
                       sc.state !== 'complete';
            });
            if (!complete.length) {
                console.log("TODO: Apply job warning delay test");
                simulation.ext.jobWarningCSS = "bg-danger";
            }
        });
    };

}(this.APP.modules.monitoring, this._));
