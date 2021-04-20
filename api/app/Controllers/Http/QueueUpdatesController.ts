import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Prefecture from 'App/Models/Prefecture';
import QueueUpdate from 'App/Models/QueueUpdate';
import QueueUpdateValidator from 'App/Validators/QueueUpdateValidator';

export default class QueueUpdatesController {
  /**
   * Insert queue status
   * @param param0
   * @returns
   */
  public async updateQueueStatus({ request, response }: HttpContextContract) {
    const data = await request.validate(QueueUpdateValidator);
    const ip = request.ip();
    console.log(data, ip);

    const prefecture = await Prefecture.findById(data.prefectureId);
    if (!prefecture) {
      console.log("Couldn't find prefecture ", data.prefectureId);
      return;
    }

    if (prefecture.enablePublicQueueUpdate === false) {
      console.log('This prefecture does not allow public queue updates.');
      return;
    }

    const status = await QueueUpdate.insertMeanQueueUpdate(data.prefectureId, data.placeId, data.status, ip);

    response.status(200).send(status);
  }
}
