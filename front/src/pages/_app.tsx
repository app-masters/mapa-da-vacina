import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ErrorBoundary from '../components/elements/errorBoundary';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect } from 'react';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

/**
 * Page _app
 * @params AppProps
 */
const App = ({ Component, pageProps }: AppProps) => {
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
          <Component {...pageProps} />
        </ThemeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
