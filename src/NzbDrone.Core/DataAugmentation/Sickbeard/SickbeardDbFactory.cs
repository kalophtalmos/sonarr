using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using Marr.Data;
using Marr.Data.Mapping;
using NzbDrone.Common.Disk;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Core.DataAugmentation.Sickbeard.Model;
using NzbDrone.Core.Datastore;

namespace NzbDrone.Core.DataAugmentation.Sickbeard
{
    public interface ISickbeardDbFactory
    {
        bool DatabaseExists { get; }
        IDatabase Open();
    }

    public class SickbeardDbFactory : ISickbeardDbFactory
    {
        private readonly IAppFolderInfo _appFolderInfo;
        private readonly IDiskProvider _diskProvider;

        static SickbeardDbFactory()
        {
            var mapper = new FluentMappings(true);

            mapper.Entity<tv_show>()
                .Table.MapTable("tv_shows")
                .Columns.AutoMapAllProperties();
            mapper.Entity<tv_episode>()
                .Table.MapTable("tv_episodes")
                .Columns.AutoMapAllProperties();
        }

        public SickbeardDbFactory(IAppFolderInfo appFolderInfo, IDiskProvider diskProvider)
        {
            _appFolderInfo = appFolderInfo;
            _diskProvider = diskProvider;
        }

        private static string GetConnectionString(string dbPath)
        {
            var connectionBuilder = new SQLiteConnectionStringBuilder();

            connectionBuilder.DataSource = dbPath;
            connectionBuilder.DateTimeKind = DateTimeKind.Utc;
            connectionBuilder.ReadOnly = true;

            return connectionBuilder.ConnectionString;
        }

        private string GetDbPath()
        {
            return Path.Combine(_appFolderInfo.AppDataFolder, "sickbeard.db");

        }

        public bool DatabaseExists
        {
            get
            {
                return _diskProvider.FileExists(GetDbPath());
            }
        }

        public IDatabase Open()
        {
            var dbPath = GetDbPath();

            var db = new Database(() =>
            {
                var dataMapper = new DataMapper(SQLiteFactory.Instance, GetConnectionString(dbPath))
                {
                    SqlMode = SqlModes.Text,
                };

                return dataMapper;
            });

            return db;
        }
    }
}
