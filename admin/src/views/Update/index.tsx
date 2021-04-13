import React from 'react';
import PlaceQueue from '../../components/elements/PlaceQueue';
import Layout from '../../layout';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { userRoleType, placeQueueStatusType } from '../../utils/constraints';
import { createQueueUpdate, updatePlace } from '../../utils/firestore';
import { placeQueue } from '../../utils/constraints';

type UpdateViewProps = {
  userRole: userRoleType;
  user: User;
  places: Place[];
  prefectures: Prefecture[];
};

/**
 * Update page
 * @params NextPage
 */
const Update: React.FC<UpdateViewProps> = ({ userRole, user, prefectures, places }) => {
  const [loading, setLoading] = React.useState<boolean>();

  /**
   * handleUpdatePlaceStatus
   */
  const handleUpdatePlaceStatus = async (place: Place, newStatus: boolean) => {
    try {
      setLoading(true);
      await updatePlace(place.id, {
        open: newStatus,
        queueStatus: newStatus ? placeQueue.noQueue : null,
        queueUpdatedAt: new Date()
      });
      if (newStatus) {
        createQueueUpdate(place.id, place.prefectureId, placeQueue.noQueue);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  /**
   * handleUpdatePlaceQueue
   */
  const handleUpdatePlaceQueue = async (placeId: string, prefectureId: string, newStatus: placeQueueStatusType) => {
    try {
      setLoading(true);
      await updatePlace(placeId, {
        queueStatus: newStatus,
        queueUpdatedAt: new Date()
      });
      if (newStatus) {
        await createQueueUpdate(placeId, prefectureId, newStatus);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Layout userRole={userRole}>
      {(prefectures || []).map((prefecture) => (
        <PlaceQueue
          key={prefecture.id}
          loading={loading}
          userRole={userRole}
          prefecture={prefecture}
          user={user}
          places={places.filter((f) => f.prefectureId === prefecture.id)}
          placeQueueUpdate={handleUpdatePlaceQueue}
          placeStatusUpdate={handleUpdatePlaceStatus}
        />
      ))}
    </Layout>
  );
};

export default Update;
