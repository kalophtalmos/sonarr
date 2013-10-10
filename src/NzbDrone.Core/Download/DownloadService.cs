using System;
using NLog;
using NzbDrone.Common.EnsureThat;
using NzbDrone.Core.Instrumentation.Extensions;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.Download
{
    public interface IDownloadService
    {
        void DownloadReport(RemoteEpisode remoteEpisode);
        void DownloadReport(RemoteMovie remoteMovie);
    }


    public class DownloadService : IDownloadService
    {
        private readonly IProvideDownloadClient _downloadClientProvider;
        private readonly IEventAggregator _eventAggregator;
        private readonly Logger _logger;


        public DownloadService(IProvideDownloadClient downloadClientProvider,
            IEventAggregator eventAggregator, Logger logger)
        {
            _downloadClientProvider = downloadClientProvider;
            _eventAggregator = eventAggregator;
            _logger = logger;
        }

        public void DownloadReport(RemoteEpisode remoteEpisode)
        {
            Ensure.That(remoteEpisode.Series, () => remoteEpisode.Series).IsNotNull();
            Ensure.That(remoteEpisode.Episodes, () => remoteEpisode.Episodes).HasItems();

            var downloadTitle = remoteEpisode.Release.Title;
            var downloadClient = _downloadClientProvider.GetDownloadClient();

            if (DownloadClientConfigured(downloadClient)) return;

            downloadClient.DownloadNzb(remoteEpisode);

            _logger.ProgressInfo("Report sent to download client. {0}", downloadTitle);
            _eventAggregator.PublishEvent(new EpisodeGrabbedEvent(remoteEpisode));
        }

        public void DownloadReport(RemoteMovie remoteMovie)
        {
            var downloadTitle = remoteMovie.Release.Title;
            var downloadClient = _downloadClientProvider.GetDownloadClient();

            if (DownloadClientConfigured(downloadClient)) return;

            downloadClient.DownloadNzb(remoteMovie);
            _logger.ProgressInfo("Report sent to download client. {0}", downloadTitle);
        }

        private bool DownloadClientConfigured(IDownloadClient downloadClient)
        {
            {
                _logger.Warn("Download client isn't configured yet.");
                return true;
            }
            return false;
        }
    }
}