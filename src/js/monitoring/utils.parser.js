(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var parseExecutionState,
        parseObsoletions;

    // Parses obsolete simulations.
    // @hashID  Hash identifier of a simulation being processed.
    parseObsoletions = function (hashID) {
        var obsoletions;

        obsoletions = _.filter(_.values(MOD.state.simulationSet), function (simulation){
            return simulation.hashid === hashID;
        });
        _.each(obsoletions, function (simulation) {
            delete MOD.state.simulationSet[simulation.uid];
        });
    };

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
        var model;

        // Extend simulation.
        _.extend(simulation, {
            ext: {
                executionState: undefined,
                experiment: undefined,
                isSelectedForIM: false,
                jobs: _.filter(jobHistory, function (job) {
                    return job.simulationUID === simulation.uid;
                }),
                jobCount: 0,
                hasLateJob: false,
                hasRunningJob: false,
                imURL: undefined,
                isRestart: simulation.tryID > 1,
                modelSynonyms: [],
                mURL: undefined,
                runningJobs: []
            }
        });

        // Parse jobs, execution status, obsolete simulations.
        MOD.parseSimulationJobs(simulation);
        parseExecutionState(simulation);
        parseObsoletions(simulation.hashid);

        // Format date fields.
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

        // Update module state.
        MOD.state.simulationSet[simulation.uid] = simulation;
        MOD.state.simulationList = _.values(MOD.state.simulationSet);
    };

    // Parses simulation jobs in readiness for processing.
    MOD.parseSimulationJobs = function (simulation, parseJobs) {
        // Parse jobs.
        if (_.isUndefined(parseJobs) || parseJobs === true) {
            _.each(simulation.ext.jobs, MOD.parseJob);
        }

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
        if (_.isUndefined(simulation.executionEndDate) &&
            simulation.isError === false &&
            _.findWhere(simulation.ext.jobs, { isLate: true })) {
            simulation.ext.hasLateJob = true;
        }
    };

    // Parses a simulation job in readiness for processing.
    MOD.parseJob = function (job) {
        if (job.executionStartDate) {
            job.executionStartDate = moment(job.executionStartDate);
        }
        if (job.expectedExecutionEndDate) {
            job.expectedExecutionEndDate = moment(job.expectedExecutionEndDate);
        }
        if (job.executionEndDate) {
            job.executionEndDate = moment(job.executionEndDate);
            job.isLate = job.wasLate;
        } else {
            job.isLate = moment().valueOf() > job.expectedExecutionEndDate.valueOf();
        }
    };

}(
    this.APP.modules.monitoring,
    this._,
    this.moment
));
