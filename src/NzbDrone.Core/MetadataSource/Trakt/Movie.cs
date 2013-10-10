using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.MetadataSource.Trakt
{
    public class Movie
    {
        public string title { get; set; }
        public int year { get; set; }
        public string url { get; set; }
        public string overview { get; set; }
        public string tagline { get; set; }
        public int runtime { get; set; }
        public string imdb_id { get; set; }
        public int tmdb_id { get; set; }
        public Images images { get; set; }
        public string certification { get; set; }
        public List<string> genres { get; set; }
    }
}
