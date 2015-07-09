(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var extendSimulation,
        getExecutionState,
        setCVTermDisplayName,
        setExecutionState;

    // Returns simulation's current execution status.
    getExecutionState = function (simulation) {
        var last;


        // Complete if cmip5.
        if (simulation.activity === 'cmip5') {
            return 'complete';
        }

        // Queued if no jobs have started.
        if (simulation.jobs.compute.all.length === 0) {
            return 'queued';
        }

        // Set last job.
        last = _.last(simulation.jobs.compute.all);

        // Running if last job is running.
        if (last.executionState === 'running') {
            return 'running';
        }

        // Error if last job is error.
        if (last.executionState === 'error') {
            return 'error';
        }

        // Complete if last job is complete and 0100 has been received.
        if (last.executionState === 'complete' && simulation.executionEndDate && simulation.isError === false) {
            return 'complete';
        }

        // Otherwise queued.
        return 'queued';
    };

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
        simulation.executionState = getExecutionState(simulation);
        setCVTermDisplayName(simulation, 'simulation_state', 'executionState');
    };

    // Set case sensitive cv related field names.
    setCVTermDisplayName = function (simulation, termType, fieldName) {
        var term, fieldValue;

        fieldName = fieldName || termType;
        fieldValue = simulation[fieldName];
        term = MOD.cv.getTerm(termType, fieldValue);
        if (term) {
            simulation.ext[fieldName] = term.displayName;
        } else {
            simulation.ext[fieldName] = fieldValue || '--';
        }

        // Update unspecified fields.
        if (simulation.ext[fieldName].toLowerCase() === 'unspecified') {
            simulation.ext[fieldName] = '--';
        }
    };

    // Extends a simulation in readiness for processing.
    extendSimulation = function (simulation) {
        var model;

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
                imURL: undefined,
                isRestart: simulation.tryID > 1,
                model: undefined,
                modelSynonyms: [],
                mURL: undefined,
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
                count: "--",
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
        setCVTermDisplayName(simulation, 'activity');
        setCVTermDisplayName(simulation, 'compute_node', 'computeNode');
        setCVTermDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        setCVTermDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        setCVTermDisplayName(simulation, 'experiment');
        setCVTermDisplayName(simulation, 'model');
        setCVTermDisplayName(simulation, 'simulation_space', 'space');

        // Set accounting project.
        if (simulation.accountingProject === 'None' || _.isNull(simulation.accountingProject)) {
            simulation.ext.accountingProject = "--";
        } else {
            simulation.ext.accountingProject = simulation.accountingProject;
        }

        // Set model synonyms.
        // TODO - derive at click time ?
        model = MOD.cv.getTerm('model', simulation.model);
        if (model && model.synonyms) {
            simulation.ext.modelSynonyms = model.synonyms.split(", ");
        }

        // Set monitoring / inter-monitoring URLs.
        // TODO - derive at click time ?
        if (_.has(MOD.urls.M, simulation.computeNode)) {
            simulation.ext.mURL = MOD.urls.M[simulation.computeNode];
        }
        if (_.has(MOD.urls.IM, simulation.computeNode)) {
            simulation.ext.imURL = MOD.urls.IM[simulation.computeNode];
        }
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        MOD.parseSimulations([simulation], jobHistory, _.indexBy([simulation], "uid"));
    };

    // Parses a collection of simulations in readiness for processing.
    MOD.parseSimulations = function (simulationList, jobHistory, simulationSet) {
        // Extend simulations.
        _.each(simulationList, extendSimulation);

        // Extend jobs.
        _.each(jobHistory, MOD.extendJob);

        // Append jobs.
        _.each(jobHistory, function (job) {
            if (_.has(simulationSet, job.simulationUID)) {
                MOD.appendJob(simulationSet[job.simulationUID], job);
            }
        });

        // Parse jobs.
        _.each(simulationList, MOD.parseJobs);

        // Set execution states.
        _.each(simulationList, setExecutionState);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
