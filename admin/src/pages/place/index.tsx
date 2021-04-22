import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';
import Loader from '../../components/ui/Loader';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn } from '../../utils/auth';
import { userRoles } from '../../utils/constraints';
import { returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import LocalView from '../../views/LocalList';

/**
 * Update page
 * @params NextPage
 */
const Update: NextPage<{ user: User; token: string }> = ({ user, token }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);

  // TODO: Replace this functions with a generic
  const handlePrefectures = React.useCallback((snaps) => {
    const listOfPrefectures: Prefecture[] = [];
    snaps.forEach((snap) => {
      const data = { id: snap.id, ...snap.data() } as Prefecture;
      listOfPrefectures.push(data);
    });
    setPrefectures(listOfPrefectures.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)));
  }, []);
  // TODO: Replace this functions with a generic
  const handlePlaces = React.useCallback((snaps) => {
    const listOfPrefectures: Place[] = [];
    snaps.forEach((snap) => {
      const data = { id: snap.id, ...snap.data() } as Place;
      listOfPrefectures.push(data);
    });
    setPlaces(listOfPrefectures.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0)));
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (prefectures && prefectures.length > 0) {
      const prefecturesId = prefectures.map((m) => m.id);
      // Not able to init unsubscribePlaces as let variable...
      if (user.role === userRoles.placeAdmin || user.role === userRoles.queueObserver) {
        const unsubscribePlaces = returnCollectionByName('prefecture')
          .doc(user.prefectureId)
          .collection('place')
          .doc(user.placeId)
          .onSnapshot((snap) => handlePlaces([snap]));
        return () => {
          unsubscribePlaces();
        };
      } else {
        const unsubscribePlaces = returnCollectionGroupByName('place')
          .where('prefectureId', 'in', prefecturesId)
          .onSnapshot((snap) => handlePlaces(snap.docs));
        return () => {
          unsubscribePlaces();
        };
      }
    }
  }, [user, user.placeId, user.prefectureId, user.role, handlePlaces, prefectures]);

  React.useEffect(() => {
    setLoading(true);
    // Not able to init unsubscribePrefectures as let variable...
    if (user.role !== userRoles.superAdmin) {
      const unsubscribePrefectures = returnCollectionByName('prefecture')
        .doc(user.prefectureId)
        .onSnapshot((doc) => handlePrefectures([doc]));
      return () => {
        unsubscribePrefectures();
      };
    } else {
      const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((snaps) =>
        handlePrefectures(snaps.docs)
      );
      return () => {
        unsubscribePrefectures();
      };
    }
  }, [user, handlePrefectures]);

  return <LocalView user={user} tokenId={token} prefectures={prefectures} places={places} pageLoading={loading} />;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async (ctx) => {
  return await shouldBeLoggedIn(ctx);
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loader
})(Update);
