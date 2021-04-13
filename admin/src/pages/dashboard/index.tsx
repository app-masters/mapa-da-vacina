import { NextPage } from 'next';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { Prefecture } from '../../lib/Prefecture';
import { User } from '../../lib/User';
import { shouldBeLoggedIn, shouldPersistUser } from '../../utils/auth';
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
  shouldPersistUser(data);
  return <DashboardView userRole={data.user.role} />;
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
