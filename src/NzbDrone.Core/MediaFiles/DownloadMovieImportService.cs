using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using NLog;
using NzbDrone.Common.Disk;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.MediaFiles.Commands;
using NzbDrone.Core.MediaFiles.EpisodeImport;
using NzbDrone.Core.MediaFiles.EpisodeImport.Specifications;
using NzbDrone.Core.MediaFiles.MovieImport;
using NzbDrone.Core.Messaging.Commands;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.MediaFiles
{
    public class DownloadMovieImportService : IExecute<DownloadedMovieScanCommand>
    {
        private readonly IDiskProvider _diskProvider;
        private readonly IDiskScanService _diskScanService;
        private readonly IMovieService _movieService;
        private readonly ISeriesService _seriesService;
        private readonly IMovieParsingService _parsingService;
        private readonly IConfigService _configService;
        private readonly IMovieImportDecisionMaker _importDecisionMaker;
        private readonly IImportApprovedMovies _importApprovedMovies;
        private readonly Logger _logger;

        public DownloadMovieImportService(IDiskProvider diskProvider,
            IDiskScanService diskScanService,
            IMovieService movieService,
            IMovieParsingService parsingService,
            IConfigService configService,
            IMovieImportDecisionMaker importDecisionMaker,
            IImportApprovedMovies importApprovedMovies,
            Logger logger)
        {
            _diskProvider = diskProvider;
            _diskScanService = diskScanService;
            _movieService = movieService;
            _parsingService = parsingService;
            _configService = configService;
            _importDecisionMaker = importDecisionMaker;
            _importApprovedMovies = importApprovedMovies;
            _logger = logger;
        }

        private void ProcessDownloadedMovieFolder()
        {
            var downloadedMovieFolder = _configService.DownloadedMoviesFolder;

            if (String.IsNullOrEmpty(downloadedMovieFolder))
            {
                _logger.Warn("Drone Factory folder is not configured");
                return;
            }

            if (!_diskProvider.FolderExists(downloadedMovieFolder))
            {
                _logger.Warn("Drone Factory folder [{0}] doesn't exist",downloadedMovieFolder);
                return;
            }

            foreach (var subfolder in _diskProvider.GetDirectories(downloadedMovieFolder))
            {
                try
                {
                    if(_movieService.MoviePathExists(subfolder))
                        continue;

                    var importedFiles = ProcessSubFolder(new DirectoryInfo(subfolder));

                    if (importedFiles.Any())
                    {
                        if (_diskProvider.GetFolderSize(subfolder) < NotSampleSpecification.SampleSizeLimit)
                        {
                            _diskProvider.DeleteFolder(subfolder,true);
                        }
                    }
                }
                catch (Exception e)
                {
                    _logger.ErrorException("An error has occurred while importing folder: " + subfolder, e);
                }
            }

            foreach (var videoFile in _diskScanService.GetVideoFiles(downloadedMovieFolder, false))
            {
                try
                {
                    ProcessVideoFile(videoFile);
                }
                catch (Exception ex)
                {
                    _logger.ErrorException("An error has occurred while importing video file" + videoFile, ex);
                }
            }
        }

        private void ProcessVideoFile(string videoFile)
        {
            var movie = _parsingService.GetMovie(Path.GetFileNameWithoutExtension(videoFile));

            if (movie == null)
            {
                _logger.Debug("Unknown movie for file: {0}", videoFile);
                return;
            }

            if (_diskProvider.IsFileLocked(videoFile))
            {
                _logger.Debug("[{0}] is currently locked by another process, skipping", videoFile);
                return;
            }
            ProcessFiles(movie, videoFile);
        }


        private List<ImportMovieDecision> ProcessSubFolder(DirectoryInfo subfolderInfo)
        {
            var cleanedUpName = GetCleanedUpFolderName(subfolderInfo.Name);

            var movie = _parsingService.GetMovie(cleanedUpName);

            if (movie == null)
            {
                _logger.Debug("Unknown Movie {0}",cleanedUpName);
                return new List<ImportMovieDecision>();
            }
            var videoFiles = _diskScanService.GetVideoFiles(subfolderInfo.FullName);
            return ProcessFiles(movie, videoFiles);
        }

        private List<ImportMovieDecision> ProcessFiles(Movie movie,params string[] videoFiles)
        {
            var decisions = _importDecisionMaker.GetImportDecisions(videoFiles, movie);
            return _importApprovedMovies.ImportMovies(decisions, true);
        }

        private string GetCleanedUpFolderName(string folder)
        {
            folder = folder.Replace("_UNPACK_", "")
                .Replace("_FAILED_", "");

            return folder;
        }

        public void Execute(DownloadedMovieScanCommand message)
        {
            ProcessDownloadedMovieFolder();
        }
    }
}