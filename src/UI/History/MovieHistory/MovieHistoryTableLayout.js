'use strict';
define(
    [
        'marionette',
        'backgrid',
        'History/MovieHistory/MovieHistoryCollection',
        'Cells/EventTypeCell',
        'Cells/QualityCell',
        'Cells/RelativeDateCell',
        'Shared/Grid/Pager',
        'Shared/LoadingView',
        'Cells/MovieTitleCell',
        'History/Table/HistoryDetailsCell'
    ], function (Marionette,
                 Backgrid,
                 HistoryCollection,
                 EventTypeCell,
                 QualityCell,
                 RelativeDateCell,
                 GridPager,
                 LoadingView,
                 MovieTitleCell,HistoryDetailCell) {
        return Marionette.Layout.extend({
            template: 'History/MovieHistory/MovieHistoryTableLayoutTemplate',

            regions: {
                history: '#x-history',
                toolbar: '#x-toolbar',
                pager: '#x-pager'
            },

            columns:
            [
            {
                name: 'movie',
                label: 'Movie',
                cell: MovieTitleCell
            },
                    {
                        name: 'quality',
                        label: 'Quality',
                        cell: QualityCell,
                        sortable: false
                    },
                    {
                        name: 'date',
                        label: 'Date',
                        cell: RelativeDateCell
                    },
                    {
                        name: 'eventType',
                        label: '',
                        cell: EventTypeCell,
                        cellValue: 'this'
                    },
                    {
                        name: 'this',
                        label: '',
                        cell: HistoryDetailCell,
                        sortable: false
                    }
                    
            ],


            initialize: function () {
                this.collection = new HistoryCollection();
                this.listenTo(this.collection, 'sync', this._showTable);
            },


            _showTable: function (collection) {

                this.history.show(new Backgrid.Grid({
                    columns: this.columns,
                    collection: collection,
                    className: 'table table-hover'
                }));

                this.pager.show(new GridPager({
                    columns: this.columns,
                    collection: collection
                }));
            },

            onShow: function () {
                this.history.show(new LoadingView());
                this.collection.fetch();
            }

        });
    });
