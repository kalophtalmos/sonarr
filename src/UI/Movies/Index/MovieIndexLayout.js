'use strict';
define(
        [
            'backgrid',
            'marionette',
            'Movies/MovieCollection',
            'Movies/Index/EmptyView',
            'Cells/QualityProfileCell',
            'Shared/Toolbar/ToolbarLayout',
            'Cells/MovieActionCell'
        ],
    function (Backgrid, Marionette, MovieCollection, EmptyView, QualityProfileCell, ToolbarLayout, MovieActionCell) {
        return Marionette.Layout.extend({
            template: 'Movies/Index/MovieIndexLayoutTemplate',
            
            regions: {
                moviesRegion: '#x-movies',
                toolbar: '#x-toolbar',
                footer:'#x-movies-footer'
            },
            
            columns:
                [
                    {
                        name: 'title',
                        label: 'Title',
                        cell: 'string'
                    },
                    {
                        name: 'qualityProfileId',
                        label: 'Quality',
                        cell: QualityProfileCell
                    },
                    {
                        name: 'this',
                        label: '',
                        sortable: false,
                        cell:MovieActionCell
                    }
                ],
            
            leftSideButtons: {
                type: 'default',
                storeState: false,
                items:
                [
                    {
                        title: 'Add Movie',
                        icon: 'icon-plus',
                        route: 'addmovie'
                    },
                        {
                            title: 'RSS Sync',
                            icon: 'icon-rss',
                            command: 'moviersssync',
                            errorMessage: 'RSS Sync Failed!'
                        },
                        {
                            title: 'Update Library',
                            icon: 'icon-refresh',
                            command: 'refreshseries',
                            successMessage: 'Library was updated!',
                            errorMessage: 'Library update failed!'
                        }
                ]
            },
            _showTable: function() {
                this.currentView = new Backgrid.Grid({                    
                    collection: MovieCollection,
                    columns: this.columns,
                    className:'table table-hover'
                });

                this._renderView();
                this._fetchCollection();
            },
            
            _renderView: function () {

                if (MovieCollection.length === 0) {
                    this.moviesRegion.show(new EmptyView());
                    this.toolbar.close();
                } else {
                    this.currentView.collection = MovieCollection;
                    this.moviesRegion.show(this.currentView);
                    //this._showToolbar();
                    //this._showFooter();
                }
            },
            
            initialize: function (options) {
                if (options.action) {
                    this.action = options.action.toLowerCase();
                }

                this.listenTo(MovieCollection, 'sync', this._renderView);
                this.listenTo(MovieCollection, 'remove', this._renderView);

            },
            _fetchCollection: function() {
                MovieCollection.fetch();
            },
            onShow: function () {
                this._showToolbar();
                this._renderView();
                this._fetchCollection();
            },
            _showToolbar: function() {
                if (this.toolbar.currentView) {
                    return;
                }

                var viewButtons = {
                    type: 'radio',
                    storeState: true,
                    menuKey: 'seriesViewMode',
                    defaultAction: 'tableView',
                    items:
                        [
                            {
                                key: 'posterView',
                                title: '',
                                tooltip: 'Posters',
                                icon: 'icon-th-large',
                                callback: this._showPosters
                            },
                            {
                                key: 'listView',
                                title: '',
                                tooltip: 'Overview List',
                                icon: 'icon-th-list',
                                callback: this._showList
                            },
                            {
                                key: 'tableView',
                                title: '',
                                tooltip: 'Table',
                                icon: 'icon-table',
                                callback: this._showTable
                            }
                        ]
                };

                this.toolbar.show(new ToolbarLayout({
                    right:
                        [
                            viewButtons
                        ],
                    left:
                        [
                            this.leftSideButtons
                        ],
                    context: this
                }));
            }
        });
    });