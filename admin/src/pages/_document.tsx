import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  /**
   * getInitialProps
   */
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      /**
       * renderPage
       */
      ctx.renderPage = () =>
        originalRenderPage({
          /**
           * enhanceApp
           */
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  /**
   * render
   */
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/fonts/Roboto-Light.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/Roboto-Regular.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/Roboto-Medium.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/Roboto-Bold.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/Roboto-Black.ttf" as="font" crossOrigin="" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
