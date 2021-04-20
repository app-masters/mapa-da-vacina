import { placeQueueLabel, placeQueueColor, placeType, placeQueue } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemIconContent, CardItemWrapper } from './styles';
import { Car, PersonPin, Pin } from '../Icons';
import { Place } from '../../../lib/Place';
import dayjs from 'dayjs';
import { Space, Tag, Tooltip, Image } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

/**
 * CardItem
 */
const CardItem: React.FC<{ item: Place; showQueueUpdatedAt?: boolean; haveWarning: boolean }> = ({
  item,
  showQueueUpdatedAt,
  haveWarning
}) => {
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
      return `Fecha às ${closeTime.format('HH:mm')}`;
    } else {
      // It's closed, show info with open time
      const openTodayTime = dayjs().set('h', openTime.hour()).set('m', openTime.minute());
      if (now.isBefore(openTodayTime)) {
        // Not open yet
        return `Abre hoje às ${openTime.format('HH:mm')}`;
      } else {
        // Already closed
        if (item.openTomorrow) {
          return `Abre amanhã às ${openTime.format('HH:mm')}`;
        } else {
          return `Não abrirá amanhã`;
        }
      }
    }
  }, [item]);

  return (
    <CardItemWrapper>
      <CardItemContent lg={12} sm={24}>
        <div>
          {title}
          <p>
            {!!item.googleMapsUrl && (
              <Tooltip title="Veja como chegar no mapa">
                <a href={item.googleMapsUrl} target="_blank" rel="noreferrer">
                  <Pin width={20} height={16} />
                </a>
              </Tooltip>
            )}
            {`${item.addressStreet ? item.addressStreet : ''}${
              item.addressDistrict ? ', ' + item.addressDistrict : ''
            }${item.addressCityState ? ' - ' + item.addressCityState : ''}${
              item.addressZip ? ', ' + item.addressZip : ''
            }`}
          </p>
        </div>
      </CardItemContent>
      <CardItemContent md={6} sm={24}>
        {timeInfoText ? (
          <CardItemExtra>
            <Tag color="default">{timeInfoText}</Tag>{' '}
          </CardItemExtra>
        ) : null}
        {/* {item.queueUpdatedAt &&
        item.open &&
        showQueueUpdatedAt &&
        item.queueStatus !== placeQueue.open &&
        item.queueStatus !== placeQueue.closed ? (
          <CardItemExtra>
            <Tag color={haveWarning ? 'error' : 'default'}>
              Atualizado {dayjs(new Date(item.queueUpdatedAt?._seconds * 1000)).fromNow()}
            </Tag>
          </CardItemExtra>
        ) : null} */}
      </CardItemContent>
      <CardItemIconContent lg={6} sm={24} bgcolor={placeQueueColor[item.queueStatus]}>
        <Space>
          {renderIcon()}
          {placeQueueLabel[item.queueStatus]}
        </Space>
        {/* {item.queueUpdatedAt &&
        item.open &&
        showQueueUpdatedAt &&
        item.queueStatus !== placeQueue.open &&
        item.queueStatus !== placeQueue.closed ? (
          <span>
            Atualizado {dayjs(new Date(item.queueUpdatedAt?._seconds * 1000)).fromNow()}
            {haveWarning ? null : null}
          </span>
        ) : null} */}
      </CardItemIconContent>
    </CardItemWrapper>
  );
};

export default CardItem;
