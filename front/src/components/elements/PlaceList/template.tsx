import { Alert, Spin } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Place } from '../../../lib/Place';
import CardItem from '../../ui/PlaceItem';
import { PlaceListWrapper, PlaceListTemplateProps, PlaceListSearchWrapper, Loading, WarningBox } from './styles';
import { getDistance } from 'geolib';

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
  loading,
  sampleMode,
  city,
  shouldShowFeaturesBanner,
  position,
  ...props
}) => {
  const isDemonstration = city && city.includes('Demonstração');

  /**
   * calcDistance
   */
  const calcDistance = (position: { latitude: number; longitude: number }, item: Place): string => {
    const distance = getDistance(position, { latitude: item.latitude, longitude: item.longitude });
    const metersAway = distance / 1000;
    if (metersAway > 1) {
      return `${metersAway.toFixed(1)}km`.replace('.', ',');
    }
    return `${metersAway * 1000}m`;
  };

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
          {data.map((item) => {
            const formattedDate = new Date(item.queueUpdatedAt?._seconds * 1000);
            const distance = position && item.latitude && item.longitude ? calcDistance(position, item) : null;
            const haveWarning = !item.open
              ? false
              : dayjs(formattedDate).add(minutesUntilWarning, 'minutes').isBefore(dayjs());
            return (
              <CardItem
                key={item.id}
                showQueueUpdatedAt={showQueueUpdatedAt}
                haveWarning={haveWarning}
                item={item}
                distance={distance}
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
