'use strict';
define(
    [
        'backbone',
        'Movies/MovieModel',
        'api!movies'
    ],
    function(Backbone,MovieModel,MoviesData) {
        var Collection = Backbone.Collection.extend({
            url :window.NzbDrone.ApiRoot+'/movies',
            model: MovieModel,
            
            comparator: function(model) {
                return model.get('title');
            }
        });

        var collection = new Collection(MoviesData);
        return collection;
    });