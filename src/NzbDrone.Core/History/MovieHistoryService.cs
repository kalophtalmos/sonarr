using System;
using System.Collections.Generic;
using System.Linq;
using NLog;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Download;
using NzbDrone.Core.MediaFiles.Events;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.History
{
    public interface IMovieHistoryService
    {
        List<MovieHistory> All();
        void Purge();
        void Trim();
        QualityModel GetBestQualityInHistory(int movieId);
        PagingSpec<MovieHistory> Paged(PagingSpec<MovieHistory> pagingSpec);
        List<MovieHistory> Failed();
        List<MovieHistory> Grabbed();
        MovieHistory MostRecentForMovie(int movieId);
    }

    public class MovieHistoryService : IMovieHistoryService, IHandle<MovieGrabbedEvent>, IHandle<MovieImportedEvent>//TODO ,IHandle<DownloadFailedEvent>
    {
        private readonly IMovieHistoryRepository _historyRepository;
        private readonly Logger _logger;

        public MovieHistoryService(IMovieHistoryRepository historyRepository,Logger logger)
        {
            _historyRepository = historyRepository;
            _logger = logger;
        }

        public List<MovieHistory> All()
        {
            return _historyRepository.All().ToList();
        }

        public void Purge()
        {
            _historyRepository.Purge();
        }

        public void Trim()
        {
            _historyRepository.Trim();
        }

        public QualityModel GetBestQualityInHistory(int movieId)
        {
            throw new NotImplementedException();
        }

        public PagingSpec<MovieHistory> Paged(PagingSpec<MovieHistory> pagingSpec)
        {
            return _historyRepository.GetPaged(pagingSpec);
        }

        public List<MovieHistory> Failed()
        {
            return _historyRepository.Failed();
        }

        public List<MovieHistory> Grabbed()
        {
            return _historyRepository.Grabbed();
        }

        public MovieHistory MostRecentForMovie(int movieId)
        {
            return _historyRepository.MostRecentForMove(movieId);
        }

        public void Handle(MovieGrabbedEvent message)
        {
            var history = new MovieHistory
            {
                EventType = HistoryEventType.Grabbed,
                Date = DateTime.UtcNow,
                Quality = message.Movie.ParsedMovieInfo.Quality,
                SourceTitle = message.Movie.Release.Title,
                MovieId = message.Movie.Movie.Id
            };

            history.Data.Add("Indexer", message.Movie.Release.Indexer);
            history.Data.Add("NzbInfoUrl", message.Movie.Release.InfoUrl);
            //TODO: Fix release group
            //history.Data.Add("ReleaseGroup", message.Movie.Release.ReleaseGroup);
            history.Data.Add("Age", message.Movie.Release.Age.ToString());
            
            if (!String.IsNullOrWhiteSpace(message.DownloadClientId))
            {
                history.Data.Add("DownloadClient", message.DownloadClient);
                history.Data.Add("DownloadClientId", message.DownloadClientId);
            }

            _historyRepository.Insert(history);
        }

        public void Handle(MovieImportedEvent message)
        {
                var history = new MovieHistory()
            {
                EventType = HistoryEventType.DownloadFolderImported,
                Date = DateTime.UtcNow,
                Quality = message.MovieInfo.Quality,
                SourceTitle = message.MovieInfo.Movie.Title,
                MovieId = message.MovieInfo.Movie.Id
            };

            history.Data.Add("DroppedPath",message.MovieInfo.Path);
            history.Data.Add("ImportedPath",message.ImportedMovie.Path);

            _historyRepository.Insert(history);
        }
    
    }
}