(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Extends a simulation in readiness for processing.
    MOD.extendSimulation = function (simulation) {
        var model;

        // Intialise job collections.
        simulation.jobs = {
            compute: {
                all: [],
                complete: [],
                error: [],
                running: [],
            },
            global: {
                all: [],
                complete: [],
                error: [],
                running: []
            },
            postProcessing: {
                all: [],
                complete: [],
                error: [],
                running: []
            },
            postProcessingFromChecker: {
                all: [],
                complete: [],
                error: [],
                running: []
            }
        };

        // Escape if already extended.
        if (_.has(simulation, 'ext')) {
            return;
        }

        // Set defaults:
        _.defaults(simulation, {
            // ... misc. fields
            accountingProject: null,
            executionEndDate: null,
            executionState: null,
            isError: false,
            isObsolete: false,
            outputStartDate: null,
            outputEndDate: null,
            parentSimulationBranchDate: null,
            parentSimulationName: null,
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
                // ... user interface fields
                accountingProject: "--",
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
                modelSynonyms: []
            }
        });

        // Format date fields.
        APP.utils.formatDateTimeField(simulation, "executionStartDate");
        APP.utils.formatDateTimeField(simulation, "executionEndDate");
        APP.utils.formatDateField(simulation, "outputStartDate");
        APP.utils.formatDateField(simulation, "outputEndDate");

        // Update case sensitive CV fields.
        MOD.cv.setFieldDisplayName(simulation, 'activity');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node', 'computeNode');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        MOD.cv.setFieldDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        MOD.cv.setFieldDisplayName(simulation, 'experiment');
        MOD.cv.setFieldDisplayName(simulation, 'model');
        MOD.cv.setFieldDisplayName(simulation, 'simulation_space', 'space');

        // Set accounting project.
        if (APP.utils.isNone(simulation.accountingProject) === false) {
            simulation.ext.accountingProject = simulation.accountingProject;
        }

        // Set model synonyms.
        model = MOD.cv.getTerm('model', simulation.model);
        if (model && model.synonyms) {
            simulation.ext.modelSynonyms = model.synonyms;
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
