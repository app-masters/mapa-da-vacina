import {
  HomeWrapper,
  HomeHeaderWrapper,
  HomeContentWrapper,
  HomeFooterWrapper,
  HomeContainerWrapper,
  ModalContainerWrapper
} from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Row, Col, Typography, Space, Modal, message } from 'antd';
import PlaceList from '../../components/elements/PlaceList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';
import { Prefecture } from '../../lib/Prefecture';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { Coordinate } from '../../lib/Location';
import { Place } from '../../lib/Place';
import { calcDistance } from '../../utils/geolocation';
import { placeDistances } from '../../utils/constraints';
import QueueModal from '../../components/elements/queueModal';
import { API } from '../../utils/api';
import dayjs from 'dayjs';

type HomeProps = {
  data: Prefecture;
  loading: boolean;
  coordinate?: Coordinate;
  setCoordinate: Dispatch<
    SetStateAction<{
      permission?: string;
      position?: GeolocationPosition;
    }>
  >;
};

const geolocationConfig = { timeout: 10 * 1000 };

/**
 * CardItem
 */
const Home: React.FC<HomeProps> = ({ coordinate, data, loading, setCoordinate }) => {
  const [publicUpdate, setPublicUpdate] = React.useState<Place[] | null>(null);
  const [modalUpdate, setModalUpdate] = React.useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);

  /**
   * geoError
   */
  const geoError = React.useCallback(
    (error) => {
      if (error.code === 1) {
        setCoordinate({ permission: 'denied' });
      }
      if (error.code === 3) {
        setCoordinate({ permission: 'timeout' });
      }
    },
    [setCoordinate]
  );

  /**
   * geolocation
   */
  const geolocation = React.useCallback(
    (callback?: (position: GeolocationPosition) => void) => {
      /**
       * geoSuccess
       */
      const geoSuccess = (position) => {
        setModal(false);
        setCoordinate({ position, permission: 'granted' });
        if (callback) callback(position);
      };
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geolocationConfig);
    },
    [setCoordinate, geoError]
  );

  /**
   * onPublicUpdate
   */
  const onPublicUpdate = (item: Place | 'all') => {
    if (item === 'all') setPublicUpdate(data.places);
    else if (item) setPublicUpdate([item as Place]);
    if (!coordinate.position) {
      setModal(true);
    } else {
      handlePublicUpdate([item as Place]);
    }
  };

  /**
   * handlePublicUpdate
   */
  const handlePublicUpdate = (items: Place[], geo?: GeolocationPosition) => {
    const lastUpdate = JSON.parse(localStorage.getItem('last_queue_update') || 'null');
    if (lastUpdate) {
      if (dayjs().isBefore(dayjs(lastUpdate).add(1, 'minutes'))) {
        Modal.error({
          content: 'É preciso aguardar pelo ao menos dois minutos para informar novamente o tamanho da fila.'
        });
        return;
      }
    }

    const haveProximity = items.find((place) => {
      const proximity = calcDistance(geo ? geo : coordinate.position, place);
      const value = placeDistances[place.type];
      if (proximity && proximity <= value) {
        return place;
      }
    });
    if (!haveProximity) {
      Modal.error({
        content: 'Você precisa estar próximo de um dos pontos de vacinação para informar a fila.'
      });
      setPublicUpdate(null);
    } else {
      if (items.length === 1) {
        setModalUpdate(true);
      } else {
        setPublicUpdate(null);
      }
    }
  };

  /**
   * submitPublicUpdate
   */
  const submitPublicUpdate = async (option: string) => {
    setLoadingUpdate(true);
    try {
      await API.post('/update-queue-status', {
        prefectureId: publicUpdate[0].prefectureId,
        placeId: publicUpdate[0].id,
        status: option
      });
      setModalUpdate(false);
      localStorage.setItem('last_queue_update', JSON.stringify(new Date()));
      Modal.success({
        content: 'Alteração de estado enviada com sucesso.'
      });

      setLoadingUpdate(false);
    } catch (err) {
      console.log(err);
      message.error('Ocorreu um erro ao enviar alteração');
      setLoadingUpdate(false);
    }
  };

  return (
    <HomeWrapper>
      <div className="page-body">
        <HomeHeaderWrapper>
          <div className="logo">
            <a href="https://www.mapadavacina.com.br" target="_blank" rel="noreferrer">
              <Image src={'/images/logo-mapa.svg'} width={280} height={80} alt="mapa-da-vacina-logo" />
            </a>
          </div>
          {data.primaryLogo ? (
            <div className="logo">
              <Image className="logo" src={data.primaryLogo} width={240} height={80} alt={data.name + ' logomarca'} />
            </div>
          ) : (
            <div className="logo-text">
              {data.city && (
                <div>
                  <Typography.Title level={1}>{`Pontos de vacinação em ${data.city}`}</Typography.Title>
                </div>
              )}
            </div>
          )}
          {data.secondaryLogo ? (
            <div className="logo">
              <div className="card-logo">
                <Image src={data.secondaryLogo} width={240} height={80} alt={data.name + ' evento'} />
              </div>
            </div>
          ) : null}
        </HomeHeaderWrapper>
        {!loading ? (
          <HomeContentWrapper>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Card
                  value={!data?.numPlaces ? null : data?.numPlaces}
                  description={
                    !data?.numPlaces ? `Nenhum ponto de vacinação na cidade` : `Pontos de vacinação na cidade`
                  }
                />
              </Col>
              <Col span={24} md={12}>
                <Card
                  value={!data?.numPlacesOpen ? null : data?.numPlacesOpen}
                  description={
                    !data?.numPlacesOpen
                      ? `Nenhum ponto de vacinação aberto agora`
                      : `Pontos de vacinação abertos agora`
                  }
                />
              </Col>
            </Row>
          </HomeContentWrapper>
        ) : null}
        <HomeContainerWrapper>
          {coordinate?.permission !== 'granted' && coordinate?.permission !== 'allowed' && (
            <div className="location-button">
              <Space>
                {data.enablePublicQueueUpdate && (
                  <Button type="default" onClick={() => onPublicUpdate('all')}>
                    Informar fila
                  </Button>
                )}
                <Button type="default" onClick={() => setModal(true)}>
                  Pontos mais próximos
                </Button>
              </Space>
            </div>
          )}
          <PlaceList prefecture={data} loading={loading} coordinate={coordinate} publicUpdate={onPublicUpdate} />
        </HomeContainerWrapper>
      </div>
      <HomeFooterWrapper>
        <div>
          <Space direction="vertical">
            <Link href="https://www.mapadavacina.com.br/criar-mapa-da-vacina" passHref>
              <Button type="outline">Criar mapa pra minha prefeitura</Button>
            </Link>
            <Link href="https://www.mapadavacina.com.br" passHref>
              <Button type="outline">Ver todas as cidades</Button>
            </Link>
          </Space>
          <a className="github-a" href="https://github.com/app-masters/filometro" target="_blank" rel="noreferrer">
            <Github width={22} height={21} />
            Projeto open source
          </a>
          <a className="appmasters-a" href="http://appmasters.io/pt" target="_blank" rel="noreferrer">
            Desenvolvido pela
            <Image src={'/images/app-masters-logo.svg'} width={170} height={50} alt="App Masters" />
          </a>
        </div>
      </HomeFooterWrapper>
      <Modal
        visible={modal}
        onOk={() => geolocation(publicUpdate ? (test) => handlePublicUpdate(publicUpdate, test) : null)}
        onCancel={() => {
          setModal(false);
          setCoordinate({});
        }}
        okButtonProps={{ style: { display: coordinate?.permission === 'denied' ? 'none' : 'inline-block' } }}
        okText={coordinate?.permission === 'timeout' ? 'Tentar novamente' : 'Permitir'}
        cancelText="Fechar"
      >
        <ModalContainerWrapper>
          {coordinate?.permission === 'denied' ? (
            <p>
              O acesso a localização está bloqueado para este navegador, por favor acesse
              <a
                href="https://support.google.com/chrome/answer/142065?co=GENIE.Platform%3DDesktop&hl=pt"
                target="_blank"
                rel="noreferrer"
              >
                {` este link `}
              </a>
              para saber mais.
            </p>
          ) : coordinate?.permission === 'timeout' ? (
            <p>Ocorreu um erro ao tentar acessar a sua localização. Tente novamente mais tarde.</p>
          ) : (
            <p>É necessário permitir que o navegador acesse a sua localização para continuar.</p>
          )}
        </ModalContainerWrapper>
      </Modal>
      <QueueModal
        open={modalUpdate}
        loading={loadingUpdate}
        handleCloseModal={() => setModalUpdate(false)}
        onSubmitForm={submitPublicUpdate}
      />
    </HomeWrapper>
  );
};

export default Home;
