using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.DataAugmentation.Sickbeard.Model
{
    // Only contains the fields we actual use.
    public class tv_episode
    {
        public int episode_id { get; set; }
        public int showid { get; set; }
        public string name { get; set; }
        public int season { get; set; }
        public int episode { get; set; }
        public int status { get; set; }
        public string location { get; set; }
        public string release_name { get; set; }
    }
}
