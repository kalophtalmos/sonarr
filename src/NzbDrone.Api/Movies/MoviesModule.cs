using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FluentValidation;
using NzbDrone.Api.Mapping;
using NzbDrone.Api.Validation;
using NzbDrone.Core.MediaCover;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Validation.Paths;

namespace NzbDrone.Api.Movies
{
    public class MoviesModule : NzbDroneRestModule<MoviesResource>
    {
        private readonly IMovieService _movieService;
        private readonly IMapCoversToLocal _coverMapper;

        public MoviesModule(IMovieService movieService, IMapCoversToLocal coverMapper):base("/Movies")
        {
            _movieService = movieService;
            _coverMapper = coverMapper;
            GetResourceAll = GetAllMovies;
            GetResourceById = GetMovie;
            CreateResource = AddMovie;
            UpdateResource = UpdateMovie;
            DeleteResource = DeleteMovie;

            SharedValidator.RuleFor(s => s.QualityProfileId).ValidId();

            PutValidator.RuleFor(s => s.Path).IsValidPath();

            PostValidator.RuleFor(s => s.Path).IsValidPath().When(s => String.IsNullOrEmpty(s.RootFolderPath));
            PostValidator.RuleFor(s => s.RootFolderPath).IsValidPath().When(s => String.IsNullOrEmpty(s.Path));
            PostValidator.RuleFor(s => s.Title).NotEmpty();
        }

        private void DeleteMovie(int id)
        {
            var deleteFiles = false;
            var deleteFilesQuery = Request.Query.deleteFiles;

            if (deleteFilesQuery.HasValue)
            {
                deleteFiles = Convert.ToBoolean(deleteFilesQuery.Value);
            }
            _movieService.DeleteMove(id,deleteFiles);
        }

        private void UpdateMovie(MoviesResource moviesResource)
        {
            GetNewId<Core.Movies.Movie>(_movieService.UpdateMovie, moviesResource);
        }

        private int AddMovie(MoviesResource moviesResource)
        {
            return GetNewId<Core.Movies.Movie>(_movieService.AddMovie, moviesResource);
        }

        private MoviesResource GetMovie(int id)
        {
            var movie = _movieService.GetMovie(id);
            return GetMovieResource(movie);
        }

        private MoviesResource GetMovieResource(Movie movie)
        {
            if (movie == null) return null;
            var resource = movie.InjectTo<MoviesResource>();
            MapCoversToLocal(resource);

            return resource;
        }

        private void MapCoversToLocal(params MoviesResource[] resource)
        {
            foreach (var moviesResource in resource)
            {
                _coverMapper.ConvertToLocalUrls(moviesResource.Id,moviesResource.Images);
            }
        }

        private List<MoviesResource> GetAllMovies()
        {
            var movieResources = ToListResource(_movieService.GetAllMovies);

            MapCoversToLocal(movieResources.ToArray());

            return movieResources;
        }
    }
}
