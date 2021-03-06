import { Alert, Spin } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { placeDistances } from '../../../utils/constraints';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper, Loading, WarningBox } from './styles';

const minutesUntilWarning = process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING
  ? Number(process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING)
  : 15;
if (!process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING) {
  console.error(
    'Configuration for minutesUntilWarning not found on env (process.env.NEXT_PUBLIC_MINUTES_UNTIL_WARNING), using default 15 minutes'
  );
}

/**
 * PlaceListTemplate
 */
const PlaceListTemplate: React.FC<PlaceListTemplateProps> = ({
  data,
  showQueueUpdatedAt,
  header,
  filter,
  loading,
  sampleMode,
  city,
  shouldShowFeaturesBanner,
  enablePublicQueueUpdate,
  currentCoordinate,
  publicUpdate,
  ...props
}) => {
  const isDemonstration = city && city.includes('Demonstração');

  return (
    <React.Fragment>
      <PlaceListSearchWrapper>{header}</PlaceListSearchWrapper>
      <PlaceListWrapper {...props}>
        {isDemonstration && (
          <Alert
            style={{ marginBottom: 16, textAlign: 'center' }}
            message="Esta é uma cidade de demonstração do sistema Mapa da Vacina, para que você possa entender como os pontos de vacinação são apresentados com suas respectivas filas"
            type="success"
          />
        )}
        {filter}
        <Spin spinning={loading} indicator={<Loading spin />} size="large" style={{ marginTop: 28 }}>
          {data.map((item) => {
            const value = placeDistances[item.type];
            const formattedDate = new Date(item.queueUpdatedAt?._seconds * 1000);
            const canUpdate = enablePublicQueueUpdate && item.distance && item.distance <= value;

            const haveWarning = !item.open
              ? false
              : dayjs(formattedDate).add(minutesUntilWarning, 'minutes').isBefore(dayjs());
            return (
              <CardItem
                key={item.id}
                showQueueUpdatedAt={showQueueUpdatedAt}
                haveWarning={haveWarning}
                item={item}
                coordinate={currentCoordinate}
                canUpdate={canUpdate}
                publicUpdate={() => publicUpdate(item)}
              />
            );
          })}
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
      {shouldShowFeaturesBanner && (
        <WarningBox>
          <p>
            Assim que a prefeitura de <strong>{city}</strong> entrar em contato conosco, será apresentado também:
          </p>
          <div>
            <ul>
              <li>O tamanho da fila em cada ponto de vacinação</li>
              <li> Datas de vacinação por idade</li>
              <li>Os pontos de vacinação mais próximos para vacinar</li>
              <li>Os melhores horários para em cada ponto</li>
            </ul>
          </div>
          <p>
            Veja
            <a href={`https://demonstracao.mapadavacina.com.br/`} rel="noreferrer">
              um exemplo
            </a>
            com este recursos em funcionamento.
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
            .
          </p>
        </WarningBox>
      )}
    </React.Fragment>
  );
};

export default PlaceListTemplate;
