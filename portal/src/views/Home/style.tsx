import { Layout } from 'antd';
import styled from 'styled-components';

export const HomeWrapper = styled(Layout)`
  min-height: 100vh;
  background: url('/images/background.png') !important;
`;

export const HomeHeaderWrapper = styled.div`
  padding: ${(props) => props.theme.spacing.default};
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
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
      font-weight: 300;
      font-size: 18px;
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
