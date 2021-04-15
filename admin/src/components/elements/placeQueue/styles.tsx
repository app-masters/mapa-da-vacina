import { Card, Col, Modal, Row, Space, Tag } from 'antd';
import styled from 'styled-components';

export const ModalQueue = styled(Modal)``;

export const PlaceQueueWrapper = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    .ant-card-body {
      padding: ${(props) => props.theme.spacing.sm};
    }
    .queue-tags {
      > span {
        margin-top: ${(props) => props.theme.spacing.sm};
      }
    }
    .queue-action {
      margin-top: ${(props) => props.theme.spacing.default};
      width: 100%;
      .ant-space,
      .ant-space-item,
      button {
        width: 100%;
      }
    }
  }
`;

export const ModalQueueContent = styled(Space)`
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const PlaceQueueCard = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.default};
`;

export const PlaceQueueItem = styled(Row)<{ warning?: boolean }>`
  background-color: ${(props) => (props.warning ? props.theme.colors.alertColor : 'transparent')};
  padding: ${(props) => props.theme.spacing.default} 0px;
  border-bottom: 1px solid #00000012;
  > div {
    display: flex;
  }
`;

export const PlaceQueueItemAvatar = styled(Col)<{ color: string }>`
  flex-direction: column;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.color || props.theme.colors.gray};
  > svg {
    width: 32px;
    height: 40px;
  }
  > p {
    font-weight: 800;
    text-transform: uppercase;
    margin: 0;
  }
`;

export const PlaceQueueItemContent = styled.div`
  > div {
    align-items: center;
    h3 {
      color: ${(props) => props.theme.colors.gray};
      margin: 0;
      margin-bottom: ${(props) => props.theme.spacing.xs};
      margin-right: ${(props) => props.theme.spacing.sm};
    }
  }
`;

export const QueueButton = styled.div<{ disabled?: boolean; color: string }>`
  cursor: pointer;
  width: 200px;
  padding: 4px 16px;
  border-radius: 2px;
  border: 1px solid ${(props) => (props.disabled ? props.theme.colors.disabled : props.color)};
  background-color: ${(props) => (props.disabled ? props.theme.colors.disabled : props.color)};
  color: ${(props) => props.theme.colors[props.disabled ? 'darkGray' : 'white']};
  font-weight: 600;
  text-transform: uppercase;
  p {
    margin: 0;
    font-weight: 400;
    text-transform: none;
  }
`;

export const QueueTag = styled(Tag)`
  padding: ${(props) => props.theme.spacing.xs};
  padding-left: ${(props) => props.theme.spacing.default};
  padding-right: ${(props) => props.theme.spacing.default};
  font-size: 16px;
`;
