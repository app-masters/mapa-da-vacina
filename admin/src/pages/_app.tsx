import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import initAuth from '../utils/initAuth';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ResponsiveProvider from '../providers/ResponsiveProvider';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

initAuth();

/**
 * Page _app
 * @params AppProps
 */
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <ResponsiveProvider>
          <Component {...pageProps} />
        </ResponsiveProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
