(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation) {
        var cvTerm;

        // Set defaults.
        _.defaults(simulation, {
            ext: {
                threddsServerUrl: undefined,
                isSelectedForIM: false,
                modelSynonyms: [],
                experiment: undefined
            }
        });
        simulation.executionStartDate =
            (simulation.executionStartDate || "").substring(0, 10);
        simulation.executionEndDate =
            (simulation.executionEndDate || "").substring(0, 10);

        // Set case sensitive CV related fields.
        _.each(['experiment'], function (field) {
            cvTerm = MOD.state.getCVTerm(field, simulation[field]);
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
        cvTerm = MOD.state.getCVTerm('model', simulation.model);
        if (cvTerm && cvTerm.synonyms) {
            simulation.ext.modelSynonyms = cvTerm.synonyms.split(", ");
        }

        // cv = MOD.state.cvTermsets.model;
        // if (_.has(cv, simulation.model)) {
        //     term = cv[simulation.model];
        //     if (term.synonyms) {
        //         simulation.ext.modelSynonyms = term.synonyms;
        //     }
        // }
    };

}(this.APP.modules.monitoring, this._));
