(function (MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // CV related functions.
    MOD.cv = {
        // Returns an individual cv term.
        getTerm: function (cvType, cvName) {
            return _.find(MOD.cv.getTermset(cvType), function (term) {
                return term.name === cvName;
            });
        },

        // Returns filtered collection of cv terms.
        getTermset: function (cvType) {
            return _.filter(STATE.cvTerms, function (term) {
                return term.typeof === cvType;
            });
        },

        // Sets a fields display name based upon it's related CV.
        setFieldDisplayName: function (obj, termType, fieldName) {
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
        }
    };

}(
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
