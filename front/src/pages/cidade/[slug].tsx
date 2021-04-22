import { useEffect, useRef, useState } from 'react';
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
  const [filter, setFilter] = useState<{ permission?: string; position?: GeolocationPosition }>(null);

  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);
    /**
     * getData
     */
    const getData = async () => {
      const prefectureData = await getPrefectureData(null, filter.position);
      setData(prefectureData);
      interval.current = setInterval(async () => {
        const prefectureData = await getPrefectureData(null, filter.position);
        setData(prefectureData);
      }, 10000);
    };
    if (filter && filter.permission) {
      getData();
    }
  }, [filter]);

  // Fetching prefecture data
  useEffect(() => {
    /**
     * initData
     */
    const initData = async () => {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFilter({ position, permission: permission.state });
          },
          null,
          { timeout: 10 * 10000 }
        );
      } else {
        setFilter({ permission: permission.state });
      }
    };
    if (process.browser && 'navigator' in window) {
      initData();
    }
  }, []);

  const siteName = `Mapa da Vacina | Vacinas de COVID-19 em ${props.data?.city || 'sua cidade'}`;
  const siteUrl = `https://${props.data?.id}.mapadavacina.com.br`;
  const siteDescription = `Descubra onde se vacinar em ${
    props.data?.city || 'sua cidade'
  } contra a COVID-19. Veja os pontos de vacinação abertos e descubra o mais próximo de você.`;
  return (
    <>
      <NextSeo
        title={siteName}
        description={siteDescription}
        openGraph={{
          url: siteUrl,
          title: siteName,
          description: siteDescription,
          images: [
            props.data?.primaryLogo && props.data?.primaryLogo.indexOf('.svg') < 0
              ? { url: props.data?.primaryLogo, alt: `Prefeitura de ${props.data?.name}` }
              : {
                  alt: `Vacinação acontecendo em ${props.data?.city || 'sua cidade'}`,
                  url: '/images/Vaccination.jpeg'
                }
          ],
          ['site_name']: siteName
        }}
      />
      <HomeView
        loading={!props.data?.id}
        data={data?.id ? data : props.data || ({} as Prefecture)}
        setCoordinate={setFilter}
        coordinate={filter}
      />
    </>
  );
};

/**
 * Generating static page with no data
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    if (!ctx.params.slug) return { props: { data: {} }, revalidate: 60 }; // Don't try to fetch
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
