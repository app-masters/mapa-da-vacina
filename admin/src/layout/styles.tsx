import styled from 'styled-components';
import { Layout } from 'antd';

export const LayoutWrapper = styled(Layout)`
  min-height: 100vh;
  .logo {
    min-height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-info {
    h4,
    h5 {
      font-size: 16px;
      margin: 0;
    }
    h4 {
      font-weight: 500;
    }
    h5 {
      font-weight: 300;
      color: ${(props) => props.theme.colors.darkGray};
    }
    text-align: center;
    border-top: 1px solid #00000012;
    border-bottom: 1px solid #00000012;
    padding: ${(props) => props.theme.spacing.sm};
  }
`;

export const LayoutContentWrapper = styled(Layout)`
  height: 100%;
  max-width: 1600px;
  width: 100%;
  // margin-left: auto;
  // margin-right: auto;
  padding: ${(props) => props.theme.spacing.default};
`;

export const LayoutHeader = styled.div`
  border-bottom: 1px solid #00000012;
  margin-bottom: ${(props) => props.theme.spacing.default};
  h1 {
    color: ${(props) => props.theme.colors.gray} !important;
    margin-top: ${(props) => props.theme.spacing.sm} !important;
    margin-bottom: ${(props) => props.theme.spacing.sm};
    font-weight: 700;
  }
  h4 {
    color: ${(props) => props.theme.colors.gray} !important;
    font-weight: 400;
  }
`;

export const FooterWrapper = styled.div`
  background-color: #f9f9ff;
  border-top: 1px solid #00000012;
  width: 100%;
  min-height: 50px;
  padding: ${(props) => props.theme.spacing.default};
  text-align: center;
  h5 {
    font-weight: 300;
    margin: 0;
    color: ${(props) => props.theme.colors.darkGray} !important;
  }
`;
