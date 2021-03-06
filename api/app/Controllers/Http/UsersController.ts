// IoC
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';

// Repositories
import UserRepository, { UserType } from 'App/Models/User';
import Prefecture from 'App/Models/Prefecture';
import Place from 'App/Models/Place';
import Admin, { AdminType } from 'App/Models/Admin';

// Validators
import UserValidator from 'App/Validators/UserValidator';
import ValidateValidator from 'App/Validators/ValidateValidator';

// Resources
import SmsMessages from 'App/Models/Messages/SmsMessages';
import parsePhoneNumberFromString from 'libphonenumber-js';

export default class UsersController {
  /**
   * Invite a new user
   */
  public async invite({ request, response }: HttpContextContract) {
    const data = await request.validate(UserValidator);
    if (!request.decodedIdToken || !request.decodedIdToken.phone_number)
      throw new Error('Usuário deve estar autenticado.');

    let admin: UserType | AdminType;
    const user = await UserRepository.findByPhone(request.decodedIdToken.phone_number, data.prefectureId);

    if (user) {
      admin = user;
    } else {
      const userAdmin = await Admin.findByPhone(request.decodedIdToken.phone_number);
      if (userAdmin) {
        admin = userAdmin;
      } else {
        throw new Error('Usuário não encontrado.');
      }
    }

    // const admin = await Admin.get({ phone: request.decodedIdToken.phone_number });

    if (
      (admin.role === 'superAdmin' && data.role !== 'prefectureAdmin') ||
      (admin.role === 'prefectureAdmin' && data.role === 'superAdmin') ||
      (admin.role === 'placeAdmin' && data.role !== 'queueObserver')
    ) {
      return response.status(401).send(`Usuário ${admin.role} não pode convidar ${data.role}.`);
    }
    const existUser = await UserRepository.findByPhone(data.phone, data.prefectureId);
    if (existUser) return response.status(401).send(`Número de telefone já convidado para esta prefeitura.`);
    const phoneId = parsePhoneNumberFromString(data.phone)?.nationalNumber.toString();
    const newUser = await UserRepository.save(
      { ...data, id: phoneId, active: false, invitedAt: new Date() },
      data.prefectureId
    );

    const prefecture = await Prefecture.findById(data.prefectureId);
    let placeTitle: string | undefined = '';
    if (newUser.role === 'placeAdmin' && data.placeId) {
      const place = await Place.findById(data.prefectureId, data.placeId);
      console.log(place);
      placeTitle = place?.title;
    }

    await SmsMessages.sendInviteSms(newUser, prefecture?.name, placeTitle);
    return response.status(200).send(newUser);
  }

  /**
   * Validate a new user
   */
  public async validate({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(ValidateValidator);
      console.log('Received data: ', data);
      if (!request.decodedIdToken) throw new Error('Usuário deve estar autenticado.');

      const userToken = request.decodedIdToken;

      // checks for our user in Firestore matching any user with the phone
      const userSnapshot = await FirebaseProvider.db
        .collectionGroup('user')
        .where('phone', '==', data.phone)
        .limit(1)
        .get();

      if (userSnapshot.docs.length > 0) {
        console.log('Found user snapshot: ', userSnapshot.docs[0].data());

        const user = userSnapshot.docs[0].data() as UserType;
        user.id = userSnapshot.docs[0].id;
        // first sign in
        if (!user.uid && !user.signedUpAt) {
          console.log('First login, activating user');
          user.uid = data.uid;
          user.signedUpAt = new Date();
          user.active = true;
          await UserRepository.save(user, user.prefectureId);
        } else if (user.active === false) {
          console.log('User Deactivated');
          return response.status(401).send('Seu usuário foi desativado.');
        }
        const prefecture = await Prefecture.findById(user.prefectureId);
        const place = user.placeId ? await Place.findById(user.prefectureId, user.placeId) : undefined;

        // Set custom claims in firebase auth
        await FirebaseProvider.app.auth().setCustomUserClaims(userToken.uid, {
          role: user.role,
          prefectureId: user.prefectureId,
          placeId: user.placeId
        });

        return response.status(200).send({ user, prefecture, place });
      }

      // if it wasn't a user, try and admin
      const admin = await Admin.find({ phone: data.phone });
      console.log('Found admin? ', admin);
      if (admin) {
        if (!admin.active) return response.status(401).send('Seu usuário foi desativado.');
        // Set custom claims in firebase auth
        await FirebaseProvider.app.auth().setCustomUserClaims(userToken.uid, {
          role: admin.role
        });
        return response.status(200).send({ admin });
      }
      console.log('No user found');

      // if coudn't find any user
      return response
        .status(401)
        .send(
          'Seu telefone não está na lista de convites para utilizar o Mapa da Vacina, fale com o responsável pelo ponto de vacinação ou da prefeitura'
        );
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}
