(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets state related to filters.
    MOD.state.setFilter = function (filter) {
        var cvNames, cvTermset;

        // Set CV names.
        cvNames = _.map(MOD.state.simulationList, function (s) {
            return s[filter.key];
        });
        if (filter.defaultValue) {
            cvNames.push(filter.defaultValue);
        }
        cvNames = _.uniq(cvNames);

        // Set CV termset.
        cvTermset = MOD.state.getCVTermset(filter.cvType, cvNames);
        cvTermset = _.sortBy(cvTermset, function (cvTerm) {
            return cvTerm.name.toLowerCase();
        });
        if (filter.supportsByAll) {
            cvTermset.unshift(MOD.state.getGlobalCVTerm(filter.cvType));
        }
        filter.cvTerms.active = cvTermset;

        // Set current CV term.
        if (!filter.cvTerms.current) {
            filter.cvTerms.current = _.find(cvTermset, function (term) {
                return term.name === (filter.defaultValue || "*");
            });
        }
    };

}(this.APP.modules.monitoring, this._));
