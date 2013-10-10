using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.History;

namespace NzbDrone.Api.MovieHistory
{
    public class MovieHistoryModule :NzbDroneRestModule<MovieHistoryResource>
    {
        private readonly IMovieHistoryService _movieHistoryService;

        public MovieHistoryModule(IMovieHistoryService movieHistoryService)
        {
            _movieHistoryService = movieHistoryService;

            GetResourcePaged = GetMovieHistory;
        }

        private PagingResource<MovieHistoryResource> GetMovieHistory(PagingResource<MovieHistoryResource> pagingResource)
        {
            var movieId = Request.Query.MovieId;

            var pagingSpec = new PagingSpec<Core.History.MovieHistory>
            {
                Page = pagingResource.Page,
                PageSize = pagingResource.PageSize,
                SortKey = pagingResource.SortKey,
                SortDirection = pagingResource.SortDirection
            };

            if (movieId.HasValue)
            {
                int i = (int) movieId;
                pagingSpec.FilterExpression = h => h.MovieId == i;
            }

            return ApplyToPage(_movieHistoryService.Paged, pagingSpec);
        }
    }
}
