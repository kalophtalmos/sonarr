'use strict';
define(
    [
        'jquery',
        'underscore',
        'vent',
        'marionette',
        'AddMovie/AddMovieCollection',
        'AddMovie/SearchResultCollectionView',
        'AddSeries/NotFoundView',
        'Shared/LoadingView'
    ], function($, _, vent, Marionette, AddMovieCollection, SearchResultCollectionView, NotFoundView, LoadingView) {
        return Marionette.Layout.extend({
            template: 'AddMovie/AddMovieViewTemplate',

            regions: {
                searchResult:'#search-result'
            },

            ui: {
                movieSearch: '.x-movie-search',
                searchBar: '.x-movie-bar',
                loadMore:'.x-load-more'
            },

            events: {
                'click .x-load-more':'_onLoadMore'
            },

            initialize: function(options) {
                this.isExisting = options.isExisting;
                this.collection = new AddMovieCollection();

                if (this.isExisting) {
                    this.collection.unmappedFolderModel = this.model;
                }
                if (this.isExisting) {
                    this.className = 'existing-movie';
                }
                else {
                    this.className = 'new-movie';
                }

                this.listenTo(vent, vent.Events.MovieAdded,this._onMovieAdded);
                this.listenTo(this.collection, 'sync', this._showResults);

                this.resultCollectionView = new SearchResultCollectionView({
                    collection: this.collection,
                    isExisting: this.isExisting
                });

                this.throttledSearch = _.debounce(this.search, 1000, { trailing: true }).bind(this);
            },
            onRender: function () {
                var self = this;

                this.$el.addClass(this.className);

                this.ui.movieSearch.keyup(function () {
                    self.searchResult.close();
                    self._abortExistingSearch();
                    self.throttledSearch({
                        term: self.ui.movieSearch.val()
                    });
                });

                if (this.isExisting) {
                    this.ui.searchBar.hide();
                }
            },

            onShow: function () {
                this.searchResult.show(this.resultCollectionView);
                this.ui.movieSearch.focus();
            },
            search: function (options) {

                this.collection.reset();

                if (!options.term || options.term === this.collection.term) {
                    return $.Deferred().resolve();
                }

                this.searchResult.show(new LoadingView());
                this.collection.term = options.term;
                this.currentSearchPromise = this.collection.fetch({
                    data: { term: options.term }
                });

                return this.currentSearchPromise;
            },
            _onMovieAdded: function (options) {
                if (this.isExisting && options.series.get('path') === this.model.get('folder').path) {
                    this.close();
                }

                else if (!this.isExisting) {
                    this.collection.reset();
                    this.searchResult.close();
                    this.ui.movieSearch.val('');
                    this.ui.movieSearch.focus();
                }
            },
            _onLoadMore: function () {
                var showingAll = this.resultCollectionView.showMore();
                this.ui.searchBar.show();

                if (showingAll) {
                    this.ui.loadMore.hide();
                }
            },
            _showResults: function () {
                if (!this.isClosed) {

                    if (this.collection.length === 0) {
                        this.searchResult.show(new NotFoundView({ term: this.collection.term }));
                    }
                    else {
                        this.searchResult.show(this.resultCollectionView);
                        if (!this.showingAll && this.isExisting) {
                            this.ui.loadMore.show();
                        }
                    }
                }
            },

            _abortExistingSearch: function () {
                if (this.currentSearchPromise && this.currentSearchPromise.readyState > 0 && this.currentSearchPromise.readyState < 4) {
                    console.log('aborting previous pending search request.');
                    this.currentSearchPromise.abort();
                }
            }
        });
    });