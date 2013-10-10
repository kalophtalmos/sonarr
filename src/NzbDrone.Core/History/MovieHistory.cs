using System;
using System.Collections.Generic;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.History
{
    public class MovieHistory : ModelBase
    {
        public MovieHistory()
        {
            Data = new Dictionary<string, string>();
        }
        public int MovieId { get; set; }
        public string SourceTitle { get; set; }
        public QualityModel Quality { get; set; }
        public DateTime Date { get; set; }
        public Movie Movie { get; set; }
        public HistoryEventType EventType { get; set; }
        public Dictionary<string,string> Data { get; set; } 
    }
}