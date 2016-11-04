(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets simulation job collections.
    MOD.extendSimulation01 = function (s) {
        s.hasMonitoring = s.accountingProject === 'cmip5' || false;
        s.jobs = {
            all: [],
            compute: {
                all: [],
                allUnsorted: [],
                complete: [],
                error: [],
                running: [],
            },
            postProcessing: {
                all: [],
                allUnsorted: [],
                complete: [],
                error: [],
                running: []
            }
        };
    };

    // Sets simulation default values.
    MOD.extendSimulation02 = function (s) {
        _.defaults(s, {
            computeNode: s.computeNodeMachine ? s.computeNodeMachine.split("-")[0] : null,
            executionState: null,
            isError: false,
            ext: {
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                executionProgress: s.executionEndDate ? (s.isError ? NaN : 1) : 0,
                experiment: undefined,
                isSelectedForIM: false,
                isRestart: s.tryID > 1,
                model: undefined,
                modelSynonyms: [],
                name: s.name.trim().toLowerCase(),
                outputEndDateInDays: APP.utils.convertDateToDays(s.outputEndDate),
                outputStartDateInDays: APP.utils.convertDateToDays(s.outputStartDate),
                outputDateRange: s.outputStartDate + "--" + s.outputEndDate,
                space: undefined
            }
        });
        s.ext.outputTimeSpanInDays = s.ext.outputEndDateInDays - s.ext.outputStartDateInDays;
        s.ext.executionProgressInPercent = _.isNaN(s.ext.executionProgress) ? "--" : parseInt(s.ext.executionProgress * 100);
    };

    // Set simulation cv fields for UI.
    MOD.extendSimulation03 = function (s) {
        var model;

        // Update case sensitive CV fields.
        MOD.cv.setFieldDisplayName(s, 'compute_node_login', 'computeNodeLogin');
        MOD.cv.setFieldDisplayName(s, 'compute_node_machine', 'computeNodeMachine');
        MOD.cv.setFieldDisplayName(s, 'experiment');
        MOD.cv.setFieldDisplayName(s, 'model');
        MOD.cv.setFieldDisplayName(s, 'simulation_space', 'space');

        // Set model synonyms.
        model = MOD.cv.getTerm('model', s.model);
        if (model && model.synonyms) {
            s.ext.modelSynonyms = model.synonyms;
        }
    };

    // Extends a simulation in readiness for processing.
    MOD.extendSimulation = function (s) {
        MOD.extendSimulation01(s);
        if (_.has(s, 'ext') === false) {
            MOD.extendSimulation02(s);
            MOD.extendSimulation03(s);
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
