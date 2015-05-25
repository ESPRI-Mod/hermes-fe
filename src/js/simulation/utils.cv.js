(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare module vars.
    var insertTerm, getTerm, getTermFromSynonym, getTermset, getGlobalTerm;

    // Appends a new term to managed collection.
    insertTerm = function (term) {
        if (!getTerm(term.typeof, term.name)) {
            MOD.state.cvTerms.push(term);
        }
    };

    // Returns an individual cv term.
    getTerm = function (cvType, cvName) {
        return _.find(getTermset(cvType), function (term) {
            return term.name === cvName;
        });
    };

    // Returns an individual cv term from a sysnonym.
    getTermFromSynonym = function (cvType, cvSynonym) {
        return _.find(getTermset(cvType), function (term) {
            return term.synonyms === cvSynonym;
        });
    };

    // Returns filtered collection of cv terms.
    getTermset = function (cvType, cvNames) {
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
    };

    // Returns the global CV term used in filtering.
    getGlobalTerm = function (cvType) {
        return {
            typeof: cvType,
            name: '*',
            displayName: '*',
            synonyms: []
        };
    };

    // Expose to module.
    MOD.cv = {
        insertTerm: insertTerm,
        getTerm: getTerm,
        getTermFromSynonym: getTermFromSynonym,
        getTermset: getTermset,
        getGlobalTerm: getGlobalTerm
    };

}(
    this.APP.modules.simulation,
    this._
));
