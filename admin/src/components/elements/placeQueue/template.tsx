import { Place } from '../../../lib/Place';
import { Prefecture } from '../../../lib/Prefecture';
import { User } from '../../../lib/User';
import {
  placeTypeLabel,
  userRoleType,
  placeQueueLabel,
  placeQueueStatusType,
  placeQueueColor,
  placeQueueHelp
} from '../../../utils/constraints';
import {
  PlaceQueueItem,
  PlaceQueueWrapper,
  PlaceQueueCard,
  PlaceQueueItemAvatar,
  PlaceQueueItemContent,
  ModalQueue,
  QueueButton,
  QueueTag,
  ModalQueueContent
} from './styles';
import { Typography, Modal, Tag, Space, Col, Radio } from 'antd';
import { PersonPin } from '../../ui/Icons';
import Button from '../../ui/Button';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export type PlaceQueueProps = {
  userRole: userRoleType;
  prefecture: Prefecture;
  loading?: boolean;
  placeQueueUpdate?: (placeId: string, prefectureId: string, status: placeQueueStatusType) => Promise<void>;
  placeStatusUpdate?: (place: Place, status: boolean) => Promise<void>;
  places: Place[];
  user: User;
};

const minutesUntilWarning = process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING
  ? Number(process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING)
  : 15;
if (!process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING) {
  console.error(
    'Configuration for minutesUntilWarning not found on env (process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING), using default 15 minutes'
  );
}

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
  const [loadingPlace, setLoadingPlace] = React.useState<string>(undefined);
  const [filter, setFilter] = React.useState<string>('all');
  const [data, setData] = React.useState<Place[]>([]);
  const [modalOpen, setModalOpen] = React.useState<{
    open: boolean;
    placeId: string;
    prefectureId: string;
    clickedOption: string;
  }>({
    open: false,
    prefectureId: undefined,
    placeId: undefined,
    clickedOption: undefined
  });

  React.useEffect(() => {
    let list = places;
    if (filter !== 'all') {
      list = list.filter((f) => f.open);
    }
    setData(list);
  }, [filter, places]);

  /**
   * handleCloseModal
   */
  const handleCloseModal = () => {
    setModalOpen({ open: false, placeId: undefined, prefectureId: undefined, clickedOption: undefined });
  };

  /**
   * confirmModal
   */
  const confirmModal = async (place: Place) => {
    if (!place.open) {
      setLoadingPlace(place.id);
      await placeStatusUpdate(place, true);
      return;
    }
    Modal.confirm({
      title: `Confirmar fechamento do local`,
      content: (
        <>
          {`Deseja realmente fechar este ponto de vacinação agora ? `}
          <strong>{place.title}</strong>
        </>
      ),
      okText: 'Sim',
      cancelText: 'Não',
      /**
       * onOk
       */
      onOk: async () => {
        setLoadingPlace(place.id);
        await placeStatusUpdate(place, false);
      }
    });
  };

  /**
   * onSubmitForm
   */
  const onSubmitForm = async (value: placeQueueStatusType) => {
    setModalOpen({ ...modalOpen, clickedOption: value });
    await placeQueueUpdate(modalOpen.placeId, modalOpen.prefectureId, value);
    handleCloseModal();
  };

  const statusToIgnore = ['open', 'closed'];

  return (
    <PlaceQueueWrapper>
      <PlaceQueueCard>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {prefecture?.name && <h1>{`Prefeitura de ${prefecture?.name}`}</h1>}
          <Space>
            <Radio.Group size="large" defaultValue="all" onChange={({ target }) => setFilter(target.value)}>
              <Radio.Button value="all">Todos</Radio.Button>
              <Radio.Button value="open">Abertos</Radio.Button>
            </Radio.Group>
          </Space>
        </div>
        {data.map((place) => {
          const formattedDate = new Date(place.queueUpdatedAt?.seconds * 1000);
          const haveWarning = !place.open
            ? false
            : dayjs(formattedDate).add(minutesUntilWarning, 'minutes').isBefore(dayjs());
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
                    {!place.open && <Tag color={'default'}>FECHADO</Tag>}
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
                  <Button
                    loading={loading && loadingPlace === place.id}
                    disabled={loading && loadingPlace !== place.id}
                    type={place.open ? 'default' : 'primary'}
                    onClick={() => confirmModal(place)}
                  >
                    {place.open ? 'Fechar ponto de vacinação' : 'Abrir ponto de vacinação'}
                  </Button>
                  {place.open && (
                    <Button
                      disabled={!place.open}
                      type="primary"
                      onClick={() =>
                        setModalOpen({
                          open: true,
                          placeId: place.id,
                          prefectureId: place.prefectureId,
                          clickedOption: undefined
                        })
                      }
                    >
                      Atualizar fila
                    </Button>
                  )}
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
        <ModalQueueContent wrap direction="vertical">
          {Object.keys(placeQueueLabel).map((option: placeQueueStatusType) => {
            if (statusToIgnore.includes(option)) return;
            return (
              <QueueButton
                disabled={loading && modalOpen.clickedOption === option}
                key={option}
                color={placeQueueColor[option]}
                onClick={() => {
                  if (!loading) {
                    onSubmitForm(option);
                  }
                }}
              >
                <div>
                  {loading && modalOpen.clickedOption === option && <LoadingOutlined spin style={{ marginRight: 8 }} />}
                  {placeQueueLabel[option]}
                </div>
                <p>{placeQueueHelp[option]}</p>
              </QueueButton>
            );
          })}
        </ModalQueueContent>
      </ModalQueue>
    </PlaceQueueWrapper>
  );
};

export default PlaceQueueTemplate;
