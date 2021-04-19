import { Layout } from 'antd';
import styled from 'styled-components';

export const ValidateWrapper = styled(Layout)`
  min-height: 100vh;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  > div {
    h1 {
      margin: 0;
      font-weight: 300;
    }
    max-width: 600px;
    text-align: center;
    background-color: ${(props) => props.theme.colors.white};
    padding: ${(props) => props.theme.spacing.default};
    border: 1px solid #00000012;

    > div > div {
      margin-top: ${(props) => props.theme.spacing.default};
      padding-top: ${(props) => props.theme.spacing.default};
      border-top: 1px solid #00000012;
      text-align: right;
    }
  }
`;
