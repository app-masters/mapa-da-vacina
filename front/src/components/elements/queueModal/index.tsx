import React from 'react';
import QueueModalTemplate, { QueueModalProps } from './template';

/**
 * QueueModal
 */
const QueueModal: React.FC<QueueModalProps> = (props) => {
  return <QueueModalTemplate {...props} />;
};

export default QueueModal;
