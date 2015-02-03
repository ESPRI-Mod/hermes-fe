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
        simulation.executionEndDate = simulation.executionEndDate || "";

        // Set case sensitive CV related fields.
        _.each(['experiment'], function (field) {
            cvTerm = MOD.state.getCVTerm(field, simulation[field]);
            if (cvTerm) {
                simulation.ext[field] = cvTerm.displayName;
            }
        });

        // Set model synonyms.
        // if (!MOD.state.getCVTerm('model', simulation.model)) {
            
        //     console.log("TODO: set model synonyms : " +  simulation.model);

        // }

        // cv = MOD.state.cvTermsets.model;
        // if (_.has(cv, simulation.model)) {
        //     term = cv[simulation.model];
        //     if (term.synonyms) {
        //         simulation.ext.modelSynonyms = term.synonyms;
        //     }
        // }

        // Set THREDDS server URL.
        // cv = MOD.state.cvTermsets.computeNode;
        // if (_.has(cv, simulation.computeNode)) {
        //     term = cv[simulation.computeNode];
        //     if (term.threddsServerUrl) {
        //         simulation.ext.threddsServerUrl = term.threddsServerUrl;
        //     }
        // }
    };

}(this.APP.modules.monitoring, this._));
