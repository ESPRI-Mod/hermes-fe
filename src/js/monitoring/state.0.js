(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // CV terms.
        cvTerms: [],

        // List of simulations.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // List of simulations for inter-monitoring.
        simulationListForIM: function () {
            return _.filter(MOD.state.simulationList, function (simulation) {
                return simulation.ext.isSelectedForIM;
            });
        },

        // Paging related state.
        paging: {
            current: undefined,
            count: undefined,
            previous: undefined,
            pages: []
        },

        // Appends a new term set to managed collection.
        appendCVTermset: function (termset) {
            _.each(termset, MOD.state.appendCVTerm);
        },

        // Appends a new term to managed collection.
        appendCVTerm: function (term) {
            if (!MOD.state.getCVTerm(term.typeof, term.name)) {
                MOD.state.cvTerms.push(term);
            }
        },

        // Returns an individual cv term.
        getCVTerm: function (cvType, cvName) {
            return _.find(MOD.state.getCVTermset(cvType), function (term) {
                return term.name === cvName;
            });
        },

        // Returns an individual cv term from a sysnonym.
        getCVTermFromSynonym: function (cvType, cvSynonym) {
            return _.find(MOD.state.getCVTermset(cvType), function (term) {
                return term.synonyms === cvSynonym;
            });
        },

        // Returns filtered collection of cv terms.
        getCVTermset: function (cvType, cvNames) {
            var termset;

            termset = _.filter(MOD.state.cvTerms, function (term) {
                return term.typeof === cvType;
            });
            if (cvNames) {
                termset = _.filter(termset, function (term) {
                    return _.indexOf(cvNames, term.name) !== -1;
                });
            }

            return termset;
        },

        // Returns the global CV term used in filtering.
        getGlobalCVTerm: function (cvType) {
            return {
                typeof: cvType,
                name: '*',
                displayName: '*',
                synonyms: []
            };
        }
    };

}(this.APP.modules.monitoring, this._));
