import React from 'react';
import { AuthContent, AuthWrapper } from './styles';
import Image from 'next/image';
import firebase from 'firebase/app';

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
  // Only renders the firebase on client side
  React.useEffect(() => {
    if (process.browser && typeof window !== 'undefined') {
      require('firebaseui/dist/firebaseui.css');
      const firebaseui = require('../../../firebaseui_pt_br');
      const element = document.getElementById('#firebase-auth');
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start(element, firebaseAuthConfig);
    }
  }, []);
  return (
    <AuthWrapper>
      <AuthContent>
        <Image src={'/images/logo-app.png'} width={230} height={80} />
        <div id="#firebase-auth" />
        {/* {renderAuth ? <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} /> : null} */}
      </AuthContent>
    </AuthWrapper>
  );
};

export default Auth;
