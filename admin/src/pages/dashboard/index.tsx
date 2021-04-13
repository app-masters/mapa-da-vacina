import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
import { returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import DashboardView from '../../views/Dashboard';

type DashboardProps = {
  user: User;
  prefecture: Prefecture;
  token: string;
};

/**
 * Dashboard page
 * @params NextPage
 */
const Dashboard: NextPage<{ data: DashboardProps }> = ({ data }) => {
  const [prefecture, setPrefecture] = React.useState<Prefecture>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);
  shouldPersistUser(data);

  React.useEffect(() => {
    const unsubscribePrefectures = returnCollectionByName('prefecture')
      .doc(data.user.prefectureId)
      .onSnapshot((snap) => {
        const data = { id: snap.id, ...snap.data() } as Prefecture;
        setPrefecture(data);
      });

    const unsubscribePlaces = returnCollectionGroupByName('place')
      .where('prefectureId', '==', data.user.prefectureId)
      .onSnapshot((snap) => {
        const list = [];
        snap.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as Place;
          list.push(data);
        });
        setPlaces(list);
      });

    return () => {
      unsubscribePrefectures();
      unsubscribePlaces();
    };
  }, [data]);

  return <DashboardView userRole={data.user.role} user={data.user} prefecture={prefecture} places={places} />;
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
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Dashboard);
