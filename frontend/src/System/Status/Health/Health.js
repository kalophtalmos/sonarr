import React, { Component, PropTypes } from 'react';
import titleCase from 'Utilities/String/titleCase';
import { icons, kinds } from 'Helpers/Props';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import FieldSet from 'Components/FieldSet';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import styles from './Health.css';

function getInternalLink(source) {
  switch (source) {
    case 'IndexerCheck':
      return (
        <Link to="/settings/indexers">
          Settings
        </Link>
      );
    case 'DownloadClientCheck':
    case 'DroneFactoryCheck':
    case 'ImportMechanismCheck':
      return (
        <Link to="/settings/downloadclients">
          Settings
        </Link>
      );
    case 'RootFolderCheck':
      return (
        <Link to="/add/import">
          Manage Root Folders
        </Link>
      );
    case 'UpdateCheck':
      return (
        <Link to="/system/updates">
          Updates
        </Link>
      );
    default:
      return;
  }
}

const columns = [
  {
    className: styles.status,
    name: 'type',
    isVisible: true
  },
  {
    name: 'message',
    label: 'Message',
    isVisible: true
  },
  {
    name: 'wikiLink',
    label: 'Wiki',
    isVisible: true
  },
  {
    name: 'internalLink',
    isVisible: true
  }
];

class Health extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      items
    } = this.props;

    const healthOk = !isFetching && items.length === 0;
    const healthIssues = !isFetching && !!items.length;

    return (
      <FieldSet
        legend="Health"
      >
        {
          isFetching &&
            <LoadingIndicator />
        }

        {
          healthOk &&
            <div className={styles.healthOk}>
              No issues with your configuration
            </div>
        }

        {
          healthIssues &&
            <Table
              columns={columns}
            >
              <TableBody>
                {
                  items.map((item) => {
                    const internalLink = getInternalLink(item.source);

                    return (
                      <TableRow key={`health${item.message}`}>
                        <TableRowCell>
                          <Icon
                            name={icons.DANGER}
                            kind={item.type.toLowerCase() === 'error' ? kinds.DANGER : kinds.WARNING}
                            title={titleCase(item.type)}
                          />
                        </TableRowCell>

                        <TableRowCell>{item.message}</TableRowCell>

                        <TableRowCell>
                          <Link
                            to={item.wikiUrl}
                            title="Read the Wiki for more information"
                          >
                            Wiki
                          </Link>
                        </TableRowCell>

                        <TableRowCell>
                          {
                            internalLink
                          }
                        </TableRowCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
        }
      </FieldSet>
    );
  }

}

Health.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
};

export default Health;
