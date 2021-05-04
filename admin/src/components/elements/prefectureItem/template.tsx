import { CheckOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Place } from '../../../lib/Place';
import { Prefecture } from '../../../lib/Prefecture';
import { User } from '../../../lib/User';
import { placeTypeLabel, userRoles } from '../../../utils/constraints';
import { Coordinate, Pin } from '../../ui/Icons';
import { PrefectureItemWrapper, PrefectureItem, PrefectureItemHeader } from './styles';

type ModalProps = {
  open: boolean;
  prefecture: Prefecture;
  place?: Place;
};

export type PrefectureItemTemplateProps = {
  prefecture: Prefecture;
  user: User;
  setModal: ({ open, prefecture, place }: ModalProps) => void;
  setModalUpload: ({ open: boolean, prefecture: Prefecture }) => void;
  places: Place[];
};

/**
 * PrefectureItemTemplate
 */
const PrefectureItemTemplate: React.FC<PrefectureItemTemplateProps> = ({
  prefecture,
  user,
  places,
  setModal,
  setModalUpload
}) => {
  const [data, setData] = useState<Place[]>(places);
  const [filter, setFilter] = useState<{ query: string }>({ query: undefined });

  useEffect(() => {
    if (!filter.query) {
      setData(places);
    } else {
      setData(places.filter((f) => f.title.toLowerCase().includes(filter.query.toLowerCase())));
    }
  }, [filter, places]);

  /**
   * formatDate
   */
  const formatDate = ({ seconds }) => dayjs(new Date(seconds * 1000)).format('HH:mm');
  const columns: ColumnsType = [
    {
      title: 'Ponto',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      /**
       * render
       */
      render: (value) => placeTypeLabel[value]
    },
    {
      title: 'Localização',
      dataIndex: 'googleMapsUrl',
      key: 'googleMapsUrl',
      align: 'center',
      /**
       * render
       */
      render: (value, record: Place) => (
        <Space>
          {value ? (
            <Tooltip title="Abrir no mapa">
              <a href={value} target="_blank" rel="noreferrer">
                <Pin />
              </a>
            </Tooltip>
          ) : null}
          {!!(record.latitude && record.longitude) ? (
            <Tooltip
              title={
                <div>
                  {`latitude: ${record.latitude}`}
                  <br />
                  {`longitude: ${record.longitude}`}
                </div>
              }
            >
              <a target="_blank" rel="noreferrer">
                <Coordinate />
              </a>
            </Tooltip>
          ) : null}
        </Space>
      )
    },
    {
      title: 'Abre hoje',
      dataIndex: 'openToday',
      key: 'openToday',
      align: 'center',
      /**
       * render
       */
      render: (_, record: Place) => (record.openToday ? <CheckOutlined /> : null)
    },
    {
      title: 'Abre amanhã',
      dataIndex: 'openTomorrow',
      key: 'openTomorrow',
      align: 'center',
      /**
       * render
       */
      render: (_, record: Place) => (record.openTomorrow ? <CheckOutlined /> : null)
    },
    {
      title: 'Horário',
      dataIndex: 'schedule',
      key: 'schedule',
      /**
       * render
       */
      render: (_, record: Place) =>
        `de ${record.openAt ? formatDate(record.openAt) : ''} até ${record.closeAt ? formatDate(record.closeAt) : ''}`
    },
    {
      title: 'Ativo',
      dataIndex: 'active',
      key: 'active',
      /**
       * render
       */
      render: (_, record: Place) => (record.active ? <CheckOutlined /> : null)
    },
    {
      title: '',
      key: 'action',
      width: 200,
      /**
       * render
       */
      render: (_, record: Place) => (
        <Space size="middle">
          <a onClick={() => setModal({ open: true, prefecture, place: record })}>
            <EditOutlined style={{ marginRight: 8 }} />
            Editar
          </a>
        </Space>
      )
    }
  ];

  return (
    <PrefectureItemWrapper>
      <PrefectureItem>
        <PrefectureItemHeader>
          <Typography.Title level={4}>{prefecture.name}</Typography.Title>
          <Space size="middle">
            {places.length > 1 && (
              <Input placeholder="Pesquisa" onChange={({ target }) => setFilter({ query: target.value })} />
            )}
            {!!(user.role === userRoles.prefectureAdmin || user.role === userRoles.superAdmin) && (
              <Button onClick={() => setModalUpload({ open: true, prefecture })}>
                <UploadOutlined />
                importar CSV
              </Button>
            )}
            <Button type="primary" onClick={() => setModal({ open: true, prefecture })}>
              Novo Ponto
            </Button>
          </Space>
        </PrefectureItemHeader>
        <Table
          pagination={false}
          columns={columns}
          dataSource={data}
          rowClassName={(record: Place) =>
            !record.googleMapsUrl || (!record.longitude && !record.latitude) ? 'warning-item' : ''
          }
          scroll={{ x: 1280 }}
        />
      </PrefectureItem>
    </PrefectureItemWrapper>
  );
};

export default PrefectureItemTemplate;
