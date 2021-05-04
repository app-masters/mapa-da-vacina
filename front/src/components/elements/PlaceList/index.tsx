import PlaceListTemplate from './template';
import Pin from '../../ui/Icons/Pin';
import Sort from '../../ui/Icons/Sort';
import React from 'react';
import { BlockIcon, ButtonIconWrapper, HeaderCard, StyledSpace } from './styles';
import { Place } from '../../../lib/Place';
import { placeQueue } from '../../../utils/constraints';
import { Prefecture } from '../../../lib/Prefecture';
import { Coordinate } from '../../../lib/Location';
import { sortPlacesByDistance, sortPlacesDefaultByName } from '../../../utils/sort';

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
      <div style={{}}>{icon}</div>
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
  const [filter, setFilter] = React.useState<{ order: string; placeType: string }>({
    order: undefined,
    placeType: undefined
  });

  const data: Place[] = React.useMemo(() => {
    let listPlaces = prefecture.places || [];
    if (filter.placeType) {
      listPlaces = listPlaces.filter((f) => f.open === (filter.placeType === 'open'));
    }
    if (filter.order) {
      if (filter.order === 'name') {
        listPlaces = sortPlacesDefaultByName(listPlaces);
      }
      if (filter.order === 'distance') {
        listPlaces = sortPlacesByDistance(listPlaces);
      }
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
          <StyledSpace wrap size={[16, 0]}>
            <IconButton
              id={'open'}
              title="Aberto"
              activeFilter={filter.placeType}
              icon={<BlockIcon $open />}
              onPress={(value) => setFilter({ ...filter, placeType: value })}
            />
            <IconButton
              id={'closed'}
              title="Fechado"
              activeFilter={filter.placeType}
              icon={<BlockIcon />}
              onPress={(value) => setFilter({ ...filter, placeType: value })}
            />
          </StyledSpace>
        </HeaderCard>
      }
      filter={
        <StyledSpace style={{ paddingBottom: 8 }} wrap size={[16, 0]}>
          <IconButton
            id={'name'}
            title="Nome"
            activeFilter={filter.order}
            icon={<Sort />}
            onPress={(value) => setFilter({ ...filter, order: value })}
          />
          {coordinate?.position && (
            <IconButton
              id={'distance'}
              title="Distância"
              activeFilter={filter.order}
              icon={<Pin />}
              onPress={(value) => setFilter({ ...filter, order: value })}
            />
          )}
        </StyledSpace>
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
