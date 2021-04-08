import { CardItem as CardItemType } from '../../../lib/CardItem';
import { itemStatus, statusColor } from '../../../utils/constraints';
import { CardItemContent, CardItemExtra, CardItemLeftContent, CardItemWrapper } from './styles';
import Car from '../Icons/Car';
import PersonPin from '../Icons/PersonPin';

/**
 * CardItem
 */
const CardItem: React.FC<{ item: CardItemType }> = ({ item }) => {
  /**
   * Render the icon based on status
   */
  const renderIcon = () => {
    switch (item.type) {
      case 'drive':
        return <Car width={31} height={30} />;
      case 'local':
        return <PersonPin width={31} height={30} />;
    }
  };

  return (
    <CardItemWrapper>
      <CardItemLeftContent lg={3} md={4} xs={24} sm={24} backgroundColor={statusColor[item.status]}>
        {renderIcon()}
        {itemStatus[item.status]}
      </CardItemLeftContent>
      <CardItemContent lg={15} md={15} xs={24} sm={24}>
        <h1 className="item-type">{item.typeLabel}</h1>
        <h1 className="item-place">{item.place}</h1>
        <p>{item.address}</p>
      </CardItemContent>
      <CardItemExtra lg={5} md={5} xs={24} sm={24}>
        <p>Atualizado em: {item.updatedAt.toLocaleDateString('pt-BR')}</p>
      </CardItemExtra>
    </CardItemWrapper>
  );
};

export default CardItem;
