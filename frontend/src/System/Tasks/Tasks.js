import React, { Component, PropTypes } from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TaskRowConnector from './TaskRowConnector';

const columns = [
  {
    name: 'name',
    label: 'Name',
    isVisible: true
  },
  {
    name: 'interval',
    label: 'Interval',
    isVisible: true
  },
  {
    name: 'lastExecution',
    label: 'Last Execution',
    isVisible: true
  },
  {
    name: 'nextExecution',
    label: 'Next Execution',
    isVisible: true
  },
  {
    name: 'actions',
    isVisible: true
  }
];

class Tasks extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      items
    } = this.props;

    return (
      <PageContent title="Tasks">
        <PageContentBody>
          {
            isFetching &&
              <LoadingIndicator />
          }

          {
            !isFetching &&
              <Table
                columns={columns}
              >
                <TableBody>
                  {
                    items.map((item) => {
                      return (
                        <TaskRowConnector
                          key={item.id}
                          {...item}
                        />
                      );
                    })
                  }
                </TableBody>
              </Table>
          }
        </PageContentBody>
      </PageContent>
    );
  }

}

Tasks.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
};

export default Tasks;
