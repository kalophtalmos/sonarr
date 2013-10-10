using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FizzWare.NBuilder;
using FluentAssertions;
using NUnit.Framework;
using NzbDrone.Core.DecisionEngine.Specifications;
using NzbDrone.Core.Download;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Qualities;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.Test.Download.DownloadApprovedReportsTests
{
    [TestFixture]
    public class DownloadApprovedMovieFixture : CoreTest<DownloadApprovedMovieReports>
    {
        private Movie GetMovie(int id)
        {
            return Builder<Movie>.CreateNew()
                .With(m => m.Id = id).Build();
        }

        private RemoteMovie GetRemoteMovie(Movie movie, QualityModel quality)
        {
            var remoteMovie = new RemoteMovie();
            remoteMovie.ParsedMovieInfo = new ParsedMovieInfo();
            remoteMovie.ParsedMovieInfo.Quality = quality;

            remoteMovie.Movie = movie;

            remoteMovie.Release = new ReleaseInfo();
            remoteMovie.Release.PublishDate = DateTime.UtcNow;

            return remoteMovie;
        }

        [Test]
        public void should_return_downloaded_reports()
        {
            var movie = GetMovie(1);
            var remoteMovie = GetRemoteMovie(movie, new QualityModel(Quality.HDTV720p));

            var decisions = new List<MovieDownloadDecision>();
            decisions.Add(new MovieDownloadDecision(remoteMovie));

            Subject.DownloadApproved(decisions).Should().HaveCount(1);
        }

        [Test]
        public void should_only_return_downloaded_reports()
        {
            var remoteMovie1 = GetRemoteMovie(GetMovie(1), new QualityModel(Quality.HDTV720p));
            var remoteMovie2 = GetRemoteMovie(GetMovie(2), new QualityModel(Quality.HDTV720p));
            var remoteMovie3 = GetRemoteMovie(GetMovie(2), new QualityModel(Quality.HDTV720p));

            var decisions = new List<MovieDownloadDecision>();
            decisions.Add(new MovieDownloadDecision(remoteMovie1));
            decisions.Add(new MovieDownloadDecision(remoteMovie2));
            decisions.Add(new MovieDownloadDecision(remoteMovie3));

            Subject.DownloadApproved(decisions).Should().HaveCount(2);
        }
    }
}
