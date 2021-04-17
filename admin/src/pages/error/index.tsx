import { NextPage } from 'next';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth';
import Router from 'next/router';
import React from 'react';
import Loader from '../../components/ui/Loader';
import { clearAuthCookies, recoverErrorMessage } from '../../utils/auth';
import ErrorView from '../../views/Error';

/**
 * Dashboard page
 * @params NextPage
 */
const Error: NextPage<{ message?: string }> = ({ message }) => {
  const AuthUser = useAuthUser();

  /**
   * handleLogout
   */
  const handleLogout = async () => {
    await AuthUser.signOut();
    clearAuthCookies();
    Router.push('/auth');
  };
  return <ErrorView handleLogout={handleLogout} message={message} />;
};

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  // eslint-disable-next-line require-await
})(async (ctx) => {
  const message = await recoverErrorMessage(ctx);
  return {
    props: { message }
  };
});

export default withAuthUser({
  LoaderComponent: Loader
})(Error);
