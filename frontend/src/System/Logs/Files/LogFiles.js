import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import TableBody from 'Components/Table/TableBody';
import LogsNavMenu from '../LogsNavMenu';
import LogFilesTableRow from './LogFilesTableRow';

const columns = [
  {
    name: 'filename',
    label: 'Filename',
    isVisible: true
  },
  {
    name: 'lastWriteTime',
    label: 'Last Write Time',
    isVisible: true
  },
  {
    name: 'download',
    isVisible: true
  }
];

class LogFiles extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      items,
      deleteFilesExecuting,
      currentLogView,
      onRefreshPress,
      onDeleteFilesPress,
      ...otherProps
    } = this.props;

    return (
      <PageContent title="Log Files">
        <PageToolbar>
          <PageToolbarSection>
            <LogsNavMenu current={currentLogView} />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.REFRESH}
              spinningName={icons.REFRESH}
              isSpinning={isFetching}
              onPress={onRefreshPress}
            />

            <PageToolbarButton
              iconName={icons.CLEAR}
              isSpinning={deleteFilesExecuting}
              onPress={onDeleteFilesPress}
            />
          </PageToolbarSection>
        </PageToolbar>
        <PageContentBody>
          {
            isFetching &&
              <LoadingIndicator />
          }

          {
            !isFetching &&
              <div>
                <Table
                  columns={columns}
                  {...otherProps}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <LogFilesTableRow
                            key={item.id}
                            {...item}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }

}

LogFiles.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  deleteFilesExecuting: PropTypes.bool.isRequired,
  currentLogView: PropTypes.string.isRequired,
  onRefreshPress: PropTypes.func.isRequired,
  onDeleteFilesPress: PropTypes.func.isRequired
};

export default LogFiles;
