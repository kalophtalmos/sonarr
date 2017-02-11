using Nancy;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Tv;
using Sonarr.Http.Extensions;

namespace Sonarr.Api.V3.Series
{
    public class SeriesEditorModule : SonarrV3Module
    {
        private readonly ISeriesService _seriesService;

        public SeriesEditorModule(ISeriesService seriesService)
            : base("/series/editor")
        {
            _seriesService = seriesService;
            Put["/"] = series => SaveAll();
        }

        private Response SaveAll()
        {
            var resource = Request.Body.FromJson<SeriesEditorResource>();
            var seriesToUpdate = _seriesService.GetSeries(resource.SeriesIds);

            foreach (var series in seriesToUpdate)
            {
                if (resource.Monitored.HasValue)
                {
                    series.Monitored = resource.Monitored.Value;
                }

                if (resource.QualityProfileId.HasValue)
                {
                    series.ProfileId = resource.QualityProfileId.Value;
                }

                if (resource.SeasonFolder.HasValue)
                {
                    series.SeasonFolder = resource.SeasonFolder.Value;
                }

                if (resource.RootFolderPath.IsNotNullOrWhiteSpace())
                {
                    series.RootFolderPath = resource.RootFolderPath;
                }
            }

            return _seriesService.UpdateSeries(seriesToUpdate)
                                 .ToResource()
                                 .AsResponse(HttpStatusCode.Accepted);
        }
    }
}
