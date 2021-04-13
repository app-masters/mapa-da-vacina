import styled from 'styled-components';
import { Table } from 'antd';

export const TableWrapper = styled(Table)`
  border: 1px solid #00000012;
`;

export const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.sm};
  h2,
  h3,
  h4 {
    font-weight: 300;
    margin: 0;
  }
  .subtitle-container {
    display: flex;
    justify-content: space-between;
    padding-top: ${(props) => props.theme.spacing.default};
    padding-bottom: ${(props) => props.theme.spacing.sm};
  }
`;
