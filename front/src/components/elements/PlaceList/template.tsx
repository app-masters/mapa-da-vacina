import { Spin } from 'antd';
import React from 'react';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper, Loading } from './styles';

/**
 * PlaceListTemplate
 */
const PlaceListTemplate: React.FC<PlaceListTemplateProps> = ({
  data,
  showQueueUpdatedAt,
  header,
  loading,
  ...props
}) => {
  return (
    <React.Fragment>
      <PlaceListSearchWrapper>{header}</PlaceListSearchWrapper>
      <PlaceListWrapper {...props}>
        <Spin spinning={loading} indicator={<Loading spin />} size="large" style={{ marginTop: 28 }}>
          {data.map((item) => (
            <CardItem key={item.id} showQueueUpdatedAt={showQueueUpdatedAt} item={item} />
          ))}
        </Spin>
      </PlaceListWrapper>
    </React.Fragment>
  );
};

export default PlaceListTemplate;
