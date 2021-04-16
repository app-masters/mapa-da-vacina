import { HomeWrapper, HomeHeaderWrapper, HomeContentWrapper, HomeFooterWrapper, HomeContainerWrapper } from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Space } from 'antd';
import PlaceList from '../../components/elements/PlaceList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';
import { Prefecture } from '../../lib/Prefecture';
import CountUp from 'react-countup';

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
            <Image className="logo" src={'/images/pjf-logo-horizontal.svg'} width={240} height={80} />
          </div>
          <div className="logo">
            <div className="card-logo">
              <Image src={'/images/logo-programa.svg'} width={240} height={80} />
            </div>
          </div>
        </HomeHeaderWrapper>
        <HomeContentWrapper>
          <Space size="large" wrap>
            <Card
              value={!data?.numPlaces ? null : <CountUp start={0} redraw end={data?.numPlaces} />}
              description="Pontos de vacinação na cidade"
            />
            <Card
              value={!data?.numPlaces ? null : <CountUp start={0} redraw end={data?.numPlacesOpen} />}
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
          <Button type="outline">Criar filometro pra minha prefeitura</Button>
          <a className="github-a" href="https://github.com/app-masters/filometro" target="_blank" rel="noreferrer">
            <Github width={22} height={21} />
            Projeto open source
          </a>
          <a className="appmasters-a" href="http://appmasters.io/pt" target="_blank" rel="noreferrer">
            Desenvolvido pela
            <Image src={'/images/appmasters-logo.png'} width={170} height={30} alt="appmasters-logo" />
          </a>
        </div>
      </HomeFooterWrapper>
    </HomeWrapper>
  );
};

export default Home;
