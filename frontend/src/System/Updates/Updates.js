import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { kinds } from 'Helpers/Props';
import formatDate from 'Utilities/Date/formatDate';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import UpdateChanges from './UpdateChanges';
import styles from './Updates.css';

class Updates extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      items,
      shortDateFormat,
      onInstallLatestPress
    } = this.props;

    const hasUpdates = !isFetching && items.length > 0;
    const noUpdates = !isFetching && !items.length;
    const hasUpdateToInstall = hasUpdates && _.some(items, { installable: true, latest: true });
    const noUpdateToInstall = hasUpdates && !hasUpdateToInstall;

    return (
      <PageContent title="Updates">
        <PageContentBody>
          {
            isFetching &&
              <LoadingIndicator />
          }

          {
            noUpdates &&
              <div>No updates are available</div>
          }

          {
            hasUpdateToInstall &&
              <Button
                kind={kinds.PRIMARY}
                className={styles.updateAvailable}
                onPress={onInstallLatestPress}
              >
                Install Latest
              </Button>
          }

          {
            noUpdateToInstall &&
              <div className={styles.upToDate}>
                <Icon
                  className={styles.upToDateIcon}
                  name="fa fa-check-circle"
                  size={30}
                />
                <div className={styles.upToDateMessage}>
                  The latest version of Sonarr is already installed
                </div>
              </div>
          }

          {
            hasUpdates &&
              <div>
                {
                  items.map((update) => {
                    const hasChanges = !!update.changes;

                    return (
                      <div
                        key={update.version}
                        className={styles.update}
                      >
                        <div className={styles.info}>
                          <div className={styles.version}>{update.version}</div>
                          <div className={styles.space}>&mdash;</div>
                          <div className={styles.date}>{formatDate(update.releaseDate, shortDateFormat)}</div>

                          {
                            update.branch !== 'master' &&
                              <Label
                                className={styles.branch}
                              >
                                {update.branch}
                              </Label>
                          }
                        </div>

                        {
                          !hasChanges &&
                            <div>Maintenance release</div>
                        }

                        {
                          hasChanges &&
                            <div className={styles.changes}>
                              <UpdateChanges
                                title="New"
                                changes={update.changes.new}
                              />

                              <UpdateChanges
                                title="Fixed"
                                changes={update.changes.fixed}
                              />
                            </div>
                        }
                      </div>
                    );
                  })
                }
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }

}

Updates.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  onInstallLatestPress: PropTypes.func.isRequired
};

export default Updates;
