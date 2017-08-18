(function (MOD, UTILS, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set simulation job collections.
    MOD.extendSimulation01 = function (s) {
        s.jobs = {
            all: [],
            compute: {
                all: [],
                allUnsorted: [],
                complete: [],
                error: [],
                jobType: 'c',
                late: [],
                running: [],
                paging: {
                    current: undefined,
                    count: undefined,
                    pages: []
                }
            },
            postProcessing: {
                all: [],
                allUnsorted: [],
                complete: [],
                error: [],
                jobType: 'p',
                late: [],
                running: [],
                paging: {
                    current: undefined,
                    count: undefined,
                    pages: []
                }
            }
        };
        s.jobsets = [s.jobs.compute, s.jobs.postProcessing];
    };

    // Sets simulation default values.
    MOD.extendSimulation02 = function (s) {
        _.defaults(s, {
            computeNode: s.computeNodeMachine ? s.computeNodeMachine.split("-")[0] : null,
            executionState: null,
            isError: false,
            ext: {
                accountingProject: UTILS.isNone(s.accountingProject) ? "--" : s.accountingProject,
                caption: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                executionProgress: s.executionEndDate ? (s.isError ? 0 : 1) : 0,
                experiment: undefined,
                isSelectedForIM: false,
                model: undefined,
                modelSynonyms: [],
                outputEndDateInDays: UTILS.convertDateToDays(s.outputEndDate),
                outputStartDateInDays: UTILS.convertDateToDays(s.outputStartDate),
                outputDateRange: s.outputStartDate + "--" + s.outputEndDate,
                space: undefined,
                submissionPath: undefined
            }
        });
        s.ext.outputTimeSpanInDays = s.ext.outputEndDateInDays - s.ext.outputStartDateInDays;
    };

    // Set simulation cv fields.
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
    this.APP.modules.monitoring,
    this.APP.utils,
    this._
));
