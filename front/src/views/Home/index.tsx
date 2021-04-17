import { HomeWrapper, HomeHeaderWrapper, HomeContentWrapper, HomeFooterWrapper, HomeContainerWrapper } from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Row, Col, Typography, Space } from 'antd';
import PlaceList from '../../components/elements/PlaceList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';
import { Prefecture } from '../../lib/Prefecture';
import Link from 'next/link';

/**
 * CardItem
 */
const Home: React.FC<{ data: Prefecture; loading: boolean }> = ({ data, loading }) => {
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
        <HomeContentWrapper>
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Card
                value={!data?.numPlaces ? null : data?.numPlaces}
                description={!data?.numPlaces ? `Nenhum ponto de vacinação na cidade` : `Pontos de vacinação na cidade`}
              />
            </Col>
            <Col span={24} md={12}>
              <Card
                value={!data?.numPlacesOpen ? null : data?.numPlacesOpen}
                description={
                  !data?.numPlacesOpen ? `Nenhum ponto de vacinação aberto agora` : `Pontos de vacinação abertos agora`
                }
              />
            </Col>
          </Row>
        </HomeContentWrapper>
        <HomeContainerWrapper>
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
    </HomeWrapper>
  );
};

export default Home;
