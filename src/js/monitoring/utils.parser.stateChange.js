(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare vars.
    var isTerminationState,
        resetSimulationStateHistory,
        setJobWarnings,
        setSimulationCurrentState;

    // Resets simulation state history related information.
    resetSimulationStateHistory = function (simulation) {
        // Initialize.
        simulation.executionState = undefined;
        simulation.ext.jobCount = "--";
        simulation.ext.jobStateHistory = [];
        simulation.ext.hasJobCompletionWarning = false;
        simulation.ext.stateHistory = [];
        simulation.ext.state = undefined;

        // Set histories.
        if (_.has(MOD.state.simulationStateHistory, simulation.uid)) {
            simulation.ext.stateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (sc) {
                return sc.jobUID === null;
            });
            simulation.ext.jobStateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (sc) {
                return sc.jobUID !== null;
            });
        }

        // Sort histories.
        simulation.ext.stateHistory = _.sortBy(simulation.ext.stateHistory, 'timestampMS');
        simulation.ext.jobStateHistory = _.sortBy(simulation.ext.jobStateHistory, 'timestampMS');
    };

    // Determines whether a state change represents a termination state.
    isTerminationState = function (stateChange) {
        return _.indexOf(['complete', 'error'], stateChange.description) > -1;
    };

    // Sets simulation's current processing status.
    setSimulationCurrentState = function (simulation) {
        // Simulations without a state history are considered to be complete.
        if (!simulation.ext.stateHistory.length) {
            simulation.executionState = 'complete';
            return;
        }

        // Termination states;
        simulation.ext.state = _.find(simulation.ext.stateHistory, function (sc) {
            return isTerminationState(sc);
        });

        // Queued / running states;
        if (_.isUndefined(simulation.ext.state)) {
            simulation.ext.state = _.last(simulation.ext.stateHistory);
        }

        simulation.executionState = simulation.ext.state.description;
    };

    // Sets a warning flag if a job has not completed before a timestamp expires.
    setJobWarnings = function (simulation) {
        _.each(simulation.ext.jobStateHistory, function (stateChange) {
            var jobStates;

            if (simulation.ext.hasJobCompletionWarning === false &&
                stateChange.expectedCompletionTimestamp &&
                stateChange.state === 'running') {
                jobStates = _.filter(simulation.ext.jobStateHistory, function (sc) {
                    return sc.jobUID === stateChange.jobUID &&
                           sc !== stateChange;
                });
                if (jobStates.length === 0 &&
                    moment().isAfter(stateChange.expectedCompletionTimestamp)) {
                    simulation.ext.hasJobCompletionWarning = true;
                }
            }
        });
    };

    // Parses a simulation status change instance in readiness for processing.
    MOD.parseStateChange = function (sc) {
        sc.description = sc.state;
        sc.timestamp = moment(sc.timestamp);
        sc.timestampMS = sc.timestamp.valueOf();
        if (sc.expectedTransitionDelay) {
            sc.expectedCompletionTimestamp = sc.timestamp.add(sc.expectedTransitionDelay, 'seconds');
        } else {
            sc.expectedCompletionTimestamp = undefined;
        }
    };

    // Parses simulation state history to detect job errors.
    MOD.parseSimulationStateHistory = function (simulation) {
        // Reset.
        resetSimulationStateHistory(simulation);

        // Set current state.
        setSimulationCurrentState(simulation);

        // When a termination state has been reached then we can assign the execution end date if required.
        if (simulation.executionEndDate === "" && isTerminationState(simulation.executionState)) {
            simulation.executionEndDate = simulation.ext.state.timestamp.format("YYYY-MM-DD");
        }

        // Set job count.
        if (simulation.ext.jobStateHistory.length) {
            simulation.ext.jobCount = _.keys(_.groupBy(simulation.ext.jobStateHistory, 'jobUID')).length;
        }

        // Set job warning.
        setJobWarnings(simulation);
    };
}(
    this.APP.modules.monitoring,
    this._,
    this.moment
));
