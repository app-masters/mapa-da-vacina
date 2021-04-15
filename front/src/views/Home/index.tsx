import { HomeWrapper, HomeHeaderWrapper, HomeContentWrapper, HomeFooterWrapper } from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Space } from 'antd';
import PlaceList from '../../components/elements/PlaceList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';
import { Prefectures } from '../../lib/Prefectures';

/**
 * CardItem
 */
const Home: React.FC<{ data: Prefectures; loading: boolean }> = ({ data, loading }) => {
  return (
    <HomeWrapper>
      <div className="page-body">
        <HomeHeaderWrapper>
          <Image src={'/images/logo-app-white.png'} width={280} height={40} />
          <Image src={'/images/pjf-logo-horizontal.svg'} width={240} height={80} />
          <div className="card-logo">
            <Image src={'/images/logo-programa.svg'} width={240} height={80} />
          </div>
        </HomeHeaderWrapper>
        <HomeContentWrapper>
          <Space size="large" wrap>
            <Card value={!data.places ? 0 : data.places.length} description="Pontos de vacinação na cidade" />
            <Card
              value={!data.places ? 0 : data.places.filter((f) => f.open).length}
              description="Pontos de vacinação abertos agora"
            />
          </Space>
        </HomeContentWrapper>
        <HomeContentWrapper>
          <PlaceList places={data.places || []} loading={loading} />
        </HomeContentWrapper>
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
            <Image src={'/images/appmasters-logo.png'} width={170} height={30} />
          </a>
        </div>
      </HomeFooterWrapper>
    </HomeWrapper>
  );
};

export default Home;
