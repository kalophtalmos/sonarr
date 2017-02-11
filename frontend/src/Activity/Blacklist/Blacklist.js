import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import BlacklistRowConnector from './BlacklistRowConnector';

class Blacklist extends Component {

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
      isClearingBlacklistExecuting,
      onClearBlacklistPress,
      ...otherProps
    } = this.props;

    return (
      <PageContent title="Blacklist">
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.CLEAR}
              title="Clear Blacklist"
              isSpinning={isClearingBlacklistExecuting}
              onPress={onClearBlacklistPress}
            />
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            isFetching && !isPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetching && !!error &&
              <div>Unable to load blacklist</div>
          }

          {
            isPopulated && !error && !items.length &&
              <div>
                No history blacklist
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
                          <BlacklistRowConnector
                            key={item.id}
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

Blacklist.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalRecords: PropTypes.number,
  isClearingBlacklistExecuting: PropTypes.bool.isRequired,
  onClearBlacklistPress: PropTypes.func.isRequired
};

export default Blacklist;
