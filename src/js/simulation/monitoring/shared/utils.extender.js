(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Extends a job in readiness for processing.
    MOD.extendJob = function (job) {
        var ppFields = [];

        // Escape if already extended.
        if (_.has(job, 'ext')) {
            return;
        }

        // Set defaults:
        _.defaults(job, {
            accountingProject: null,
            executionEndDate: null,
            executionState: null,
            ext: {
                // ... user interface fields
                accountingProject: '--',
                lateness: '--',
                duration: '--',
                executionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                postProcessingInfo: '--',
                // ... helper fields
                expectedExecutionEndDate: null,
                isPostProcessing: _.has(job, 'typeof') ? job.typeof !== 'computing' : true
            },
            isError: false,
            postProcessingComponent: null,
            postProcessingDate: null,
            postProcessingDimension: null,
            postProcessingFile: null,
            postProcessingName: null,
            typeof: 'post-processing',
            warningDelay: parseInt(_.has(job, 'warningDelay') ? job.warningDelay :
                                                                MOD.defaults.jobWarningDelay, 10)
        });

        // Set accounting project.
        if (APP.utils.isNone(job.accountingProject) === false) {
            job.ext.accountingProject = job.accountingProject;
        }

        // Set post-processing fields.
        if (job.ext.isPostProcessing) {
            if (job.postProcessingName) {
                ppFields.push(job.postProcessingName);
            }
            if (job.postProcessingDate) {
                ppFields.push(job.postProcessingDate);
            }
            if (job.postProcessingDimension) {
                ppFields.push(job.postProcessingDimension);
            }
            if (job.postProcessingComponent) {
                ppFields.push(job.postProcessingComponent);
            }
            if (job.postProcessingFile) {
                ppFields.push(job.postProcessingFile);
            }
            if (ppFields.length) {
                job.ext.postProcessingInfo = ppFields.join(".");
            }
        }

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set expected end date.
        if (job.executionStartDate) {
            job.ext.expectedExecutionEndDate = moment(job.executionStartDate).add(job.warningDelay, 's');
        }

        // Set duration.
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = job.executionEndDate.diff(job.executionStartDate, 's');
            job.ext.duration = numeral(job.ext.duration).format('00:00:00');
        }

        // Set lateness.
        if (job.executionStartDate &&
            job.executionEndDate &&
            job.executionEndDate > job.ext.expectedExecutionEndDate) {
            job.ext.lateness = job.executionEndDate.diff(job.ext.expectedExecutionEndDate, 's');
            job.ext.lateness = numeral(job.ext.lateness).format('00:00:00');
        }

        // Set execution state.
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }
    };

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
            simulation.ext.modelSynonyms = model.synonyms.split(", ");
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
