import Layout from '../../layout';
import { ContainerWrapper, Section } from './styles';
import { Table, Popconfirm, Typography } from 'antd';
import Button from '../../components/ui/Button';
import React from 'react';
import FormInvitation from '../../components/elements/FormInvitation';
import { User } from '../../lib/User';
import { userRoles, userRolesLabel, userRoleType } from '../../utils/constraints';
import { disableUser } from '../../utils/firestore';
import { Prefecture } from '../../lib/Prefecture';
import { Place } from '../../lib/Place';

type UsersViewProps = {
  users: User[];
  prefectures: Prefecture[];
  places: Place[];
  userRole: userRoleType;
};

/**
 * Users page
 */
const Users: React.FC<UsersViewProps> = ({ users, prefectures, places, userRole }) => {
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
      {
        title: 'Prefeitura',
        dataIndex: 'prefectureId',
        key: 'prefectureId',
        /**
         * render
         */
        render: (text) => {
          const prefecture = prefectures.find((f) => f.id === text);
          return <a>{prefecture?.name}</a>;
        }
      },
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
        render: (_, record: User) => <a>{new Date(record.invitedAt as string).toLocaleDateString('pt-br')}</a>
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

    if (userRole !== userRoles.superAdmin) {
      dataColumns = dataColumns.filter((f) => f.key !== 'prefectureId');
    }

    return dataColumns;
  }, [handleDisableUser, userRole, prefectures, places]);

  const listUsers = React.useMemo(() => {
    return (users || []).map((user) => ({ key: user.id, ...user }));
  }, [users]);

  return (
    <Layout userRole={userRole}>
      <ContainerWrapper>
        <Table
          pagination={false}
          columns={columns.filter((f) => f.key !== 'invitedAt')}
          dataSource={listUsers.filter((f) => f.active)}
        />
      </ContainerWrapper>
      <Section>
        <div>
          <Typography.Title level={3}>Convites enviados</Typography.Title>
          <FormInvitation prefectures={prefectures} places={places} />
        </div>
        <ContainerWrapper>
          <Table
            pagination={false}
            columns={columns.filter((f) => f.key !== 'action')}
            dataSource={listUsers.filter((f) => !f.signedUpAt)}
          />
        </ContainerWrapper>
      </Section>
    </Layout>
  );
};

export default Users;
