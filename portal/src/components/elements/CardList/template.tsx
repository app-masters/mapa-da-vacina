import { Space } from 'antd';
import React from 'react';
import CardItem from '../../ui/CardItem';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { CardListWrapper, CardListTemplateProps, CardListSearchWrapper } from './styles';
import Pin from '../../ui/Icons/Pin';
import Person from '../../ui/Icons/Person';
import Search from '../../ui/Icons/Search';

/**
 * CardListTemplate
 */
const CardListTemplate: React.FC<CardListTemplateProps> = ({ data, ...props }) => {
  return (
    <React.Fragment>
      <CardListSearchWrapper>
        <Space wrap>
          <p>Encontre seu ponto</p>
          <div>
            <Input style={{ marginRight: 8 }} placeholder="Minha idade" prefix={<Person />} />
            <Input placeholder="CEP" prefix={<Pin />} />
          </div>
          <Button icon={<Search />} type="primary" size="large">
            Buscar
          </Button>
        </Space>
      </CardListSearchWrapper>
      <CardListWrapper {...props}>
        {data.map((item) => (
          <CardItem key={item.id} item={item} />
        ))}
      </CardListWrapper>
    </React.Fragment>
  );
};

export default CardListTemplate;
