import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PrefectureRepository from 'App/Models/Prefecture';
import Cache from 'memory-cache';

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
  public async show({ response, params }: HttpContextContract) {
    const cacheKey = `prefecture-${params.id}`;
    // Tentar obter do cache
    let data = Cache.get(cacheKey);
    console.log('Reading cache: ', cacheKey);

    // Se não tiver, salva no cache
    if (!data) {
      data = await PrefectureRepository.findByIdWithPlaces(params.id);
      console.log('Adding cache: ', cacheKey);
      Cache.put(cacheKey, data);
    }
    response.send(data);
  }
}
