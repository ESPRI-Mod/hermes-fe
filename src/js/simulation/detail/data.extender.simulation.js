(function (APP, MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set simulation job collections.
    MOD.extendSimulation01 = function (simulation) {
        simulation.hasMonitoring = simulation.accountingProject === 'cmip5' || false;
        simulation.jobs = {
            all: [],
            compute: {
                all: [],
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
    MOD.extendSimulation02 = function (simulation) {
        _.defaults(simulation, {
            computeNode: simulation.computeNodeMachine ? simulation.computeNodeMachine.split("-")[0] : null,
            executionState: null,
            isError: false,
            ext: {
                accountingProject: APP.utils.isNone(simulation.accountingProject) ? "--" : simulation.accountingProject,
                caption: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                experiment: undefined,
                model: undefined,
                space: undefined,
                // ... helper fields
                isSelectedForIM: false,
                modelSynonyms: [],
                submissionPath: undefined
            }
        });
    };

    // Set simulation date fields.
    MOD.extendSimulation03 = function (simulation) {
        if (simulation.executionEndDate) {
            simulation.executionEndDate = moment(simulation.executionEndDate);
        }
        if (simulation.executionStartDate) {
            simulation.executionStartDate = moment(simulation.executionStartDate);
        }
        if (simulation.outputStartDate) {
            simulation.outputStartDate = moment(simulation.outputStartDate);
        }
        if (simulation.outputEndDate) {
            simulation.outputEndDate = moment(simulation.outputEndDate);
        }
    };

    // Set simulation cv fields.
    MOD.extendSimulation04 = function (simulation) {
        var model;

        // Update case sensitive CV fields.
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
    this._,
    this.moment
));
