import styled from 'styled-components';
import { Button } from 'antd';
import { ButtonProps as ButtonStyledProps, ButtonType } from 'antd/lib/button';
import { colors, spacing } from '../../../styles/theme';

export type ButtonProps = Omit<ButtonStyledProps, 'type'> & {
  type?: ButtonType | 'outline' | 'secondary';
};

export const ButtonStyled: React.FC<ButtonProps> = styled(Button)<ButtonProps>`
  font-weight: 500;
  border-radius: 3px;
  ${(props: ButtonStyledProps) => {
    if (props.type === 'primary') {
      return `
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
        padding-left: ${spacing.sm} !important;
        span {
            padding-left: ${spacing.sm} !important;
        }
        :disabled {
          background-color: ${colors.disabled} !important;
          border-color: ${colors.disabled} !important;
          color: ${colors.darkGray};
          :hover {
            color: ${colors.darkGray};
          }
        }
      `;
    }
    if ((props.type as ButtonType | 'outline') === 'outline') {
      return `
        display: flex;
        background: transparent !important;
        color: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
        box-shadow: none;
      `;
    }
    if ((props.type as ButtonType | 'outline' | 'secondary') === 'secondary') {
      return `
        display: flex;
        color: ${colors.white} !important;
        background: ${colors.darkGray} !important;
        border-color: ${colors.darkGray} !important;
        box-shadow: none;
      `;
    }
  }}
`;
