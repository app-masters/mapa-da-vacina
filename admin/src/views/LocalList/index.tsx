import React from 'react';
import Layout from '../../layout';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { placeQueue } from '../../utils/constraints';
import { message, Spin } from 'antd';
import FormPlace from '../../components/elements/formPlace';
import dayjs from 'dayjs';
import logging from '../../utils/logging';
import { createPlace, updatePlace } from '../../utils/firestore';
import ModalUpload from '../../components/elements/modalUpload';
import { API } from '../../utils/api';
import PrefectureItem from '../../components/elements/prefectureItem';
import ModalSchedule from '../../components/elements/modalSchedule';

type ListViewProps = {
  user: User;
  tokenId?: string;
  places: Place[];
  pageLoading: boolean;
  prefectures: Prefecture[];
};

/**
 * List page
 * @params NextPage
 */
const List: React.FC<ListViewProps> = ({ user, tokenId, prefectures, places, pageLoading }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<{ open: boolean; prefecture?: Prefecture; place?: Place }>({ open: false });
  const [modalSchedule, setModalSchedule] = React.useState<{ open: boolean; prefecture?: Prefecture; place?: Place }>({
    open: false
  });
  const [modalUpload, setModalUpload] = React.useState<{ open: boolean; prefecture?: Prefecture }>({ open: false });

  /**
   * onSubmitForm
   */
  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      localStorage.setItem('default_time', JSON.stringify({ openAt: data.openAt, closeAt: data.closeAt }));
      const convertData: Place = {
        ...data,
        internalTitle: data.internalTitle || data.title,
        openAt: dayjs(data.openAt).toDate(),
        closeAt: dayjs(data.closeAt).toDate()
      };
      if (modal.place) {
        await updatePlace(modal.place.id, modal.prefecture.id, convertData);
      } else {
        const place = {
          ...convertData,
          open: true,
          queueStatus: placeQueue.closed,
          prefectureId: modal.prefecture.id
        };
        await createPlace(modal.prefecture.id, place);
      }
      setModal({ open: false });
      message.success(`Ponto de vacinação ${modal.place ? 'atualizado' : 'inserido'} com sucesso`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error(`Falha ao ${modal.place ? 'atualizar' : 'inserir'} ponto de vacinação`);
      logging.error('Error submitting place', { err, data });
    }
  };

  /**
   * onSubmitUpload
   */
  const onSubmitUpload = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file[0].originFileObj);
      formData.append('deactivateMissing', data.disableNotInFile);
      formData.append('prefectureId', modalUpload.prefecture.id);

      const response = await API.post('/import-places', formData, {
        headers: {
          Authorization: tokenId,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        message.success('Arquivo enviado com sucesso!');
        setModalUpload({ open: false });
      }
      setLoading(false);
    } catch (err) {
      logging.error('Error uploading csv file: ', { data, err });
      message.error('Houve um problema ao enviar o arquivo');
      setLoading(false);
    }
  };

  return (
    <Layout userRole={user.role} user={user}>
      {modal.open && (
        <FormPlace
          open={modal.open}
          setOpen={setModal}
          loading={loading}
          onSubmit={onSubmitForm}
          place={modal.place}
          defaultCity={modal.prefecture?.city}
          defaultState={modal.prefecture?.state}
        />
      )}
      <ModalUpload
        loading={loading}
        open={modalUpload.open}
        setOpen={setModalUpload}
        onSubmit={onSubmitUpload}
        prefecture={modalUpload.prefecture}
      />
      <ModalSchedule
        loading={loading}
        open={modalSchedule.open}
        onSubmit={onSubmitForm}
        setOpen={setModalSchedule}
        place={modal.place}
      />
      <Spin size="large" spinning={pageLoading} style={{ marginTop: 36 }}>
        {(prefectures || []).map((prefecture) => (
          <PrefectureItem
            key={prefecture.id}
            places={places.filter((f) => f.prefectureId === prefecture.id)}
            user={user}
            prefecture={prefecture}
            setModal={setModal}
            setModalUpload={setModalUpload}
            setModalSchedule={setModalSchedule}
          />
        ))}
      </Spin>
    </Layout>
  );
};

export default List;
