import { Place } from '../../../lib/Place';
import { Prefecture } from '../../../lib/Prefecture';
import { User } from '../../../lib/User';
import {
  userRoleType,
  placeQueueLabel,
  placeQueueStatusType,
  placeQueueColor,
  placeQueueHelp
} from '../../../utils/constraints';
import {
  PlaceQueueItemsGrid,
  PlaceQueueHeader,
  PlaceQueueItem,
  PlaceQueueWrapper,
  PlaceQueueCard,
  PlaceQueueItemContent,
  ModalQueue,
  QueueButton,
  QueueTag,
  ModalQueueContent,
  ButtonsWrapper
} from './styles';
import { Typography, Modal, Tag, Space, Radio, Input } from 'antd';
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
  const [filter, setFilter] = React.useState<{ type: string; query?: string }>({ type: 'all' });
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
    if (filter.type !== 'all') {
      list = list.filter((f) => f.open);
    }

    if (filter.query) {
      list = places.filter((f) => f.title.toLowerCase().includes(filter.query.toLowerCase()));
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
        <PlaceQueueHeader>
          {prefecture?.name && <h1>{`Prefeitura de ${prefecture?.name}`}</h1>}
          <Space>
            <Input
              placeholder="Pesquisa"
              size="large"
              onChange={({ target }) => setFilter({ ...filter, query: target.value, type: 'all' })}
            />
            <Radio.Group
              size="large"
              value={filter.type}
              onChange={({ target }) => setFilter({ ...filter, type: target.value })}
            >
              <Radio.Button value="all">Todos</Radio.Button>
              <Radio.Button value="open">Abertos</Radio.Button>
            </Radio.Group>
          </Space>
        </PlaceQueueHeader>
        <PlaceQueueItemsGrid>
          {data.map((place) => {
            const formattedDate = new Date(place.queueUpdatedAt?.seconds * 1000);
            const haveWarning = !place.open
              ? false
              : dayjs(formattedDate).add(minutesUntilWarning, 'minutes').isBefore(dayjs());
            return (
              <PlaceQueueItem warning={haveWarning} key={place.id}>
                <div>
                  <Space wrap align="start">
                    <PlaceQueueItemContent>
                      <div>
                        <Typography.Title level={3}>{place.title}</Typography.Title>
                      </div>
                      {place.open ? (
                        <QueueTag color={placeQueueColor[place.queueStatus]}>
                          {placeQueueLabel[place.queueStatus]}
                        </QueueTag>
                      ) : (
                        <Tag color={'default'}>FECHADO</Tag>
                      )}
                    </PlaceQueueItemContent>
                    <div className="queue-tags" style={{ paddingTop: 6 }}>
                      {!!(place.open && place.queueUpdatedAt) && (
                        <Tag color={haveWarning ? 'error' : 'default'}>{`Última atualização incluída ${dayjs(
                          formattedDate
                        ).fromNow()}`}</Tag>
                      )}
                    </div>
                  </Space>
                </div>
                <ButtonsWrapper>
                  <Button
                    loading={loading && loadingPlace === place.id}
                    disabled={loading && loadingPlace !== place.id}
                    type={place.open ? 'default' : 'primary'}
                    onClick={() => confirmModal(place)}
                    style={{ width: '100%' }}
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
                      style={{ width: '100%', marginLeft: 10 }}
                    >
                      Atualizar fila
                    </Button>
                  )}
                </ButtonsWrapper>
              </PlaceQueueItem>
            );
          })}
        </PlaceQueueItemsGrid>
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
