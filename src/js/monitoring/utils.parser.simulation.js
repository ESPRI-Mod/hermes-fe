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
                hasJobCompletionWarning: false,
                jobCount: 0,
                jobStateHistory: [],
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

}(this.APP.modules.monitoring, this._));
