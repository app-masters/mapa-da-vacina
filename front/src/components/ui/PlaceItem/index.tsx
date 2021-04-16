import { placeQueueLabel, placeQueueColor, placeType } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemLeftContent, CardItemWrapper } from './styles';
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
  const haveWarning = dayjs(formattedDate).add(15, 'minutes').isBefore(dayjs());

  return (
    <CardItemWrapper>
      <CardItemLeftContent lg={2} md={4} xs={24} sm={24} bgcolor={placeQueueColor[item.queueStatus]}>
        {renderIcon()}
        {placeQueueLabel[item.queueStatus]}
      </CardItemLeftContent>
      <CardItemContent lg={22} md={20} xs={24} sm={24}>
        <div>
          <h1 className="item-place">{item.title}</h1>
          <p>{`${item.addressStreet ? item.addressStreet : ''} ${
            item.addressDistrict ? ', ' + item.addressDistrict : ''
          }${item.addressCityState ? ' - ' + item.addressCityState : ''}${
            item.addressZip ? ', ' + item.addressZip : ''
          }`}</p>
        </div>
        {!!(item.queueUpdatedAt && item.open && showQueueUpdatedAt) ? (
          <CardItemExtra>
            <Tag color={haveWarning ? 'error' : 'default'}>Atualizado {dayjs(formattedDate).fromNow()}</Tag>
          </CardItemExtra>
        ) : null}
      </CardItemContent>
    </CardItemWrapper>
  );
};

export default CardItem;
