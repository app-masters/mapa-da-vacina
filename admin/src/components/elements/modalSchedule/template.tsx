import { Checkbox, Divider, Input, Modal, TimePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Place } from '../../../lib/Place';
import Button from '../../ui/Button';
import { FormActionWrapper, FormHoursWrapper, DayWrapper, DayTitle } from './styles';

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
          <Checkbox style={{ width: '100%' }} disabled={loading}>
            Aberto agora
          </Checkbox>
        </Form.Item>
        {weekDays.map((day, index) => (
          <DayWrapper key={day.key}>
            <Input.Group style={{ display: 'flex', alignItems: 'center' }}>
              <DayTitle>{day.name}</DayTitle>
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
              <FormHoursWrapper>
                <Form.Item
                  name={`openAt-${day.key}`}
                  label="Abertura"
                  style={{ marginBottom: 0, width: '50%' }}
                  initialValue={day.openAt}
                  rules={[
                    { type: 'object' as const, required: true, message: 'Informar horário' },
                    ({ getFieldValue }) => ({
                      /**
                       * validator
                       */
                      validator(_, value) {
                        const selectedTime = dayjs(value);
                        const closeAt = dayjs(getFieldValue(`closeAt-${day.key}`));
                        const convertedSelectedTime = selectedTime.hour() * 60 * 60 + selectedTime.minute() * 60;
                        const convertedCloseAt = closeAt.hour() * 60 * 60 + closeAt.minute() * 60;
                        if (value && convertedSelectedTime >= convertedCloseAt) {
                          return Promise.reject(new Error('Abertura deve ser antes do fechamento'));
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
                  style={{ marginBottom: 0, marginLeft: 10, width: '55%' }}
                  initialValue={day.closeAt}
                  rules={[
                    { type: 'object' as const, required: true, message: 'Informar horário' },
                    ({ getFieldValue }) => ({
                      /**
                       * validator
                       */
                      validator(_, value) {
                        const selectedTime = dayjs(value);
                        const openAt = dayjs(getFieldValue(`openAt-${day.key}`));
                        const convertedSelectedTime = selectedTime.hour() * 60 * 60 + selectedTime.minute() * 60;
                        const convertedOpenAt = openAt.hour() * 60 * 60 + openAt.minute() * 60;
                        if (value && convertedSelectedTime <= convertedOpenAt) {
                          return Promise.reject(new Error('Fechamento deve ser depois da abertura'));
                        }
                        return Promise.resolve();
                      }
                    })
                  ]}
                >
                  <TimePicker style={{ width: '100%' }} format="HH:mm" disabled={loading} placeholder="HH:MM" />
                </Form.Item>
              </FormHoursWrapper>
            </Input.Group>
            {index !== weekDays.length - 1 && <Divider style={{ margin: '20px 0' }} />}
          </DayWrapper>
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
