using System;
using System.Collections.Generic;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.History
{
    public interface IHistoryService
    {
        List<History> All();
        void Purge();
        void Trim();
        QualityModel GetBestQualityInHistory(QualityProfile qualityProfile, int episodeId);
        PagingSpec<History> Paged(PagingSpec<History> pagingSpec);
        List<History> BetweenDates(DateTime startDate, DateTime endDate, HistoryEventType eventType);
        List<History> Failed();
        List<History> Grabbed();
        History MostRecentForEpisode(int episodeId);
        History Get(int id);
    }
}
