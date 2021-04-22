import React from 'react';
import { placeQueueLabel, placeQueueColor, placeType, placeQueue } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemIconContent, CardItemWrapper } from './styles';
import { Car, PersonPin, Pin } from '../Icons';
import { Place } from '../../../lib/Place';
import dayjs from 'dayjs';
import { Space, Tag, Tooltip } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { distanceHumanize } from '../../../utils/geolocation';
import Button from '../Button';

type CardItemProps = {
  item: Place;
  showQueueUpdatedAt?: boolean;
  haveWarning: boolean;
  canUpdate?: boolean;
  publicUpdate: () => void;
};

/**
 * CardItem
 */
const CardItem: React.FC<CardItemProps> = ({ item, showQueueUpdatedAt, canUpdate, haveWarning, publicUpdate }) => {
  /**
   * Render the icon based on status
   */
  const renderIcon = () => {
    switch (item.type) {
      case placeType.driveThru:
        return <Car width={31} height={30} />;
      case placeType.fixed:
        return <PersonPin width={31} height={30} />;
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

  return (
    <CardItemWrapper>
      <CardItemContent md={18} sm={24}>
        <div>
          <span>
            {title}
            {timeInfoText ? (
              <CardItemExtra>
                <Tag color="default">{timeInfoText}</Tag>{' '}
              </CardItemExtra>
            ) : null}
          </span>

          <div>
            {!!item.googleMapsUrl && (
              <Tooltip title="Veja como chegar">
                <a href={item.googleMapsUrl} target="_blank" rel="noreferrer">
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
            {item.open && canUpdate && (
              <Button size="small" onClick={publicUpdate} style={{ marginLeft: 4 }}>
                Informar fila
              </Button>
            )}
          </div>
        </div>
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
          <span>
            Atualizado {dayjs(new Date(item.queueUpdatedAt?._seconds * 1000)).fromNow()}
            {haveWarning ? <WarningFilled /> : null}
          </span>
        ) : null}
      </CardItemIconContent>
    </CardItemWrapper>
  );
};

export default CardItem;
