'use strict';
define(
    [
        'vent',
        'AppLayout',
        'marionette',
        'Movies/MovieCollection',
        'AddMovie/AddMovieView',
        'Quality/QualityProfileCollection',
        'AddSeries/RootFolders/RootFolderCollection'
    ], function (vent,AppLayout, Marionette, MovieCollection, AddMovieView, QualityProfileCollection,RootFolderCollection) {
        return Marionette.Layout.extend({
            template: 'AddMovie/AddMovieLayoutTemplate',

            regions: {
                workspace: '#add-movie-workspace'
            },
            events: {
                'click .x-import': '_importMovie',
                'click .x-add-new': '_addMovie'
            },
            attributes: {
                id: 'add-movie-screen'
            },

            initialize: function () {
                QualityProfileCollection.fetch();
                RootFolderCollection.fetch();
                MovieCollection.fetch();
            },

            onShow: function () {
                this.workspace.show(new AddMovieView());
            },
            _addMovie: function () {
                this.workspace.show(new AddMovieView());
            }
        });
    });