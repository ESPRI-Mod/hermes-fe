(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        footer: "<div>\n\
                  <span>\n\
                    <span class='monitoring-state-queued'><small><strong>&nbsp;QUEUED&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-running'><small><strong>&nbsp;RUNNING&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-complete'><small><strong>&nbsp;COMPLETE&nbsp;</strong></small></span>\n\
                    <span class='monitoring-state-error'><small><strong>&nbsp;ERROR&nbsp;</strong></small>\n\
                  </span>\n\
                  <span class='pull-right'>\n\
                    <small><strong><a href='https://github.com/Prodiguer/prodiguer-docs/wiki' target='blank'><%- APP.title %></a> <%- MOD.title %> v<%- APP.version %> © <%- year %> <a href='<%- APP.institute.homePage %>' target='_blank'>IPSL</a></strong></small>\n\
                  </span>\n\
                </div>",

        notifications:
            "<strong>Awaiting simulation events ...</strong>",

        criteria: {
            summary:
                "<strong>Active Filters: </strong>\n\
                 <span class='criteria-text'><%= filterText %></span>"
        },

        info: {
            pagerItem: "<a href='#'><%- id %></ a>"
        },

        info2: "<span>\n\
                  <strong><span class='summary-stats'></span></strong>\n\
                </span>",

        timeframeFilterOptions:
            "<option value='ALL'>*</option>\n\
             <option value='1W' selected='true'>< 1 week</option>\n\
             <option value='2W'>< 2 weeks</option>\n\
             <option value='1M'>< 1 month</option>\n\
             <option value='2M'>< 2 months</option>\n\
             <option value='3M'>< 3 months</option>\n\
             <option value='6M'>< 6 months</option>\n\
             <option value='12M'>< 1 year</option>",

        gridPager:
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

        gridContextMenu:
            "<ul class='dropdown-menu' role='menu'>\n\
                <li><a tabindex='-1' class='open'>Open inter-monitoring</a></li>\n\
                <li><a tabindex='-1' class='clear'>Clear selections</a></li>\n\
            </ul>",

        gridHeader:
            "<tr class='bg-primary'>\n\
                <th title='UID' class='hidden'>UID</th>\n\
                <th title='Activity' class='text-center'><small>Activity</small></th>\n\
                <th title='Name'><small>Name</small></th>\n\
                <th title='Try' class='text-center'><small>Try</small></th>\n\
                <th title='Compute Jobs' class='text-center'><small>Jobs (C)</small></th>\n\
                <th title='Post-Processing Jobs' class='text-center'><small>Jobs (PP)</small></th>\n\
                <th title='Node - Machine' class='text-center'><small>Node - Machine</small></th>\n\
                <th title='Login' class='text-center'><small>Login</small></th>\n\
                <th title='Tag / Model' class='text-center'><small>Tag / Model</small></th>\n\
                <th title='Space' class='text-center'><small>Space</small></th>\n\
                <th title='Experiment' class='text-center'><small>Experiment</small></th>\n\
                <th title='Start' class='text-center'><small>Start</small></th>\n\
                <th title='End' class='text-center'><small>End</small></th>\n\
                <th title='monitoring' class='text-center'></th>\n\
                <th class='interMonitoring text-center' title='Open inter-monitoring menu' data-toggle='context' data-target='#imContextMenu'>\n\
                  <span class='glyphicon glyphicon-random'></span>\n\
                </th>\tn\
            </tr>",

        gridRow:
            "<td class='row-link uid hidden'></td>\n\
             <td class='row-link activity text-center'><small></small></td>\n\
             <td class='row-link name'><small></small></td>\n\
             <td class='row-link tryID text-center'><small>XXX</small></td>\n\
             <td class='row-link compute-job-count text-center' title='Compute Job Count (#running : #complete : #errors)'><small></small></td>\n\
             <td class='row-link post-processing-job-count text-center' title='Post-Processing Job Count (#running : #complete : #errors)'><small></small></td>\n\
             <td class='row-link computeNodeMachine text-center'><small></small></td>\n\
             <td class='row-link computeNodeLogin text-center'><small></small></td>\n\
             <td class='row-link model text-center' ><small></small></td>\n\
             <td class='row-link space text-center' ><small></small></td>\n\
             <td class='row-link experiment text-center' ><small></small></td>\n\
             <td class='row-link executionStartDate text-center' ><small></small></td>\n\
             <td class='row-link executionEndDate text-center' ><small></small></td>\n\
             <td class='monitoring text-center' ><span class='glyphicon glyphicon-random'></span></td>\n\
             <td class='interMonitoring text-center' ><input type='checkbox'></input></td>",

        imInput : "<input type='hidden' id=<%= key %> name=<%= key %> value=<%= value %>></ input>",

        wsClose:
            "<div class='modal-dialog'>\n\
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
