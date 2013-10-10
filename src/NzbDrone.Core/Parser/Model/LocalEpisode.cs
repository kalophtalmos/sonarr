using System;
using System.Linq;
using System.Collections.Generic;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Qualities;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.Parser.Model
{
    public class LocalVideoFile
    {
        public String Path { get; set; }
        public Int64 Size { get; set; }
        public QualityModel Quality { get; set; }
        public Boolean ExistingFile { get; set; }
    }

    public class LocalMovie : LocalVideoFile
    {
        public ParsedMovieInfo ParsedMovieInfo { get; set; }
        public Movie Movie { get; set; }

        public override string ToString()
        {
            return Path;
        }
    }

    public class LocalEpisode : LocalVideoFile
    {
        public ParsedEpisodeInfo ParsedEpisodeInfo { get; set; }
        public Series Series { get; set; }
        public List<Episode> Episodes { get; set; }
        
        public int SeasonNumber 
        { 
            get
            {
                return Episodes.Select(c => c.SeasonNumber).Distinct().Single();
            } 
        }
        
        public override string ToString()
        {
            return Path;
        }
    }
}