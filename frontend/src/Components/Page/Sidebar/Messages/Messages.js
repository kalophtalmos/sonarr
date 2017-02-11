import React, { PropTypes } from 'react';
import MessageConnector from './MessageConnector';
import styles from './Messages.css';

function Messages({ messages }) {
  return (
    <div className={styles.messages}>
      {
        messages.map((message) => {
          return (
            <MessageConnector
              key={message.id}
              {...message}
            />
          );
        })
      }
    </div>
  );
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Messages;
