(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var setExecutionState,
        setJobs;

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
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

    // Parses simulation jobs in readiness for processing.
    setJobs = function (simulation, jobHistory) {
        // Set jobs.
        simulation.ext.jobs = _.filter(jobHistory, function (item) {
            return item.simulationUID === simulation.uid;
        });

        // Parse jobs.
        _.each(simulation.ext.jobs, function (job) {
            job.executionStartDate = moment(job.executionStartDate);
            job.expectedExecutionEndDate = moment(job.expectedExecutionEndDate);
            if (job.executionEndDate) {
                job.executionEndDate = moment(job.executionEndDate);
                job.isLate = job.wasLate;
            } else {
                simulation.ext.hasRunningJob = true;
                job.isLate = moment().valueOf() > job.expectedExecutionEndDate.valueOf();
            }
        });

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

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        var model, previousSimulations;

        // Set extension fields.
        simulation.ext = {
            executionState: undefined,
            experiment: undefined,
            isSelectedForIM: false,
            jobs: [],
            jobCount: 0,
            hasLateJob: false,
            hasRunningJob: false,
            imURL: undefined,
            isRestart: false,
            modelSynonyms: [],
            mURL: undefined,
        };

        // Set job / execution state.
        setJobs(simulation, jobHistory);
        setExecutionState(simulation);

        // Format date fields.
        // TODO use moment.js
        simulation.executionStartDate =
            (simulation.executionStartDate || "").substring(0, 10);
        simulation.executionEndDate =
            (simulation.executionEndDate || "").substring(0, 10);

        // Set case sensitive CV fields.
        _.each(['experiment'], function (field) {
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
        if (_.has(MOD.urls.IM, simulation.computeNode)) {
            simulation.ext.imURL = MOD.urls.IM[simulation.computeNode];
        }

        // Set is restart flag.
        previousSimulations = _.where(MOD.state.simulationList, { hashID: simulation.hashID });
        if (previousSimulations.length) {
            simulation.ext.isRestart = true;
        }

        // Update module state.
        MOD.state.simulationSet[simulation.uid] = simulation;
        _.each(previousSimulations, function (previousSimulation) {
            delete MOD.state.simulationSet[previousSimulation.uid];
        });
        MOD.state.simulationList = _.values(MOD.state.simulationSet);
    };

}(
    this.APP.modules.monitoring,
    this._,
    this.moment
));
