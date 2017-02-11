using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Nancy;
using NLog;
using NzbDrone.Core.Datastore.Events;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.MediaFiles;
using NzbDrone.Core.MediaFiles.Events;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Tv;
using NzbDrone.SignalR;
using Sonarr.Api.V3.Series;
using Sonarr.Http;
using Sonarr.Http.Extensions;
using Sonarr.Http.REST;

namespace Sonarr.Api.V3.EpisodeFiles
{
    public class EpisodeModule : SonarrRestModuleWithSignalR<EpisodeFileResource, EpisodeFile>,
                                 IHandle<EpisodeFileAddedEvent>
    {
        private readonly IMediaFileService _mediaFileService;
        private readonly IRecycleBinProvider _recycleBinProvider;
        private readonly ISeriesService _seriesService;
        private readonly IQualityUpgradableSpecification _qualityUpgradableSpecification;
        private readonly Logger _logger;

        public EpisodeModule(IBroadcastSignalRMessage signalRBroadcaster,
                             IMediaFileService mediaFileService,
                             IRecycleBinProvider recycleBinProvider,
                             ISeriesService seriesService,
                             IQualityUpgradableSpecification qualityUpgradableSpecification,
                             Logger logger)
            : base(signalRBroadcaster)
        {
            _mediaFileService = mediaFileService;
            _recycleBinProvider = recycleBinProvider;
            _seriesService = seriesService;
            _qualityUpgradableSpecification = qualityUpgradableSpecification;
            _logger = logger;

            GetResourceById = GetEpisodeFile;
            GetResourceAll = GetEpisodeFiles;
            UpdateResource = SetQuality;
            DeleteResource = DeleteEpisodeFile;

            Put["/editor"] = episodeFiles => SetQuality();
            Delete["/bulk"] = episodeFiles => DeleteEpisodeFiles();
        }

        private EpisodeFileResource GetEpisodeFile(int id)
        {
            var episodeFile = _mediaFileService.Get(id);
            var series = _seriesService.GetSeries(episodeFile.SeriesId);

            return episodeFile.ToResource(series, _qualityUpgradableSpecification);
        }

        private List<EpisodeFileResource> GetEpisodeFiles()
        {
            var seriesIdQuery = Request.Query.SeriesId;
            var episodeFileIdsQuery = Request.Query.EpisodeFileIds;

            if (!seriesIdQuery.HasValue && !episodeFileIdsQuery.HasValue)
            {
                throw new BadRequestException("seriesId or episodeFileIds must be provided");
            }

            if (seriesIdQuery.HasValue)
            {
                int seriesId = Convert.ToInt32(seriesIdQuery.Value);
                var series = _seriesService.GetSeries(seriesId);

                return _mediaFileService.GetFilesBySeries(seriesId).ConvertAll(f => f.ToResource(series, _qualityUpgradableSpecification));
            }

            else
            {
                string episodeFileIdsValue = episodeFileIdsQuery.Value.ToString();

                var episodeFileIds = episodeFileIdsValue.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                                        .Select(e => Convert.ToInt32(e))
                                                        .ToList();

                var episodeFiles = _mediaFileService.Get(episodeFileIds);
                var series = _seriesService.GetSeries(episodeFiles.First().SeriesId);

                return episodeFiles.ConvertAll(f => f.ToResource(series, _qualityUpgradableSpecification));
            }
        }

        private void SetQuality(EpisodeFileResource episodeFileResource)
        {
            var episodeFile = _mediaFileService.Get(episodeFileResource.Id);
            episodeFile.Quality = episodeFileResource.Quality;
            _mediaFileService.Update(episodeFile);
        }

        private Response SetQuality()
        {
            var resource = Request.Body.FromJson<EpisodeFileListResource>();
            var episodeFiles = _mediaFileService.GetFiles(resource.EpisodeFileIds);

            foreach (var episodeFile in episodeFiles)
            {
                episodeFile.Quality = resource.Quality;
            }

            _mediaFileService.Update(episodeFiles);

            var series = _seriesService.GetSeries(episodeFiles.First().SeriesId);

            return episodeFiles.ConvertAll(f => f.ToResource(series, _qualityUpgradableSpecification))
                               .AsResponse(HttpStatusCode.Accepted);
        }

        private void DeleteEpisodeFile(int id)
        {
            var episodeFile = _mediaFileService.Get(id);
            var series = _seriesService.GetSeries(episodeFile.SeriesId);
            var fullPath = Path.Combine(series.Path, episodeFile.RelativePath);

            _logger.Info("Deleting episode file: {0}", fullPath);
            _recycleBinProvider.DeleteFile(fullPath);
            _mediaFileService.Delete(episodeFile, DeleteMediaFileReason.Manual);
        }

        private Response DeleteEpisodeFiles()
        {
            var resource = Request.Body.FromJson<EpisodeFileListResource>();
            var episodeFiles = _mediaFileService.GetFiles(resource.EpisodeFileIds);
            var series = _seriesService.GetSeries(episodeFiles.First().SeriesId);

            foreach (var episodeFile in episodeFiles)
            {
                var fullPath = Path.Combine(series.Path, episodeFile.RelativePath);

                _logger.Info("Deleting episode file: {0}", fullPath);
                _recycleBinProvider.DeleteFile(fullPath);
                _mediaFileService.Delete(episodeFile, DeleteMediaFileReason.Manual);
            }

            return new object().AsResponse();
        }

        public void Handle(EpisodeFileAddedEvent message)
        {
            BroadcastResourceChange(ModelAction.Updated, message.EpisodeFile.Id);
        }
    }
}