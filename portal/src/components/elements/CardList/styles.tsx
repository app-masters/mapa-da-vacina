import styled from 'styled-components';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import { CardItem } from '../../../lib/CardItem';
import { InputStyled } from '../../ui/Input/styles';

export type CardListTemplateProps = CardProps & { data: CardItem[] };

export const CardListWrapper = styled(Card)`
  .ant-card-head-title {
    font-size: 32px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

export const ButtonIconWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  user-select: none;
  color: ${(props) => props.theme.colors[props.active ? 'primary' : 'darkGray']};
  border-bottom: 2px solid ${(props) => (props.active ? props.theme.colors.primary : 'transparent')};
  padding: ${(props) => props.theme.spacing.sm};
  cursor: pointer;
  div {
    height: 25px;
    width: 1px;
    border-left: 1px solid #00000012;
    margin-left: ${(props) => props.theme.spacing.sm};
    margin-right: ${(props) => props.theme.spacing.sm};
  }
  p {
    margin: 0;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 16px;
  }
  :hover {
    border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

export const CardListSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${(props) => props.theme.colors.background};
  margin-bottom: ${(props) => props.theme.spacing.default};
  font-size: 22px;
  .ant-input-prefix {
    color: ${(props) => props.theme.colors.darkGray};
    margin-right: ${(props) => props.theme.spacing.sm} !important;
  }
  input {
    border-left: 1px solid #00000012 !important;
    padding-left: ${(props) => props.theme.spacing.sm} !important;
  }
  p {
    margin: 0;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    ${InputStyled} {
      max-width: none;
    }
    .ant-space-item {
      width: 100% !important;
    }
  }
`;
