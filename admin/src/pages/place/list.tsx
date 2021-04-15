import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';
import Loader from '../../components/ui/Loader';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
import { userRoles } from '../../utils/constraints';
import { returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import LocalView from '../../views/LocalList';

type UpdateProps = {
  user: User;
  prefecture: Prefecture;
  token: string;
};

/**
 * Update page
 * @params NextPage
 */
const Update: NextPage<{ data: UpdateProps }> = ({ data }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);
  shouldPersistUser(data);

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
      if (data.user.role === userRoles.placeAdmin || data.user.role === userRoles.queueObserver) {
        const unsubscribePlaces = returnCollectionByName('prefecture')
          .doc(data.user.prefectureId)
          .collection('place')
          .doc(data.user.placeId)
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
  }, [data.user, data.user.placeId, data.user.prefectureId, data.user.role, handlePlaces, prefectures]);

  React.useEffect(() => {
    setLoading(true);
    // Not able to init unsubscribePrefectures as let variable...
    if (data.user.role !== userRoles.superAdmin) {
      const unsubscribePrefectures = returnCollectionByName('prefecture')
        .doc(data.user.prefectureId)
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
  }, [data, handlePrefectures]);

  return (
    <LocalView
      userRole={data.user.role}
      user={data.user}
      prefectures={prefectures}
      places={places}
      pageLoading={loading}
    />
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async (ctx) => {
  const response = await shouldBeLoggedIn(ctx);
  return {
    props: response
  };
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loader
})(Update);
