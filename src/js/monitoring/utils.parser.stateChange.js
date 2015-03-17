(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation status change instance in readiness for processing.
    MOD.parseStateChange = function (stateChange) {
        stateChange.description = stateChange.state;
        stateChange.timestamp = moment(stateChange.timestamp);
        if (stateChange.expectedTransitionDelay) {
            stateChange.expectedCompletionTimestamp =
                stateChange.timestamp.add(stateChange.expectedTransitionDelay, 'seconds');
        } else {
            stateChange.expectedCompletionTimestamp = undefined;
        }
    };

    // Parses a collection of simulation status change instances.
    MOD.parseStateChangeHistory = function (stateChangeHistory) {
        _.each(stateChangeHistory, MOD.parseStateChange);
    };

    // Parses simulation state history to detect job errors.
    MOD.parseSimulationStateHistory = function (simulation) {
        // Reset extension fields.
        simulation.ext.jobCount = "--";
        simulation.ext.jobStateHistory = [];
        simulation.ext.hasJobCompletionWarning = false;
        simulation.ext.stateHistory = [];

        // Set histories.
        if (_.has(MOD.state.simulationStateHistory, simulation.uid)) {
            simulation.ext.stateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (stateChange) {
                return stateChange.jobUID === null;
            });
            simulation.ext.stateHistory = _.sortBy(simulation.ext.stateHistory, 'timestamp');
            simulation.ext.jobStateHistory = _.filter(MOD.state.simulationStateHistory[simulation.uid], function (stateChange) {
                return stateChange.jobUID !== null;
            });
        }

        // Set current state.
        if (simulation.ext.stateHistory.length) {
            simulation.ext.statePrevious = simulation.ext.state;
            simulation.ext.state = _.last(simulation.ext.stateHistory);
            simulation.executionState = simulation.ext.state.description;
            if (simulation.executionEndDate === "" &&
                    _.indexOf(['complete', 'error'], simulation.executionState) > -1) {
                simulation.executionEndDate = simulation.ext.state.timestamp.format("YYYY-MM-DD");
            }
        }

        // Set job count.
        if (simulation.ext.jobStateHistory.length) {
            simulation.ext.jobCount = _.keys(_.groupBy(simulation.ext.jobStateHistory, 'jobUID')).length;
        }

        // Set job warning.
        _.each(simulation.ext.jobStateHistory, function (stateChange) {
            var complete;

            if (simulation.ext.hasJobCompletionWarning === false &&
                    stateChange.expectedCompletionTimestamp &&
                    stateChange.state === 'running') {
                complete = _.filter(simulation.ext.jobStateHistory, function (sc) {
                    return sc.jobUID === stateChange.jobUID &&
                           sc.state !== 'running' &&
                           sc.state !== 'complete';
                });
                if (!complete.length &&
                        moment().isAfter(stateChange.expectedCompletionTimestamp)) {
                    simulation.ext.hasJobCompletionWarning = true;
                }
            }
        });
    };
}(
    this.APP.modules.monitoring,
    this._,
    this.moment
));
