import { Prefecture } from '../../../lib/Prefecture';
import FormInvitationTemplate from './template';
import { Button, message } from 'antd';
import React from 'react';
import { Place } from '../../../lib/Place';
import { API } from '../../../utils/api';

type FormInvitationProps = {
  prefectures: Prefecture[];
  places: Place[];
};

/**
 * FormInvitation
 */
const FormInvitation: React.FC<FormInvitationProps> = ({ prefectures, places }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  /**
   * onSubmitForm
   */
  const onSubmitForm = async (values) => {
    setLoading(true);
    try {
      await API.post('/invite', values);
      setLoading(false);
      setOpen(false);
      message.success('Convite enviado com sucesso');
    } catch (err) {
      setLoading(false);
      message.error(err.data ? err.data.message : 'Falha ao convidar usuário');
      console.log('failed to invite user', err);
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
        userRole="superAdmin"
        userPrefecture="juiz-de-fora"
        userPlace="1"
      />
      <Button type="primary" onClick={() => setOpen(true)}>
        Convidar
      </Button>
    </React.Fragment>
  );
};

export default FormInvitation;
