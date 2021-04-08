import { Space } from 'antd';
import CardListTemplate from './template';
import Car from '../../ui/Icons/Car';
import PersonPin from '../../ui/Icons/PersonPin';
import React, { Dispatch, SetStateAction } from 'react';
import { ButtonIconWrapper } from './styles';
import { CardItem } from '../../../lib/CardItem';

type IconButtonProps = {
  onPress?: Dispatch<SetStateAction<string>>;
  activeFilter?: string;
  title: string;
  id: string;
  icon: React.ReactNode;
};

/**
 * IconButton
 */
const IconButton: React.FC<IconButtonProps> = ({ onPress = () => ({}), id, activeFilter, title, icon }) => {
  return (
    <ButtonIconWrapper active={activeFilter === id} onClick={() => onPress(activeFilter === id ? undefined : id)}>
      {icon}
      <div />
      <p>{title}</p>
    </ButtonIconWrapper>
  );
};

/**
 * CardList
 */
const CardList: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState<string>(undefined);

  const data: CardItem[] = React.useMemo(() => {
    const items = [
      {
        id: 1,
        status: 1,
        type: 'drive',
        updatedAt: new Date(),
        typeLabel: '1º DOSE - IDOSOS',
        place: '5º Centro de Saúde Clementino Fraga',
        address: 'Av. Centenário, s/n - Garcia, Salvador - BA, 46100-000'
      },
      {
        id: 1,
        status: 2,
        type: 'local',
        updatedAt: new Date(),
        typeLabel: '1º DOSE - IDOSOS',
        place: '5º Centro de Saúde Clementino Fraga',
        address: 'Av. Centenário, s/n - Garcia, Salvador - BA, 46100-000'
      }
    ];

    return !activeFilter ? items : items.filter((f) => f.type === activeFilter);
  }, [activeFilter]);

  return (
    <CardListTemplate
      title="Locais de vacinação"
      data={data}
      extra={
        <Space size={[60, 0]}>
          <IconButton
            id="drive"
            title="Drive thru"
            activeFilter={activeFilter}
            icon={<Car />}
            onPress={setActiveFilter}
          />
          <IconButton
            id="local"
            title="Ponto fixo"
            activeFilter={activeFilter}
            icon={<PersonPin />}
            onPress={setActiveFilter}
          />
        </Space>
      }
    />
  );
};

export default CardList;
