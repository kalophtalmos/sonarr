using System.Collections.Generic;

namespace Sonarr.Api.V3.Series
{
    public class SeriesEditorResource
    {
        public List<int> SeriesIds { get; set; }
        public bool? Monitored { get; set; }
        public int? QualityProfileId { get; set; }
        public bool? SeasonFolder { get; set; }
        public string RootFolderPath { get; set; }
    }
}
