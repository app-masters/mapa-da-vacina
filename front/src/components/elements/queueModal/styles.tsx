import { Modal, Space } from 'antd';
import styled from 'styled-components';

export const ModalQueue = styled(Modal)`
  .info {
    text-align: center;
  }
`;

export const ModalQueueContent = styled(Space)`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  .ant-space-item {
    width: 100%;
  }
`;

export const QueueButton = styled.div<{ disabled?: boolean; color: string }>`
  cursor: pointer;
  width: 100%;
  padding: 4px 16px;
  border-radius: 2px;
  border: 1px solid ${(props) => (props.disabled ? props.theme.colors.disabled : props.color)};
  background-color: ${(props) => (props.disabled ? props.theme.colors.disabled : props.color)};
  color: ${(props) => props.theme.colors[props.disabled ? 'darkGray' : 'white']};
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.colors[props.disabled ? 'darkGray' : 'background']};
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    text-transform: none;
  }
`;
