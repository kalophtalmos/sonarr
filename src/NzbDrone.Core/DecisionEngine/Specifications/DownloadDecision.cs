using System.Collections.Generic;
using System.Linq;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.DecisionEngine.Specifications
{
    public abstract class Decision
    {
        protected Decision(params string[] rejections)
        {
            Rejections = rejections.ToList();
            
        }

        public IEnumerable<string> Rejections { get; protected set; }
        public bool Approved
        {
            get
            {
                return !Rejections.Any();
            }
        }
    }

    public class DownloadDecision : Decision
    {
        public RemoteEpisode RemoteEpisode { get; private set; }

        public DownloadDecision(RemoteEpisode episode, params string[] rejections):base(rejections)
        {
            RemoteEpisode = episode;
        }


        public override string ToString()
        {
            if (Approved)
            {
                return "[OK] " + RemoteEpisode;
            }

            return "[Rejected " + Rejections.Count() + "]" + RemoteEpisode;
        }
    }

    public class MovieDownloadDecision : Decision
    {
        public RemoteMovie RemoteMovie { get; private set; }

        public MovieDownloadDecision(RemoteMovie remoteMovie,params string[] rejections):base(rejections)
        {
            RemoteMovie = remoteMovie;
        }

        public override string ToString()
        {
            if (Approved)
            {
                return "[OK] " + RemoteMovie;
            }

            return "[Rejected " + Rejections.Count() + "]" + RemoteMovie;
        }
    }
}