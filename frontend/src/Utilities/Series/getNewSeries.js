import getMonitoringOptions from 'Utilities/Series/getMonitoringOptions';

function getNewSeries(series, payload) {
  const {
    rootFolder,
    monitor,
    qualityProfileId,
    seriesType,
    seasonFolder,
    tags,
    searchForMissingEpisodes = false
  } = payload;

  const {
    seasons,
    options: addOptions
  } = getMonitoringOptions(series.seasons, monitor);

  addOptions.searchForMissingEpisodes = searchForMissingEpisodes;
  series.addOptions = addOptions;
  series.seasons = seasons;
  series.monitored = true;
  series.qualityProfileId = qualityProfileId;
  series.rootFolderPath = rootFolder;
  series.seriesType = seriesType;
  series.seasonFolder = seasonFolder;
  series.tags = tags;

  return series;
}

export default getNewSeries;
