import { HomeWrapper, HomeHeaderWrapper, HomeContentWrapper, HomeFooterWrapper, HomeContainerWrapper } from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Space, Typography } from 'antd';
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
          <div className="logo">
            {data.primaryLogo ? (
              <Image className="logo" src={data.primaryLogo} width={240} height={80} />
            ) : (
              <div className="logo-text">
                <div>
                  <Typography.Title level={2}>{`Prefeitura de`}</Typography.Title>
                  <Typography.Title level={2}>{`${data.city}`}</Typography.Title>
                </div>
              </div>
            )}
          </div>
          <div className="logo">
            {data.secondaryLogo && (
              <div className="card-logo">
                <Image src={data.secondaryLogo} width={240} height={80} />
              </div>
            )}
          </div>
        </HomeHeaderWrapper>
        <HomeContentWrapper>
          <Space size="large" wrap>
            <Card value={!data?.numPlaces ? null : data?.numPlaces} description="Pontos de vacinação na cidade" />
            <Card
              value={!data?.numPlacesOpen ? null : data?.numPlacesOpen}
              description="Pontos de vacinação abertos agora"
            />
          </Space>
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
