import styled from 'styled-components';
import { Col, Row } from 'antd';
import { ColProps } from 'antd/lib/col';

export const CardItemWrapper = styled(Row)`
  display: flex;
  position: relative;
  display: flex;
  border: 1px solid #00000012;
  min-height: 80px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.default};
  border-radius: 5px;
  overflow: hidden;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export const CardItemIconContent = styled(Col)<ColProps & { bgcolor: string }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: ${(props) => props.theme.spacing.sm};
  width: 100%;
  min-width: 120px;
  background-color: ${(props) => props.bgcolor || props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.background};
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 100%;
    div {
      flex-direction: row;
    }
    svg {
      margin-right: ${(props) => props.theme.spacing.sm};
    }
  }
  span {
    text-transform: initial;
    font-size: 12px;
    font-weight: initial;
  }
`;

export const CardItemContent = styled(Col)<ColProps>`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${(props) => props.theme.spacing.sm};
  padding-left: ${(props) => props.theme.spacing.default};
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    > div {
      color: ${(props) => props.theme.colors.darkGray};
    }
  }
  h1,
  p {
    color: ${(props) => props.theme.colors.darkGray};
    margin: 0;
  }
  h1 {
    font-weight: 500;
  }
  .item-type {
    font-size: 18px;
  }
  .item-place {
    font-size: 23px;
  }
  .item-header {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    h1 {
      margin-right: ${(props) => props.theme.spacing.sm};
    }
    > small {
      font-size: 14px;
    }
  }
  .location-label {
    font-weight: 900;
    color: ${(props) => props.theme.colors.green1};
  }
`;

export const CardItemExtra = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm} 0px;
`;
