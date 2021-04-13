import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import initAuth from '../utils/initAuth';
import { theme } from '../styles/theme';
import '../styles/globals.css';

initAuth();

/**
 * Page _app
 * @params AppProps
 */
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
