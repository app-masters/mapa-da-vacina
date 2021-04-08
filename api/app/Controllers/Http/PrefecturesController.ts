import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PrefectureRepository from 'App/Models/Prefecture';
import { getSlug } from 'App/Helpers';

//import Prefecture from '@ioc:Adonis/Providers/Firebase';

export default class PrefecturesController {
  /**
   * Index
   */
  public async index({ response }: HttpContextContract) {
    const prefectures = await PrefectureRepository.list({});
    response.send(prefectures);
  }

  /**
   * Save a new prefecture
   */
  public async store({ request, response }: HttpContextContract) {
    const body = request.post();
    const pref = await PrefectureRepository.save({
      name: body.name,
      slug: getSlug(body.name)
    });
    response.send(pref);
  }

  /**
   * Find a prefecture by id
   */
  public async show({ response, params }: HttpContextContract) {
    const prefecture = await PrefectureRepository.findByIdWithPlacesAndUsers(params.id);
    response.send(prefecture);
  }

  /**
   * Update
   */
  public async update({ request, response }: HttpContextContract) {
    const body = request.post();
    const pref = PrefectureRepository.save({
      id: body.id,
      name: body.name,
      slug: getSlug(body.name)
    });
    response.send(pref);
  }

  /**
   * Delete
   */
  public async destroy({ response, params }: HttpContextContract) {
    await PrefectureRepository.delete(params.id);
    return response.status(200);
  }
}
