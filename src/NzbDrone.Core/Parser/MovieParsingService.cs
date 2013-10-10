using System;
using NLog;
using NzbDrone.Common;
using NzbDrone.Common.Disk;
using NzbDrone.Core.IndexerSearch.Definitions;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.Parser
{
    public interface IMovieParsingService
    {
        Movie GetMovie(string filename);
        LocalMovie GetMovieFromPath(string filename,Movie movie);
        RemoteMovie Map(ParsedMovieInfo parsedMovieInfo, int imdbId, SearchCriteriaBase searchCriteria = null);
    }

    public class MovieParsingService : IMovieParsingService
    {
        private readonly IMovieService _movieService;
        private readonly IDiskProvider _diskProvider;
        private readonly Logger _logger;

        public MovieParsingService(IMovieService movieService, IDiskProvider diskProvider,Logger logger)
        {
            _movieService = movieService;
            _diskProvider = diskProvider;
            _logger = logger;
        }

        public Movie GetMovie(string title)
        {
            var searchTitle = title;
            var parsedMovieInfo = Parser.ParseMovieTitle(title);

            if (parsedMovieInfo != null)
            {
                searchTitle = parsedMovieInfo.MovieTitle;
            }

            return _movieService.FindByTitle(searchTitle);
        }

        public LocalMovie GetMovieFromPath(string filename,Movie movie)
        {
            var parsedMovieInfo = Parser.ParsedMoviePath(filename);

            if (parsedMovieInfo == null) return null;

            return new LocalMovie()
            {
                Movie =  movie,
                Quality = parsedMovieInfo.Quality,
                Path = filename,
                ParsedMovieInfo = parsedMovieInfo,
                ExistingFile =  DiskProviderBase.IsParent(movie.Path,filename)
            };
        }

        public RemoteMovie Map(ParsedMovieInfo parsedMovieInfo, int imdbId, SearchCriteriaBase searchCriteria = null)
        {
            var remoteMovie = new RemoteMovie()
            {
                ParsedMovieInfo = parsedMovieInfo
            };

            var movie = searchCriteria == null
                ? GetMovie(parsedMovieInfo, imdbId)
                : GetMovie(parsedMovieInfo, imdbId, searchCriteria);

            if (movie == null)
            {
                return remoteMovie;
            }
            remoteMovie.Movie = movie;

            return remoteMovie;
        }


        private Movie GetMovie(ParsedMovieInfo parsedMovieInfo, int imdbId)
        {
            var movie = _movieService.FindByTitle(parsedMovieInfo.MovieTitle);
            if (movie == null && imdbId > 0)
            {
                movie = _movieService.FindByImdbId(imdbId.ToString());
            }

            if (movie == null)
            {
                _logger.Trace("No matching movie {0}", parsedMovieInfo.MovieTitle);
                return null;
            }

            return movie;
        }
        private Movie GetMovie(ParsedMovieInfo parsedMovieInfo, int imdbId, SearchCriteriaBase searchCriteria)
        {
            if (parsedMovieInfo.MovieTitle.CleanSeriesTitle() == searchCriteria.Movie.CleanTitle)
            {
                return searchCriteria.Movie;
            }

            return GetMovie(parsedMovieInfo, imdbId);
        }

    }
}