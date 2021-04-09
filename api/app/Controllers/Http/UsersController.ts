import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserValidator from 'App/Validators/UserValidator';
import ValidateValidator from 'App/Validators/ValidateValidator';
import UserRepository, { UserType } from 'App/Models/User';
import SmsMessages from 'App/Models/Messages/SmsMessages';
import Prefecture from 'App/Models/Prefecture';
import Place from 'App/Models/Place';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import Admin from 'App/Models/Admin';
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

  /**
   * Validate a new user
   */
  public async validate({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(ValidateValidator);

      // checks for our user in Firestore matching any user with the phone
      const userSnapshot = await FirebaseProvider.db
        .collectionGroup('user')
        .where('phone', '==', data.phone)
        .limit(1)
        .get();

      if (userSnapshot.docs.length > 0) {
        const user = userSnapshot.docs[0].data() as UserType;
        console.log('user', user);
        // first sign in
        if (!user.uid && !user.signedUpAt) {
          user.uid = data.uid;
          user.signedUpAt = new Date();
          user.active = true;
          await UserRepository.save(user, user.prefectureId);
        }
        const prefecture = Prefecture.findById(user.prefectureId);
        const place = user.placeId ? Prefecture.findById(user.placeId) : undefined;
        return response.status(200).send({ user, prefecture, place });
      }

      // if it wasn't a user, try and admin
      const admin = await Admin.get({ phone: data.phone });
      if (admin) return response.status(200).send(admin);

      // if coudn't find any user
      return response
        .status(401)
        .send(
          'Seu telefone não está na lista de convites para utilizar o filômetro, fale com o responsável pelo ponto de vacinação ou da prefeitura'
        );
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}
