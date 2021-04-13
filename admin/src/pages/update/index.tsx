import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';
import { Place } from '../../lib/Place';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
import { userRoles } from '../../utils/constraints';
import { returnCollectionByName, returnCollectionGroupByName } from '../../utils/firestore';
import UpdateView from '../../views/Update';

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
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);
  shouldPersistUser(data);

  React.useEffect(() => {
    const unsubscribePrefectures = returnCollectionByName('prefecture').onSnapshot((snaps) => {
      let listOfPrefectures: Prefecture[] = [];
      snaps.docs.forEach((snap) => {
        const data = { id: snap.id, ...snap.data() } as Prefecture;
        listOfPrefectures.push(data);
      });

      if (data.user.role === userRoles.prefectureAdmin) {
        listOfPrefectures = listOfPrefectures.filter((f) => f.id === data.user.prefectureId);
      }

      setPrefectures(listOfPrefectures);
    });

    const unsubscribePlaces = returnCollectionGroupByName('place').onSnapshot((snap) => {
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

  return <UpdateView userRole={data.user.role} user={data.user} prefectures={prefectures} places={places} />;
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
})(Update);
