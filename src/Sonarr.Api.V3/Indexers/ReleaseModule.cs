﻿using System;
using System.Collections.Generic;
using FluentValidation;
using Nancy;
using Nancy.ModelBinding;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.Download;
using NzbDrone.Core.Exceptions;
using NzbDrone.Core.Indexers;
using NzbDrone.Core.IndexerSearch;
using NzbDrone.Core.Parser.Model;
using Sonarr.Http.Extensions;
using HttpStatusCode = System.Net.HttpStatusCode;

namespace Sonarr.Api.V3.Indexers
{
    public class ReleaseModule : ReleaseModuleBase
    {
        private readonly IFetchAndParseRss _rssFetcherAndParser;
        private readonly ISearchForNzb _nzbSearchService;
        private readonly IMakeDownloadDecision _downloadDecisionMaker;
        private readonly IPrioritizeDownloadDecision _prioritizeDownloadDecision;
        private readonly IDownloadService _downloadService;
        private readonly Logger _logger;

        private readonly ICached<RemoteEpisode> _remoteEpisodeCache;

        public ReleaseModule(IFetchAndParseRss rssFetcherAndParser,
                             ISearchForNzb nzbSearchService,
                             IMakeDownloadDecision downloadDecisionMaker,
                             IPrioritizeDownloadDecision prioritizeDownloadDecision,
                             IDownloadService downloadService,
                             ICacheManager cacheManager,
                             Logger logger)
        {
            _rssFetcherAndParser = rssFetcherAndParser;
            _nzbSearchService = nzbSearchService;
            _downloadDecisionMaker = downloadDecisionMaker;
            _prioritizeDownloadDecision = prioritizeDownloadDecision;
            _downloadService = downloadService;
            _logger = logger;

            GetResourceAll = GetReleases;
            Post["/"] = x => DownloadRelease(this.Bind<ReleaseResource>());

            PostValidator.RuleFor(s => s.DownloadAllowed).Equal(true);
            PostValidator.RuleFor(s => s.Guid).NotEmpty();

            _remoteEpisodeCache = cacheManager.GetCache<RemoteEpisode>(GetType(), "remoteEpisodes");
        }

        private Response DownloadRelease(ReleaseResource release)
        {
            var remoteEpisode = _remoteEpisodeCache.Find(release.Guid);

            if (remoteEpisode == null)
            {
                _logger.Debug("Couldn't find requested release in cache, cache timeout probably expired.");

                throw new NzbDroneClientException(HttpStatusCode.NotFound, "Couldn't find requested release in cache, try searching again");
            }

            try
            {
                _downloadService.DownloadReport(remoteEpisode);
            }
            catch (ReleaseDownloadException ex)
            {
                _logger.ErrorException(ex.Message, ex);
                throw new NzbDroneClientException(HttpStatusCode.Conflict, "Getting release from indexer failed");
            }

            return release.AsResponse();
        }

        private List<ReleaseResource> GetReleases()
        {
            if (Request.Query.episodeId != null)
            {
                return GetEpisodeReleases(Request.Query.episodeId);
            }

            return GetRss();
        }

        private List<ReleaseResource> GetEpisodeReleases(int episodeId)
        {
            try
            {
                var decisions = _nzbSearchService.EpisodeSearch(episodeId, true);
                var prioritizedDecisions = _prioritizeDownloadDecision.PrioritizeDecisions(decisions);

                return MapDecisions(prioritizedDecisions);
            }
            catch (Exception ex)
            {
                _logger.ErrorException("Episode search failed: " + ex.Message, ex);
            }

            return new List<ReleaseResource>();
        }

        private List<ReleaseResource> GetRss()
        {
            var reports = _rssFetcherAndParser.Fetch();
            var decisions = _downloadDecisionMaker.GetRssDecision(reports);
            var prioritizedDecisions = _prioritizeDownloadDecision.PrioritizeDecisions(decisions);

            return MapDecisions(prioritizedDecisions);
        }

        protected override ReleaseResource MapDecision(DownloadDecision decision, int initialWeight)
        {
            _remoteEpisodeCache.Set(decision.RemoteEpisode.Release.Guid, decision.RemoteEpisode, TimeSpan.FromMinutes(30));
           return base.MapDecision(decision, initialWeight);
        }
    }
}