(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation) {
        var cv, term;

        // Set defaults.
        _.defaults(simulation, {
            threddsServerUrl: undefined,
            executionEndDate: "",
            isSelectedForIM: false,
            modelSynonyms: []
        });

        // Set case sensitive CV related fields.
        _.each(['experiment'], function (field) {
            cv = MOD.state.cvTerms[field];
            if (_.has(cv, simulation[field])) {
                term = cv[simulation[field]];
            }
            if (term) {
                simulation[field] = term.name;
            }
        });

        // Set model synonyms.
        cv = MOD.state.cvTerms.model;
        if (_.has(cv, simulation.model)) {
            term = cv[simulation.model];
            simulation.modelSynonyms = term.synonyms;
        }

        // Set THREDDS server URL.
        cv = MOD.state.cvTerms.computeNode;
        if (_.has(cv, simulation.computeNode)) {
            term = cv[simulation.computeNode];
            if (term.threddsServerUrl) {
                simulation.threddsServerUrl = term.threddsServerUrl;
            }
        }
    };

}(this.APP.modules.monitoring, this._));
