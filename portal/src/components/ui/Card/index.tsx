import { CardWrapper, CardValue } from './styles';

export type CardProps = {
  value: string | number;
  description: string;
  onPress?: () => void;
};

/**
 * Card
 */
const Card: React.FC<CardProps> = ({ value, description, onPress = () => ({}) }) => {
  return (
    <CardWrapper onClick={onPress}>
      <CardValue>{value}</CardValue>
      <p>{description}</p>
    </CardWrapper>
  );
};

export default Card;
