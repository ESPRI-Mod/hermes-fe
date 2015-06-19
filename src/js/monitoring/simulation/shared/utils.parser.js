(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var excludePreviousTries,
        getJobTypesets,
        parseComputeJobs,
        reverseSortJobs,
        setCVTermDisplayName,
        setExecutionState,
        setJobCount,
        setJobIdentifiers,
        setJobLateFlag,
        setJobStatesets,
        setJobTypeset,
        setJobTypesets,
        sortJobs;

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
        if (simulation.executionEndDate) {
            if (simulation.isError) {
                simulation.executionState = 'error';
            } else {
                simulation.executionState = 'complete';
            }
        } else if (simulation.jobs.compute.running.length) {
            simulation.executionState = 'running';
        } else {
            simulation.executionState = 'queued';
        }
    };

    // Set case sensitive cv related field names.
    setCVTermDisplayName = function (simulation, termType, fieldName) {
        var term;

        fieldName = fieldName || termType;
        term = MOD.cv.getTerm(termType, simulation[fieldName]);
        if (term) {
            simulation.ext[fieldName] = term.displayName;
        }
    };

    // Returns top-level job sets.
    getJobTypesets = function (simulation) {
        return [
            simulation.jobs.global,
            simulation.jobs.compute,
            simulation.jobs.postProcessing,
            simulation.jobs.postProcessingFromChecker
        ];
    };

    // Sets a job type set.
    setJobTypeset = function (simulation, jobTypeset, jobType) {
        jobTypeset.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.typeof === jobType;
        });
    };

    // Sets all job type sets.
    setJobTypesets = function (simulation) {
        setJobTypeset(simulation, simulation.jobs.compute, 'computing');
        setJobTypeset(simulation, simulation.jobs.postProcessing, 'post-processing');
        setJobTypeset(simulation, simulation.jobs.postProcessingFromChecker, 'post-processing-from-checker');
    };

    // Sorts jobs.
    sortJobs = function (simulation) {
        _.each(getJobTypesets(simulation), function (jobSet) {
            _.each(['all', 'running', 'complete', 'running'], function (jobState) {
                jobSet[jobState] = _.sortBy(jobSet[jobState], 'executionStartDate');
            });
        });
    };

    // Sets job state sets.
    setJobStatesets = function (simulation) {
        _.each(getJobTypesets(simulation), function (jobSet) {
            _.each(['running', 'complete', 'error'], function (jobState) {
                jobSet[jobState] = _.filter(jobSet.all, function (job) {
                    return job.executionState === jobState;
                });
            });
        });
    };

    // Parses set of simulation compute jobs.
    parseComputeJobs = function (simulation) {
        var firstJob, incompleteJobs;

        // Set spin-up job start date if necessary.
        firstJob = _.first(simulation.jobs.compute.all);
        if (_.isNull(firstJob.executionStartDate)) {
            firstJob.executionStartDate = simulation.executionStartDate;
            MOD.parseJob(firstJob);
        }

        // When a simulation is completed ensure that
        // incomplete compute jobs have the same termination status.
        if (simulation.executionEndDate) {
            incompleteJobs = _.filter(simulation.jobs.compute.all, function (job) {
                return _.isNull(job.executionEndDate);
            });
            _.each(incompleteJobs, function (job) {
                job.executionState = simulation.isError ? 'error' : 'complete';
            });
        }
    };

    // Assigns job identifiers.
    setJobIdentifiers = function (simulation) {
        _.each(simulation.jobs.global.all, function (job, index) {
            job.ext.id = index + 1;
        });
    };

    // Assigns job count field.
    setJobCount = function (simulation) {
        if (simulation.jobs.global.all) {
            simulation.jobs.count = simulation.jobs.global.all.length;
        } else {
            simulation.jobs.count = "--";
        }
    };

    // Sets a flag indicating whether a compute job is late.
    setJobLateFlag = function (simulation) {
        if (_.isUndefined(simulation.executionEndDate) &&
            _.findWhere(simulation.jobs.compute.all, { isLate: true })) {
            simulation.jobs.compute.hasLate = true;
        }
    };

    // Reverse sorts jobs so that most recent is displayed first.
    reverseSortJobs = function (simulation) {
        simulation.jobs.global.all = simulation.jobs.global.all.reverse();
    };

    // Parses simulation jobs in readiness for processing.
    MOD.parseJobs = function (simulation, doIndividualParse) {
        // Parse jobs.
        if (_.isUndefined(doIndividualParse) || doIndividualParse === true) {
            _.each(simulation.jobs.global.all, MOD.parseJob);
        }

        // Invoke parsing operations.
        _.each([
            sortJobs,
            setJobTypesets,
            parseComputeJobs,
            sortJobs,
            setJobStatesets,
            setJobIdentifiers,
            setJobCount,
            setJobLateFlag,
            reverseSortJobs
        ], function (parser) {
            parser(simulation);
        });
    };

    // Parses a job in readiness for processing.
    MOD.parseJob = function (job) {
        // Extend job.
        _.extend(job, {
            executionState: undefined,
            ext: {
                id: undefined,
                duration: '--',
                executionEndDate: '--',
                expectedExecutionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                type: job.typeof || 'computing'
            },
            isLate: undefined
        });

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "expectedExecutionEndDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set duration (in seconds).
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = job.executionEndDate.diff(job.executionStartDate, 'seconds');
            job.ext.duration = numeral(job.ext.duration).format('00:00:00');
        }

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
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var caption, model;

        // Extend simulation.
        _.extend(simulation, {
            executionState: undefined,
            ext: {
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
                jobs: jobHistory,
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
                    running: []
                },
                count: "--",
                global: {
                    all: jobHistory,
                    complete: [],
                    error: [],
                    running: []
                },
                longCaption: undefined,
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
                },
                shortCaption: undefined,
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

        // Set simulation caption.
        caption = "{activity} -> {space} -> {name}";
        caption = caption.replace("{activity}", simulation.ext.activity);
        caption = caption.replace("{space}", simulation.ext.space);
        caption = caption.replace("{name}", simulation.name);
        simulation.ext.caption = caption;

        // Set jobs long caption.
        caption = "{0} jobs: {1} running; {2} complete; {3} errors.";
        caption = caption.replace("{0}", simulation.jobs.global.all.length);
        caption = caption.replace("{1}", simulation.jobs.global.running.length);
        caption = caption.replace("{2}", simulation.jobs.global.complete.length);
        caption = caption.replace("{3}", simulation.jobs.global.error.length);
        simulation.jobs.longCaption = caption;

        // Set jobs short caption.
        caption = "{0} running | {1} complete | {2} errors";
        caption = caption.replace("{0}", simulation.jobs.global.running.length);
        caption = caption.replace("{1}", simulation.jobs.global.complete.length);
        caption = caption.replace("{2}", simulation.jobs.global.error.length);
        simulation.jobs.shortCaption = caption;

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
