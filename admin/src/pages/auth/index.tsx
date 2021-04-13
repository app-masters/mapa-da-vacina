import React from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import AuthView from '../../views/Auth';
/**
 * Authentication page
 */
const Auth = () => {
  return <AuthView />;
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER
})(Auth);
