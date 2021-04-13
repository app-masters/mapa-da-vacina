import React from 'react';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper } from './styles';

/**
 * PlaceListTemplate
 */
const PlaceListTemplate: React.FC<PlaceListTemplateProps> = ({ data, header, ...props }) => {
  return (
    <React.Fragment>
      <PlaceListSearchWrapper>{header}</PlaceListSearchWrapper>
      <PlaceListWrapper {...props}>
        {data.map((item) => (
          <CardItem key={item.id} item={item} />
        ))}
      </PlaceListWrapper>
    </React.Fragment>
  );
};

export default PlaceListTemplate;
