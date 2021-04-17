import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';

/**
 * Auth middleware checks only if google credentials exist
 */
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
      if (!decodedToken.uid) {
        return response.status(401).send({ message: 'Usuário não encontrado.' });
      }

      console.log('decodedToken', JSON.stringify(decodedToken));
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
