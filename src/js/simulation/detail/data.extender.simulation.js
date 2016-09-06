(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set simulation job collections.
    MOD.extendSimulation01 = function (simulation) {
        simulation.hasMonitoring = simulation.activity === 'cmip5' || false;
        simulation.jobs = {
            all: [],
            compute: {
                all: [],
                complete: [],
                error: [],
                first: undefined,
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
                complete: [],
                error: [],
                jobType: 'post-processing',
                running: [],
                paging: {
                    current: undefined,
                    count: undefined,
                    pages: []
                }
            },
            postProcessingFromChecker: {
                all: [],
                complete: [],
                error: [],
                jobType: 'post-processing-from-checker',
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
    MOD.extendSimulation02 = function (simulation) {
        _.defaults(simulation, {
            // ... misc. fields
            executionState: null,
            isError: false,
            outputStartDate: null,
            outputEndDate: null,
            // ... cv fields
            activity: null,
            activityRaw: null,
            computeNode: simulation.computeNodeMachine ? simulation.computeNodeMachine.split("-")[0] : null,
            computeNodeLogin: null,
            computeNodeLoginRaw: null,
            experiment: null,
            experimentRaw: null,
            model: null,
            modelRaw: null,
            space: null,
            spaceRaw: null,
            // ... extension fields
            ext: {
                accountingProject: APP.utils.isNone(simulation.accountingProject) ? "--" : simulation.accountingProject,
                activity: undefined,
                caption: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionEndDate: "--",
                executionState: undefined,
                executionStartDate: "--",
                experiment: undefined,
                model: undefined,
                outputEndDate: "--",
                outputStartDate: "--",
                space: undefined,
                // ... helper fields
                isSelectedForIM: false,
                isRestart: simulation.tryID > 1,
                modelSynonyms: [],
                submissionPath: "--"
            }
        });
    };

    // Set simulation date fields.
    MOD.extendSimulation03 = function (simulation) {
        if (simulation.executionStartDate) {
            simulation.ext.executionStartDate = simulation.executionStartDate.slice(0, 19);
        }
        if (simulation.outputStartDate) {
            simulation.ext.outputStartDate = simulation.outputStartDate.slice(0, 10);
        }
        if (simulation.outputEndDate) {
            simulation.ext.outputEndDate = simulation.outputEndDate.slice(0, 10);
        }
    };

    // Set simulation cv fields.
    MOD.extendSimulation04 = function (simulation) {
        var model;

        // Update case sensitive CV fields.
        MOD.cv.setFieldDisplayName(simulation, 'activity');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        MOD.cv.setFieldDisplayName(simulation, 'experiment');
        MOD.cv.setFieldDisplayName(simulation, 'model');
        MOD.cv.setFieldDisplayName(simulation, 'simulation_space', 'space');

        // Set model synonyms.
        model = MOD.cv.getTerm('model', simulation.model);
        if (model && model.synonyms) {
            simulation.ext.modelSynonyms = model.synonyms;
        }
    };

    // Extends a simulation in readiness for processing.
    MOD.extendSimulation = function (simulation) {
        MOD.extendSimulation01(simulation);
        if (_.has(simulation, 'ext') === false) {
            MOD.extendSimulation02(simulation);
            MOD.extendSimulation03(simulation);
            MOD.extendSimulation04(simulation);
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
