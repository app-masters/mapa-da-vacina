import { placeQueueLabel, placeQueueColor, placeType } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemLeftContent, CardItemWrapper } from './styles';
import { Car, PersonPin } from '../Icons';
import { Place } from '../../../lib/Place';

/**
 * CardItem
 */
const CardItem: React.FC<{ item: Place }> = ({ item }) => {
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

  return (
    <CardItemWrapper>
      <CardItemLeftContent lg={3} md={4} xs={24} sm={24} bgcolor={placeQueueColor[item.queueStatus]}>
        {renderIcon()}
        {placeQueueLabel[item.queueStatus]}
      </CardItemLeftContent>
      <CardItemContent lg={15} md={15} xs={24} sm={24}>
        <h1 className="item-place">{item.title}</h1>
        <p>{`${item.addressStreet} - ${item.addressCityState}, ${item.addressCityState} - ${item.addressZip}`}</p>
      </CardItemContent>
      <CardItemExtra lg={5} md={5} xs={24} sm={24}>
        <p>
          Atualizado em:{' '}
          {item.queueUpdatedAt ? new Date(item.queueUpdatedAt._seconds * 1000).toLocaleDateString('pt-BR') : ''}
        </p>
      </CardItemExtra>
    </CardItemWrapper>
  );
};

export default CardItem;
