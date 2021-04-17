import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import UsersView from '../../views/Users';
import { shouldBeLoggedIn } from '../../utils/auth';
import { listUsersByPrefecture, returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import { User } from '../../lib/User';
import React from 'react';
import { Prefecture } from '../../lib/Prefecture';
import { Place } from '../../lib/Place';
import { userRoles } from '../../utils/constraints';
import Loader from '../../components/ui/Loader';

/**
 * Users page
 * @params NextPage
 */
const Users: NextPage<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([]);
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    setLoading(true);
    const unsubscribeUsers = listUsersByPrefecture(user).onSnapshot((snap) => {
      let list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
      if (user.role === userRoles.placeAdmin) {
        list = list.filter((f) => f.placeId === user.placeId && f.role !== userRoles.prefectureAdmin);
      }
      setUsers(list);
      setLoading(false);
    });

    const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((doc) => {
      let list = doc.docs.map((snap) => ({ id: snap.id, ...snap.data() } as Prefecture));
      if (user.role !== userRoles.superAdmin) {
        list = list.filter((f) => f.id === user.prefectureId);
      }
      setPrefectures(list);
      setLoading(false);
    });

    const unsubscribePlaces = returnCollectionGroupByName('place').onSnapshot((doc) => {
      let list = doc.docs.map((snap) => ({ id: snap.id, ...snap.data() } as Place));
      if (user.role === userRoles.placeAdmin) {
        list = list.filter((f) => f.id === user.placeId);
      }
      setPlaces(list);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePrefectures();
      unsubscribePlaces();
    };
  }, [user]);

  return <UsersView loading={loading} users={users} prefectures={prefectures} places={places} user={user} />;
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
})(Users);
