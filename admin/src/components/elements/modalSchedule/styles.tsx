import { Space, Form as AntForm } from 'antd';
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

export const Form = styled(AntForm)`
  > div {
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px; */
  }
`;
