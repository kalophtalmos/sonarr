using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Marr.Data;
using NLog;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.DataAugmentation.Sickbeard.Model;
using NzbDrone.Core.MediaFiles;
using NzbDrone.Core.MediaFiles.Events;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.DataAugmentation.Sickbeard
{
    public interface ISickbeardService
    {
        bool DatabaseExists { get; }
        List<Series> GetAllSeries();
    }

    public class SickbeardService : ISickbeardService, IHandle<EpisodeImportedEvent>
    {
        private readonly IMediaFileService _mediaFileService;
        private readonly ISickbeardDbFactory _dbFactory;
        private readonly Logger _logger;

        public SickbeardService(IMediaFileService mediaFileService, ISickbeardDbFactory dbFactory, Logger logger)
        {
            _mediaFileService = mediaFileService;
            _dbFactory = dbFactory;
            _logger = logger;
        }

        private IDataMapper GetDataMapper()
        {
            var database = _dbFactory.Open();
            var dataMapper = database.GetDataMapper();

            return dataMapper;
        }

        public List<Series> GetAllSeries()
        {
            if (!DatabaseExists)
            {
                return null;
            }

            var shows = GetDataMapper().Query<tv_show>().ToArray();

            return shows.Select(MapSeries).ToList();
        }

        public bool DatabaseExists
        {
            get
            {
                return _dbFactory.DatabaseExists;
            }
        }

        public Series GetSeries(int tvdbid)
        {
            if (!DatabaseExists)
            {
                return null;
            }

            var show = GetDataMapper().Query<tv_show>().Where(v => v.tvdb_id == tvdbid).FirstOrDefault();

            if (show != null)
            {
                return MapSeries(show);
            }

            return null;
        }

        public bool UpdateEpisodeFile(Series series, EpisodeFile episodeFile)
        {
            if (!DatabaseExists)
            {
                return false;
            }

            var fullPath = Path.Combine(series.Path, episodeFile.RelativePath);

            var episode = GetDataMapper().Query<tv_episode>().Where(v => v.location == fullPath).FirstOrDefault();

            if (episode != null)
            {
                if (episode.release_name.IsNotNullOrWhiteSpace())
                {
                    var parsedEpisodeInfo = Parser.Parser.ParseTitle(episode.release_name);
                    if (parsedEpisodeInfo != null)
                    {
                        episodeFile.ReleaseGroup = parsedEpisodeInfo.ReleaseGroup;
                        episodeFile.Quality = parsedEpisodeInfo.Quality;

                        if (SceneChecker.IsSceneTitle(episode.release_name))
                        {
                            episodeFile.SceneName = episode.release_name;
                        }
                    }
                }

                var quality = GetQuality(episode.status);
                if (episodeFile.Quality.Quality != quality.Quality)
                {
                    episodeFile.Quality.Quality = quality.Quality;
                }
                return true;
            }

            return false;
        }

        private Series MapSeries(tv_show series)
        {
            return new Series
            {
                Path = series.location,
                Title = series.show_name,
                TvdbId = series.tvdb_id,
                // quality
                SeasonFolder = series.flatten_folders == 0,
                Monitored = series.paused != 0,
                SeriesType = series.air_by_date != 0 ? SeriesTypes.Daily : SeriesTypes.Standard
            };
        }

        private Qualities.QualityModel GetQuality(int status)
        {
            if (status == (int)Quality.UNKNOWN)
            {
                return new Qualities.QualityModel(Qualities.Quality.Unknown);
            }

            switch ((Quality)(status / 100))
            {
                default:
                case Quality.None:
                    return new Qualities.QualityModel(Qualities.Quality.Unknown);
                case Quality.SDTV:
                    return new Qualities.QualityModel(Qualities.Quality.SDTV);
                case Quality.SDDVD:
                    return new Qualities.QualityModel(Qualities.Quality.DVD);
                case Quality.HDTV:
                    return new Qualities.QualityModel(Qualities.Quality.HDTV720p);
                case Quality.RAWHDTV:
                    return new Qualities.QualityModel(Qualities.Quality.RAWHD);
                case Quality.FULLHDTV:
                    return new Qualities.QualityModel(Qualities.Quality.HDTV1080p);
                case Quality.HDWEBDL:
                    return new Qualities.QualityModel(Qualities.Quality.WEBDL720p);
                case Quality.FULLHDWEBDL:
                    return new Qualities.QualityModel(Qualities.Quality.WEBDL1080p);
                case Quality.HDBLURAY:
                    return new Qualities.QualityModel(Qualities.Quality.Bluray720p);
                case Quality.FULLHDBLURAY:
                    return new Qualities.QualityModel(Qualities.Quality.Bluray1080p);
            }
        }

        public void Handle(EpisodeImportedEvent message)
        {
            if (!DatabaseExists)
            {
                return;
            }

            var episodeFile = message.ImportedEpisode;

            var updated = UpdateEpisodeFile(message.EpisodeInfo.Series, episodeFile);

            if (updated)
            {
                _mediaFileService.Update(episodeFile);
            }
        }
    }
}
