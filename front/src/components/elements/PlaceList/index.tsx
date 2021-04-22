import { Space } from 'antd';
import PlaceListTemplate from './template';
import Car from '../../ui/Icons/Car';
import PersonPin from '../../ui/Icons/PersonPin';
import React from 'react';
import { ButtonIconWrapper, HeaderCard } from './styles';
import { Place } from '../../../lib/Place';
import { placeQueue, placeType } from '../../../utils/constraints';
import { Prefecture } from '../../../lib/Prefecture';
import { Coordinate } from '../../../lib/Location';

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
      <div style={{ width: 20 }}>{icon}</div>
      <div />
      <p>{title}</p>
    </ButtonIconWrapper>
  );
};

type PlaceListProps = {
  prefecture: Prefecture;
  loading: boolean;
  coordinate: Coordinate;
  publicUpdate: (item: Place) => void;
};

/**
 * PlaceList
 */
const PlaceList: React.FC<PlaceListProps> = ({ prefecture, loading, publicUpdate, coordinate }) => {
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

  const shouldShowFeaturesBanner = React.useMemo(() => {
    const hasLogo = !!prefecture?.primaryLogo;
    const isUsingQueue = prefecture?.places?.some(
      (place) => place.queueStatus !== placeQueue.open && place.queueStatus !== placeQueue.closed
    );

    // Probably, the prefecture has not paid for the system
    return !loading && !hasLogo && !isUsingQueue;
  }, [loading, prefecture.primaryLogo, prefecture.places]);

  return (
    <PlaceListTemplate
      title={
        <HeaderCard>
          <div>Locais de vacinação</div>
          <Space wrap size={[16, 0]}>
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
        </HeaderCard>
      }
      data={data}
      currentCoordinate={coordinate?.position}
      enablePublicQueueUpdate={prefecture.enablePublicQueueUpdate}
      showQueueUpdatedAt={prefecture.showQueueUpdatedAt !== false}
      sampleMode={prefecture.sampleMode}
      city={prefecture.city}
      loading={loading}
      shouldShowFeaturesBanner={shouldShowFeaturesBanner}
      publicUpdate={publicUpdate}
    />
  );
};

export default PlaceList;
