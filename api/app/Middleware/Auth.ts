import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import UserRepository from 'App/Models/User';
import AdminRepository from 'App/Models/Admin';

export default class Auth {
  /**
   * Middleware handles
   * @param param0
   * @param next
   * @returns
   */
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      // checks for Firebase user first
      const idToken = request.header('Authorization') as string;
      if (!idToken) return response.status(401).send({ message: 'Usuário não autorizado.' });

      const decodedToken = await FirebaseProvider.app.auth().verifyIdToken(idToken);
      console.log('decodedToken', JSON.stringify(decodedToken));
      const phone = decodedToken.phone_number;

      // then checks for our user in Firestore
      const prefectureId = request.post().prefectureId;
      if (prefectureId) {
        const user = await UserRepository.find({ phone: phone }, prefectureId);
        if (user) {
          request.user = user;
        } else {
          const userAdmin = await AdminRepository.find({ phone: phone });
          if (userAdmin) {
            request.user = userAdmin;
          }
        }
      }

      // code for middleware goes here. ABOVE THE NEXT CALL
      await next();
    } catch (err) {
      console.log(err);
      console.error(`${err.code} -  ${err.message}`);
      return response.status(401).send({ message: 'Usuário não autorizado.' });
    }
  }
}
