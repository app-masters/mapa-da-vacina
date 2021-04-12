import React from 'react';
import { ButtonStyled, ButtonProps } from './styles';

/**
 * Button
 */
const Button: React.FC<ButtonProps> = (props) => {
  return <ButtonStyled {...props} />;
};

export default Button;
