import React from 'react';
import { Place } from '../../../lib/Place';
import { placeQueue, placeQueueStatusType } from '../../../utils/constraints';
import { createQueueUpdate } from '../../../utils/firestore';
import logging from '../../../utils/logging';
import PlaceQueueTemplate, { PlaceQueueProps } from './template';

/**
 * PlaceQueue
 */
const PlaceQueue: React.FC<PlaceQueueProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>();

  /**
   * handleUpdatePlaceStatus
   */
  const handleUpdatePlaceStatus = async (place: Place, isOpen: boolean) => {
    try {
      setLoading(true);
      const newQueueStatus = isOpen ? placeQueue.open : placeQueue.closed;
      await createQueueUpdate(place.id, place.prefectureId, isOpen, newQueueStatus, props.user.id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      logging.error(err);
    }
  };

  /**
   * handleUpdatePlaceQueue
   */
  const handleUpdatePlaceQueue = async (placeId: string, prefectureId: string, newStatus: placeQueueStatusType) => {
    try {
      setLoading(true);
      await createQueueUpdate(placeId, prefectureId, true, newStatus, props.user.id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      logging.error(err);
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
