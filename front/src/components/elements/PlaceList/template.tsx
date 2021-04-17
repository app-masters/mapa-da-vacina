import { Alert, Spin } from 'antd';
import React from 'react';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper, Loading, WarningBox } from './styles';

/**
 * PlaceListTemplate
 */
const PlaceListTemplate: React.FC<PlaceListTemplateProps> = ({
  data,
  showQueueUpdatedAt,
  header,
  loading,
  sampleMode,
  city,
  ...props
}) => {
  const isDemonstration = city && city.includes('Demonstração');
  return (
    <React.Fragment>
      <PlaceListSearchWrapper>{header}</PlaceListSearchWrapper>
      <PlaceListWrapper {...props}>
        {isDemonstration && (
          <Alert
            style={{ marginBottom: 16 }}
            message="Esta é uma cidade de demonstração do sistema Mapa da Vacina, para que você possa entender como os pontos de vacinação são apresentados com suas respectivas filas"
            type="success"
          />
        )}
        <Spin spinning={loading} indicator={<Loading spin />} size="large" style={{ marginTop: 28 }}>
          {data.map((item) => (
            <CardItem key={item.id} showQueueUpdatedAt={showQueueUpdatedAt} item={item} />
          ))}
        </Spin>
      </PlaceListWrapper>
      {sampleMode && (
        <WarningBox>
          <p>
            Estamos aguardando o contato da prefeitura de <strong>{city}</strong> para apresentarmos também o tamanho da
            fila em cada ponto de vacinação.
          </p>
          <p>
            Se você é da prefeitura de <strong>{city}</strong>{' '}
            <a
              href={`https://api.whatsapp.com/send?phone=5532988735683&text=Sou da prefeitura de ${city} e gostaria de saber como utilizar o Mapa da Vacina.`}
              target="_blank"
              rel="noreferrer"
            >
              entre em contato conosco
            </a>
          </p>
        </WarningBox>
      )}
    </React.Fragment>
  );
};

export default PlaceListTemplate;
