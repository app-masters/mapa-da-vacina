import React from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import AuthView from '../../views/Auth';
import Loader from '../../components/ui/Loader';
/**
 * Authentication page
 */
const Auth = () => {
  return <AuthView />;
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: Loader
})(Auth);
