import { NextPage } from 'next';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth';
import Router from 'next/router';
import React from 'react';
import Button from '../../components/ui/Button';
import { clearAuthCookies } from '../../utils/auth';
import { LayoutWrapper } from './styles';

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
  return (
    <LayoutWrapper>
      <div>
        <h1>
          O número informado não se encontra na base de dados, por favor entre em contato com o administrador da região
        </h1>
        <div>
          <Button type="primary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async () => {
  return {
    props: {}
  };
});

export default withAuthUser({})(Logout);
