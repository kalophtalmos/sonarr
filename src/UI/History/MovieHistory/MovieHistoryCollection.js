'use strict';
define(['History/MovieHistory/MovieHistoryModel','backbone.pageable'], function(MovieHistoryModel,PageableCollection) {
    return PageableCollection.extend({
        url: window.NzbDrone.ApiRoot + '/moviehistory',
        model: MovieHistoryModel,
        
        state: {
            pageSize: 15,
            sortKey: 'date',
            order:1
        },
        
        queryParams: {
            totalPages: null,
            totalRecords: null,
            pageSize: 'pageSize',
            sortKey: 'sortKey',
            order: 'sortDir',
            directions: {
                '-1': 'asc',
                '1': 'desc'
            }
        },
        
        initialize: function(options) {
            delete this.queryParams.movieId;
            if (options) {
                if (options.episodeId) {
                    this.queryParams.movieId = options.movieId;
                }
            }
        },
        
        parseState: function(resp) {
            return { totalRecords: resp.totalRecords };
        },
        
        parseRecords: function(resp) {
            if (resp) {
                return resp.records;
            }
            return resp;
        }
    });
});