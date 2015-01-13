using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.DataAugmentation.Sickbeard.Model
{
    public class tv_show
    {
        public int show_id { get; set; }
        public string location { get; set; }
        public string show_name { get; set; }
        public int tvdb_id { get; set; }
        public int quality { get; set; }
        public int flatten_folders { get; set; }
        public int paused { get; set; }
        public int air_by_date { get; set; }
    }
}
