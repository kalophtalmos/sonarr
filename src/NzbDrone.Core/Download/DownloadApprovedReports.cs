using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using NLog;
using NzbDrone.Core.DecisionEngine.Specifications;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.Download
{
    public interface IDownloadApprovedTVReports : IDownloadApprovedReports<DownloadDecision>
    {}
    public interface IDownloadApprovedReports<T>
    {
        List<T> DownloadApproved(List<T> decisions);
    }

    public interface IDownloadApprovedMovieReports : IDownloadApprovedReports<MovieDownloadDecision>
    {
    }

    public class DownloadApprovedMovieReports : IDownloadApprovedMovieReports
    {
        private readonly Logger _logger;
        private readonly IDownloadService _downloadService;

        public DownloadApprovedMovieReports(Logger logger,IDownloadService downloadService)
        {
            _logger = logger;
            _downloadService = downloadService;
        }

        public List<MovieDownloadDecision> DownloadApproved(List<MovieDownloadDecision> decisions)
        {
            var qualifiedReports = GetQualifiedReports(decisions);
            var downloadReports = new List<MovieDownloadDecision>();
            foreach (var report in qualifiedReports)
            {
                var remoteMovie = report.RemoteMovie;
                try
                {
                    if(downloadReports.Any(x=>x.RemoteMovie.Movie.Id == report.RemoteMovie.Movie.Id))
                        continue;
                    _downloadService.DownloadReport(remoteMovie);
                    downloadReports.Add(report);
                }
                catch (Exception e)
                {

                    _logger.WarnException("Couldn't add report to download queue. " + report, e);
                }
            }
            return downloadReports;
        }

        private List<MovieDownloadDecision> GetQualifiedReports(IEnumerable<MovieDownloadDecision> decisions)
        {
            return decisions.Where(c => c.Approved).OrderByDescending(c => c.RemoteMovie.ParsedMovieInfo.Quality)
                            .ThenBy(c => c.RemoteMovie.Release.Age)
                            .ToList();
        }
    }

    public class DownloadApprovedReports : IDownloadApprovedTVReports
    {
        private readonly IDownloadService _downloadService;
        private readonly Logger _logger;

        public DownloadApprovedReports(IDownloadService downloadService,  Logger logger)
        {
            _downloadService = downloadService;
            _logger = logger;
        }

        public List<DownloadDecision> DownloadApproved(List<DownloadDecision> decisions)
        {
            var qualifiedReports = GetQualifiedReports(decisions);
            var downloadedReports = new List<DownloadDecision>();

            foreach (var report in qualifiedReports)
            {
                var remoteEpisode = report.RemoteEpisode;

                try
                {
                    if (downloadedReports.SelectMany(r => r.RemoteEpisode.Episodes)
                                         .Select(e => e.Id)
                                         .ToList()
                                         .Intersect(remoteEpisode.Episodes.Select(e => e.Id))
                                         .Any())
                    {
                        continue;
                    }

                    _downloadService.DownloadReport(remoteEpisode);
                    downloadedReports.Add(report);
                }
                catch (Exception e)
                {
                    _logger.WarnException("Couldn't add report to download queue. " + remoteEpisode, e);
                }
            }

            return downloadedReports;
        }

        public List<DownloadDecision> GetQualifiedReports(IEnumerable<DownloadDecision> decisions)
        {
            return decisions.Where(c => c.Approved && c.RemoteEpisode.Episodes.Any())
                .GroupBy(c => c.RemoteEpisode.Series.Id, (i,s) => s
                    .OrderByDescending(c => c.RemoteEpisode.ParsedEpisodeInfo.Quality, new QualityModelComparer(s.First().RemoteEpisode.Series.QualityProfile))
                    .ThenBy(c => c.RemoteEpisode.Episodes.Select(e => e.EpisodeNumber).MinOrDefault())
                    .ThenBy(c => c.RemoteEpisode.Release.Size.Round(200.Megabytes()) / c.RemoteEpisode.Episodes.Count)
                    .ThenBy(c => c.RemoteEpisode.Release.Age))
                .SelectMany(c => c)
                .ToList();
        }
    }
}
