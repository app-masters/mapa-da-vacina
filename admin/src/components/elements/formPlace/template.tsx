import { Checkbox, Form, Input, Modal, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Place } from '../../../lib/Place';
import { placeTypeLabel } from '../../../utils/constraints';
import Button from '../../ui/Button';
import { FormActionWrapper } from './styles';

export type FormPlaceTemplateProps = {
  loading: boolean;
  onSubmit: (values: unknown) => Promise<void>;
  setOpen: ({ open: boolean }) => void;
  defaultCity?: string;
  defaultState?: string;
  place?: Place;
  open: boolean;
};

/**
 * FormPlaceTemplate
 */
const FormPlaceTemplate: React.FC<FormPlaceTemplateProps> = ({
  open,
  setOpen,
  onSubmit,
  loading,
  defaultCity,
  defaultState,
  place
}) => {
  const [title, setTitle] = React.useState<string>(undefined);
  /**
   * closeModal
   */
  const closeModal = () => {
    setOpen({ open: false });
    setTitle(undefined);
  };

  const initialDateValues = React.useMemo(() => {
    const dates = {
      openAt: undefined,
      closeAt: undefined
    };
    if (place) {
      dates.openAt = dayjs(new Date(place?.openAt.seconds * 1000), 'HH:mm');
      dates.closeAt = dayjs(new Date(place?.closeAt.seconds * 1000), 'HH:mm');
    }
    const localDate = JSON.parse(localStorage.getItem('default_time') || '{}');
    if (!place && localDate) {
      dates.openAt = dayjs(localDate.openAt, 'HH:mm');
      dates.closeAt = dayjs(localDate.closeAt, 'HH:mm');
    }
    return dates;
  }, [place]);

  return (
    <Modal
      title={place?.title ? place.title : 'Novo Ponto de Vacinação'}
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
        <Form.Item initialValue={place ? place.active : true} name="active" valuePropName="checked">
          <Checkbox>Posto de vacinação ativo</Checkbox>
        </Form.Item>
        <Form.Item
          label="Título"
          initialValue={place?.title}
          name="title"
          rules={[{ required: true, message: 'Por favor informe o título' }]}
        >
          <Input disabled={loading} onBlur={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Título interno" initialValue={place?.internalTitle} name="internalTitle">
          <Input disabled={loading} name="internalTitle" placeholder={title || place?.title} />
        </Form.Item>
        <Form.Item
          label="Tipo"
          initialValue={place?.type}
          name="type"
          rules={[{ required: true, message: 'Por favor informe o tipo' }]}
        >
          <Select disabled={loading}>
            {Object.keys(placeTypeLabel).map((option) => (
              <Select.Option key={option} value={option}>
                {placeTypeLabel[option]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {!place && (
          <Input.Group compact>
            <Form.Item
              name="openAt"
              label="Abertura"
              style={{ width: '50%' }}
              initialValue={initialDateValues.openAt}
              rules={[
                { required: true, message: 'Por favor informe o horário de abertura' },
                ({ getFieldValue }) => ({
                  /**
                   * validator
                   */
                  validator(_, value) {
                    const closeAt = dayjs(getFieldValue('closeAt'));
                    const selectedTime = dayjs(value);
                    if (value && (dayjs(selectedTime).isSame(closeAt) || dayjs(selectedTime).isAfter(closeAt))) {
                      return Promise.reject(new Error('O horário de abertura deve ser antes do de fechamento'));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" disabled={loading} placeholder="HH:MM" />
            </Form.Item>
            <Form.Item
              name="closeAt"
              label="Fechamento"
              style={{ width: '50%' }}
              initialValue={initialDateValues.closeAt}
              rules={[
                { type: 'object' as const, required: true, message: 'Por favor informe o horário de fechamento' },
                ({ getFieldValue }) => ({
                  /**
                   * validator
                   */
                  validator(_, value) {
                    const openAt = dayjs(getFieldValue('openAt'));
                    const selectedTime = dayjs(value);
                    if (value && (dayjs(selectedTime).isSame(openAt) || dayjs(selectedTime).isBefore(openAt))) {
                      return Promise.reject(new Error('O horário de fechamento deve ser depois do de abertura'));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" disabled={loading} placeholder="HH:MM" />
            </Form.Item>
          </Input.Group>
        )}
        <Form.Item
          label="Rua"
          initialValue={place?.addressStreet}
          name="addressStreet"
          rules={[{ required: true, message: 'Por favor informe o rua' }]}
        >
          <Input disabled={loading} placeholder="Av Barão do Rio Branco 3480" />
        </Form.Item>
        <Form.Item
          label="Bairro"
          initialValue={place?.addressDistrict || ''}
          name="addressDistrict"
          rules={[{ required: false, message: 'Por favor informe o bairro' }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item label="CEP" initialValue={place?.addressZip || ''} name="addressZip">
          <Input disabled={loading} />
        </Form.Item>
        <Input.Group compact>
          <Form.Item
            name="addressCity"
            label="Cidade"
            style={{ width: '50%' }}
            initialValue={defaultCity}
            rules={[{ required: true, message: 'Por favor informe a cidade' }]}
          >
            <Input style={{ width: '100%' }} disabled={loading} />
          </Form.Item>
          <Form.Item
            name="addressState"
            label="Estado"
            style={{ width: '50%' }}
            initialValue={defaultState}
            rules={[{ required: true, message: 'Por favor informe o estado' }]}
          >
            <Input style={{ width: '100%' }} maxLength={2} disabled={loading} placeholder="MG" />
          </Form.Item>
        </Input.Group>
        <Form.Item label="Url Google Maps" initialValue={place?.googleMapsUrl || ''} name="googleMapsUrl">
          <Input disabled={loading} />
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
    </Modal>
  );
};

export default FormPlaceTemplate;
