import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';
import Loader from '../../components/ui/Loader';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn } from '../../utils/auth';
import { userRoles } from '../../utils/constraints';
import { returnCollectionByName } from '../../utils/firestore';
import DashboardView from '../../views/Dashboard';

/**
 * Dashboard page
 * @params NextPage
 */
const Dashboard: NextPage<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [prefecture, setPrefecture] = React.useState<Prefecture>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    if (user.role === userRoles.queueObserver || user.role === userRoles.placeAdmin) {
      setLoading(true);
      const unsubscribePrefectures = returnCollectionByName('prefecture')
        .doc(user.prefectureId)
        .onSnapshot((snap) => {
          const data = { id: snap.id, ...snap.data() } as Prefecture;
          setPrefecture(data);
          setLoading(false);
        });

      const unsubscribePlaces = returnCollectionByName('prefecture')
        .doc(user.prefectureId)
        .collection('place')
        .doc(user?.placeId)
        .onSnapshot((snap) => {
          const data = { id: snap.id, ...snap.data() } as Place;
          setPlaces([data]);
          setLoading(false);
        });

      return () => {
        unsubscribePrefectures();
        unsubscribePlaces();
      };
    }
  }, [user]);

  return <DashboardView user={user} prefecture={prefecture} places={places} pageLoading={loading} />;
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
})(Dashboard);
