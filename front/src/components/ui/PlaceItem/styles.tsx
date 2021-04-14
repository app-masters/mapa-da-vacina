import styled from 'styled-components';
import { Col, Row } from 'antd';
import { ColProps } from 'antd/lib/col';

export const CardItemWrapper = styled(Row)`
  position: relative;
  display: flex;
  border: 1px solid #00000012;
  min-height: 100px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.default};
  border-radius: 5px;
  overflow: hidden;
`;

export const CardItemLeftContent = styled(Col)<ColProps & { bgcolor: string }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: ${(props) => props.theme.spacing.sm};
  max-width: 120px;
  background-color: ${(props) => props.bgcolor || props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.background};
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

export const CardItemContent = styled(Col)<ColProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.sm};
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
`;

export const CardItemExtra = styled(Col)<ColProps>`
  padding: ${(props) => props.theme.spacing.sm};
  text-align: right;
`;
