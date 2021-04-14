import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import UsersView from '../../views/Users';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
import { listUsersByPrefecture, returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import { User } from '../../lib/User';
import React from 'react';
import { Prefecture } from '../../lib/Prefecture';
import { Place } from '../../lib/Place';
import { userRoles } from '../../utils/constraints';

type UsersProps = {
  user: User;
  prefecture: Prefecture;
  token: string;
};

/**
 * Users page
 * @params NextPage
 */
const Users: NextPage<{ data: UsersProps }> = ({ data }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([]);
  const [places, setPlaces] = React.useState<Place[]>([]);

  shouldPersistUser(data);

  React.useEffect(() => {
    setLoading(true);
    /**
     * unsubscribe
     */
    const unsubscribeUsers = listUsersByPrefecture().onSnapshot((snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
      setLoading(false);
    });

    const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((doc) => {
      let list = doc.docs.map((snap) => ({ id: snap.id, ...snap.data() } as Prefecture));
      if (data.user.role !== userRoles.superAdmin) {
        list = list.filter((f) => f.id === data.user.prefectureId);
      }
      setPrefectures(list);
      setLoading(false);
    });

    const unsubscribePlaces = returnCollectionGroupByName('place').onSnapshot((doc) => {
      const data = doc.docs.map((snap) => ({ id: snap.id, ...snap.data() } as Place));
      setPlaces(data);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePrefectures();
      unsubscribePlaces();
    };
  }, [data.user.prefectureId, data.user.role]);

  return <UsersView loading={loading} users={users} prefectures={prefectures} places={places} user={data.user} />;
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
})(Users);
