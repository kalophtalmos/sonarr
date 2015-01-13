using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NzbDrone.Core.DataAugmentation.Sickbeard.Model
{
    [Flags]
    public enum Quality
    {
        None = 0,
        SDTV = 1 << 0,
        SDDVD = 1 << 1,
        HDTV = 1 << 2,
        RAWHDTV = 1 << 3,
        FULLHDTV = 1 << 4,
        HDWEBDL = 1 << 5,
        FULLHDWEBDL = 1 << 6,
        HDBLURAY = 1 << 7,
        FULLHDBLURAY = 1 << 8,
        UNKNOWN = 1 << 15
    }
}
