import styled from 'styled-components';
import { Layout } from 'antd';

export const AuthWrapper = styled(Layout)`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

export const AuthContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.xxl};
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-top: ${(props) => props.theme.spacing.default};
  }
  #firebaseui_container {
    margin-top: ${(props) => props.theme.spacing.default};
    min-width: 360px;
  }
`;
