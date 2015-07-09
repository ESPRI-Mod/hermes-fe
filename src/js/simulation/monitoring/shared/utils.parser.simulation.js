(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var excludePreviousTries,
        setCVTermDisplayName,
        setExecutionState;

    // Excludes previous tries from set of managed simulations.
    // @hashID  Hash identifier of a simulation being processed.
    excludePreviousTries = function (hashID) {
        var obsoletions;

        obsoletions = _.filter(_.values(MOD.state.simulationSet), function (simulation) {
            return simulation.hashid === hashID;
        });
        _.each(obsoletions, function (simulation) {
            delete MOD.state.simulationSet[simulation.uid];
        });
    };

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
        var last;

        // Complete if cmip5.
        if (simulation.activity === 'cmip5') {
            simulation.executionState = 'complete';
            return;
        }


        // Queued if no jobs have started.
        if (simulation.jobs.compute.all.length === 0) {
            simulation.executionState = 'queued';
            return;
        }

        // Set last job.
        last = _.last(simulation.jobs.compute.all);

        // Running if last job is running.
        if (last.executionState === 'running') {
            simulation.executionState = 'running';
            return;
        }

        // Error if last job is error.
        if (last.executionState === 'error') {
            simulation.executionState = 'error';
            return;
        }

        // Complete if last job is complete and 0100 has been received.
        if (last.executionState === 'complete' && simulation.executionEndDate && simulation.isError === false) {
            simulation.executionState = 'complete';
            return;
        }

        // Otherwise queued.
        simulation.executionState = 'queued';
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
            simulation.ext[fieldName] = fieldValue || 'UNSPECIFIED';
        }
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var caption, model;

        // Extend simulation.
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
                    first: undefined,
                    hasLate: false,
                    last: undefined,
                    running: [],
                },
                count: "--",
                global: {
                    all: jobHistory,
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

        // Parse jobs.
        if (jobHistory.length) {
            MOD.parseJobs(simulation);
        }

        // Set execution state.
        setExecutionState(simulation);

        // Parse obsolete simulations.
        if (_.has(MOD.state, 'simulationSet')) {
            excludePreviousTries(simulation.hashid);
        }

        // Update case sensitive CV fields.
        setCVTermDisplayName(simulation, 'activity');
        setCVTermDisplayName(simulation, 'compute_node', 'computeNode');
        setCVTermDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        setCVTermDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        setCVTermDisplayName(simulation, 'experiment');
        setCVTermDisplayName(simulation, 'model');
        setCVTermDisplayName(simulation, 'simulation_space', 'space');
        setCVTermDisplayName(simulation, 'simulation_state', 'executionState');

        // Set accounting project.
        if (simulation.accountingProject === 'None' || _.isNull(simulation.accountingProject)) {
            simulation.ext.accountingProject = "--";
        } else {
            simulation.ext.accountingProject = simulation.accountingProject;
        }

        // Set simulation caption.
        caption = "{activity} -> {space} -> {name}";
        caption = caption.replace("{activity}", simulation.ext.activity);
        caption = caption.replace("{space}", simulation.ext.space);
        caption = caption.replace("{name}", simulation.name);
        simulation.ext.caption = caption;

        // Set model synonyms.
        model = MOD.cv.getTerm('model', simulation.model);
        if (model && model.synonyms) {
            simulation.ext.modelSynonyms = model.synonyms.split(", ");
        }

        // Set monitoring / inter-monitoring URLs.
        if (_.has(MOD.urls.M, simulation.computeNode)) {
            simulation.ext.mURL = MOD.urls.M[simulation.computeNode];
        }
        if (_.has(MOD.urls.IM, simulation.computeNode)) {
            simulation.ext.imURL = MOD.urls.IM[simulation.computeNode];
        }
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
