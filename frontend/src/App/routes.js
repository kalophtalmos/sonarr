import React from 'react';
import { Route, IndexRoute } from 'react-router';
import NotFound from 'Components/NotFound';
import PageConnector from 'Components/Page/PageConnector';
import SeriesIndexConnector from 'Series/Index/SeriesIndexConnector';
import AddNewSeriesConnector from 'AddSeries/AddNewSeries/AddNewSeriesConnector';
import ImportSeriesSelectFolderConnector from 'AddSeries/ImportSeries/SelectFolder/ImportSeriesSelectFolderConnector';
import ImportSeriesConnector from 'AddSeries/ImportSeries/Import/ImportSeriesConnector';
import SeriesEditorConnector from 'Series/Editor/SeriesEditorConnector';
import SeasonPassConnector from 'SeasonPass/SeasonPassConnector';
import SeriesDetailsPageConnector from 'Series/Details/SeriesDetailsPageConnector';
import CalendarPageConnector from 'Calendar/CalendarPageConnector';
import HistoryConnector from 'Activity/History/HistoryConnector';
import QueueConnector from 'Activity/Queue/QueueConnector';
import BlacklistConnector from 'Activity/Blacklist/BlacklistConnector';
import MissingConnector from 'Wanted/Missing/MissingConnector';
import CutoffUnmetConnector from 'Wanted/CutoffUnmet/CutoffUnmetConnector';
import UISettingsConnector from 'Settings/UI/UISettingsConnector';
import MediaManagementConnector from 'Settings/MediaManagement/MediaManagementConnector';
import Profiles from 'Settings/Profiles/Profiles';
import Quality from 'Settings/Quality/Quality';
import IndexerSettings from 'Settings/Indexers/IndexerSettings';
import DownloadClientSettings from 'Settings/DownloadClients/DownloadClientSettings';
import NotificationSettings from 'Settings/Notifications/NotificationSettings';
import MetadataSettings from 'Settings/Metadata/MetadataSettings';
import GeneralSettingsConnector from 'Settings/General/GeneralSettingsConnector';
import Status from 'System/Status/Status';
import TasksConnector from 'System/Tasks/TasksConnector';
import BackupsConnector from 'System/Backup/BackupsConnector';
import UpdatesConnector from 'System/Updates/UpdatesConnector';
import LogsTableConnector from 'System/Logs/Table/LogsTableConnector';
import LogFilesConnector from 'System/Logs/Files/LogFilesConnector';
import UpdateLogFilesConnector from 'System/Logs/Updates/UpdateLogFilesConnector';

function getPath(path) {
  return `${window.Sonarr.urlBase}${path}`;
}

// TODO: share routes and sidebar links if we can.
// This will require some flattening of the sidebar
// link hierarchy to fit into routes
// Leaving for later to make sure the idea still makes sense

const routes = (
  <Route
    path={getPath('/')}
    component={PageConnector}
  >
    {/*
      Series
    */}
    <IndexRoute component={SeriesIndexConnector} />

    <Route
      path={getPath('/add/new')}
      component={AddNewSeriesConnector}
    />

    <Route path={getPath('/add/import')} >
      <IndexRoute component={ImportSeriesSelectFolderConnector} />

      <Route
        path={getPath('/add/import/:rootFolderId')}
        component={ImportSeriesConnector}
      />
    </Route>

    <Route
      path={getPath('/serieseditor')}
      component={SeriesEditorConnector}
    />

    <Route
      path={getPath('/seasonpass')}
      component={SeasonPassConnector}
    />

    <Route
      path={getPath('/series/:titleSlug')}
      component={SeriesDetailsPageConnector}
    />

    {/*
      Calendar
    */}

    <Route
      path={getPath('/calendar')}
      component={CalendarPageConnector}
    />

    {/*
      Activity
    */}

    <Route
      path={getPath('/activity/history')}
      component={HistoryConnector}
    />

    <Route
      path={getPath('/activity/queue')}
      component={QueueConnector}
    />

    <Route
      path={getPath('/activity/blacklist')}
      component={BlacklistConnector}
    />

    {/*
      Wanted
    */}

    <Route
      path={getPath('/wanted/missing')}
      component={MissingConnector}
    />

    <Route
      path={getPath('/wanted/cutoffunmet')}
      component={CutoffUnmetConnector}
    />

    {/*
      Wanted
    */}

    <Route
      path={getPath('/settings/ui')}
      component={UISettingsConnector}
    />

    <Route
      path={getPath('/settings/mediamanagement')}
      component={MediaManagementConnector}
    />

    <Route
      path={getPath('/settings/profiles')}
      component={Profiles}
    />

    <Route
      path={getPath('/settings/quality')}
      component={Quality}
    />

    <Route
      path={getPath('/settings/indexers')}
      component={IndexerSettings}
    />

    <Route
      path={getPath('/settings/downloadclients')}
      component={DownloadClientSettings}
    />

    <Route
      path={getPath('/settings/connect')}
      component={NotificationSettings}
    />

    <Route
      path={getPath('/settings/metadata')}
      component={MetadataSettings}
    />

    <Route
      path={getPath('/settings/general')}
      component={GeneralSettingsConnector}
    />

    {/*
      System
    */}

    <Route
      path={getPath('/system/status')}
      component={Status}
    />

    <Route
      path={getPath('/system/tasks')}
      component={TasksConnector}
    />

    <Route
      path={getPath('/system/backup')}
      component={BackupsConnector}
    />

    <Route
      path={getPath('/system/updates')}
      component={UpdatesConnector}
    />

    <Route path={getPath('/system/logs')}>
      <IndexRoute component={LogsTableConnector} />

      <Route
        path={getPath('/system/logs/files')}
        component={LogFilesConnector}
      />

      <Route
        path={getPath('/system/logs/updatefiles')}
        component={UpdateLogFilesConnector}
      />
    </Route>

    <Route
      path="*"
      component={NotFound}
    />
  </Route>
);

export default routes;
