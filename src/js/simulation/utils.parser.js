(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var setExecutionState,
        getJobTypesets,
        parseComputeJobs,
        parseJob,
        parseJobs,
        setCVTermDisplayName,
        setJobIdentifiers,
        setJobStatesets,
        setJobTypeset,
        setJobTypesets,
        sortJobs;

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
        if (simulation.executionEndDate) {
            if (simulation.isError) {
                simulation.executionState = 'error';
            } else {
                simulation.executionState = 'complete';
            }
        } else if (simulation.ext.runningJobs.length) {
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

    // Parses a simulation job in readiness for processing.
    parseJob = function (job) {
        // Extend job.
        _.extend(job, {
            ext: {
                id: undefined,
                executionEndDate: '--',
                expectedExecutionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                duration: '--',
                type: job.typeof || 'compute'
            }
        });

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "expectedExecutionEndDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set duration (in seconds).
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = numeral(job.executionEndDate.diff(job.executionStartDate, 'seconds')).format('00:00:00');
        }

        // Set execution state.
        if (job.isError) {
            job.ext.executionState = 'error';
        } else if (job.executionEndDate) {
            job.ext.executionState = 'complete';
        } else {
            job.ext.executionState = 'running';
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
                    return job.ext.executionState === jobState;
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
            parseJob(firstJob);
        }

        // When a simulation is completed ensure that
        // incomplete compute jobs have the same termination status.
        if (simulation.executionEndDate) {
            incompleteJobs = _.filter(simulation.jobs.compute.all, function (job) {
                return _.isNull(job.executionEndDate);
            });
            _.each(incompleteJobs, function (job) {
                job.ext.executionState = simulation.isError ? 'error' : 'complete';
            });
        }
    };

    // Assigns job identifiers.
    setJobIdentifiers = function (simulation) {
        _.each(simulation.jobs.global.all, function (job, index) {
            job.ext.id = index + 1;
        });
    };

    // Parses simulation jobs in readiness for processing.
    parseJobs = function (simulation) {
        // Perform initial job parse.
        _.each(simulation.jobs.global.all, parseJob);

        // Invoke parsing operations.
        _.each([
            sortJobs,
            setJobTypesets,
            parseComputeJobs,
            sortJobs,
            setJobStatesets,
            setJobIdentifiers
        ], function (parser) {
            parser(simulation);
        });

        // Reverse sort so that most recent is displayed first.
        simulation.jobs.global.all = simulation.jobs.global.all.reverse();
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var caption;

        // Extend simulation.
        _.extend(simulation, {
            ext: {
                activity: undefined,
                caption: undefined,
                executionEndDate: "--",
                executionState: undefined,
                executionStartDate: "--",
                experiment: undefined,
                model: undefined,
                outputEndDate: "--",
                outputStartDate: "--",
                runningJobs: [],
                simulationSpace: undefined,
                simulation_space: undefined
            },
            jobs: {
                caption: undefined,
                compute: {
                    all: [],
                    complete: [],
                    error: [],
                    running: []
                },
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
        APP.utils.formatDateField(simulation, "executionStartDate");
        APP.utils.formatDateField(simulation, "executionEndDate");
        APP.utils.formatDateField(simulation, "outputStartDate");
        APP.utils.formatDateField(simulation, "outputEndDate");

        // Parse jobs.
        if (jobHistory.length) {
            parseJobs(simulation);
        }

        // Set execution state.
        setExecutionState(simulation);

        // Update case sensitive CV fields.
        setCVTermDisplayName(simulation, 'activity');
        setCVTermDisplayName(simulation, 'simulation_space', 'space');
        setCVTermDisplayName(simulation, 'simulation_state', 'executionState');
        setCVTermDisplayName(simulation, 'compute_node', 'computeNode');
        setCVTermDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        setCVTermDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        setCVTermDisplayName(simulation, 'model');
        setCVTermDisplayName(simulation, 'experiment');

        // Set simulation caption.
        caption = "{activity} -> {space} -> {name}";
        caption = caption.replace("{activity}", simulation.activity.toUpperCase());
        caption = caption.replace("{space}", simulation.space.toUpperCase());
        caption = caption.replace("{name}", simulation.name);
        simulation.ext.caption = caption;

        // Set jobs caption.
        caption = "{0} jobs: {1} running; {2} complete; {3} errors.";
        caption = caption.replace("{0}", simulation.jobs.global.all.length);
        caption = caption.replace("{1}", simulation.jobs.global.running.length);
        caption = caption.replace("{2}", simulation.jobs.global.complete.length);
        caption = caption.replace("{3}", simulation.jobs.global.error.length);
        simulation.jobs.caption = caption;
    };
}(
    this.APP,
    this.APP.modules.simulation,
    this._,
    this.moment,
    this.numeral
));
