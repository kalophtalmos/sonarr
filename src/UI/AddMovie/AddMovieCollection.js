'use strict';
define(
    [
        'backbone',
        'Movies/MovieModel',
        'underscore'
    ], function(Backbone,MovieModel,_) {
        return Backbone.Collection.extend({
            url: window.NzbDrone.ApiRoot + '/movies/lookup',
            model: MovieModel,
            
            parse: function(response) {
                var self = this;

                _.each(response, function(model) {
                    model.id = undefined;
                    
                    if (self.unmappedFolderModel) {
                        model.path = self.unmappedFolderModel.get('folder').path;
                    }
                });

                return response;
            }
        });
    }
);