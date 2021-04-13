import { InputStyled, InputProps } from './styles';

/**
 * Input component
 */
const Input: React.FC<InputProps> = (props) => {
  return <InputStyled size="large" {...props} />;
};

export default Input;
