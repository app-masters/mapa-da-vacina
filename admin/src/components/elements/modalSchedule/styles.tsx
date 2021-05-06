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

export const DayWrapper = styled.div``;

export const DayTitle = styled.h3`
  width: 20%;
  margin: 0;
  margin-right: 5px;
`;

export const FormHoursWrapper = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
