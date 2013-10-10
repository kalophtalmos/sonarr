using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NzbDrone.Api.REST;
using NzbDrone.Core.MediaCover;

namespace NzbDrone.Api.Movies
{
    public class MoviesResource : RestResource
    {
        public string Title { get; set; }

        public string QualityProfileName { get; set; }
        public string Overview { get; set; }
        public List<MediaCover> Images { get; set; }
        public string RemotePoster { get; set; }
        public int Year { get; set; }

        public string Path { get; set; }
        public int QualityProfileId { get; set; }
        public Int32 Runtime { get; set; }
        public string TagLine { get; set; }

        public String CleanTitle { get; set; }
        public String ImdbId { get; set; }
        public int TmdbId { get; set; }
        public String TitleSlug { get; set; }
        public String RootFolderPath { get; set; }
        public DateTime? LastInfoSync { get; set; }
        public string Certification { get; set; }
    }
}
