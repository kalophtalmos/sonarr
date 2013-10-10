'use strict';
define(['backbone','Movies/MovieModel'],
    function(Backbone,MovieModel) {
        return Backbone.Model.extend({
            parse: function (model) {
                console.log(model.title);
                model.movie = new MovieModel(model.movie);
                return model;
            }
        });
    });