import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import UsersView from '../../views/Users';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
import { listUsersByPrefecture, returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import { User } from '../../lib/User';
import React from 'react';
import { Prefecture } from '../../lib/Prefecture';
import { Place } from '../../lib/Place';

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
  const [users, setUsers] = React.useState<User[]>([]);
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([]);
  const [places, setPlaces] = React.useState<Place[]>([]);

  shouldPersistUser(data);

  React.useEffect(() => {
    /**
     * unsubscribe
     */
    const unsubscribeUsers = listUsersByPrefecture().onSnapshot((snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      const formattedData = data.map(
        (
          user: User & {
            invitedAt: { seconds: number; nanoseconds: number };
            signedUpAt: { seconds: number; nanoseconds: number };
          }
        ) => ({
          ...user,
          invitedAt: user.invitedAt ? new Date(user.invitedAt.seconds * 1000) : null,
          signedUpAt: user.signedUpAt ? new Date(user.signedUpAt.seconds * 1000) : null
        })
      );
      setUsers(formattedData);
    });

    const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((doc) => {
      const listOfSnaps = [];
      doc.forEach((snap) => {
        listOfSnaps.push({ id: snap.id, ...snap.data() });
      });
      setPrefectures(listOfSnaps);
    });

    const unsubscribePlaces = returnCollectionGroupByName('place').onSnapshot((doc) => {
      const listOfSnaps = [];
      doc.forEach((snap) => {
        listOfSnaps.push({ id: snap.id, ...snap.data() });
      });
      setPlaces(listOfSnaps);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePrefectures();
      unsubscribePlaces();
    };
  }, []);

  return <UsersView users={users} prefectures={prefectures} places={places} userRole={data.user.role} />;
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
