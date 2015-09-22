(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set a job's lateness indicator.
    MOD.setJobLateness = function (job) {
        var now;

        // Escape if unnecessary.
        if (_.isNull(job.executionStartDate)) {
            return;
        }
        if (job.ext.latenessAssigned) {
            return;
        }

        // Set lateness (in HH::MM::SS).
        if (job.executionEndDate) {
            if (job.executionEndDate > job.expectedExecutionEndDate) {
                job.ext.latenessAssigned = true;
                job.ext.lateness = job.executionEndDate.diff(job.expectedExecutionEndDate, 'seconds');
                job.ext.lateness = numeral(job.ext.lateness).format('00:00:00');
            }
        } else {
            now = moment();
            if (now > job.expectedExecutionEndDate) {
                job.ext.latenessAssigned = false;
                job.ext.lateness = now.diff(job.expectedExecutionEndDate, 'seconds');
                job.ext.lateness = numeral(job.ext.lateness).format('00:00:00');
            }
        }
    }

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
            isError: false,
            wasLate: false,
            postProcessingComponent: null,
            postProcessingDate: null,
            postProcessingDimension: null,
            postProcessingFile: null,
            postProcessingName: null,
            typeof: 'post-processing'
        });
        
        // Initialise extension fields.
        _.extend(job, {
            accountingProject: undefined,
            executionState: undefined,
            ext: {
                accountingProject: '--',
                id: undefined,
                lateness: '--',
                latenessAssigned: false,
                duration: '--',
                executionEndDate: '--',
                expectedExecutionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                type: job.typeof,
                isPostProcessing: job.typeof !== 'computing',
                postProcessingInfo: '--'
            },
            isLate: undefined
        });

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        if (_.has(job, "expectedExecutionEndDate")) {
            APP.utils.formatDateTimeField(job, "expectedExecutionEndDate");            
        }
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set duration (in HH::MM::SS).
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = job.executionEndDate.diff(job.executionStartDate, 'seconds');
            job.ext.duration = numeral(job.ext.duration).format('00:00:00');
        }

        // Set lateness indicator (in HH::MM::SS).
        MOD.setJobLateness(job);

        // Set execution state.
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }

        // Set is late flag.
        if (job.executionEndDate) {
            job.isLate = job.wasLate;
        } else {
            job.isLate = moment().valueOf() > job.expectedExecutionEndDate.valueOf();
        }

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
            // job.ext.postProcessingInfo = "creates_ts.19801231.Chunck3D.ATM.Post_1M_histmth-DSDASDSDASDASD";
        }
    };

    // Extends a simulation in readiness for processing.
    MOD.extendSimulation = function (simulation) {
        var model;
        
        // Set defaults:
        _.defaults(simulation, {
            accountingProject: null,
            executionEndDate: null,
            isError: false,
            isObsolete: false,
            outputStartDate: null,
            outputEndDate: null,
            parentSimulationBranchDate: null,
            parentSimulationName: null,
            // ... cv related
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
            spaceRaw: null            
        });

        // Initialise extension fields.
        _.extend(simulation, {
            executionState: undefined,
            ext: {
                accountingProject: undefined,
                activity: undefined,
                caption: undefined,
                computeNode: undefined,
                computeNodeLogin: undefined,
                computeNodeMachine: undefined,
                executionEndDate: "--",
                executionState: undefined,
                executionStartDate: "--",
                experiment: undefined,
                hasRunningJob: false,
                isSelectedForIM: false,
                isRestart: simulation.tryID > 1,
                model: undefined,
                modelSynonyms: [],
                outputEndDate: "--",
                outputStartDate: "--",
                space: undefined
            },
            jobs: {
                compute: {
                    all: [],
                    complete: [],
                    error: [],
                    hasLate: false,
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
        if (simulation.accountingProject === 'None' || _.isNull(simulation.accountingProject)) {
            simulation.ext.accountingProject = "--";
        } else {
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
