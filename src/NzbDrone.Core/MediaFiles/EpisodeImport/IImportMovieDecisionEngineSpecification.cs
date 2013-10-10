using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.MediaFiles.EpisodeImport
{
    public interface IImportMovieDecisionEngineSpecification : IRejectWithReason
    {
        bool IsSatisfiedBy(LocalMovie localMovie);
    }
}