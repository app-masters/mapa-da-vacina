import { SSRPropsContext } from 'next-firebase-auth';
import { ParsedUrlQuery } from 'node:querystring';
import cookies from 'next-cookies';
import { User } from '../lib/User';
import { GetServerSidePropsResult } from 'next';

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
    if (AuthUser) {
      return {
        redirect: {
          permanent: false,
          destination: '/validate'
        }
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/auth'
        }
      };
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth'
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
    localStorage.clear();
  }
};
