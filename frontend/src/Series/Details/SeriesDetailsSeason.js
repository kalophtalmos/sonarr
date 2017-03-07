import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import isAfter from 'Utilities/Date/isAfter';
import isBefore from 'Utilities/Date/isBefore';
import getToggledRange from 'Utilities/Table/getToggledRange';
import { align, icons, kinds, sizes } from 'Helpers/Props';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import SpinnerIcon from 'Components/SpinnerIcon';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import MenuItem from 'Components/Menu/MenuItem';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import EpisodeFileEditorModal from 'EpisodeFile/Editor/EpisodeFileEditorModal';
import OrganizePreviewModalConnector from 'Organize/OrganizePreviewModalConnector';
import EpisodeRowConnector from './EpisodeRowConnector';
import styles from './SeriesDetailsSeason.css';

function getSeasonStatistics(episodes) {
  let episodeCount = 0;
  let episodeFileCount = 0;
  let totalEpisodeCount = 0;

  episodes.forEach((episode) => {
    if (episode.episodeFileId || (episode.monitored && isBefore(episode.airDateUtc))) {
      episodeCount ++;
    }

    if (episode.episodeFileId) {
      episodeFileCount++;
    }

    totalEpisodeCount++;
  });

  return {
    episodeCount,
    episodeFileCount,
    totalEpisodeCount
  };
}

function getEpisodeCountKind(monitored, episodeFileCount, episodeCount) {
  if (episodeFileCount === episodeCount && episodeCount > 0) {
    return kinds.SUCCESS;
  }

  if (!monitored) {
    return kinds.WARNING;
  }

  return kinds.DANGER;
}

