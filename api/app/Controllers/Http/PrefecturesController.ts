import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Config from '@ioc:Adonis/Core/Config';
import PrefectureRepository from 'App/Models/Prefecture';
import Cache from 'memory-cache';
import fetch from 'node-fetch';
import { calculateDistance, sanitizeZip } from 'App/Helpers';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
export default class PrefecturesController {
  /**
   * Index
   */
  public async index({ response }: HttpContextContract) {
    const prefectures = await PrefectureRepository.list();
    response.send(prefectures);
  }

  /**
   * List Active prefectures
   */
  public async listActive({ response }: HttpContextContract) {
    // cache 1 minuto
    const cacheKey = 'prefectures-list';
    // Tentar obter do cache
    let data = Cache.get(cacheKey);
    console.log('Reading cache: ', cacheKey);
    // Se não tiver, salva no cache
    if (!data) {
      data = await PrefectureRepository.listActive();
      console.log('Adding cache: ', cacheKey);
      Cache.put(cacheKey, data);
    }
    response.send(data);
  }

  /**
   * Find a prefecture by id
   */
  public async show({ request, response, params }: HttpContextContract) {
    //const cacheKey = `prefecture-${params.id}`;
    const queryParams = request.get();
    console.log('Query params', queryParams);

    let zip = queryParams['zip'];
    const latitude = queryParams['latitude'];
    const longitude = queryParams['longitude'];

    // Se tiver latitude e longitude / zip
    // acha o zip e verifica o cache
    // let foundZip = zip;
    if (latitude && longitude) {
      const roundedLatitude = Number(latitude).toFixed(3);
      const roundedLongitude = Number(longitude).toFixed(3);
      try {
        const responseZip = await fetch(Config.get('app.getZipUrl'), {
          method: 'POST',
          body: JSON.stringify({ latitude: roundedLatitude, longitude: roundedLongitude }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (responseZip.status === 200) {
          zip = sanitizeZip((await responseZip.json()).zip);
          RollbarProvider.info('Found zip via coordinates', { zip: zip, coordinates: { latitude, longitude } });
        } else {
          zip = undefined;
          RollbarProvider.info('Error fetching zip', { coordinates: { latitude, longitude } });
          console.log('Error fetching zip... Check cloud functions log for more information');
        }
      } catch (err) {
        zip = undefined;
        RollbarProvider.info('Error fetching zip', { coordinates: { latitude, longitude } });
        console.log('Error fetching zip', err);
      }
    }
    // verifica o cache
    let cacheKey = `prefecture:${params.id}-`;
    if (zip) cacheKey += `zip:${zip}`;
    console.log('Reading cache: ', cacheKey);
    let data = Cache.get(cacheKey);

    // Se não tiver cache, salva
    if (!data) {
      data = await PrefectureRepository.findByIdWithPlaces(params.id);

      // Se tiver zip, encontra as coordenadas e calcula as distancias
      // Se tiver lat long, calcula as distancias
      // Se não tiver nada, não calcula as distancias
      let coordinates;
      if (latitude && longitude) {
        coordinates = { latitude, longitude };
      } else if (zip) {
        try {
          const resp = await fetch(Config.get('app.getCoordinatesUrl'), {
            method: 'post',
            body: JSON.stringify({ addressZip: zip }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (resp.status === 200) {
            coordinates = await resp.json();
            RollbarProvider.info('Found coordinates via zip', { zip: zip, coordinates });
          } else {
            coordinates = undefined;
            RollbarProvider.info('Error fetching coordinates', { zip: zip });
            console.log('Error fetching coordinates... Check cloud functions log for more information');
          }
        } catch (err) {
          coordinates = undefined;
          RollbarProvider.info('Error fetching coordinates', { zip: zip });
          console.log('Error fetching coordinates', err);
        }
      }

      for (const place of data.places) {
        if (
          place.open &&
          place.queueStatus !== 'open' &&
          place.queueUpdatedAt &&
          Math.abs(place.queueUpdatedAt.toDate().getTime() - new Date().getTime()) >= 50 * 60 * 1000
        ) {
          place.queueStatus = 'open';
        }
        // If there are coordinates, calculate the distance
        if (coordinates && place.latitude && place.longitude) {
          place.distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            place.latitude,
            place.longitude
          );
        } else {
          place.distance = Number.MAX_VALUE;
        }
      }
      // sort by distance
      data.places.sort((a, b) => {
        return a.distance - b.distance;
      });

      console.log('Adding cache: ', cacheKey);
      Cache.put(cacheKey, data, 30 * 60 * 1000);
    }

    response.send(data);
  }

  /**
   * Find a prefecture by id
   */
  public async showCoordinates({ response, params }: HttpContextContract) {
    const { latitude, longitude } = params;
    // Arrendondar
    const lat = Number(latitude).toFixed(3);
    const lon = Number(longitude).toFixed(3);

    const data = await PrefectureRepository.findByIdWithPlaces(params.id);
    console.log(latitude, longitude);

    for (const place of data.places) {
      if (
        place.open &&
        place.queueStatus !== 'open' &&
        place.queueUpdatedAt &&
        Math.abs(place.queueUpdatedAt.toDate().getTime() - new Date().getTime()) >= 50 * 60 * 1000
      ) {
        place.queueStatus = 'open';
      }

      if (latitude && longitude && place.latitude && place.longitude) {
        place.distance = calculateDistance(latitude, longitude, place.latitude, place.longitude);
      }
    }

    // console.log('Adding cache: ', cacheKey);
    // Cache.put(cacheKey, data, 30 * 60 * 1000);

    response.send(data);
  }
}
