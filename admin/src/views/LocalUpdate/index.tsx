import React from 'react';
import PlaceQueue from '../../components/elements/placeQueue';
import Layout from '../../layout';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { Spin } from 'antd';

type UpdateViewProps = {
  user: User;
  places: Place[];
  pageLoading: boolean;
  prefectures: Prefecture[];
};

/**
 * Update page
 * @params NextPage
 */
const Update: React.FC<UpdateViewProps> = ({ user, prefectures, places, pageLoading }) => {
  return (
    <Layout userRole={user.role} user={user}>
      <Spin size="large" spinning={pageLoading} style={{ marginTop: 36 }}>
        {(prefectures || []).map((prefecture) => (
          <PlaceQueue
            key={prefecture.id}
            userRole={user.role}
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
