'use strict';
define(
    ['vent',
        'marionette',
        'Cells/NzbDroneCell',
        'Commands/CommandController'
    ], function (vent, Marionette, NzbDroneCell, CommandController) {
        return NzbDroneCell.extend({
            className: 'episode-actions-cell',
            template: 'Cells/MovieActionsCellTemplate',

            events:
            {
                'click .x-automatic-search': '_automaticSearch',
                'click .x-delete-movie': '_deleteMovie'
            },
            ui: {
                automaticSearch: '.x-automatic-search-icon'
            },
            
            render: function() {
                var templateName = this.column.get('template') || this.template;

                this.templateFunction = Marionette.TemplateCache.get(templateName);
                var data = this.cellValue.toJSON();
                var html = this.templateFunction(data);

                this.$el.html(html);

                CommandController.bindToCommand({
                    element: this.$(this.ui.automaticSearch),
                    command: {
                        name: 'movieSearch',
                        movieIds: this.model.get('id')
                    }
                });

                this.delegateEvents();
                return this;
            },
            
            _automaticSearch: function() {
                CommandController.Execute('movieSearch', {
                    name: 'movieSearch',
                    movieIds: [this.model.get('id')]
                });
            },
            
            _deleteMovie: function() {
                vent.trigger(vent.Commands.DeleteMovieCommand, { movie: this.model });
            }

        });
    }
);