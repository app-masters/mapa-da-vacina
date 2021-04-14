import { Form, Input, Select } from 'antd';
import React from 'react';
import { userRoleType, userRoles, userRolesLabel } from '../../../utils/constraints';
import { FormWrapper, FormActionWrapper, ModalWrapper } from './styles';
import Button from '../../ui/Button';
import MaskedInput from 'antd-mask-input';
import { Prefecture } from '../../../lib/Prefecture';
import { Place } from '../../../lib/Place';

export type FormInvitationTemplateProps = {
  onSubmit: (values: unknown) => Promise<void>;
  setOpen: (open: boolean) => void;
  open: boolean;
  loading: boolean;
  userRole: userRoleType;
  prefectures: Prefecture[];
  places: Place[];
  userPrefecture: string;
  userPlace: string;
};

/**
 * FormInvitationTemplate
 */
const FormInvitationTemplate: React.FC<FormInvitationTemplateProps> = ({
  onSubmit,
  open,
  setOpen,
  loading,
  prefectures,
  places,
  userRole,
  userPrefecture
}) => {
  const [selectedRole, setSelectedRole] = React.useState<string>(undefined);

  /**
   * closeModal
   */
  const closeModal = () => {
    setOpen(false);
    setSelectedRole(undefined);
  };

  const selectOptions: { label: string; value: string }[] = React.useMemo(() => {
    let listOfOptions = [];
    for (const attr in userRolesLabel) {
      if (attr !== userRoles.superAdmin) {
        listOfOptions.push({
          label: userRolesLabel[attr],
          value: attr
        });
      }
    }

    if (userRole === userRoles.prefectureAdmin) {
      listOfOptions = listOfOptions.filter((f) => f.value !== userRoles.superAdmin);
    }
    if (userRole === userRoles.placeAdmin) {
      listOfOptions = listOfOptions.filter((f) => f.value === userRoles.queueObserver);
    }

    return listOfOptions;
  }, [userRole]);

  const selectPrefectures: { label: string; value: string }[] = React.useMemo(() => {
    return (prefectures || []).map((i) => ({ label: i.name, value: i.id }));
  }, [prefectures]);

  const selectPlaces: { label: string; value: string }[] = React.useMemo(() => {
    return (places || []).map((i) => ({ value: i.id, label: i.title }));
  }, [places]);

  const placeRoles = [userRoles.superAdmin, userRoles.prefectureAdmin];

  return (
    <ModalWrapper visible={open} destroyOnClose onCancel={closeModal} footer={null}>
      <FormWrapper>
        <Form
          layout="vertical"
          size="large"
          onFinish={async (values: unknown) => {
            await onSubmit(values);
            closeModal();
          }}
        >
          <Form.Item label="Nome" name="name" rules={[{ required: true, message: 'Por favor informe um nome' }]}>
            <Input disabled={loading} />
          </Form.Item>
          <Form.Item
            label="Telefone"
            name="phone"
            rules={[{ required: true, message: 'Por favor informe um telefone' }]}
          >
            <MaskedInput disabled={loading} mask="(11) 11111-1111" />
          </Form.Item>
          <Form.Item label="Cargo" name="role" rules={[{ required: true, message: 'Por favor informe um cargo' }]}>
            <Select disabled={loading} onChange={(value) => setSelectedRole(value as string)}>
              {selectOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {!!(selectedRole === userRoles.prefectureAdmin || selectedRole === userRoles.placeAdmin) && (
            <Form.Item
              label="Prefeitura"
              name="prefectureId"
              initialValue={prefectures[0].id}
              rules={[{ required: true, message: 'Por favor informe uma prefeitura' }]}
            >
              <Select disabled={loading}>
                {selectPrefectures
                  .filter((f) => (userRole === userRoles.superAdmin ? true : f.value === userPrefecture))
                  .map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )}
          {!!(
            selectedRole === userRoles.placeAdmin ||
            (selectedRole === userRoles.queueObserver && placeRoles.includes(userRole))
          ) && (
            <Form.Item label="Local" name="placeId" rules={[{ required: true, message: 'Por favor informe um local' }]}>
              <Select disabled={loading}>
                {(selectPlaces || []).map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
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
      </FormWrapper>
    </ModalWrapper>
  );
};

export default FormInvitationTemplate;
