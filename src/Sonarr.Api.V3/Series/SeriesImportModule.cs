using System.Collections.Generic;
using Nancy;
using NzbDrone.Core.Tv;
using Sonarr.Http;
using Sonarr.Http.Extensions;

namespace Sonarr.Api.V3.Series
{
    public class SeriesImportModule : SonarrRestModule<SeriesResource>
    {
        private readonly ISeriesService _seriesService;

        public SeriesImportModule(ISeriesService seriesService)
            : base("/series/import")
        {
            _seriesService = seriesService;
            Post["/"] = x => Import();
        }


        private Response Import()
        {
            var resource = Request.Body.FromJson<List<SeriesResource>>();
            var newSeries = resource.ToModel();

            return _seriesService.AddSeries(newSeries).ToResource().AsResponse();
        }
    }
}
