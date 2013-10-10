using System;
using System.Collections.Generic;
using NzbDrone.Api.REST;
using NzbDrone.Core.History;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Api.MovieHistory
{
    public class MovieHistoryResource : RestResource
    {
        public int MovieId { get; set; }
        public string SourceTitle { get; set; }
        public Movie Movie { get; set; }
        public QualityModel Quality { get; set; }
        public DateTime Date { get; set; }
        public HistoryEventType EventType { get; set; }
        public Dictionary<string, string> Data { get; set; }
        public string Indexer { get; set; }
        public string NzbInfoUrl { get; set; }
        public string ReleaseGroup { get; set; }
    }
}
