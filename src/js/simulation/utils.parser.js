(function (MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var setExecutionState, parseJob, parseJobs;

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

    // Parses a simulation job in readiness for processing.
    parseJob = function (job) {
        // Set default extension field values.
        job.ext = {
            id: undefined,
            executionEndDate: undefined,
            expectedExecutionEndDate: undefined,
            executionStartDate: undefined,
            executionState: undefined,
            duration: undefined
        };

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "expectedExecutionEndDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set duration (in seconds).
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = numeral(job.executionEndDate.diff(job.executionStartDate, 'seconds')).format('00:00:00');;
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

    // Parses simulation jobs in readiness for processing.
    parseJobs = function (simulation) {
        // Parse each job.
        _.each(simulation.ext.jobs, parseJob);

        // Sort.
        simulation.ext.jobs = _.sortBy(simulation.ext.jobs, 'executionStartDate');

        // Set id.
        _.each(simulation.ext.jobs, function (job, index) {
            job.ext.id = index + 1;
        });

        // Reverse sort so that most recent is displayed first.
        simulation.ext.jobs = simulation.ext.jobs.reverse();

        // Set running jobs.
        simulation.ext.runningJobs = _.filter(simulation.ext.jobs, function (job) {
            return _.isNull(job.executionEndDate);
        });
        simulation.ext.completeJobs = _.filter(simulation.ext.jobs, function (job) {
            return !_.isNull(job.executionEndDate) && !job.isError;
        });
        simulation.ext.errorJobs = _.filter(simulation.ext.jobs, function (job) {
            return job.isError;
        });
    };

    var setCVTermDisplayName = function (simulation, termType, fieldName) {
        var term;

        fieldName = fieldName || termType;
        term = MOD.cv.getTerm(termType, simulation[fieldName]);
        if (term) {
            simulation.ext[fieldName] = term.displayName;
        }
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var caption;

        // Set default extension field values.
        simulation.ext = {
            activity: undefined,
            caption: undefined,
            completeJobs: [],
            errorJobs: [],
            executionEndDate: "--",
            executionState: undefined,
            executionStartDate: "--",
            experiment: undefined,
            jobs: jobHistory,
            jobsCaption: undefined,
            model: undefined,
            outputEndDate: "--",
            outputStartDate: "--",
            runningJobs: [],
            simulationSpace: undefined,
            simulation_space: undefined
        };

        // Format date fields.
        APP.utils.formatDateField(simulation, "executionStartDate");
        APP.utils.formatDateField(simulation, "executionEndDate");
        APP.utils.formatDateField(simulation, "outputStartDate");
        APP.utils.formatDateField(simulation, "outputEndDate");

        // Parse jobs.
        parseJobs(simulation);

        // Set execution state.
        setExecutionState(simulation);

        // Set case sensitive CV fields.
        setCVTermDisplayName(simulation, 'activity');
        setCVTermDisplayName(simulation, 'simulation_space', 'space');
        setCVTermDisplayName(simulation, 'simulation_state', 'executionState');
        setCVTermDisplayName(simulation, 'compute_node_login', 'computeNodeLogin');
        setCVTermDisplayName(simulation, 'compute_node_machine', 'computeNodeMachine');
        setCVTermDisplayName(simulation, 'model');
        setCVTermDisplayName(simulation, 'experiment');

        // Set caption.
        caption = "{activity} -> {space} -> {name}";
        caption = caption.replace("{activity}", simulation.activity.toUpperCase());
        caption = caption.replace("{space}", simulation.space.toUpperCase());
        caption = caption.replace("{name}", simulation.name);
        simulation.ext.caption = caption;

        // Set jobs caption.
        caption = "{0} jobs: {1} running; {2} complete; {3} errors.";
        caption = caption.replace("{0}", simulation.ext.jobs.length);
        caption = caption.replace("{1}", simulation.ext.runningJobs.length);
        caption = caption.replace("{2}", simulation.ext.completeJobs.length);
        caption = caption.replace("{3}", simulation.ext.errorJobs.length);
        simulation.ext.jobsCaption = caption;
    };
}(
    this.APP.modules.simulation,
    this._,
    this.moment,
    this.numeral
));
