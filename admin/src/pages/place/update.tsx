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
import LocalView from '../../views/LocalUpdate';

/**
 * Update page
 * @params NextPage
 */
const Update: NextPage<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    setLoading(true);
    const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((snaps) => {
      let listOfPrefectures: Prefecture[] = [];
      snaps.docs.forEach((snap) => {
        const data = { id: snap.id, ...snap.data() } as Prefecture;
        listOfPrefectures.push(data);
      });

      if (user.role === userRoles.prefectureAdmin) {
        listOfPrefectures = listOfPrefectures.filter((f) => f.id === user.prefectureId);
      }

      setPrefectures(listOfPrefectures);
      setLoading(false);
    });

    const unsubscribePlaces = returnCollectionGroupByName('place').onSnapshot((snap) => {
      const list: Place[] = [];
      snap.docs.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as Place;
        list.push(data);
      });
      setPlaces(
        list.sort((a, b) => {
          return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
        })
      );
      setLoading(false);
    });

    return () => {
      unsubscribePrefectures();
      unsubscribePlaces();
    };
  }, [user]);

  return <LocalView user={user} prefectures={prefectures} places={places} pageLoading={loading} />;
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
