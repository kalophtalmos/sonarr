using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using NLog;
using NzbDrone.Common;
using NzbDrone.Common.Disk;
using NzbDrone.Core.MediaFiles.Events;
using NzbDrone.Core.Messaging.Events;

namespace NzbDrone.Core.MediaFiles.EpisodeImport
{
    public interface IImportApprovedMovies
    {
        List<ImportMovieDecision> ImportMovies(List<ImportMovieDecision> decisions, bool newDownloads = false);
    }

    public class ImportApprovedMovies : IImportApprovedMovies
    {
        private readonly IUpgradeMediaFiles _movieFileUpgrader;
        private readonly IMediaFileService _mediaFileService;
        private readonly IDiskProvider _diskProvider;
        private readonly IEventAggregator _eventAggregator;
        private readonly Logger _logger;

        public ImportApprovedMovies(IUpgradeMediaFiles movieFileUpgrader,
            IMediaFileService mediaFileService,
            IDiskProvider diskProvider,
            IEventAggregator eventAggregator,
            Logger logger)
        {
            _movieFileUpgrader = movieFileUpgrader;
            _mediaFileService = mediaFileService;
            _diskProvider = diskProvider;
            _eventAggregator = eventAggregator;
            _logger = logger;
        }

        public List<ImportMovieDecision> ImportMovies(List<ImportMovieDecision> decisions, bool newDownloads = false)
        {
            var qualifiedImports = getQualifiedMovieDecisions(decisions);
            var imported = new List<ImportMovieDecision>();

            foreach (var movieDecision in qualifiedImports)
            {
                var localMovie = movieDecision.LocalMovie;

                try
                {
                    if (imported.Any(x => x.LocalMovie.Movie.Id == localMovie.Movie.Id))
                        continue;

                    var movieFile = new MovieFile();
                    movieFile.DateAdded = DateTime.UtcNow;
                    movieFile.MovieId = localMovie.Movie.Id;
                    movieFile.Path = localMovie.Path.CleanFilePath();
                    movieFile.Size = _diskProvider.GetFileSize(localMovie.Path);
                    movieFile.Quality = localMovie.Quality;
                    movieFile.SceneName = localMovie.Movie.Title;

                    if (newDownloads)
                    {
                        movieFile.SceneName = Path.GetFileNameWithoutExtension(localMovie.Path.CleanFilePath());
                        movieFile.Path = _movieFileUpgrader.UpgradeMovieFile(movieFile, localMovie);
                    }
                    _mediaFileService.Add(movieFile);
                    imported.Add(movieDecision);

                    if (newDownloads)
                    {
                        _eventAggregator.PublishEvent(new MovieImportedEvent(localMovie, movieFile));
                        _eventAggregator.PublishEvent(new MovieDownloadedEvent(localMovie));
                    }
                }
                catch (Exception e)
                {

                    _logger.WarnException("Couldn't import movie " + localMovie, e);
                }

            }
            return imported;
        }

        private List<ImportMovieDecision> getQualifiedMovieDecisions(List<ImportMovieDecision> decisions)
        {
            return decisions.Where(c => c.Approved).OrderBy(c => c.LocalMovie.Quality)
                .ThenBy(c => c.LocalMovie.Size).ToList();
        }
    }
}