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

export const DayWrapper = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
    > span {
      flex-wrap: wrap !important;
    }

    label {
      width: 50% !important;
    }
  }
`;

export const DayTitle = styled.h3`
  width: 20%;
  margin: 0;
  margin-right: 5px;

  @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
    width: 50%;
  }
`;

export const FormHoursWrapper = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
    width: 100%;
    margin-top: 10px;
    > div {
      margin: 0 !important;
      width: 50% !important;
    }
  }
`;
