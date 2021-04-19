import { NextPage } from 'next';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import Loader from '../../components/ui/Loader';
import ValidateView from '../../views/Validate';

/**
 * Validate
 */
const Validate: React.FC<NextPage> = () => <ValidateView />;

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loader
})(Validate);
