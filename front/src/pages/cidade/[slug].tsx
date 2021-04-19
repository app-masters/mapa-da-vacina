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
  return (
    <>
      <NextSeo
        title={props.data.name}
        description={`Descubra onde vacinar em ${props.data.city} contra a COVID-19`}
        openGraph={{ images: [{ url: props.data.primaryLogo, alt: `Logo da prefeitura de ${props.data.name}` }] }}
      />
      <HomeView loading={!props.data?.id} data={props.data || ({} as Prefecture)} />
    </>
  );
};

/**
 * Generating static page with no data
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
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