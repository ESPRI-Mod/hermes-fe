(function (MOD, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

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
        // Reset extension fields.
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

        // Set current state.
        if (simulation.ext.stateHistory.length) {
            // ... complete / error states;
            simulation.ext.state = _.find(simulation.ext.stateHistory, function (sc) {
                return _.indexOf(['complete', 'error'], sc.description) > -1;
            });
            // ... queued / running states;
            if (_.isUndefined(simulation.ext.state)) {
                simulation.ext.state = _.last(simulation.ext.stateHistory);
            }
            simulation.executionState = simulation.ext.state.description;
            if (simulation.executionEndDate === "" &&
                _.indexOf(['complete', 'error'], simulation.executionState) > -1) {
                simulation.executionEndDate = simulation.ext.state.timestamp.format("YYYY-MM-DD");
            }
        } else {
            simulation.executionState = 'complete';
        }

        // Set job count.
        if (simulation.ext.jobStateHistory.length) {
            simulation.ext.jobCount = _.keys(_.groupBy(simulation.ext.jobStateHistory, 'jobUID')).length;
        }

        // Set job warning.
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
}(
    this.APP.modules.monitoring,
    this._,
    this.moment
));
