import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import initAuth from '../utils/initAuth';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ResponsiveProvider from '../providers/ResponsiveProvider';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import ErrorBoundary from '../components/elements/errorBoundary';
import React, { useEffect } from 'react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { API } from '../utils/api';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

initAuth();

/**
 * Page _app
 * @params AppProps
 */
const App = ({ Component, pageProps }: AppProps) => {
  const authUser = useAuthUser();

  useEffect(() => {
    (async () => {
      // Setting Authorization on reload
      if (authUser && authUser.firebaseUser) {
        const token = await authUser.getIdToken();
        API.defaults.headers['Authorization'] = token;
      }
    })();
  }, [authUser]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && window.location.host.indexOf('localhost') < 0) {
      const httpTokens = /^http:\/\/(.*)$/.exec(window.location.href);
      if (httpTokens) {
        window.location.replace('https://' + httpTokens[1]);
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <ResponsiveProvider>
            <Component {...pageProps} />
          </ResponsiveProvider>
        </ThemeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default withAuthUser()(App as React.FC);
