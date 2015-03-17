(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        footer: "<div>\n\
                  <span>\n\
                    <span class='monitoring-state-queued'><small><strong>&nbsp;QUEUED&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-running'><small><strong>&nbsp;RUNNING&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-complete'><small><strong>&nbsp;COMPLETE&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-error'><small><strong>&nbsp;ERROR&nbsp;</strong></small></span>\n\
                  <span class='pull-right'>\n\
                    <small><strong><%- APP.title %> <%- MOD.title %> v0.2.0 © <%- year %> IPSL</strong></small>\n\
                  </span>\n\
                </div>",

        notifications:
            "<strong>Awaiting simulation events ...</strong>",

        info: {
            pagerItem: "<a href='#'><%- id %></ a>"
        },

        info2: "<span>\n\
                  <strong><span class='summary-stats'></span></strong>\n\
                </span>",

        grid: {
            pager:
                "<span class='btn-group' role='group'>\n\
                    <button type='button' class='btn btn-default pagination-first'>\n\
                        <strong class='text-primary'><<</strong>\n\
                    </button>\n\
                    <button type='button' class='btn btn-default pagination-previous'>\n\
                        <strong class='text-primary'>&nbsp;&lt;&nbsp;</strong>\n\
                    </button>\n\
                </span>\n\
                <span class='btn-group'>\n\
                    <input type='text' class='pagination-info form-control' placeholder=''>\n\
                </span>\n\
                <span class='btn-group' role='group'>\n\
                    <button type='button' class='btn btn-default pagination-next'>\n\
                        <strong class='text-primary'>&nbsp;&gt;&nbsp;</strong>\n\
                    </button>\n\
                    <button type='button' class='btn btn-default pagination-last'>\n\
                        <strong class='text-primary'>>></strong>\n\
                    </button>\n\
                </span>",

            contextMenu:
                "<ul class='dropdown-menu' role='menu'>\n\
                    <li><a tabindex='-1' class='open'>Open inter-monitoring</a></li>\n\
                    <li><a tabindex='-1' class='clear'>Clear selections</a></li>\n\
                </ul>",

            header: "<tr class='bg-primary'>\n\
                        <th title='Activity'>Activity</th>\n\
                        <th title='Name' class='col-md-2'>Name</th>\n\
                        <th title='Jobs' class='text-center'>Jobs</th>\n\
                        <th title='Node - Machine' class='text-center'>Node - Machine</th>\n\
                        <th title='Login' class='text-center'>Login</th>\n\
                        <th title='Tag / Model' class='text-center'>Tag / Model</th>\n\
                        <th title='Space' class='text-center'>Space</th>\n\
                        <th title='Experiment' class='col-md-2'>Experiment</th>\n\
                        <th title='Start' class='text-center'>Start</th>\n\
                        <th title='End' class='text-center'>End</th>\n\
                        <th title='monitoring'></th>\n\
                        <th class='interMonitoring' title='Open inter-monitoring menu' data-toggle='context' data-target='#imContextMenu'>\n\
                          <span class='glyphicon glyphicon-random'></span>\n\
                        </th>\n\
                    </tr>",

            row: "<td class='activity text-uppercase' title='<%= activity %>'><%= activity %></td>\n\
                  <td class='name' title='<%= name %>'><%= name %></td>\n\
                  <td class='jobCount text-center <%= ext.hasJobCompletionWarning ? 'bg-danger' : '' %>' title='<%= ext.jobCount %>'><%= ext.jobCount %></td>\n\
                  <td class='computeNodeMachine text-uppercase text-center' title='<%= computeNodeMachine %>'><%= computeNodeMachine %></td>\n\
                  <td class='computeNodeLogin text-center' title='<%= computeNodeLogin %>'><%= computeNodeLogin %></td>\n\
                  <td class='model text-uppercase text-center' title='<%= model %>'><%= model %></td>\n\
                  <td class='space text-uppercase text-center' title='<%= space %>'><%= space %></td>\n\
                  <td class='experiment' title='<%= ext.experiment %>'><%= ext.experiment %></td>\n\
                  <td class='executionStartDate text-center' title='<%= executionStartDate %>'><%= executionStartDate.substring(0, 10) %></td>\n\
                  <td class='executionEndDate text-center' title='<%= executionEndDate %>'><%= executionEndDate.substring(0, 10) %></td>\n\
                  <td class='monitoring' title='Open monitoring'><span class='glyphicon glyphicon-random'></span></td>\n\
                  <td class='interMonitoring' title='Select for inter-monitoring'><input type='checkbox'></input></td>"
        },

        imInput : "<input type='hidden' id=<%= key %> name=<%= key %> value=<%= value %>></ input>",

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

}(this.APP.modules.monitoring));
