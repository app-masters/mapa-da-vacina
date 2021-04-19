import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Config from '@ioc:Adonis/Core/Config';
import PrefectureRepository from 'App/Models/Prefecture';
import Cache from 'memory-cache';
import fetch from 'node-fetch';
import { calculateDistance } from 'App/Helpers';
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

    const latitude = queryParams['latitude'];
    const longitude = queryParams['longitude'];
    const zip = queryParams['zip'];

    // Tentar obter do cache
    const cacheKey = `prefecture-${params.id}-zip:${params.zip}`;
    console.log('Reading cache: ', cacheKey);
    let data = Cache.get(cacheKey);

    // Se não tiver, salva no cache
    if (!data) {
      data = await PrefectureRepository.findByIdWithPlaces(params.id);

      console.log(zip);
      let coordinates;
      if (zip) {
        const resp = await fetch(Config.get('app.getCoordinatesUrl'), {
          method: 'post',
          body: JSON.stringify({ addressZip: zip }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (resp.status === 200) {
          coordinates = await resp.json();
        } else {
          coordinates = undefined;
          console.log('Error fetching coordinates... Check cloud functions log for more information');
        }
      } else if (latitude && longitude) {
        coordinates = { latitude, longitude };
      }
      console.log(coordinates);

      for (const place of data.places) {
        if (
          place.open &&
          place.queueStatus !== 'open' &&
          place.queueUpdatedAt &&
          Math.abs(place.queueUpdatedAt.toDate().getTime() - new Date().getTime()) >= 50 * 60 * 1000
        ) {
          place.queueStatus = 'open';
        }

        if (coordinates && place.latitude && place.longitude) {
          place.distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            place.latitude,
            place.longitude
          );
        }
      }
      // sort by distance
      data.places.sort((a, b) => {
        return +b.open - +a.open || a.distance - b.distance;
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
