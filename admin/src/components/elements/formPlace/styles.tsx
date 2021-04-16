import { Space } from 'antd';
import styled from 'styled-components';

export const FormPlaceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${(props) => props.theme.spacing.default};
`;

export const FormActionWrapper = styled(Space)`
  display: flex;
  justify-content: flex-end;
`;
