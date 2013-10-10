using NzbDrone.Core.Datastore;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Qualities;
using System;

namespace NzbDrone.Core.MediaFiles
{
    public class MovieFile : ModelBase
    {
        public int MovieId { get; set; }
        public string Path { get; set; }
        public long Size { get; set; }
        public DateTime DateAdded { get; set; }
        public string SceneName { get; set; }
        public QualityModel Quality { get; set; }
        public Lazy<Movie> Movie { get; set; }
        public override string ToString()
        {
            return String.Format("[{0}] {1}", Id, Path);
        }


    }
}
