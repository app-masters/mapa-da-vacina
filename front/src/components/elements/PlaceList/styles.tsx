import styled from 'styled-components';
import { Card, Space } from 'antd';
import { CardProps } from 'antd/lib/card';
import { InputStyled } from '../../ui/Input/styles';
import { Place } from '../../../lib/Place';
import { LoadingOutlined } from '@ant-design/icons';

export type PlaceListTemplateProps = CardProps & {
  data: Place[];
  showQueueUpdatedAt?: boolean;
  sampleMode?: boolean;
  city?: string;
  header?: React.ReactNode;
  filter?: React.ReactNode;
  loading: boolean;
  currentCoordinate?: GeolocationPosition;
  publicUpdate?: (item: Place) => void;
  enablePublicQueueUpdate?: boolean;
  shouldShowFeaturesBanner?: boolean;
};

export const PlaceListWrapper = styled(Card)`
  overflow: hidden;
  .ant-card-head-title {
    font-size: 32px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.darkGray};
    padding: 0px;
  }
  .ant-card-body {
    min-height: 100px;
    padding-top: ${(props) => props.theme.spacing.sm};
  }
`;

export const StyledSpace = styled(Space)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const WarningBox = styled.div`
  margin-top: ${(props) => props.theme.spacing.default} !important;
  border-radius: 2px;
  color: ${(props) => props.theme.colors.darkGray};
  text-align: center;
  background-color: ${(props) => props.theme.colors.alert};
  padding: ${(props) => props.theme.spacing.default} !important;
  p {
    font-size: 16px;
    margin: 0;
    > a {
      text-decoration: underline;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: ${(props) => props.theme.spacing.sm};
  }
  ul {
    text-align: left;
  }
`;

export const ButtonIconWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  user-select: none;
  color: ${(props) => props.theme.colors[props.active ? 'primary' : 'darkGray']};
  padding: ${(props) => props.theme.spacing.sm};
  cursor: pointer;
  > div:nth-child(2) {
    height: 25px;
    width: 1px;
    border-left: 1px solid #00000012;
    margin-left: ${(props) => props.theme.spacing.sm};
    margin-right: ${(props) => props.theme.spacing.sm};
  }
  p {
    margin: 0;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 16px;
  }
`;

export const PlaceListSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${(props) => props.theme.colors.background};
  margin-bottom: ${(props) => props.theme.spacing.default};
  font-size: 22px;
  .ant-input-prefix {
    color: ${(props) => props.theme.colors.darkGray};
    margin-right: ${(props) => props.theme.spacing.sm} !important;
  }
  input {
    border-left: 1px solid #00000012 !important;
    padding-left: ${(props) => props.theme.spacing.sm} !important;
  }
  p {
    margin: 0;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    ${InputStyled} {
      max-width: none;
    }
    .ant-space-item {
      width: 100% !important;
    }
  }
`;

export const Loading = styled(LoadingOutlined)`
  font-size: 24px;
  color: ${(props) => props.theme.colors.primary};
`;

export const BlockIcon = styled.div<{ $open?: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.$open ? props.theme.colors.green1 : '#879395')};
  border-radius: 4px;
`;

export const HeaderCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-weight: 400;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 24px;
    padding-top: ${(props) => props.theme.spacing.default};
  }
  > div:nth-child(1) {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;
