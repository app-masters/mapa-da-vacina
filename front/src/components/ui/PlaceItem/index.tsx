import { placeQueueLabel, placeQueueColor, placeType, placeQueue } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemIconContent, CardItemWrapper } from './styles';
import { Car, PersonPin, Pin } from '../Icons';
import { Place } from '../../../lib/Place';
import dayjs from 'dayjs';
import { Tag, Tooltip } from 'antd';
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
    if (item.open) {
      if (item.closeAt) {
        return `Fecha às ${dayjs(item.closeAt._seconds * 1000).format('HH:mm')}`;
      }
    } else if (item.openTomorrow) {
      if (item.openAt) {
        return `Abre amanhã às ${dayjs(item.openAt._seconds * 1000).format('HH:mm')}`;
      }
    } else {
      return `Não abrirá amanhã`;
    }
    return '';
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
      <CardItemContent md={10} sm={24}>
        <CardItemExtra>{timeInfoText ? <Tag color="default">{timeInfoText}</Tag> : null}</CardItemExtra>
      </CardItemContent>
      <CardItemContent md={10} sm={24}>
        {item.queueUpdatedAt &&
        item.open &&
        showQueueUpdatedAt &&
        item.queueStatus !== placeQueue.open &&
        item.queueStatus !== placeQueue.closed ? (
          <CardItemExtra>
            <Tag color={haveWarning ? 'error' : 'default'}>
              Atualizado {dayjs(new Date(item.queueUpdatedAt?._seconds * 1000)).fromNow()}
            </Tag>
          </CardItemExtra>
        ) : null}
      </CardItemContent>
      <CardItemIconContent lg={2} sm={24} bgcolor={placeQueueColor[item.queueStatus]}>
        {renderIcon()}
        {placeQueueLabel[item.queueStatus]}
      </CardItemIconContent>
    </CardItemWrapper>
  );
};

export default CardItem;
