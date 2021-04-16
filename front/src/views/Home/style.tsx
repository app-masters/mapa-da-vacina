import { Layout } from 'antd';
import styled from 'styled-components';

export const HomeWrapper = styled(Layout)`
  min-height: 100vh;
  background: rgb(68, 144, 161);
  background: linear-gradient(0deg, rgba(95, 206, 193, 1) 0%, rgba(68, 144, 161, 1) 100%);
  .page-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const HomeHeaderWrapper = styled.div`
  padding: ${(props) => props.theme.spacing.default};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    justify-content: center;
  }
  .card-logo {
    background-color: white;
    padding: ${(props) => props.theme.spacing.default};
    border-radius: 10px;
    box-shadow: 0px 6px 12px #00000030;
    display: grid;
    align-items: center;
  }
  .logo-text {
    text-align: center;
    h2 {
      margin: 0;
      color: #ffffff !important;
      font-weight: 400;
      text-shadow: 2px 2px 6px #00000030;
    }
  }
  .logo {
    flex: 1;
    @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
      flex: none;
      padding-bottom: ${(props) => props.theme.spacing.default};
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }
`;

export const HomeContainerWrapper = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
  padding: ${(props) => props.theme.spacing.default};
  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    margin-top: ${(props) => props.theme.spacing.sm};
  }
`;

export const HomeContentWrapper = styled(HomeContainerWrapper)`
  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    .ant-space {
      width: 100%;
      justify-content: center;
    }
    .ant-space-item {
      width: 48% !important;
    }
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    .ant-space {
      justify-content: flex-start;
    }
    .ant-space-item {
      margin-right: 0 !important;
      width: 100% !important;
    }
  }
`;

export const HomeFooterWrapper = styled.footer`
  display: flex;
  min-height: 100px;
  background-color: #f9f9f9;
  margin-top: ${(props) => props.theme.spacing.xxl};
  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.theme.spacing.default};
    max-width: 1600px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    .github-a {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.darkGray};
      font-weight: 300;
      font-size: 18px;
      svg {
        margin-right: ${(props) => props.theme.spacing.sm};
      }
    }
    .github-a:hover {
      color: ${(props) => props.theme.colors.primary};
    }
    .appmasters-a {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 300;
      font-size: 18px;
      :hover {
        color: ${(props) => props.theme.colors.primary};
      }
    }
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      flex-direction: column;
      .github-a,
      .appmasters-a {
        margin-top: ${(props) => props.theme.spacing.default};
      }
    }
  }
`;
