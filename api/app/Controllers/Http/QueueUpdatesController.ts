import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Place from 'App/Models/Place';
import Prefecture from 'App/Models/Prefecture';
import QueueUpdate from 'App/Models/QueueUpdate';
import QueueUpdateValidator from 'App/Validators/QueueUpdateValidator';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';

export default class QueueUpdatesController {
  /**
   * Insert queue status
   * @param param0
   * @returns
   */
  public async updateQueueStatus({ request, response }: HttpContextContract) {
    const data = await request.validate(QueueUpdateValidator);
    const ip = request.ip();
    // Log provisório para identificar erros no inicio
    // RollbarProvider.info('Updating queue Status', { data, ip });

    const postsLastMinutes = await QueueUpdate.getUpdatesByIp(data.placeId, ip);

    if (postsLastMinutes && postsLastMinutes.length > 0) {
      console.log("Can't update queue again before 2 minutes " + data.placeId + ' ' + ip);
      return response
        .status(401)
        .send({ message: "Can't update queue again before 2 minutes " + data.placeId + ' ' + ip });
    }

    const prefecture = await Prefecture.findById(data.prefectureId);
    if (!prefecture) {
      console.log("Couldn't find prefecture ", data.prefectureId);
      return response.status(404).send({ message: "Couldn't find prefecture " + data.prefectureId });
    }

    const place = await Place.findById(data.prefectureId, data.placeId);
    if (!place) {
      console.log("Couldn't find place ", data.placeId);
      return response.status(404).send({ message: "Couldn't find place " + data.placeId });
    } else if (!place.open) {
      console.log("Can't update status on closed place ", data.placeId);
      return response.status(401).send({ message: "Can't update status on closed place " + data.placeId });
    }

    if (prefecture.enablePublicQueueUpdate === false) {
      console.log('This prefecture does not allow public queue updates.');
      return response.status(401).send({ message: 'This prefecture does not allow public queue updates.' });
    }

    const status = await QueueUpdate.insertMeanQueueUpdate(data.prefectureId, data.placeId, data.status, ip);

    return response.status(200).send(status);
  }
}
