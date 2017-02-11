import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import episodeEntities from 'Episode/episodeEntities';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import QueueRowConnector from './QueueRowConnector';

class Queue extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      columns,
      totalRecords,
      onRefreshPress,
      ...otherProps
    } = this.props;

    return (
      <PageContent title="Queue">
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              title="Refresh"
              isSpinning={isFetching}
              onPress={onRefreshPress}
            />
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            isFetching && !isPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetching && error &&
              <div>
                Failed to load Queue
              </div>
          }

          {
            isPopulated && !error && !items.length &&
              <div>
                Queue is empty
              </div>
          }

          {
            isPopulated && !error && !!items.length &&
              <div>
                <Table
                  columns={columns}
                  {...otherProps}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <QueueRowConnector
                            key={item.id}
                            episodeId={item.episode.id}
                            episodeEntity={episodeEntities.QUEUE_EPISODES}
                            columns={columns}
                            {...item}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>

                <TablePager
                  totalRecords={totalRecords}
                  isFetching={isFetching}
                  {...otherProps}
                />
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

Queue.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalRecords: PropTypes.number,
  onRefreshPress: PropTypes.func.isRequired
};

export default Queue;
