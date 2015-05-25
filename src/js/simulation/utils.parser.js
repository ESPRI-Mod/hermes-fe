(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var parseExecutionState;

    // Sets simulation's current execution status.
    parseExecutionState = function (simulation) {
        if (simulation.executionEndDate) {
            if (simulation.isError) {
                simulation.ext.executionState = 'error';
            } else {
                simulation.ext.executionState = 'complete';
            }
        } else if (simulation.ext.hasRunningJob === true) {
            simulation.ext.executionState = 'running';
        } else {
            simulation.ext.executionState = 'queued';
        }
        simulation.executionState = simulation.ext.executionState;
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var caption, model;

        // Set extension fields.
        simulation.ext = {
            activity: undefined,
            caption: undefined,
            executionState: undefined,
            experiment: undefined,
            isSelectedForIM: false,
            jobs: jobHistory,
            jobCount: 0,
            hasLateJob: false,
            hasRunningJob: false,
            imURL: undefined,
            isRestart: simulation.tryID > 1,
            modelSynonyms: [],
            mURL: undefined,
            runningJobs: [],
            simulationSpace: undefined,
            simulation_space: undefined
        };
        simulation.login = simulation.computeNodeLogin;
        simulation.machine = simulation.computeNodeMachine;
        simulation.node = simulation.computeNode;

        // Parse jobs, execution status, obsolete simulations.
        MOD.parseSimulationJobs(simulation);
        parseExecutionState(simulation);

        // Format date fields.
        simulation.executionStartDate =
            (simulation.executionStartDate || "--").substring(0, 10);
        simulation.executionEndDate =
            (simulation.executionEndDate || "--").substring(0, 10);
        simulation.outputStartDate =
            (simulation.outputStartDate || "--").substring(0, 10);
        simulation.outputEndDate =
            (simulation.outputEndDate || "--").substring(0, 10);

        // Set case sensitive CV fields.
        _.each(['activity', 'experiment', 'simulation_space'], function (field) {
            var cvTerm = MOD.cv.getTerm(field, simulation[field]);
            if (cvTerm) {
                simulation.ext[field] = cvTerm.displayName;
            }
        });

        // Set model synonyms.
        model = MOD.cv.getTerm('model', simulation.model);
        if (model && model.synonyms) {
            simulation.ext.modelSynonyms = model.synonyms.split(", ");
        }

        // Set monitoring / inter-monitoring URLs.
        if (_.has(MOD.urls.M, simulation.computeNode)) {
            simulation.ext.mURL = MOD.urls.M[simulation.computeNode];
        }

        // Set caption.
        caption = "{activity} -> {space} -> {name} ({tryID})";
        caption = caption.replace("{activity}", simulation.activity);
        caption = caption.replace("{space}", simulation.space);
        caption = caption.replace("{name}", simulation.name);
        caption = caption.replace("{tryID}", simulation.tryID);
        simulation.ext.caption = caption;
    };

    // Parses simulation jobs in readiness for processing.
    MOD.parseSimulationJobs = function (simulation, parseJobs) {
        // Parse.
        if (_.isUndefined(parseJobs) || parseJobs === true) {
            _.each(simulation.ext.jobs, MOD.parseJob);
        }

        // Sort.
        simulation.ext.jobs = _.sortBy(simulation.ext.jobs, 'executionStartDate');

        // Set id.
        _.each(simulation.ext.jobs, function (job, index) {
            job.ext.id = index + 1;
        });

        // Set running jobs.
        simulation.ext.runningJobs = _.filter(simulation.ext.jobs, function (job) {
            return _.isNull(job.executionEndDate);
        });
        simulation.ext.hasRunningJob = simulation.ext.runningJobs.length > 0;

        // Set job count.
        if (simulation.ext.jobs) {
            simulation.ext.jobCount = simulation.ext.jobs.length;
        } else {
            simulation.ext.jobCount = "--";
        }

        // Set has late job flag.
        if (_.findWhere(simulation.ext.jobs, { isLate: true })) {
            simulation.ext.hasLateJob = true;
        }
    };

    // Parses a simulation job in readiness for processing.
    MOD.parseJob = function (job) {
        job.ext = {
            id: undefined,
            executionEndDate: undefined,
            expectedExecutionEndDate: undefined,
            executionStartDate: undefined,
            executionState: undefined
        };
        if (job.executionStartDate) {
            job.executionStartDate = moment(job.executionStartDate);
            job.ext.executionStartDate = moment(job.executionStartDate).format('DD-MM-YYYY HH:mm:ss');
        }
        if (job.expectedExecutionEndDate) {
            job.expectedExecutionEndDate = moment(job.expectedExecutionEndDate);
            job.ext.expectedExecutionEndDate = moment(job.expectedExecutionEndDate).format('DD-MM-YYYY HH:mm:ss');
        }
        if (job.executionEndDate) {
            job.executionEndDate = moment(job.executionEndDate);
            job.ext.executionEndDate = moment(job.executionEndDate).format('DD-MM-YYYY HH:mm:ss');
            job.isLate = job.wasLate;
        } else {
            job.isLate = moment().valueOf() > job.expectedExecutionEndDate.valueOf();
        }
        if (job.isError) {
            job.ext.executionState = 'error';
        } else if (job.executionEndDate) {
            job.ext.executionState = 'complete';
        } else {
            job.ext.executionState = 'running';
        }
    };

}(
    this.APP.modules.simulation,
    this._,
    this.moment
));
