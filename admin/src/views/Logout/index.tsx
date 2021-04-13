import React from 'react';
import Button from '../../components/ui/Button';
import { LayoutWrapper } from './styles';

type LogoutProps = {
  handleLogout: () => void;
};

/**
 * Logout page
 */
const Logout: React.FC<LogoutProps> = ({ handleLogout }) => {
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

export default Logout;
