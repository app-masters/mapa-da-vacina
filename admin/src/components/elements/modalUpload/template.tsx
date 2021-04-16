import { InboxOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Upload } from 'antd';
import React from 'react';
import { Prefecture } from '../../../lib/Prefecture';
import { ModalUploadWrapper, FormActionWrapper } from './styles';

export type ModalUploadTemplateProps = {
  loading: boolean;
  prefecture: Prefecture;
  onSubmit: (values: unknown) => Promise<void>;
  setOpen: ({ open: boolean }) => void;
  open: boolean;
};

/**
 * ModalUploadTemplate
 */
const ModalUploadTemplate: React.FC<ModalUploadTemplateProps> = ({ setOpen, open, prefecture, loading, onSubmit }) => {
  /**
   * closeModal
   */
  const closeModal = () => {
    setOpen({ open: false });
  };

  /**
   * normFile
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <ModalUploadWrapper
      title={`Importar CSV de locais para ${prefecture?.name}`}
      visible={open}
      destroyOnClose
      onCancel={closeModal}
      footer={null}
    >
      <Form
        layout="vertical"
        size="large"
        onFinish={async (values: unknown) => {
          await onSubmit(values);
        }}
      >
        <Form.Item name="disableNotInFile" initialValue={false} valuePropName="checked">
          <Checkbox>Desativar pontos que não estiverem na lista</Checkbox>
        </Form.Item>
        <Form.Item name="file" getValueFromEvent={normFile} valuePropName="fileList" noStyle>
          <Upload.Dragger accept=".csv" disabled={loading} maxCount={1} name="file">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Clique ou arraste o arquivo para a área de upload</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <FormActionWrapper>
            <Button disabled={loading} type="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button loading={loading} type="primary" htmlType="submit">
              Salvar
            </Button>
          </FormActionWrapper>
        </Form.Item>
      </Form>
    </ModalUploadWrapper>
  );
};

export default ModalUploadTemplate;
