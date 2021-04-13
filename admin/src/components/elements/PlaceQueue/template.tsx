import { Place } from '../../../lib/Place';
import { Prefecture } from '../../../lib/Prefecture';
import { User } from '../../../lib/User';
import {
  placeTypeLabel,
  userRoleType,
  placeQueueLabel,
  placeQueueStatusType,
  placeQueueColor
} from '../../../utils/constraints';
import {
  PlaceQueueItem,
  PlaceQueueWrapper,
  PlaceQueueCard,
  PlaceQueueItemAvatar,
  PlaceQueueItemContent,
  ModalQueue,
  QueueButton,
  QueueTag
} from './styles';
import { Typography, Modal, Tag, Space, Form, Col } from 'antd';
import { PersonPin } from '../../ui/Icons';
import Button from '../../ui/Button';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export type PlaceQueueProps = {
  userRole: userRoleType;
  prefecture: Prefecture;
  loading: boolean;
  placeQueueUpdate: (placeId: string, prefectureId: string, status: placeQueueStatusType) => Promise<void>;
  placeStatusUpdate: (place: Place, status: boolean) => void;
  places: Place[];
  user: User;
};

/**
 * PlaceQueueTemplate
 */
const PlaceQueueTemplate: React.FC<PlaceQueueProps> = ({
  prefecture,
  places,
  placeStatusUpdate,
  loading,
  placeQueueUpdate
}) => {
  const [modalOpen, setModalOpen] = React.useState<{ open: boolean; placeId: string; prefectureId: string }>({
    open: false,
    prefectureId: undefined,
    placeId: undefined
  });

  /**
   * handleCloseModal
   */
  const handleCloseModal = () => {
    setModalOpen({ open: false, placeId: undefined, prefectureId: undefined });
  };

  /**
   * confirmModal
   */
  const confirmModal = (place: Place) => {
    Modal.confirm({
      title: `Confirmar ${place.open ? 'fechamento' : 'abertura'} do local`,
      content: (
        <>
          {`Deseja realmente ${place.open ? 'fechar' : 'abrir'} este ponto de vacinação agora ? `}
          <strong>{place.title}</strong>
        </>
      ),
      okText: 'Sim',
      cancelText: 'Não',
      /**
       * onOk
       */
      onOk: () => placeStatusUpdate(place, !place.open)
    });
  };

  /**
   * onSubmitForm
   */
  const onSubmitForm = async (value: placeQueueStatusType) => {
    await placeQueueUpdate(modalOpen.placeId, modalOpen.prefectureId, value);
    handleCloseModal();
  };

  return (
    <PlaceQueueWrapper>
      <PlaceQueueCard>
        <h1>{`Prefeitura de ${prefecture?.name}`}</h1>
        {places.map((place) => {
          const formattedDate = new Date(place.queueUpdatedAt?.seconds * 1000);
          const haveWarning = dayjs(formattedDate).add(15, 'minutes').isBefore(dayjs());
          return (
            <PlaceQueueItem warning={haveWarning} key={place.id}>
              <PlaceQueueItemAvatar xs={24} sm={24} md={4} lg={2} color={placeQueueColor[place.queueStatus]}>
                <PersonPin style={{ marginTop: 6 }} />
                <p>{placeTypeLabel[place.type]}</p>
              </PlaceQueueItemAvatar>
              <Col xs={24} sm={24} md={13} lg={17}>
                <Space wrap align="start">
                  <PlaceQueueItemContent>
                    <div>
                      <Typography.Title level={3}>{place.title}</Typography.Title>
                    </div>
                    {place.open && (
                      <QueueTag color={placeQueueColor[place.queueStatus]}>
                        {placeQueueLabel[place.queueStatus]}
                      </QueueTag>
                    )}
                  </PlaceQueueItemContent>
                  <div className="queue-tags" style={{ paddingTop: 6 }}>
                    <Tag color={place.open ? 'success' : 'default'}>{place.open ? 'ABERTO' : 'FECHADO'}</Tag>
                    {!!(place.open && place.queueUpdatedAt) && (
                      <Tag color={haveWarning ? 'error' : 'default'}>{`Última atualização incluída ${dayjs(
                        formattedDate
                      ).fromNow()}`}</Tag>
                    )}
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={24} md={6} lg={4} style={{ justifyContent: 'flex-end' }}>
                <Space className="queue-action" direction="vertical" align="end">
                  <Button type={place.open ? 'default' : 'primary'} onClick={() => confirmModal(place)}>
                    {place.open ? 'Fechar ponto de vacinação' : 'Abrir ponto de vacinação'}
                  </Button>
                  <Button
                    disabled={!place.open}
                    type="primary"
                    onClick={() => setModalOpen({ open: true, placeId: place.id, prefectureId: place.prefectureId })}
                  >
                    Atualizar fila
                  </Button>
                </Space>
              </Col>
            </PlaceQueueItem>
          );
        })}
      </PlaceQueueCard>
      <ModalQueue
        title="Alterar estado da fila"
        destroyOnClose
        visible={modalOpen.open}
        footer={null}
        onCancel={handleCloseModal}
      >
        <Form layout="vertical" size="large" onFinish={onSubmitForm}>
          <Space style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }} wrap direction="vertical">
            {Object.keys(placeQueueLabel).map((option: placeQueueStatusType) => (
              <QueueButton
                disabled={loading}
                key={option}
                color={placeQueueColor[option]}
                onClick={() => onSubmitForm(option)}
              >
                {loading && <LoadingOutlined spin style={{ marginRight: 8 }} />}
                {placeQueueLabel[option]}
              </QueueButton>
            ))}
          </Space>
        </Form>
      </ModalQueue>
    </PlaceQueueWrapper>
  );
};

export default PlaceQueueTemplate;
