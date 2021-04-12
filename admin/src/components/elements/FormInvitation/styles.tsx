import { Modal, Space } from 'antd';
import styled from 'styled-components';

export const FormWrapper = styled.div``;

export const FormActionWrapper = styled(Space)`
  display: flex;
  justify-content: flex-end;
`;

export const ModalWrapper = styled(Modal)`
  .ant-modal-body {
    padding-bottom: ${(props) => props.theme.spacing.xxs} !important;
  }
`;
