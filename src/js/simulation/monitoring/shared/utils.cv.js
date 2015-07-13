(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare module vars.
    var insertTerm,
        getTerm,
        getTermFromSynonym,
        getTermset,
        getGlobalTerm,
        setFieldDisplayName;

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

    // Sets a fields display name based upon it's related CV.
    setFieldDisplayName = function (obj, termType, fieldName) {
        var term, fieldValue;

        fieldName = fieldName || termType;
        fieldValue = obj[fieldName];
        term = MOD.cv.getTerm(termType, fieldValue);
        if (term) {
            obj.ext[fieldName] = term.displayName;
        } else {
            obj.ext[fieldName] = fieldValue || '--';
        }

        // Update unspecified fields.
        if (obj.ext[fieldName].toLowerCase() === 'unspecified') {
            obj.ext[fieldName] = '--';
        }
    };

    // Expose to module.
    MOD.cv = {
        insertTerm: insertTerm,
        getTerm: getTerm,
        getTermFromSynonym: getTermFromSynonym,
        getTermset: getTermset,
        getGlobalTerm: getGlobalTerm,
        setFieldDisplayName: setFieldDisplayName
    };

}(
    this.APP.modules.monitoring,
    this._
));
