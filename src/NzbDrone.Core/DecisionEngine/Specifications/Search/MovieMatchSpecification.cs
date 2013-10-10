using NLog;
using NzbDrone.Core.IndexerSearch.Definitions;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.DecisionEngine.Specifications.Search
{
    public class MovieMatchSpecification : IMovieDecisionEngineSpecification
    {
        private readonly Logger _logger;

        public MovieMatchSpecification(Logger logger)
        {
            _logger = logger;
        }

        public string RejectionReason
        {
            get
            {
                return "Movie doesn't match";
            }
        }
        public bool IsSatisfiedBy(RemoteMovie subject, SearchCriteriaBase searchCriteria)
        {
            if (searchCriteria == null) return true;

            var movieSpc = searchCriteria as MovieSearchCriteria;

            if (movieSpc.SceneTitle != subject.ParsedMovieInfo.MovieTitle)
            {
                _logger.Trace("Movie title does not match ");
                return false;
            }

            return true;
        }
    }
}