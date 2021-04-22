import React from 'react';
import { placeQueueLabel, placeQueueColor, placeType, placeQueue } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemIconContent, CardItemWrapper } from './styles';
import { Car, PersonPin, Pin } from '../Icons';
import { Place } from '../../../lib/Place';
import dayjs from 'dayjs';
import { Space, Tag, Tooltip } from 'antd';
import { distanceHumanize } from '../../../utils/geolocation';
import Button from '../Button';

type CardItemProps = {
  item: Place;
  showQueueUpdatedAt?: boolean;
  haveWarning: boolean;
  canUpdate?: boolean;
  coordinate?: GeolocationPosition;
  publicUpdate: () => void;
};

/**
 * CardItem
 */
const CardItem: React.FC<CardItemProps> = ({ item, coordinate, showQueueUpdatedAt, canUpdate, publicUpdate }) => {
  /**
   * Render the icon based on status
   */
  const renderIcon = () => {
    switch (item.type) {
      case placeType.driveThru:
        return <Car width={31} height={30} />;
      case placeType.fixed:
        return <PersonPin width={26} height={30} />;
    }
  };

  const title = React.useMemo(() => {
    if (item.title.includes('(')) {
      const regexTitle = /\(([^)]+)\)/.exec(item.title);
      if (regexTitle && regexTitle[0]) {
        return (
          <div className="item-header">
            <h1 className="item-place">{item.title.replace(regexTitle[0], '')}</h1>
            <small>{regexTitle[0]}</small>
          </div>
        );
      }
    }
    return <h1 className="item-place">{item.title}</h1>;
  }, [item]);

  const timeInfoText = React.useMemo(() => {
    const now = dayjs();
    const openTime = dayjs(item.openAt._seconds * 1000);
    const closeTime = dayjs(item.closeAt._seconds * 1000);
    if (!item.openAt || !item.closeAt) return ''; // Don't have a defined time
    if (item.open) {
      // Place is open
      return `Aberto até às ${closeTime.format('HH:mm')}`;
    } else {
      // It's closed, show info with open time
      const openTodayTime = dayjs().set('h', openTime.hour()).set('m', openTime.minute());
      if (now.isBefore(openTodayTime)) {
        // Not open yet
        return `Abre hoje às ${openTime.format('HH:mm')}`;
      } else {
        // Already closed
        if (!item.openToday && !item.openTomorrow) {
          return `Não abrirá hoje nem amanhã`;
        } else if (item.openTomorrow) {
          return `Abre amanhã às ${openTime.format('HH:mm')}`;
        } else {
          return `Não abrirá amanhã`;
        }
      }
    }
  }, [item]);

  const url = React.useMemo(() => {
    if (coordinate && item.addressStreet) {
      return `http://maps.google.com/?mode=walking&daddr=${coordinate.coords.latitude},${coordinate.coords.longitude}&saddr=${item.addressStreet}`;
    } else if (item.googleMapsUrl) {
      return item.googleMapsUrl;
    } else {
      return undefined;
    }
  }, [coordinate, item.googleMapsUrl, item.addressStreet]);

  return (
    <CardItemWrapper>
      <CardItemContent md={12} sm={24}>
        <div style={{ flex: 1 }}>
          <span>
            {title}
            {timeInfoText ? (
              <CardItemExtra>
                <Tag color="default" style={{ marginRight: 0 }}>
                  {timeInfoText}
                </Tag>
              </CardItemExtra>
            ) : null}
          </span>
          <div>
            {!!url && (
              <Tooltip title="Veja como chegar">
                <a href={url} target="_blank" rel="noreferrer">
                  <Pin width={20} height={16} />
                </a>
              </Tooltip>
            )}
            {`${item.addressStreet ? item.addressStreet : ''}${
              item.addressDistrict ? ', ' + item.addressDistrict : ''
            }`}
            {item.distance && (
              <label
                className="location-label"
                style={{ marginLeft: item.googleMapsUrl ? 0 : 4 }}
              >{`- Distância: ${distanceHumanize(item.distance)}`}</label>
            )}
          </div>
        </div>
      </CardItemContent>
      <CardItemContent align="center" justify="center" md={6} sm={24}>
        {item.open && canUpdate && (
          <Button className="queue-button" type="action" size="large" onClick={publicUpdate}>
            Informar fila
          </Button>
        )}
      </CardItemContent>
      <CardItemIconContent md={6} sm={24} bgcolor={placeQueueColor[item.queueStatus]}>
        <Space>
          {renderIcon()}
          {placeQueueLabel[item.queueStatus]}
        </Space>
        {item.queueUpdatedAt &&
        item.open &&
        showQueueUpdatedAt &&
        item.queueStatus !== placeQueue.open &&
        item.queueStatus !== placeQueue.closed ? (
          <span>Atualizado {dayjs(new Date(item.queueUpdatedAt?._seconds * 1000)).fromNow()}</span>
        ) : null}
      </CardItemIconContent>
    </CardItemWrapper>
  );
};

export default CardItem;
