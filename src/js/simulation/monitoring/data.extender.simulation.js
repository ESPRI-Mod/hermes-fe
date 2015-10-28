(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets simulation job collections.
    MOD.extendSimulation01 = function (simulation) {
        simulation.jobs = {
            all: [],
            compute: {
                all: [],
                complete: [],
                error: [],
                running: [],
            },
            postProcessing: {
                complete: [],
                error: [],
                running: []
            },
            postProcessingFromChecker: {
                complete: [],
                error: [],
                running: []
            }
        };
    };

    // Sets simulation default values.
    MOD.extendSimulation02 = function (simulation) {
        _.defaults(simulation, {
            // ... misc. fields
            executionState: null,
            isError: false,
            // ... cv fields
            activity: null,
            activityRaw: null,
            computeNode: null,
            computeNodeRaw: null,
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
                activity: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionEndDate: "--",
                executionState: undefined,
                executionStartDate: "--",
                experiment: undefined,
                isSelectedForIM: false,
                isRestart: simulation.tryID > 1,
                model: undefined,
                modelSynonyms: [],
                space: undefined
            }
        });
    };

    // Set simulation date fields.
    MOD.extendSimulation03 = function (simulation) {
        if (simulation.executionStartDate) {
            simulation.ext.executionStartDate = simulation.executionStartDate.slice(0, 19);
        }
    };

    // Set simulation cv fields for UI.
    MOD.extendSimulation04 = function (simulation) {
        var model;

        // Update case sensitive CV fields.
        MOD.cv.setFieldDisplayName(simulation, 'activity');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node', 'computeNode');
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
    this.moment,
    this.numeral
));
