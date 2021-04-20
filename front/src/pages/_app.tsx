import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import '../styles/globals.css';
import ErrorBoundary from '../components/elements/errorBoundary';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect } from 'react';
import { NextSeo } from 'next-seo';

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
    <>
      <NextSeo
        titleTemplate="Mapa da Vacina | %s"
        defaultTitle="Encontre a vacina para COVID"
        canonical="https://mapadavacina.com.br"
        openGraph={{
          url: 'https://mapadavacina.com.br',
          title: 'Mapa da Vacina | Encontre a vacina para COVID',
          description: 'Descubra onde é vacina de COVID mais próxima de você',
          images: [
            {
              url:
                'https://www.aljazeera.com/wp-content/uploads/2021/03/2021-03-11T200339Z_1838474793_RC289M9636OU_RTRMADP_3_HEALTH-CORONAVIRUS-USA.jpg?resize=770%2C513'
            }
          ],
          ['site_name']: 'Mapa da Vacina'
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image'
        }}
      />
      <ErrorBoundary>
        <ConfigProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ConfigProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
