import { Checkbox, Divider, Input, Modal, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Place } from '../../../lib/Place';
import Button from '../../ui/Button';
import { FormActionWrapper, Form } from './styles';

export type ModalScheduleTemplateProps = {
  loading: boolean;
  onSubmit: (values: unknown) => Promise<void>;
  setOpen: ({ open: boolean }) => void;
  defaultCity?: string;
  defaultState?: string;
  place?: Place;
  open: boolean;
};

/**
 * ModalScheduleTemplate
 */
const ModalScheduleTemplate: React.FC<ModalScheduleTemplateProps> = ({ open, setOpen, onSubmit, loading, place }) => {
  /**
   * closeModal
   */
  const closeModal = () => {
    setOpen({ open: false });
  };

  const days = [
    {
      name: 'Domingo',
      key: 'sunday'
    },
    {
      name: 'Segunda',
      key: 'monday'
    },
    {
      name: 'Terça',
      key: 'tuesday'
    },
    {
      name: 'Quarta',
      key: 'wednesday'
    },
    {
      name: 'Quinta',
      key: 'thursday'
    },
    {
      name: 'Sexta',
      key: 'friday'
    },
    {
      name: 'Sábado',
      key: 'saturday'
    }
  ];
  const weekDays = days.map((day, index) => {
    return {
      name: day.name,
      key: day.key,
      openAt: place?.openAtWeek ? dayjs(new Date(place?.openAtWeek[index]?.seconds * 1000), 'HH:mm') : undefined,
      closeAt: place?.closeAtWeek ? dayjs(new Date(place?.closeAtWeek[index]?.seconds * 1000), 'HH:mm') : undefined
    };
  });

  return (
    <Modal title="Agenda de horários" visible={open} destroyOnClose onCancel={closeModal} footer={null} width={720}>
      <Form
        layout="horizontal"
        size="small"
        onFinish={async (values: unknown) => {
          await onSubmit(values);
        }}
      >
        <Form.Item
          name="open-now"
          style={{ width: '100%' }}
          initialValue={place?.open || false}
          valuePropName="checked"
        >
          <Checkbox style={{ width: '30%' }} disabled={loading}>
            Aberto agora
          </Checkbox>
        </Form.Item>
        {weekDays.map((day, index) => (
          <div key={day.key}>
            <Input.Group style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ width: '20%', margin: 0, marginRight: 5 }}>{day.name}</h3>
              <Form.Item
                name={`open-${day.key}`}
                style={{ width: '20%', marginBottom: 0 }}
                initialValue={place?.openWeek ? place?.openWeek[index] : false}
                valuePropName="checked"
              >
                <Checkbox style={{ width: '100%' }} disabled={loading}>
                  Abrirá
                </Checkbox>
              </Form.Item>
              <div style={{ width: '60%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Form.Item
                  name={`openAt-${day.key}`}
                  label="Abertura"
                  style={{ marginBottom: 0, maxWidth: '50%' }}
                  initialValue={day.openAt}
                  rules={[
                    { required: true, message: 'Por favor informe o horário de abertura' },
                    ({ getFieldValue }) => ({
                      /**
                       * validator
                       */
                      validator(_, value) {
                        const closeAt = dayjs(getFieldValue(`closeAt-${day.key}`));
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
                  name={`closeAt-${day.key}`}
                  label="Fechamento"
                  style={{ marginBottom: 0, marginLeft: 10, maxWidth: '50%' }}
                  initialValue={day.closeAt}
                  rules={[
                    { type: 'object' as const, required: true, message: 'Por favor informe o horário de fechamento' },
                    ({ getFieldValue }) => ({
                      /**
                       * validator
                       */
                      validator(_, value) {
                        const openAt = dayjs(getFieldValue(`openAt-${day.key}`));
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
              </div>
            </Input.Group>
            {index !== weekDays.length - 1 && <Divider style={{ margin: '20px 0' }} />}
          </div>
        ))}
        <Form.Item style={{ marginBottom: 0, marginTop: 36 }}>
          <FormActionWrapper>
            <Button disabled={loading} type="ghost" onClick={closeModal} size="middle">
              Cancelar
            </Button>
            <Button loading={loading} type="primary" htmlType="submit" size="middle">
              Salvar
            </Button>
          </FormActionWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalScheduleTemplate;
