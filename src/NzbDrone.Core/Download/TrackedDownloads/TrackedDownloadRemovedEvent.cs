using NzbDrone.Common.Messaging;

namespace NzbDrone.Core.Download.TrackedDownloads
{
    public class TrackedDownloadRemovedEvent : IEvent
    {
        public TrackedDownload TrackedDownload { get; private set; }

        public TrackedDownloadRemovedEvent(TrackedDownload trackedDownload)
        {
            TrackedDownload = trackedDownload;
        }
    }
}
