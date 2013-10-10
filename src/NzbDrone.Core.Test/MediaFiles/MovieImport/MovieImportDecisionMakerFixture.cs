using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.MediaFiles;
using NzbDrone.Core.MediaFiles.EpisodeImport;
using NzbDrone.Core.MediaFiles.MovieImport;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.MediaFiles.MovieImport
{
    [TestFixture]
    public class MovieImportDecisionMakerFixture : CoreTest<MovieImportDecisionMaker>
    {
        private List<string> _videoFiles;
        private LocalMovie _localMovie;

        private Movie _movie;

        private Mock<IImportMovieDecisionEngineSpecification> _pass1;
        private Mock<IImportMovieDecisionEngineSpecification> _pass2;
        private Mock<IImportMovieDecisionEngineSpecification> _pass3;


        private Mock<IImportMovieDecisionEngineSpecification> _fail1;
        private Mock<IImportMovieDecisionEngineSpecification> _fail2;
        private Mock<IImportMovieDecisionEngineSpecification> _fail3;

        [SetUp]
        public void Setup()
        {
            _pass1 = new Mock<IImportMovieDecisionEngineSpecification>();
            _pass2 = new Mock<IImportMovieDecisionEngineSpecification>();
            _pass3 = new Mock<IImportMovieDecisionEngineSpecification>();

            _fail1 = new Mock<IImportMovieDecisionEngineSpecification>();
            _fail2 = new Mock<IImportMovieDecisionEngineSpecification>();
            _fail3 = new Mock<IImportMovieDecisionEngineSpecification>();

            _pass1.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(true);
            _pass1.Setup(c => c.RejectionReason).Returns("_pass1");

            _pass2.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(true);
            _pass2.Setup(c => c.RejectionReason).Returns("_pass2");

            _pass3.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(true);
            _pass3.Setup(c => c.RejectionReason).Returns("_pass3");

            _fail1.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(false);
            _fail1.Setup(c => c.RejectionReason).Returns("_fail1");

            _fail2.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(false);
            _fail2.Setup(c => c.RejectionReason).Returns("_fail2");

            _fail3.Setup(c => c.IsSatisfiedBy(It.IsAny<LocalMovie>())).Returns(false);
            _fail3.Setup(c => c.RejectionReason).Returns("_fail3");

            _videoFiles = new List<string>() { @"D:\Movies\Silent.Hill.Revelation.2012.720p.BluRay.x264-ALLiANCE\silent.hill.revelation.2012.720p.bluray.x264-alliance.mkv" };

            _movie = new Movie();

            _localMovie = new LocalMovie() { Movie = _movie, Path = @"D:\Movies\Silent.Hill.Revelation.2012.720p.BluRay.x264-ALLiANCE\silent.hill.revelation.2012.720p.bluray.x264-alliance.mkv" };

            Mocker.GetMock<IMovieParsingService>()
                .Setup(x => x.GetMovieFromPath(It.IsAny<string>(),It.IsAny<Movie>())).Returns(_localMovie);

            Mocker.GetMock<IMediaFileService>()
                .Setup(c => c.FilterExistingFiles(_videoFiles, It.IsAny<int>())).Returns(_videoFiles);
        }

        private void GivenSpecifications(params Mock<IImportMovieDecisionEngineSpecification>[] mocks)
        {
            Mocker.SetConstant<IEnumerable<IRejectWithReason>>(mocks.Select(c => c.Object));
        }

        [Test]
        public void should_call_all_specifications()
        {
            GivenSpecifications(_pass1, _pass2, _pass3, _fail1, _fail2, _fail3);

            Subject.GetImportDecisions(_videoFiles, new Movie());

            _fail1.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
            _fail2.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
            _fail3.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
            _pass1.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
            _pass2.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
            _pass3.Verify(c => c.IsSatisfiedBy(_localMovie), Times.Once());
        }

        [Test]
        public void should_return_rejected_if_single_specs_fail()
        {
            GivenSpecifications(_fail1);

            var result = Subject.GetImportDecisions(_videoFiles, new Movie());

            result.Single().Approved.Should().BeFalse();
        }

        [Test]
        public void should_return_rejected_if_one_of_specs_fail()
        {
            GivenSpecifications(_pass1, _fail1, _pass2, _pass3);

            var result = Subject.GetImportDecisions(_videoFiles, new Movie());

            result.Single().Approved.Should().BeFalse();
        }

        [Test]
        public void should_return_pass_if_all_specs_pass()
        {
            GivenSpecifications(_pass1, _pass2, _pass3);

            var result = Subject.GetImportDecisions(_videoFiles, new Movie());

            result.Single().Approved.Should().BeTrue();
        }

        [Test]
        public void should_have_same_number_of_rejections_as_specs_that_failed()
        {
            GivenSpecifications(_pass1, _pass2, _pass3, _fail1, _fail2, _fail3);

            var result = Subject.GetImportDecisions(_videoFiles, new Movie());
            result.Single().Rejections.Should().HaveCount(3);
        }

        [Test]
        public void failed_parse_shouldnt_blowup_the_process()
        {
            GivenSpecifications(_pass1);

            Mocker.GetMock<IMovieParsingService>().Setup(x => x.GetMovieFromPath(It.IsAny<string>(), It.IsAny<Movie>())).Throws<TestException>();

            _videoFiles = new List<string>()
            {
                 "silent.hill.revelation.2012.720p.bluray.x264-alliance.mkv"
            };

            Mocker.GetMock<IMediaFileService>()
                .Setup(x => x.FilterExistingFiles(_videoFiles, It.IsAny<int>()))
                .Returns(_videoFiles);

            Subject.GetImportDecisions(_videoFiles, new Movie());

            Mocker.GetMock<IMovieParsingService>()
                .Verify(x => x.GetMovieFromPath(It.IsAny<string>(), It.IsAny<Movie>()), Times.Exactly(_videoFiles.Count));

            ExceptionVerification.ExpectedErrors(1);
        }

    }
}