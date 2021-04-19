import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { ValidateWrapper } from './styles';
import { API } from '../../utils/api';
import { useAuthUser } from 'next-firebase-auth';
import { User } from '../../lib/User';
import logging from '../../utils/logging';
import { clearAuthCookies } from '../../utils/auth';
import Button from '../../components/ui/Button';
import Router from 'next/router';

/**
 * ValidateView
 */
const ValidateView: React.FC = () => {
  const [error, setError] = React.useState<string>(undefined);
  const authUser = useAuthUser();

  /**
   * handleLogout
   */
  const handleLogout = async () => {
    await authUser.signOut();
    clearAuthCookies();
    Router.push('/auth');
  };

  /**
   * validateUser
   */
  const validateUser = React.useCallback(async () => {
    try {
      const token = await authUser.getIdToken();
      API.defaults.headers['Authorization'] = token;
      const response = await API.post('/validate-user', {
        phone: authUser.claims.phone_number,
        uid: authUser.id
      });
      // Recover user
      const user = (response.data.user || response.data.admin) as User;
      // Set response user to cookies
      document.cookie = `user=${JSON.stringify(user)}; path=/`;
      // Return the validated user
      Router.push('/dashboard');
    } catch (err) {
      logging.error('Error auth: ', { user: authUser, err });
      setError(err?.response?.data || 'Erro ao autenticar. Entre em contato com o administrador');
    }
  }, [authUser]);

  React.useEffect(() => {
    validateUser();
  }, [validateUser]);

  return (
    <ValidateWrapper>
      <div>
        {error !== undefined ? (
          <div>
            <h1>{error}</h1>
            <div>
              <Button onClick={handleLogout}>Sair</Button>
            </div>
          </div>
        ) : (
          <h1>
            <LoadingOutlined spin style={{ marginRight: 16 }} />
            Por favor, aguarde enquanto validamos seu usuário...
          </h1>
        )}
      </div>
    </ValidateWrapper>
  );
};

export default ValidateView;
