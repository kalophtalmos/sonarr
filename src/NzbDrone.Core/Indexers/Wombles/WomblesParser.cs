using System.Xml.Linq;

namespace NzbDrone.Core.Indexers.Wombles
{
    public class WomblesParser : RssParserBase
    {
        protected override string GetNzbInfoUrl(XElement item)
        {
            return null;
        }

        protected override long GetSize(XElement item)
        {
            return 0;
        }

        protected override int GetImdbId(XElement item)
        {
            return 0;
        }

        protected override int GetTvdbId(XElement item)
        {
            return 0;
        }
    }
}