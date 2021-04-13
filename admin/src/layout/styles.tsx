import styled from 'styled-components';
import { Layout } from 'antd';

export const LayoutWrapper = styled(Layout)`
  min-height: 100vh;
  .logo {
    min-height: 65px;
  }
`;

export const LayoutContentWrapper = styled(Layout)`
  max-width: 1600px;
  width: 100%;
  // margin-left: auto;
  // margin-right: auto;
  padding: ${(props) => props.theme.spacing.default};
`;

export const LayoutHeader = styled.div`
  border-bottom: 1px solid #00000012;
  margin-bottom: ${(props) => props.theme.spacing.default};
  > h1 {
    color: ${(props) => props.theme.colors.gray} !important;
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }
`;
