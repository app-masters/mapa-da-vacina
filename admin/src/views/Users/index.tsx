import Layout from '../../layout';
import { TableWrapper, Section } from './styles';
import { Popconfirm, Typography, Collapse } from 'antd';
import Button from '../../components/ui/Button';
import React from 'react';
import FormInvitation from '../../components/elements/FormInvitation';
import { User } from '../../lib/User';
import { userRoles, userRolesLabel } from '../../utils/constraints';
import { disableUser } from '../../utils/firestore';
import { Prefecture } from '../../lib/Prefecture';
import { Place } from '../../lib/Place';

type UsersViewProps = {
  users: User[];
  prefectures: Prefecture[];
  places: Place[];
  user: User;
};

/**
 * Users page
 */
const Users: React.FC<UsersViewProps> = ({ users, prefectures, places, user }) => {
  /**
   * handleDisableUser
   */
  const handleDisableUser = React.useCallback(async (user: User) => {
    await disableUser(user.prefectureId, user.id);
  }, []);

  const columns = React.useMemo(() => {
    let dataColumns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        /**
         * render
         */
        render: (text) => <a>{text}</a>
      },
      {
        title: 'Cargo',
        dataIndex: 'role',
        key: 'role',
        /**
         * render
         */
        render: (text) => <a>{userRolesLabel[text]}</a>
      },
      // {
      //   title: 'Prefeitura',
      //   dataIndex: 'prefectureId',
      //   key: 'prefectureId',
      //   /**
      //    * render
      //    */
      //   render: (text) => {
      //     const prefecture = prefectures.find((f) => f.id === text);
      //     return <a>{prefecture?.name}</a>;
      //   }
      // },
      {
        title: 'Local',
        dataIndex: 'placeId',
        key: 'placeId',
        /**
         * render
         */
        render: (text) => {
          const place = places.find((f) => f.id === text);
          return <a>{place?.title}</a>;
        }
      },
      {
        title: 'Convidado em',
        dataIndex: 'invitedAt',
        key: 'invitedAt',
        /**
         * render
         */
        render: (_, record: User) => <a>{new Date(record.invitedAt?.seconds * 1000).toLocaleDateString('pt-br')}</a>
      },
      {
        title: '',
        key: 'action',
        width: 120,
        /**
         * render
         */
        render: (_, record: User) => (
          <>
            {record.active && (
              <Popconfirm
                placement="topLeft"
                title={'Deseja mesmo desativar este usuário?'}
                onConfirm={() => handleDisableUser(record)}
                okText="Sim"
                cancelText="Não"
              >
                <Button type="secondary">Desativar</Button>
              </Popconfirm>
            )}
          </>
        )
      }
    ];

    if (user.role !== userRoles.superAdmin) {
      dataColumns = dataColumns.filter((f) => f.key !== 'prefectureId');
    }

    return dataColumns;
  }, [handleDisableUser, user.role, places]);

  const listUsers = React.useMemo(() => {
    return (users || [])
      .map((user) => ({ key: user.id, ...user }))
      .filter((f) => f.role !== userRoles.superAdmin)
      .sort((a, b) => b.invitedAt?.seconds - a.invitedAt?.seconds);
  }, [users]);

  const superAdmin = React.useMemo(() => {
    return (users || []).map((user) => ({ key: user.id, ...user })).filter((f) => f.role === userRoles.superAdmin);
  }, [users]);

  return (
    <Layout userRole={user.role}>
      <Section>
        {user.role === userRoles.superAdmin && (
          <Collapse style={{ marginBottom: 16 }}>
            <Collapse.Panel
              key={'superAdmin'}
              header={<Typography.Title level={4}>{'Super Administradores'}</Typography.Title>}
            >
              <TableWrapper
                pagination={false}
                columns={columns.filter((f) => f.key !== 'invitedAt')}
                locale={{ emptyText: 'Nenhum dado' }}
                dataSource={superAdmin}
              />
              <div className="subtitle-container">
                <Typography.Title level={4}>Convites enviados</Typography.Title>
              </div>
              <TableWrapper
                pagination={false}
                columns={columns.filter((f) => f.key !== 'action')}
                locale={{ emptyText: 'Nenhum dado' }}
                dataSource={superAdmin.filter((f) => !f.signedUpAt)}
              />
            </Collapse.Panel>
          </Collapse>
        )}
        {prefectures && prefectures.length > 0 && (
          <Collapse defaultActiveKey={[prefectures[0]?.id]}>
            {prefectures.map((prefecture) => (
              <Collapse.Panel
                key={prefecture.id}
                header={<Typography.Title level={4}>{prefecture.name || prefecture.slug}</Typography.Title>}
              >
                <TableWrapper
                  pagination={false}
                  columns={columns.filter((f) => f.key !== 'invitedAt')}
                  locale={{ emptyText: 'Nenhum dado' }}
                  dataSource={listUsers.filter((f) => f.active && f.prefectureId === prefecture.id)}
                />
                <div className="subtitle-container">
                  <Typography.Title level={4}>Convidar Usuários</Typography.Title>
                  <FormInvitation
                    prefectures={[prefecture]}
                    places={places.filter((f) => f.prefectureId === prefecture.id)}
                    user={user}
                  />
                </div>
                <TableWrapper
                  pagination={false}
                  columns={columns.filter((f) => f.key !== 'action')}
                  locale={{ emptyText: 'Nenhum dado' }}
                  dataSource={listUsers.filter((f) => !f.signedUpAt && f.prefectureId === prefecture.id)}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
      </Section>
    </Layout>
  );
};

export default Users;
