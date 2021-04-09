import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserValidator from 'App/Validators/UserValidator';
import UserRepository from 'App/Models/User';
import SmsMessages from 'App/Models/Messages/SmsMessages';
import Prefecture from 'App/Models/Prefecture';
import Place, { PlaceType } from 'App/Models/Place';
export default class UsersController {
  /**
   * Invite a new user
   */
  public async invite({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);

      const admin = request.user;
      if (!admin) throw new Error('Erro ao obter usuário registrado.');

      if (
        (admin.role === 'superAdmin' && data.role !== 'prefectureAdmin') ||
        (admin.role === 'prefectureAdmin' && data.role === 'superAdmin') ||
        (admin.role === 'placeAdmin' && data.role !== 'queueObserver')
      ) {
        return response.status(401).send(`Usuário ${admin.role} não pode convidar ${data.role}.`);
      }
      const existUser = await UserRepository.find({ phone: data.phone }, data.prefectureId);
      if (existUser) return response.status(401).send(`Número de telefone já convidado para esta prefeitura.`);

      const newUser = await UserRepository.save({ ...data, active: false, invitedAt: new Date() }, data.prefectureId);
      console.log(newUser);
      // Todo: get data from listener instead of querying again
      const prefecture = await Prefecture.getById(data.prefectureId);
      let placeTitle: string = '';
      if (newUser.role === 'placeAdmin' && data.placeId) {
        placeTitle = await (await Place.getById(data.placeId, data.prefectureId)).title;
      }
      await SmsMessages.sendInviteSms(newUser, prefecture.name, placeTitle);

      return response.status(200).send(newUser);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}
