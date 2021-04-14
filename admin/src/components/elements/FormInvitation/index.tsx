import { Prefecture } from '../../../lib/Prefecture';
import FormInvitationTemplate from './template';
import { Button, message } from 'antd';
import React from 'react';
import { Place } from '../../../lib/Place';
import { API } from '../../../utils/api';
import { User } from '../../../lib/User';
import { userRoles } from '../../../utils/constraints';
import logging from '../../../utils/logging';

type FormInvitationProps = {
  prefectures: Prefecture[];
  places: Place[];
  user: User;
};

/**
 * FormInvitation
 */
const FormInvitation: React.FC<FormInvitationProps> = ({ prefectures, places, user }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  /**
   * onSubmitForm
   */
  const onSubmitForm = async (values) => {
    setLoading(true);
    try {
      if (user.role === userRoles.placeAdmin) {
        values.placeId = user.placeId;
      }
      if (!values.prefectureId) {
        values.prefectureId = prefectures[0].id;
      }
      await API.post('/invite', values);
      setLoading(false);
      setOpen(false);
      message.success('Convite enviado com sucesso');
    } catch (err) {
      setLoading(false);
      message.error(err.data ? err.data.message : 'Falha ao convidar usuário');
      logging.error(err);
    }
  };

  return (
    <React.Fragment>
      <FormInvitationTemplate
        open={open}
        setOpen={setOpen}
        loading={loading}
        onSubmit={onSubmitForm}
        prefectures={prefectures}
        places={places}
        userRole={user.role}
        userPrefecture={user.prefectureId}
        userPlace={user.placeId}
      />
      <Button type="primary" onClick={() => setOpen(true)}>
        Convidar
      </Button>
    </React.Fragment>
  );
};

export default FormInvitation;
