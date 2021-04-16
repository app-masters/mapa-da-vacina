import { Modal, Space } from 'antd';
import styled from 'styled-components';

export const ModalUploadWrapper = styled(Modal)``;

export const FormActionWrapper = styled(Space)`
  margin-top: ${(props) => props.theme.spacing.default};
  display: flex;
  justify-content: flex-end;
`;
