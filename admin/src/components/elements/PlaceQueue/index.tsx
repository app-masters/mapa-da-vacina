import React from 'react';
import { Place } from '../../../lib/Place';
import { placeQueue, placeQueueStatusType } from '../../../utils/constraints';
import { createQueueUpdate, updatePlace } from '../../../utils/firestore';
import PlaceQueueTemplate, { PlaceQueueProps } from './template';

/**
 * PlaceQueue
 */
const PlaceQueue: React.FC<PlaceQueueProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>();

  /**
   * handleUpdatePlaceStatus
   */
  const handleUpdatePlaceStatus = async (place: Place, newStatus: boolean) => {
    try {
      setLoading(true);
      await updatePlace(place.id, place.prefectureId, {
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
      await updatePlace(placeId, prefectureId, {
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
    <PlaceQueueTemplate
      {...props}
      loading={loading}
      placeQueueUpdate={handleUpdatePlaceQueue}
      placeStatusUpdate={handleUpdatePlaceStatus}
    />
  );
};

export default PlaceQueue;
