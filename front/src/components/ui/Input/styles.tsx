import styled from 'styled-components';
import { Input } from 'antd';
import { InputProps as InputStyledProps } from 'antd/lib/input';

export type InputProps = InputStyledProps;

export const InputStyled = styled(Input)<InputStyledProps>`
  border-radius: 3px;
  box-shadow: 0px 3px 6px #00000012;
  max-width: 170px;
  :hover {
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  :focus {
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
`;
