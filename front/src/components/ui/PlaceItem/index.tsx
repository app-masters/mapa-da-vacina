import { placeQueueLabel, placeQueueColor, placeType, placeQueue } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemIconContent, CardItemWrapper } from './styles';
import { Car, PersonPin } from '../Icons';
import { Place } from '../../../lib/Place';
import dayjs from 'dayjs';
import { Tag } from 'antd';
/**
 * CardItem
 */
const CardItem: React.FC<{ item: Place; showQueueUpdatedAt?: boolean }> = ({ item, showQueueUpdatedAt }) => {
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

  const formattedDate = new Date(item.queueUpdatedAt?._seconds * 1000);

  const haveWarning = dayjs(formattedDate)
    .add(Number(process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING), 'minutes')
    .isBefore(dayjs());

  return (
    <CardItemWrapper>
      <CardItemContent lg={12} sm={24}>
        <div>
          <h1 className="item-place">{item.title}</h1>
          <p>{`${item.addressStreet ? item.addressStreet : ''} ${
            item.addressDistrict ? ', ' + item.addressDistrict : ''
          }${item.addressCityState ? ' - ' + item.addressCityState : ''}${
            item.addressZip ? ', ' + item.addressZip : ''
          }`}</p>
        </div>
      </CardItemContent>
      <CardItemContent md={10} sm={24}>
        {item.open && item.closeAt ? (
          <CardItemExtra>
            <Tag color="default"> Fecha às {dayjs(item.closeAt._seconds * 1000).format('HH:mm')}</Tag>
          </CardItemExtra>
        ) : (
          <CardItemExtra>
            <Tag color="default">
              {item.openTomorrow && item.openAt
                ? `Abre amanhã às ${dayjs(item.closeAt._seconds * 1000).format('HH:mm')}`
                : `Não abrirá amanhã`}
            </Tag>
          </CardItemExtra>
        )}
      </CardItemContent>
      <CardItemContent md={10} sm={24}>
        {item.queueUpdatedAt &&
        item.open &&
        showQueueUpdatedAt &&
        item.queueStatus !== placeQueue.open &&
        item.queueStatus !== placeQueue.closed ? (
          <CardItemExtra>
            <Tag color={haveWarning ? 'error' : 'default'}>Atualizado {dayjs(formattedDate).fromNow()}</Tag>
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
