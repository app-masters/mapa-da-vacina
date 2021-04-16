import React from 'react';
import PlaceQueue from '../../components/elements/placeQueue';
import Layout from '../../layout';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { userRoleType } from '../../utils/constraints';
import { Spin } from 'antd';

type UpdateViewProps = {
  userRole: userRoleType;
  user: User;
  places: Place[];
  pageLoading: boolean;
  prefectures: Prefecture[];
};

/**
 * Update page
 * @params NextPage
 */
const Update: React.FC<UpdateViewProps> = ({ userRole, user, prefectures, places, pageLoading }) => {
  return (
    <Layout userRole={userRole} user={user}>
      <Spin size="large" spinning={pageLoading} style={{ marginTop: 36 }}>
        {(prefectures || []).map((prefecture) => (
          <PlaceQueue
            key={prefecture.id}
            userRole={userRole}
            prefecture={prefecture}
            user={user}
            places={places.filter((f) => f.prefectureId === prefecture.id)}
          />
        ))}
      </Spin>
    </Layout>
  );
};

export default Update;
