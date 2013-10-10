using System;
using System.Collections.Generic;
using System.Linq;
using Marr.Data.QGen;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Datastore.Extentions;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Movies;

namespace NzbDrone.Core.History
{
    public interface IMovieHistoryRepository : IBasicRepository<MovieHistory>
    {
        void Trim();
        List<MovieHistory> Grabbed();
        List<MovieHistory> Failed();
        MovieHistory MostRecentForMove(int movieId);
    }

    public class MovieHistoryRepository : BasicRepository<MovieHistory>, IMovieHistoryRepository
    {
        public MovieHistoryRepository(IDatabase database, IEventAggregator eventAggregator) : base(database, eventAggregator)
        {
        }

        public void Trim()
        {
            var cutoff = DateTime.UtcNow.AddDays(-30).Date;
            Delete(c=>c.Date <cutoff);
        }


        public List<MovieHistory> Grabbed()
        {
            return Query.Where(h => h.EventType == HistoryEventType.Grabbed);
        }

        public List<MovieHistory> Failed()
        {
            return Query.Where(h => h.EventType == HistoryEventType.DownloadFailed);
        }

        public MovieHistory MostRecentForMove(int movieId)
        {
            return Query.Where(h => h.MovieId == movieId)
                .OrderByDescending(h => h.Date)
                .FirstOrDefault();
        }

        public override PagingSpec<MovieHistory> GetPaged(PagingSpec<MovieHistory> pagingSpec)
        {
            pagingSpec.Records = getPagedMovieHistory(pagingSpec);
            pagingSpec.TotalRecords = getPagedMovieHistory(pagingSpec).GetRowCount();

            return pagingSpec;
        }

        private SortBuilder<MovieHistory> getPagedMovieHistory(PagingSpec<MovieHistory> pagingSpec)
        {
            return Query.Join<MovieHistory, Movie>(JoinType.Inner, x => x.Movie, (h, s) => h.MovieId == s.Id)
                .Where(pagingSpec.FilterExpression)
                .OrderBy(pagingSpec.OrderByClause(), pagingSpec.ToSortDirection())
                .Skip(pagingSpec.PagingOffset())
                .Take(pagingSpec.PageSize);

        }
    }
}