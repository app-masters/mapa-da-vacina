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
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      width: 100%;
    }
  }
`;

export const HomeContentWrapper = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
  padding: ${(props) => props.theme.spacing.default};
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-top: ${(props) => props.theme.spacing.default};
    .ant-space-item {
      margin-right: 0px !important;
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
