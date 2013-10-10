using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NLog;
using NzbDrone.Core.Download;
using NzbDrone.Core.Instrumentation.Extensions;
using NzbDrone.Core.Messaging.Commands;

namespace NzbDrone.Core.IndexerSearch
{
    public class MovieSearchService : IExecute<MovieSearchCommand>
    {
        private readonly ISearchForNzb _nzbSearchService;
        private readonly IDownloadApprovedMovieReports _downloadApprovedReports;
        private readonly Logger _logger;

        public MovieSearchService(ISearchForNzb nzbSearchService,
                                  IDownloadApprovedMovieReports downloadApprovedReports,
                                  Logger logger)
        {
            _nzbSearchService = nzbSearchService;
            _downloadApprovedReports = downloadApprovedReports;
            _logger = logger;
        }

        public void Execute(MovieSearchCommand message)
        {
            foreach (var movieId in message.MovieIds)
            {
                var decisions = _nzbSearchService.MovieSearch(movieId);
                var download = _downloadApprovedReports.DownloadApproved(decisions);

                _logger.ProgressInfo("Movie search complete. {0} reports downloaded",download.Count);
            }
        }
    }
}
