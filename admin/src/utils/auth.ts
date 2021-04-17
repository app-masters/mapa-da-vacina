import { SSRPropsContext } from 'next-firebase-auth';
import { ParsedUrlQuery } from 'node:querystring';
import cookies from 'next-cookies';
import { User } from '../lib/User';
import { API } from './api';
import logging from './logging';
import { GetServerSidePropsResult } from 'next';
import { serialize } from 'cookie';

/**
 * Get the user and return the correct format
 * @param user data saved on user cookie
 */
const parseCookieUser = (user: User | string): User => {
  if (typeof user === 'string') {
    return JSON.parse(user) as User;
  }
  return user;
};

/**
 * Check if user is logged and redirect it if it's not
 * @param ctx Next page context
 */
export const shouldBeLoggedIn = async (
  ctx: SSRPropsContext<ParsedUrlQuery>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  try {
    const { AuthUser } = ctx;
    const allCookies = cookies(ctx);
    const userTokenId = await AuthUser.getIdToken();
    // Have user on cookie
    if (allCookies && allCookies.user) {
      const user = parseCookieUser(allCookies.user);
      // Return the user and skip validation
      if (user) {
        return {
          props: { user, token: userTokenId }
        };
      }
    }
    // Doesn't have user on cookies then validate it
    API.defaults.headers['Authorization'] = userTokenId;
    const response = await API.post('/validate-user', {
      phone: AuthUser.claims.phone_number,
      uid: AuthUser.id
    });
    // Recover user
    const user = (response.data.user || response.data.admin) as User;
    // Set response user to cookies
    ctx.res.setHeader('Set-Cookie', serialize('user', JSON.stringify(user), { path: '/' }));
    // Return the validated user
    return {
      props: { user, token: userTokenId }
    };
  } catch (err) {
    // Error when validating user 401
    logging.error('Error auth: ', { user: ctx.AuthUser, err });

    // Set error on cookies
    ctx.res.setHeader(
      'Set-Cookie',
      serialize(
        'Filometro.AuthError',
        err.response.data || 'Erro ao autenticar. Entre em contato com o administrador',
        {
          path: '/'
        }
      )
    );

    return {
      redirect: {
        permanent: false,
        destination: err.response.status === 401 ? '/error' : 'auth'
      }
    };
  }
};

/**
 * Check if the users must be persisted
 */
export const clearAuthCookies = () => {
  if (process.browser) {
    document.cookie = `user=; path=/; expires=${new Date()}`;
    document.cookie = `Filometro.AuthError=; path=/; expires=${new Date()}`;
    localStorage.clear();
  }
};

/**
 * Recover error messages from cookies
 */
export const recoverErrorMessage = (ctx) => {
  const allCookies = cookies(ctx);
  if (allCookies && allCookies['Filometro.AuthError']) {
    return allCookies['Filometro.AuthError'];
  }
};
