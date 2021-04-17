import React from 'react';
import Button from '../../components/ui/Button';
import { LayoutWrapper } from './styles';

type ErrorProps = {
  handleLogout: () => void;
  message: string;
};

/**
 * Error page
 */
const Error: React.FC<ErrorProps> = ({ handleLogout, message }) => {
  return (
    <LayoutWrapper>
      <div>
        <h1>{message}</h1>
        <div>
          <Button type="primary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Error;
