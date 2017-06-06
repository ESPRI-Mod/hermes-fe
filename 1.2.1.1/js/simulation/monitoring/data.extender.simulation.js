(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialize simulation job collections.
    var initSimulationJobCounts = function (s) {
        s.jobCounts = {
            all: 0,
            c: {
                all: 0,
                c: 0,
                r: 0,
                e: 0
            },
            p: {
                all: 0,
                c: 0,
                r: 0,
                e: 0
            }
        };
    };

    // Initialize simulation default values.
    var initSimulationDefaults = function (s) {
        _.defaults(s, {
            computeNode: s.computeNodeMachine ? s.computeNodeMachine.split("-")[0] : null,
            executionState: null,
            isError: false,
            ext: {
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                executionProgress: s.executionEndDate ? (s.isError ? 0 : 1) : 0,
                experiment: undefined,
                isSelectedForIM: false,
                isRestart: s.tryID > 1,
                latestComputeJob: undefined,
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
    };

    // Initialize simulation cv fields for UI.
    var initSimulationCVFields = function (s) {
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
        if (_.has(s, 'ext')) return;
        initSimulationJobCounts(s);
        initSimulationDefaults(s);
        initSimulationCVFields(s);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
