(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets simulation job collections.
    MOD.extendSimulation01 = function (simulation) {
        simulation.hasMonitoring = simulation.accountingProject === 'cmip5' || false;
        simulation.jobs = {
            all: [],
            compute: {
                all: [],
                complete: [],
                error: [],
                running: [],
            },
            postProcessing: {
                all: [],
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
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionState: undefined,
                experiment: undefined,
                isSelectedForIM: false,
                isRestart: simulation.tryID > 1,
                model: undefined,
                modelSynonyms: [],
                name: simulation.name.trim().toLowerCase(),
                space: undefined
            }
        });
    };

    // Set simulation cv fields for UI.
    MOD.extendSimulation03 = function (simulation) {
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
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
