import styled from 'styled-components';
import { Layout } from 'antd';

export const LayoutWrapper = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    padding: ${(props) => props.theme.spacing.default};
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    width: 100%;
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid #00000012;
    border-radius 2px;

    > div {
      border-top: 1px solid #00000012;
      padding-top: ${(props) => props.theme.spacing.default};
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  h1 {
    text-align: center;
    font-weight: 300;
  }
`;
