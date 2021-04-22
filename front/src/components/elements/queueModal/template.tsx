import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { placeQueueColor, placeQueueLabel, placeQueueStatusType, placeQueueHelp } from '../../../utils/constraints';
import { ModalQueue, ModalQueueContent, QueueButton } from './styles';

export type QueueModalProps = {
  open: boolean;
  loading?: boolean;
  handleCloseModal: () => void;
  onSubmitForm: (option: placeQueueStatusType) => void;
};

const statusToIgnore = ['closed', 'open'];

/**
 * QueueModal
 */
const QueueModal: React.FC<QueueModalProps> = ({ open, loading, handleCloseModal, onSubmitForm }) => {
  const [clickedOption, setClickedOption] = React.useState<string>(undefined);
  return (
    <ModalQueue title="Tamanho da fila" destroyOnClose visible={open} footer={null} onCancel={handleCloseModal}>
      <div className="info">
        A ferramenta irá comparar sua informação com as de outros usuários, para determinar qual tamanho será mantido.
      </div>
      <ModalQueueContent wrap direction="vertical">
        {Object.keys(placeQueueLabel).map((option: placeQueueStatusType) => {
          if (statusToIgnore.includes(option)) return;
          return (
            <QueueButton
              disabled={loading && clickedOption === option}
              key={option}
              color={placeQueueColor[option]}
              onClick={() => {
                if (!loading) {
                  setClickedOption(option);
                  onSubmitForm(option);
                }
              }}
            >
              <div>
                {loading && clickedOption === option && <LoadingOutlined spin style={{ marginRight: 8 }} />}
                {placeQueueLabel[option]}
              </div>
              <p>{placeQueueHelp[option]}</p>
            </QueueButton>
          );
        })}
      </ModalQueueContent>
    </ModalQueue>
  );
};

export default QueueModal;
