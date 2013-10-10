using FluentMigrator;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(47)]
    public class add_movies : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            Create.TableForModel("Movie").
                   WithColumn("ImdbId").AsString().Unique()
                  .WithColumn("Title").AsString()
                  .WithColumn("TitleSlug").AsString()
                  .WithColumn("CleanTitle").AsString().Unique()
                  .WithColumn("Year").AsInt32()
                  .WithColumn("Runtime").AsInt32()
                  .WithColumn("TmdbId").AsInt32().Unique()
                  .WithColumn("Overview").AsString()
                  .WithColumn("TagLine").AsString().Nullable()
                  .WithColumn("Images").AsString()
                  .WithColumn("LastInfoSync").AsDateTime().Nullable()
                  .WithColumn("Path").AsString()
                  .WithColumn("QualityProfileId").AsInt32();

            Create.TableForModel("MovieFile")
                  .WithColumn("MovieId").AsInt32()
                  .WithColumn("Path").AsString()
                  .WithColumn("SceneName").AsString().Nullable()
                  .WithColumn("ReleaseGroup").AsString().Nullable()
                  .WithColumn("Quality").AsString()
                  .WithColumn("Size").AsInt64()
                  .WithColumn("DateAdded").AsDateTime();
        }
    }
}
