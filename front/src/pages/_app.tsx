import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ErrorBoundary from '../components/elements/errorBoundary';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

/**
 * Page _app
 * @params AppProps
 */
const App = ({ Component, pageProps }: AppProps) => {
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
