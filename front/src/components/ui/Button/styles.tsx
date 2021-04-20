import styled from 'styled-components';
import { Button } from 'antd';
import { ButtonProps as ButtonStyledProps, ButtonType } from 'antd/lib/button';
import { colors, spacing } from '../../../styles/theme';

export type ButtonProps = Omit<ButtonStyledProps, 'type'> & {
  type?: ButtonType | 'outline';
};

export const ButtonStyled: React.FC<ButtonProps> = styled(Button)<ButtonProps>`
  font-weight: 500;
  border-radius: 3px;
  ${(props: ButtonStyledProps) => {
    if (props.type === 'primary') {
      return `
        display: flex;
        align-items: center;
        background: ${colors.primary} !important;
        border-color: ${colors.primary} !important;
        padding-left: ${spacing.sm} !important;
        span {
            padding-left: ${spacing.sm} !important;
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
    if (props.type === 'default') {
      return `
        :hover {
          color: ${colors.primary} !important;
          border-color: ${colors.primary} !important;
        }
      `;
    }
  }}
`;
