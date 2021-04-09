import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserValidator from 'App/Validators/UserValidator';
import UserRepository from 'App/Models/User';
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

      const newUser = await UserRepository.save({ ...data, active: false, invitedAt: new Date() }, data.prefectureId);
      console.log(newUser);

      return response.status(200).send(newUser);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}
