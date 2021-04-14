import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ErrorBoundary from '../components/elements/errorBoundary';

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
