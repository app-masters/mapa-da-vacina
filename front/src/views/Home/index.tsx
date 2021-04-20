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
import { Row, Col, Typography, Space, Modal } from 'antd';
import PlaceList from '../../components/elements/PlaceList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';
import { Prefecture } from '../../lib/Prefecture';
import Link from 'next/link';
import React from 'react';

type HomeProps = {
  data: Prefecture;
  loading: boolean;
  filterByPosition: (coords: GeolocationPosition) => void;
};

const geolocationConfig = { timeout: 10 * 1000 };

/**
 * CardItem
 */
const Home: React.FC<HomeProps> = ({ data, loading, filterByPosition }) => {
  const [modal, setModal] = React.useState<boolean>(false);
  const [permission, setPermission] = React.useState<string>(undefined);

  /**
   * geoError
   */
  const geoError = React.useCallback((error) => {
    if (error.code === 1) {
      setPermission('denied');
    }
  }, []);

  /**
   * geolocation
   */
  const geolocation = React.useCallback(() => {
    /**
     * geoSuccess
     */
    const geoSuccess = (position) => {
      setModal(false);
      setPermission('allowed');
      filterByPosition(position);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geolocationConfig);
  }, [filterByPosition, geoError]);

  return (
    <HomeWrapper>
      <div className="page-body">
        <HomeHeaderWrapper>
          <div className="logo">
            <Image src={'/images/logo-mapa.svg'} width={280} height={80} alt="app-logo" />
          </div>
          {data.primaryLogo ? (
            <div className="logo">
              <Image className="logo" src={data.primaryLogo} width={240} height={80} />
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
                <Image src={data.secondaryLogo} width={240} height={80} />
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
          <div style={{ display: 'grid', justifyContent: 'flex-end' }}>
            <Button
              type="default"
              onClick={() => {
                if (permission === 'granted' || permission === 'allowed') {
                  geolocation();
                } else {
                  setModal(true);
                }
              }}
            >
              Pontos mais próximos
            </Button>
          </div>
          <PlaceList prefecture={data} loading={loading} />
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
            <Image src={'/images/app-masters-logo.svg'} width={170} height={50} alt="appmasters-logo" />
          </a>
        </div>
      </HomeFooterWrapper>
      <Modal
        visible={modal}
        onOk={() => geolocation()}
        onCancel={() => setModal(false)}
        okButtonProps={{ style: { display: permission === 'denied' ? 'none' : 'inline-block' } }}
        okText="Permitir"
        cancelText="Fechar"
      >
        <ModalContainerWrapper>
          {permission === 'denied' ? (
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
          ) : (
            <p>É necessário permitir que o navegador acesse a sua localização para continuar.</p>
          )}
        </ModalContainerWrapper>
      </Modal>
    </HomeWrapper>
  );
};

export default Home;
