using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NLog;
using NzbDrone.Common.Disk;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.MediaFiles.EpisodeImport;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.MediaFiles.MovieImport
{
    public interface IMovieImportDecisionMaker
    {

        List<ImportMovieDecision> GetImportDecisions(IEnumerable<String> videoFiles, Movie movie);
    }

    public class MovieImportDecisionMaker : IMovieImportDecisionMaker
    {
        private readonly IEnumerable<IRejectWithReason> _specifications;
        private readonly IMovieParsingService _parsingService;
        private readonly IMediaFileService _mediaFileService;
        private readonly IDiskProvider _diskProvider;
        private readonly Logger _logger;

        public MovieImportDecisionMaker(IEnumerable<IRejectWithReason> specifications,
            IMovieParsingService parsingService,
            IMediaFileService mediaFileService,
            IDiskProvider diskProvider,
            Logger logger)
        {
            _specifications = specifications;
            _parsingService = parsingService;
            _mediaFileService = mediaFileService;
            _diskProvider = diskProvider;
            _logger = logger;
        }

        public List<ImportMovieDecision> GetImportDecisions(IEnumerable<string> videoFiles, Movie movie)
        {
            var newFiles = _mediaFileService.FilterExistingFiles(videoFiles.ToList(), movie.Id);
            return GetDecisions(newFiles, movie).ToList();
        }

        private IEnumerable<ImportMovieDecision> GetDecisions(List<string> newFiles, Movie movie)
        {
            foreach (var file in newFiles)
            {
                ImportMovieDecision decision = null;

                try
                {
                    var parsedMovie = _parsingService.GetMovieFromPath(file, movie);

                    if (parsedMovie != null)
                    {
                        parsedMovie.Size = _diskProvider.GetFileSize(file);
                        decision = GetDecisions(parsedMovie);
                    }
                    else
                    {
                        parsedMovie = new LocalMovie();
                        parsedMovie.Path = file;

                        decision = new ImportMovieDecision(parsedMovie,"Unable to parse file");
                    }
                }
                catch (Exception e)
                {
                    _logger.ErrorException("Couldn't import file" + file,e);
                }

                if (decision != null) yield return decision;
            }
        }

        private ImportMovieDecision GetDecisions(Parser.Model.LocalMovie parsedMovie)
        {
            var reasons =
                _specifications.Select(c => EvaluateSpec(c, parsedMovie)).Where(c => !string.IsNullOrWhiteSpace(c));

            return new ImportMovieDecision(parsedMovie,reasons.ToArray());
        }

        private string EvaluateSpec(IRejectWithReason spec, LocalMovie locaMovie)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(spec.RejectionReason))
                {
                    throw new InvalidOperationException("[Need Rejection Text]");
                }

                var generalSpecification = spec as IImportMovieDecisionEngineSpecification;
                if (generalSpecification != null && !generalSpecification.IsSatisfiedBy(locaMovie))
                {
                    return spec.RejectionReason;
                }
            }
            catch (Exception e)
            {
                //e.Data.Add("report", remoteEpisode.Report.ToJson());
                //e.Data.Add("parsed", remoteEpisode.ParsedEpisodeInfo.ToJson());
                _logger.ErrorException("Couldn't evaluate decision on " + locaMovie.Path, e);
                return string.Format("{0}: {1}", spec.GetType().Name, e.Message);
            }

            return null;
        }
    }
}
