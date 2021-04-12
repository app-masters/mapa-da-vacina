import React from 'react';
import { AuthContent, AuthWrapper } from './styles';
import Image from 'next/image';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseAuthConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
      defaultCountry: 'BR',
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomleft'
      },
      whitelistedCountries: ['BR', '+55']
    }
  ],
  signInSuccessUrl: '/dashboard',
  credentialHelper: 'none',
  callbacks: {
    /**
     * signInSuccessWithAuthResult
     */
    signInSuccessWithAuthResult: () => false
  }
};

/**
 * Auth view
 */
const Auth: React.FC = () => {
  const [renderAuth, setRenderAuth] = React.useState<boolean>(false);
  // Only renders the firebase on client side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true);
    }
  }, []);
  return (
    <AuthWrapper>
      <AuthContent>
        <Image src={'/images/logo-app.png'} width={230} height={80} />
        {renderAuth ? <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} /> : null}
      </AuthContent>
    </AuthWrapper>
  );
};

export default Auth;
