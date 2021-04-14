import { Spin } from 'antd';
import React from 'react';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper } from './styles';

/**
 * PlaceListTemplate
 */
const PlaceListTemplate: React.FC<PlaceListTemplateProps> = ({ data, header, loading, ...props }) => {
  return (
    <React.Fragment>
      <PlaceListSearchWrapper>{header}</PlaceListSearchWrapper>
      <PlaceListWrapper {...props}>
        <Spin spinning={loading} size="large" style={{ padding: 16 }}>
          {data.map((item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </Spin>
      </PlaceListWrapper>
    </React.Fragment>
  );
};

export default PlaceListTemplate;
