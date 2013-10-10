using System;
using System.Linq;
using NLog;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.Download;
using NzbDrone.Core.Instrumentation.Extensions;
using NzbDrone.Core.Messaging.Commands;

namespace NzbDrone.Core.Indexers
{
    public interface IRssSyncService
    {
        void Sync();
    }

    public class RssSyncService : IRssSyncService, IExecute<RssSyncCommand>
    {
        private readonly IFetchAndParseRss _rssFetcherAndParser;
        private readonly IMakeDownloadDecision _downloadDecisionMaker;
        private readonly IDownloadApprovedTVReports _downloadApprovedReports;
        private readonly Logger _logger;

        public RssSyncService(IFetchAndParseRss rssFetcherAndParser,
                              IMakeDownloadDecision downloadDecisionMaker,
                              IDownloadApprovedTVReports downloadApprovedReports,
                              Logger logger)
        {
            _rssFetcherAndParser = rssFetcherAndParser;
            _downloadDecisionMaker = downloadDecisionMaker;
            _downloadApprovedReports = downloadApprovedReports;
            _logger = logger;
        }


        public void Sync()
        {
            _logger.ProgressInfo("Starting RSS Sync");

            var reports = _rssFetcherAndParser.Fetch();
            var decisions = _downloadDecisionMaker.GetRssDecision(reports);
            var downloaded = _downloadApprovedReports.DownloadApproved(decisions);

            _logger.ProgressInfo("RSS Sync Completed. Reports found: {0}, Reports downloaded: {1}", reports.Count, downloaded.Count());
        }

        public void Execute(RssSyncCommand message)
        {
            Sync();
        }
    }

    public interface IMovieRssSyncService
    {
        void Sync();
    }

    public class MovieRssSyncService : IMovieRssSyncService, IExecute<MovieRssSyncCommand>
    {
        private readonly IFetchAndParseMovieRss _rssFetchAndMovieParser;
        private readonly IMakeDownloadDecision _downloadDecision;
        private readonly IDownloadApprovedMovieReports _downloadApprovedReports;
        private readonly Logger _logger;

        public MovieRssSyncService(IFetchAndParseMovieRss rssFetchAndMovieParser,
                                   IMakeDownloadDecision downloadDecision,
                                   IDownloadApprovedMovieReports downloadApprovedReports,
                                   Logger logger)
        {
            _rssFetchAndMovieParser = rssFetchAndMovieParser;
            _downloadDecision = downloadDecision;
            _downloadApprovedReports = downloadApprovedReports;
            _logger = logger;
        }

        public void Sync()
        {
            _logger.ProgressInfo("Starting Movie Rss Sync");

            var reports = _rssFetchAndMovieParser.Fetch();
            var decisions = _downloadDecision.GetMovieRssDecision(reports);
            var downloaded = _downloadApprovedReports.DownloadApproved(decisions);

            _logger.ProgressInfo("Movie RSS Sync Complete. Reports found: {0}, Reports downloaded: {1}",reports.Count,downloaded.Count);
        }

        public void Execute(MovieRssSyncCommand message)
        {
            Sync();
        }
    }
}