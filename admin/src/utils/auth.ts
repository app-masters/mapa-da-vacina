import { SSRPropsContext } from 'next-firebase-auth';
import Router from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import cookies from 'next-cookies';
import { User } from '../lib/User';
import { Prefecture } from '../lib/Prefecture';
import { API } from './api';

/**
 * Redirect user on server and client side
 * @param path redirect destination
 */
export const redirect = (ctx: SSRPropsContext<ParsedUrlQuery>, path: string) => {
  if (ctx.res) {
    // Server side
    ctx.res.writeHead(301, {
      Location: path
    });
    return ctx.res.end();
  } else {
    // Client side
    return Router.push(path);
  }
};

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
 * Get the prefecture and return the correct format
 * @param prefecture data saved on user cookie
 */
const parseCookiePrefecture = (prefecture: Prefecture | string): Prefecture => {
  if (typeof prefecture === 'string') {
    return JSON.parse(prefecture) as Prefecture;
  }
  return prefecture;
};

/**
 * Check if user is logged and redirect it if it's not
 * @param ctx Next page context
 */
export const shouldBeLoggedIn = async (ctx: SSRPropsContext<ParsedUrlQuery>) => {
  try {
    const allCookies = cookies(ctx);
    let user;
    let prefecture;
    if (allCookies && allCookies.user && allCookies.prefecture) {
      user = parseCookieUser(allCookies.user);
      prefecture = parseCookiePrefecture(allCookies.prefecture);
    }
    const { AuthUser } = ctx;

    if (AuthUser && user?.id) {
      return {
        data: {
          user: user,
          prefecture: prefecture,
          token: await AuthUser.getIdToken()
        },
        shouldPersist: true
      };
    }

    API.defaults.headers['Authorization'] = await AuthUser.getIdToken();
    const response = await API.post('/validate-user', {
      phone: AuthUser.claims.phone_number,
      uid: AuthUser.id
    });
    return {
      data: {
        user: response.data.user || response.data.admin,
        prefecture: response.data?.prefecture || null,
        token: await AuthUser.getIdToken()
      },
      shouldPersist: true
    };
  } catch (err) {
    console.error(err);
    if (err.status !== 401) {
      redirect(ctx, '/logout');
    }
    redirect(ctx, '/auth');
  }
};

/**
 * Check if the users must be persisted
 */
export const shouldPersistUser = async (data: { user: User; prefecture: Prefecture; token: string }) => {
  if (process.browser && data) {
    const localUser = localStorage.getItem('@auth-user');
    const localPrefecture = localStorage.getItem('@auth-prefecture');
    API.defaults.headers.common['Authorization'] = data.token;
    if (!localUser) {
      localStorage.setItem('@auth-user', JSON.stringify(data.user));
      document.cookie = `user=${JSON.stringify(data.user)}; path=/`;
    }
    if (!localPrefecture) {
      localStorage.setItem('@auth-prefecture', JSON.stringify(data.prefecture));
      document.cookie = `prefecture=${JSON.stringify(data.prefecture)}; path=/`;
    }
  }
};

/**
 * Check if the users must be persisted
 */
export const clearAuthCookies = () => {
  if (process.browser) {
    document.cookie = `user=; path=/; expires=${new Date()}`;
    document.cookie = `prefecture=; path=/; expires=${new Date()}`;
    localStorage.clear();
  }
};
