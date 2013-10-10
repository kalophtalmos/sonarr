'use strict';
define(
    [
        'marionette',
        'backbone',
        'backgrid',
        'History/Table/HistoryTableLayout',
        'History/Blacklist/BlacklistLayout',
        'History/Queue/QueueLayout',
        'History/MovieHistory/MovieHistoryTableLayout'
    ], function (Marionette, Backbone, Backgrid, HistoryTableLayout, BlacklistLayout, QueueLayout, MovieHistoryTableLayout) {
        return Marionette.Layout.extend({
            template: 'History/HistoryLayoutTemplate',

            regions: {
                history      : '#history',
                blacklist    : '#blacklist',
                queueRegion  : '#queue',
                movieHistory : '#movieHistory'
            },

            ui: {
                historyTab      : '.x-history-tab',
                blacklistTab    : '.x-blacklist-tab',
                queueTab        : '.x-queue-tab',
                movieHistoryTab : '.x-movieHistory-tab'
            },

            events: {
                'click .x-history-tab'      : '_showHistory',
                'click .x-blacklist-tab'    : '_showBlacklist',
                'click .x-queue-tab'        : '_showQueue',
                'click .x-movieHistory-tab' : '_showMovieHistory'
            },

            initialize: function (options) {
                if (options.action) {
                    this.action = options.action.toLowerCase();
                }
            },

            onShow: function () {
                switch (this.action) {
                    case 'queue':
                        this._showQueue();
                        break;
                    case 'moviehistory':
                        this._showMovieHistory();
                        break;
                    default:
                        this._showHistory();
                }
            },

            _navigate: function (route) {
                Backbone.history.navigate(route);
            },

            _showHistory: function (e) {
                if (e) {
                    e.preventDefault();
                }

                this.history.show(new HistoryTableLayout());
                this.ui.historyTab.tab('show');
                this._navigate('/history');
            },

            _showBlacklist: function (e) {
                if (e) {
                    e.preventDefault();
                }

                this.blacklist.show(new BlacklistLayout());
                this.ui.blacklistTab.tab('show');
                this._navigate('/history/blacklist');
            },

            _showQueue: function (e) {
                if (e) {
                    e.preventDefault();
                }

                this.queueRegion.show(new QueueLayout());
                this.ui.queueTab.tab('show');
                this._navigate('/history/queue');
            },

            _showMovieHistory: function (e) {
                if (e) {
                    e.preventDefault();
                }
                this.movieHistory.show(new MovieHistoryTableLayout());
                this.ui.movieHistoryTab.tab('show');
                this._navigate('/history/movieHistory');
            }
        });
    });
