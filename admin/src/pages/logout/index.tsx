import { NextPage } from 'next';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth';
import Router from 'next/router';
import React from 'react';
import Loader from '../../components/ui/Loader';
import { clearAuthCookies } from '../../utils/auth';
import LayoutView from '../../views/Logout';

/**
 * Dashboard page
 * @params NextPage
 */
const Logout: NextPage = () => {
  const AuthUser = useAuthUser();

  /**
   * handleLogout
   */
  const handleLogout = async () => {
    await AuthUser.signOut();
    clearAuthCookies();
    Router.push('/auth');
  };
  return <LayoutView handleLogout={handleLogout} />;
};

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  // eslint-disable-next-line require-await
})(async () => {
  return {
    props: {}
  };
});

export default withAuthUser({
  LoaderComponent: Loader
})(Logout);
