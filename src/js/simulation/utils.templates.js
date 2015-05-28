(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        header:
            "<h2>Simulation: <%- MOD.state.simulation.ext.caption %></h2>",

        footer:
            "<span>\n\
                <strong><%- MOD.state.simulation.ext.caption %></strong>\n\
             </span>\n\
             <span class='pull-right'>\n\
                <small><strong><a href='https://github.com/Prodiguer/prodiguer-docs/wiki' target='blank'><%- APP.title %></a> <%- MOD.title %> v<%- APP.version %> © <%- year %> <a href='<%- APP.institute.homePage %>' target='_blank'>IPSL</a></strong></small>\n\
             </span>",

        details:
            "<header class='bg-info'>\n\
                <h3>Details</h3>\n\
            </header>\n\
            <div class='container'>\n\
                <div class='row'>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Activity</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.activity %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Space</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.space %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Try</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.tryID %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Status</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.executionState %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div class='row'>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Machine</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.computeNodeMachine %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Login</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.computeNodeLogin %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Started</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.executionStartDate %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Ended</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.executionEndDate %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div class='row'>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Model</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.model %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Experiment</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.experiment %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Output Start</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.outputStartDate %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Output End</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.outputEndDate %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
            </div>",

        configCard:
            "<header class='bg-info'>\n\
                <h3>Configuration Card</h3>\n\
            </header>\n\
            <textarea class='form-control' rows='45' cols='40'><%- MOD.state.configCard %></textarea>",

        jobHistory: {
            caption:
                "<header class='bg-info'>\n\
                    <h3>Jobs</h3>\n\
                </header>",

            header:
                "<tr class='bg-primary'>\n\
                    <th title='ID'>#</th>\n\
                    <th title='UID' class='hidden'>UID</th>\n\
                    <th title='Start Date' class='text-center'>Start Date</th>\n\
                    <th title='End Date' class='text-center'>End Date</th>\n\
                    <th title='Duration' class='text-center'>Duration (hours)</th>\n\
                    <th title='Expected End Date' class='text-center'>Expected End Date</th>\n\
                    <th title='Was Late' class='text-center'>Was Late ?</th>\n\
                </ttr>",

            footer:
                "<div class='module-footer'>\n\
                    <span>\n\
                        <span class='job-state-running'><small><strong>&nbsp;RUNNING&nbsp;</strong></small></span>\n\
                        <span class='job-state-complete'><small><strong>&nbsp;COMPLETE&nbsp;</strong></small></span>\n\
                        <span class='job-state-error'><small><strong>&nbsp;ERROR&nbsp;</strong></small>\n\
                    </span>\n\
                    <span class='pull-right'>\n\
                        <strong><%- simulation.ext.jobsCaption %></strong>\n\
                    </span>\n\
                </div>",

            row:
                "<td class='id' title='<%= ext.id %>'><%= ext.id %></td>\n\
                <td class='uid hidden' title='<%= jobUID %>'><%= jobUID %></td>\n\
                <td class='executionStartDate text-center' title='<%= ext.executionStartDate %>'><%= ext.executionStartDate %></td>\n\
                <td class='executionEndDate text-center' title='<%= ext.executionEndDate %>'><%= ext.executionEndDate %></td>\n\
                <td class='duration text-center' title='<%= ext.duration %>'><%= ext.duration %></td>\n\
                <td class='expectedExecutionEndDate text-center' title='<%= ext.expectedExecutionEndDate %>'><%= ext.expectedExecutionEndDate %></td>\n\
                <td class='wasLate text-center' title='<%= wasLate ? 'Yes' : '--' %>'><%= wasLate ? 'Yes' : '--' %></td>"
        },

        notifications:
            "<strong>Awaiting simulation events ...</strong>",

        wsClose: "<div class='modal-dialog'>\n\
                <div class='modal-content'>\n\
                    <div class='modal-header'>\n\
                        <h4 class='modal-title' id='wsCloseDialogLabel'><%= app.title %> <%= mod.title %> v<%= mod.version %></h4>\n\
                    </div>\n\
                    <div class='modal-body'>\n\
                        The Prodiguer web socket server connection has been interrupted.\n\
                    </div>\n\
                    <div class='modal-footer'>\n\
                        <button type='button' class='btn btn-primary' id='wsCloseRefreshPageButton'>Refresh page</button>\n\
                    </div>\n\
                </div>\n\
            </div>"
    };

}(
    this.APP.modules.simulation
));