class SeriesDetailsSeason extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOrganizeModalOpen: false,
      isManageEpisodesOpen: false,
      lastToggledEpisode: null
    };
  }

  componentWillMount() {
    const {
      seasonNumber,
      onExpandPress,
      items
    } = this.props;

    const expand = _.some(items, (item) => {
      return isAfter(item.airDateUtc) ||
             isAfter(item.airDateUtc, { days: -30 });
    });

    onExpandPress(seasonNumber, expand && seasonNumber > 0);
  }

  //
  // Listeners

  onOrganizePress = () => {
    this.setState({ isOrganizeModalOpen: true });
  }

  onOrganizeModalClose = () => {
    this.setState({ isOrganizeModalOpen: false });
  }

  onManageEpisodesPress = () => {
    this.setState({ isManageEpisodesOpen: true });
  }

  onManageEpisodesModalClose = () => {
    this.setState({ isManageEpisodesOpen: false });
  }

  onExpandPress = () => {
    const {
      seasonNumber,
      isExpanded
    } = this.props;

    this.props.onExpandPress(seasonNumber, !isExpanded);
  }

  onMonitorEpisodePress = (episodeId, monitored, { shiftKey }) => {
    const lastToggled = this.state.lastToggledEpisode;
    const episodeIds = [episodeId];

    if (shiftKey && lastToggled) {
      const { lower, upper } = getToggledRange(this.props.items, episodeId, lastToggled);
      const items = this.props.items;

      for (let i = lower; i < upper; i++) {
        episodeIds.push(items[i].id);
      }
    }

    this.setState({ lastToggledEpisode: episodeId });

    this.props.onMonitorEpisodePress(_.uniq(episodeIds), monitored);
  }

  //
  // Render

  render() {
    const {
      seriesId,
      monitored,
      seasonNumber,
      items,
      columns,
      isSaving,
      isExpanded,
      isSearching,
      seriesMonitored,
      isSmallScreen,
      onTableOptionChange,
      onMonitorSeasonPress,
      onSearchPress
    } = this.props;

    const {
      episodeCount,
      episodeFileCount,
      totalEpisodeCount
    } = getSeasonStatistics(items);

    const {
      isOrganizeModalOpen,
      isManageEpisodesOpen
    } = this.state;

    return (
      <div
        className={styles.season}
      >
        <div className={styles.header}>
          <div className={styles.left}>
            <MonitorToggleButton
              monitored={monitored}
              isDisabled={!seriesMonitored}
              isSaving={isSaving}
              size={24}
              onPress={onMonitorSeasonPress}
            />

            {
              seasonNumber === 0 ?
                <span className={styles.seasonNumber}>
                  Specials
                </span> :
                <span className={styles.seasonNumber}>
                  Season {seasonNumber}
                </span>
            }

            <Label
              title={`${totalEpisodeCount} episodes total. ${episodeFileCount} episodes with files.`}
              kind={getEpisodeCountKind(monitored, episodeFileCount, episodeCount)}
              size={sizes.LARGE}
            >
              {
                monitored || episodeFileCount ?
                  <span>{episodeFileCount} / {episodeCount}</span> :
                  <span>&nbsp;</span>
              }
            </Label>
          </div>

          <Link
            className={styles.expandButton}
            onPress={this.onExpandPress}
          >
            <Icon
              className={styles.expandButtonIcon}
              name={isExpanded ? icons.COLLAPSE : icons.EXPAND}
              title={isExpanded ? 'Hide episodes' : 'Show episodes'}
              size={24}
            />
            {
              !isSmallScreen &&
                <span>&nbsp;</span>
            }
          </Link>

          {
            isSmallScreen ?
              <Menu className={styles.actionsMenu}>
                <MenuButton>
                  <Icon
                    name={icons.ACTIONS}
                    size={22}
                  />
                </MenuButton>

                <MenuContent
                  className={styles.actionsMenuContent}
                  alignMenu={align.RIGHT}
                >
                  <MenuItem
                    onPress={onSearchPress}
                  >
                    <SpinnerIcon
                      className={styles.actionMenuIcon}
                      name={icons.SEARCH}
                      isSpinning={isSearching}
                    />

                    Search
                  </MenuItem>

                  <MenuItem
                    onPress={this.onOrganizePress}
                  >
                    <Icon
                      className={styles.actionMenuIcon}
                      name={icons.ORGANIZE}
                      isSpinning={isSearching}
                    />

                    Preview Rename
                  </MenuItem>

                  <MenuItem
                    onPress={this.onManageEpisodesPress}
                  >
                    <Icon
                      className={styles.actionMenuIcon}
                      name={icons.EPISODE_FILE}
                      isSpinning={isSearching}
                    />

                    Manage Episodes
                  </MenuItem>
                </MenuContent>
              </Menu> :

              <div className={styles.actions}>
                <SpinnerIconButton
                  className={styles.actionButton}
                  name={icons.SEARCH}
                  title="Search for monitored episodes in this seasons"
                  size={24}
                  isSpinning={isSearching}
                  onPress={onSearchPress}
                />

                <IconButton
                  className={styles.actionButton}
                  name={icons.ORGANIZE}
                  title="Preview rename for this season"
                  size={24}
                  onPress={this.onOrganizePress}
                />

                <IconButton
                  className={styles.actionButton}
                  name={icons.EPISODE_FILE}
                  title="Manage episode files in this series"
                  size={24}
                  onPress={this.onManageEpisodesPress}
                />
              </div>
          }

        </div>

        <div>
          {
            isExpanded &&
              <div className={styles.episodes}>
                {
                  !!items.length &&
                    <Table
                      columns={columns}
                      onTableOptionChange={onTableOptionChange}
                    >
                      <TableBody>
                        {
                          items.map((item) => {
                            return (
                              <EpisodeRowConnector
                                key={item.id}
                                columns={columns}
                                {...item}
                                onMonitorEpisodePress={this.onMonitorEpisodePress}
                              />
                            );
                          })
                        }
                      </TableBody>
                    </Table>
                }
                <div className={styles.collapseButtonContainer}>
                  <IconButton
                    name={icons.COLLAPSE}
                    size={20}
                    title="Hide episodes"
                    onPress={this.onExpandPress}
                  />
                </div>
              </div>
          }
        </div>

        <OrganizePreviewModalConnector
          isOpen={isOrganizeModalOpen}
          seriesId={seriesId}
          seasonNumber={seasonNumber}
          onModalClose={this.onOrganizeModalClose}
        />

        <EpisodeFileEditorModal
          isOpen={isManageEpisodesOpen}
          seriesId={seriesId}
          seasonNumber={seasonNumber}
          onModalClose={this.onManageEpisodesModalClose}
        />
      </div>
    );
  }
}

SeriesDetailsSeason.propTypes = {
  seriesId: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSaving: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isSearching: PropTypes.bool.isRequired,
  seriesMonitored: PropTypes.bool.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  onTableOptionChange: PropTypes.func.isRequired,
  onMonitorSeasonPress: PropTypes.func.isRequired,
  onExpandPress: PropTypes.func.isRequired,
  onMonitorEpisodePress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

export default SeriesDetailsSeason;
