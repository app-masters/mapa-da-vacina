import { Checkbox, Divider, Input, Modal, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
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

  // const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  // const weekDayss = days.map((day, index) => {
  //   return {
  //     name: day,
  //     openAt:
  //   }
  // });
  const weekDays = [
    {
      name: 'Segunda',
      key: 'monday',
      openAt: place.openAtWeek[0]
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
    },
    {
      name: 'Domingo',
      key: 'sunday'
    }
  ];

  return (
    <Modal title="Agenda de horários" visible={open} destroyOnClose onCancel={closeModal} footer={null} width={720}>
      <Form
        layout="horizontal"
        size="small"
        onFinish={async (values: unknown) => {
          await onSubmit(values);
        }}
      >
        <Form.Item name="open" style={{ width: '100%' }} initialValue={place?.open || false} valuePropName="checked">
          <Checkbox style={{ width: '30%' }} disabled={loading}>
            Aberto agora
          </Checkbox>
        </Form.Item>
        {weekDays.map((day, index) => (
          <div key={day.key}>
            <Input.Group style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ width: '20%', margin: 0, marginRight: 5 }}>{day.name}</h3>
              <Form.Item
                name="openToday"
                style={{ width: '20%', marginBottom: 0 }}
                initialValue={place?.openToday || false}
                valuePropName="checked"
              >
                <Checkbox style={{ width: '100%' }} disabled={loading}>
                  Abrirá
                </Checkbox>
              </Form.Item>
              <div style={{ width: '60%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Form.Item
                  name="openAt"
                  label="Abertura"
                  style={{ marginBottom: 0, maxWidth: '50%' }}
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
                  style={{ marginBottom: 0, marginLeft: 10, maxWidth: '50%' }}
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
