define(
    [
        'marionette',
        'backbone'
    ], function (Marionette, Backbone) {
        'use strict';

        var vent = new Backbone.Wreqr.EventAggregator();

        vent.Events = {
            SeriesAdded       : 'series:added',
            SeriesDeleted     : 'series:deleted',
            CommandComplete   : 'command:complete',
            MovieAdded        : 'movie:added',
            MovieDeleted      : 'movie:deleted',
            MovieRenamed      :'movie:renamed'
        };

        vent.Commands = {
            EditSeriesCommand         : 'EditSeriesCommand',
            DeleteSeriesCommand       : 'DeleteSeriesCommand',
            OpenModalCommand          : 'OpenModalCommand',
            CloseModalCommand         : 'CloseModalCommand',
            ShowEpisodeDetails        : 'ShowEpisodeDetails',
            ShowHistoryDetails        : 'ShowHistoryDetails',
            ShowLogDetails            : 'ShowLogDetails',
            SaveSettings              : 'saveSettings',
            ShowLogFile               : 'showLogFile',
            ShowRenamePreview         : 'showRenamePreview',
            OpenControlPanelCommand   : 'OpenControlPanelCommand',
            CloseControlPanelCommand  : 'CloseControlPanelCommand',
            DeleteMovieCommand        : 'DeleteMovieCommand'
        };

        return vent;
    });
