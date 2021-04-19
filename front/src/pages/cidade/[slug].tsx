import { useEffect, useState, useCallback } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Prefecture } from '../../lib/Prefecture';
import { getPrefectureData } from '../../utils/prefecture';
import HomeView from '../../views/Home';

/**
 * Home page
 * @params NextPage
 */
const Home: NextPage<{ data: Prefecture }> = (props) => {
  // Local state
  const [data, setData] = useState(props.data as Prefecture);

  // Dealing with the fetch and re-fetch of the data
  const getAndSetPrefectureData = useCallback(async () => {
    const prefectureData = await getPrefectureData();

    if (prefectureData && prefectureData.id) {
      // only set if successful, keeping old values if couldn't fetch
      setData(prefectureData);
      // If the data is defined, update it after some time
      setTimeout(getAndSetPrefectureData, 60000);
    }
  }, []);

  // Fetching prefecture data
  useEffect(() => {
    getAndSetPrefectureData();
  }, [getAndSetPrefectureData]);

  return (
    <>
      <NextSeo
        title={props.data?.name}
        description={`Descubra onde vacinar em ${props.data?.city || 'sua cidade'} contra a COVID-19`}
        openGraph={{ images: [{ url: props.data?.primaryLogo, alt: `Logo da prefeitura de ${props.data?.name}` }] }}
      />
      <HomeView loading={!props.data?.id} data={data?.id ? data : props.data || ({} as Prefecture)} />
    </>
  );
};

/**
 * Generating static page with no data
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    if (!ctx.params.slug) return { props: { data: {} } }; // Don't try to regenerate base html
    console.log('[debug] Regenerating page for', ctx.params.slug);
    const data = await getPrefectureData(ctx.params.slug as string);
    return { props: { data }, revalidate: 60 };
  } catch (error) {
    return { props: { data: {} }, revalidate: 60 };
  }
};

/**
 * Possible paths
 */
export async function getStaticPaths() {
  if (process.env.NEXT_PUBLIC_PREFECTURE_ID) {
    return {
      paths: [{ params: { slug: process.env.NEXT_PUBLIC_PREFECTURE_ID } }],
      fallback: false
    };
  }
  return {
    paths: JSON.parse(process.env.NEXT_PUBLIC_HEROKU).map((item) => ({ params: { slug: item } })),
    fallback: true // Cannot be 'blocking' because of the rewrite
  };
}

export default Home;
