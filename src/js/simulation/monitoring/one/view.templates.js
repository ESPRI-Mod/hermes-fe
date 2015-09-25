(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        header:
            "<h2>Simulation: <%- simulation.ext.activity %> -> <%- simulation.ext.space %> -> <%- simulation.name %>\n\
                <span class='pull-right' style='margin-right: 4px;'>\n\
                    <span class='simulation-messages glyphicon glyphicon-equalizer' title='View Simulation Messages'></span>\n\
                    <span class='inter-monitoring glyphicon glyphicon-random' title='Open Monitoring'></span>\n\
                </span>\n\
            </h2>",

        footer:
            "<span>\n\
                <strong><%- simulation.ext.activity %> -> <%- simulation.ext.space %> -> <%- simulation.name %></strong>\n\
             </span>\n\
             <span class='pull-right'>\n\
                <small><strong>\n\
                    <a href='https://github.com/Prodiguer/prodiguer-docs/wiki' target='blank'><%- APP.title %></a> <%- MOD.title %> v<%- APP.version %> © <%- year %> <a href='<%- APP.institute.homePage %>' target='_blank'>IPSL</a>\n\
                </strong></small>\n\
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
                                <strong>Login</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.computeNodeLogin %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div class='row'>\n\
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Acc. Project</strong>\n\
                            </span>\n\
                            <span class='col-md-7'>\n\
                                <%- simulation.ext.accountingProject %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
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
                    <div class='col-md-3'>\n\
                        <div class='row'>\n\
                            <span class='col-md-5'>\n\
                                <strong>Prev. Tries</strong>\n\
                            </span>\n\
                            <span class='col-md-7 previous-try'>\n\
                                <%- simulation.tryID > 1 ? '' : '--' %>\n\
                            </span>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div class='row'>\n\
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
                    <h3><%- jobTypeCaption %> Jobs\n\
                    <span class='pull-right'>\n\
                        <%- jobHistory.running.length %> running | \n\
                        <%- jobHistory.complete.length %> complete | \n\
                        <%- jobHistory.error.length %> errors\n\
                    <span>\n\
                    </h3>\n\
                </header>",

            header:
                "<tr class='bg-primary'>\n\
                    <th title='UID' class='hidden'>UID</th>\n\
                    <th title='ID' class='text-center'>#</th>\n\
                    <th title='Post Processing Information' class='<%= jobType === 'compute' ? 'hidden' : '' %>'>Info.</th>\n\
                    <th title='Start Date' class='text-center'>Start Date</th>\n\
                    <th title='End Date' class='text-center'>End Date</th>\n\
                    <th title='Duration' class='text-center'>Duration</th>\n\
                    <th title='Delay' class='text-center'>Lateness</th>\n\
                </tr>",

            row:
                "<td class='uid hidden'><%= job.jobUID %></td>\n\
                 <td style='width: 40px;' class='id text-center' title='<%= jobIndex %>'><%= jobIndex %></td>\n\
                 <td class='postProcessingInfo <%= jobType === 'compute' ? 'hidden' : '' %>' title='<%= job.ext.postProcessingInfo %>'><%= job.ext.postProcessingInfo %></td>\n\
                 <td style='width: <%= jobType === 'compute' ? '24%' : '15%' %>;' class='executionStartDate text-center' title='<%= job.ext.executionStartDate %>'><%= job.ext.executionStartDate %></td>\n\
                 <td style='width: <%= jobType === 'compute' ? '24%' : '15%' %>;' class='executionEndDate text-center' title='<%= job.ext.executionEndDate %>'><%= job.ext.executionEndDate %></td>\n\
                 <td style='width: <%= jobType === 'compute' ? '24%' : '15%' %>;' class='duration text-center' title='<%= job.ext.duration %>'><%= job.ext.duration %></td>\n\
                 <td style='width: <%= jobType === 'compute' ? '24%' : '15%' %>;' class='lateness text-center' title='<%= job.ext.lateness %>'><%= job.ext.lateness %></td>",

            footer:
                "<div class='module-footer'>\n\
                    <span>\n\
                        <span class='monitoring-state-running'><small><strong>&nbsp;RUNNING&nbsp;</strong></small></span>\n\
                        <span class='monitoring-state-complete'><small><strong>&nbsp;COMPLETE&nbsp;</strong></small></span>\n\
                        <span class='monitoring-state-error'><small><strong>&nbsp;ERROR&nbsp;</strong></small>\n\
                    </span>\n\
                    <span class='pull-right'>\n\
                        <strong>\n\
                            <%- jobTypeCaption %> jobs: \n\
                            <%- jobHistory.running.length %> running | \n\
                            <%- jobHistory.complete.length %> complete | \n\
                            <%- jobHistory.error.length %> errors \n\
                        </strong>\n\
                    </span>\n\
                </div>"
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
    this.APP.modules.monitoring
));
