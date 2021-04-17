import { Card, Typography } from 'antd';
import styled from 'styled-components';

export const CardWrapper = styled(Card)`
  user-select: none;
  .ant-card-body {
    padding: ${(props) => props.theme.spacing.default};
    display: flex !important;
    align-items: center;
  }
  p {
    font-size: 22px;
    max-width: 250px;
    margin: 0;
    line-height: 1.2em;
    font-weight: 300;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    p {
      font-size: 18px;
    }
  }
`;

export const CardValue = styled(Typography.Title)`
  font-weight: 700 !important;
  color: ${(props) => props.theme.colors.primary} !important;
  margin: 0 !important;
  padding-right: ${(props) => props.theme.spacing.default};
  font-size: 48px !important;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 36px !important;
  }
`;
