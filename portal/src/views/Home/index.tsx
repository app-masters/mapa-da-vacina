import { HomeWrapper, HomeHeaderWrapper, HomeContentWrapper, HomeFooterWrapper } from './style';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import { Space } from 'antd';
import CardList from '../../components/elements/CardList';
import Button from '../../components/ui/Button';
import Github from '../../components/ui/Icons/Github';

/**
 * CardItem
 */
const Home: React.FC = () => {
  return (
    <HomeWrapper>
      <HomeHeaderWrapper>
        <Image src={'/images/logo-app.png'} width={230} height={80} />
        <Image src={'/images/logo-jf.png'} width={140} height={80} />
      </HomeHeaderWrapper>
      <HomeContentWrapper>
        <Space size="large" wrap>
          <Card value={32} description="Pontos de vacinação na cidade" />
          <Card value={13} description="Pontos de vacinação abertos agora" />
        </Space>
      </HomeContentWrapper>
      <HomeContentWrapper>
        <CardList />
      </HomeContentWrapper>
      <HomeFooterWrapper>
        <div>
          <Button type="outline">Criar filometro pra minha prefeitura</Button>
          <a className="github-a" href="https://github.com/app-masters/filometro" target="_blank" rel="noreferrer">
            <Github width={22} height={21} />
            Projeto open source
          </a>
          <a className="appmasters-a" href="http://appmasters.io/pt" target="_blank" rel="noreferrer">
            Desenvolvido pela
            <Image src={'/images/appmasters-logo.png'} width={130} height={30} />
          </a>
        </div>
      </HomeFooterWrapper>
    </HomeWrapper>
  );
};

export default Home;
