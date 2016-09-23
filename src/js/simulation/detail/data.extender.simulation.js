(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set simulation job collections.
    MOD.extendSimulation01 = function (s) {
        s.hasMonitoring = s.accountingProject === 'cmip5' || false;
        s.jobs = {
            all: [],
            compute: {
                all: [],
                allUnsorted: [],
                complete: [],
                error: [],
                jobType: 'computing',
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
                jobType: 'post-processing',
                running: [],
                paging: {
                    current: undefined,
                    count: undefined,
                    pages: []
                }
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
                accountingProject: APP.utils.isNone(s.accountingProject) ? "--" : s.accountingProject,
                caption: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                experiment: undefined,
                isSelectedForIM: false,
                model: undefined,
                modelSynonyms: [],
                space: undefined,
                submissionPath: undefined
            }
        });
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
    this.APP,
    this.APP.modules.monitoring,
    this._
));
