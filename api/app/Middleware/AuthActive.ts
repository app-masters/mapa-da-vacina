import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import Admin, { AdminType } from 'App/Models/Admin';
// Repositories
import UserRepository, { UserType } from 'App/Models/User';

/**
 * Auth active middleware checks for google credentials and existing role
 */
export default class AuthActive {
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
      if (!idToken)
        return response.status(401).send({ message: 'Usuário não autorizado. IdToken recebido: ' + idToken });

      const decodedToken = await FirebaseProvider.app.auth().verifyIdToken(idToken);
      console.log('decodedToken', JSON.stringify(decodedToken));

      // No auth data from firebase
      if (!decodedToken.uid || !decodedToken.phone_number) {
        return response.status(401).send({ message: 'Usuário não encontrado.' });
      }

      // user active or not
      let user: UserType | AdminType | null;
      user = await Admin.findByPhone(decodedToken.phone_number);

      if (!user && decodedToken.prefectureId) {
        user = await UserRepository.findByPhone(decodedToken.phone_number, decodedToken.prefectureId);
      }

      if (!user || !user.active) {
        return response.status(401).send({ message: 'Usuário não encontrado ou inativo.' });
      }

      request.decodedIdToken = decodedToken;

      // code for middleware goes here. ABOVE THE NEXT CALL
      await next();
    } catch (err) {
      console.log(err);
      console.error(`${err.code} -  ${err.message}`);
      return response.status(401).send({ message: 'Usuário não autorizado.' });
    }
  }
}
