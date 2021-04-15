import { Space } from 'antd';
import PlaceListTemplate from './template';
import Car from '../../ui/Icons/Car';
import PersonPin from '../../ui/Icons/PersonPin';
import React from 'react';
import { ButtonIconWrapper } from './styles';
import { Place } from '../../../lib/Place';
import { placeType } from '../../../utils/constraints';
import { Prefecture } from '../../../lib/Prefecture';

type IconButtonProps = {
  onPress?: (value: string) => void;
  activeFilter?: string;
  title: string;
  id: string;
  icon: React.ReactNode;
};

/**
 * IconButton
 */
const IconButton: React.FC<IconButtonProps> = ({ onPress, id, activeFilter, title, icon }) => {
  return (
    <ButtonIconWrapper active={activeFilter === id} onClick={() => onPress(activeFilter === id ? undefined : id)}>
      {icon}
      <div />
      <p>{title}</p>
    </ButtonIconWrapper>
  );
};

/**
 * PlaceList
 */
const PlaceList: React.FC<{ prefecture: Prefecture; loading: boolean }> = ({ prefecture, loading }) => {
  const [filter, setFilter] = React.useState<{ age: string; zip: string; placeType: string }>({
    age: undefined,
    zip: undefined,
    placeType: undefined
  });

  const data: Place[] = React.useMemo(() => {
    let listPlaces = prefecture.places || [];
    // TODO: implement age filter
    if (filter.age) {
      // listPlaces = listPlaces.filter((f) => f.age === filter.age);
    }
    if (filter.zip) {
      listPlaces = listPlaces.filter((f) => f.addressZip === filter.zip);
    }
    if (filter.placeType) {
      listPlaces = listPlaces.filter((f) => f.type === filter.placeType);
    }
    return listPlaces;
  }, [prefecture.places, filter]);

  return (
    <PlaceListTemplate
      title="Locais de vacinação"
      data={data}
      showQueueUpdatedAt={prefecture.showQueueUpdatedAt}
      loading={loading}
      // header={
      //   <Space wrap>
      //     <p>Encontre seu ponto</p>
      //     <div>
      //       <Input
      //         style={{ marginRight: 8 }}
      //         placeholder="Minha idade"
      //         prefix={<Person />}
      //         value={search.age}
      //         maxLength={3}
      //         onChange={(e) => {
      //           const { value } = e.target;
      //           const reg = /^-?\d*(\.\d*)?$/;
      //           if ((!isNaN(Number(value)) && reg.test(value)) || value === '' || value === '-') {
      //             setSearch({ ...search, age: e.target.value });
      //           }
      //         }}
      //       />
      //       <Input
      //         placeholder="CEP"
      //         prefix={<Pin />}
      //         value={search.zip}
      //         maxLength={8}
      //         onChange={(e) => setSearch({ ...search, zip: e.target.value })}
      //       />
      //     </div>
      //     <Button
      //       icon={<Search />}
      //       type="primary"
      //       size="large"
      //       onClick={() => alert('Ainda não implementado nesta versão')}
      //     >
      //       Buscar
      //     </Button>
      //   </Space>
      // }
      extra={
        <Space size={[60, 0]}>
          <IconButton
            id={placeType.driveThru}
            title="Drive thru"
            activeFilter={filter.placeType}
            icon={<Car />}
            onPress={(value) => setFilter({ ...filter, placeType: value })}
          />
          <IconButton
            id={placeType.fixed}
            title="Ponto fixo"
            activeFilter={filter.placeType}
            icon={<PersonPin />}
            onPress={(value) => setFilter({ ...filter, placeType: value })}
          />
        </Space>
      }
    />
  );
};

export default PlaceList;
