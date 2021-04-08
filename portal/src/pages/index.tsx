import { GetStaticProps, NextPage } from 'next';
import { Prefectures } from '../lib/Prefectures';
import HomeView from '../views/Home';

/**
 * Home page
 * @params NextPage
 */
const Home: NextPage<{ data: Prefectures }> = ({ data }) => {
  return <HomeView data={data} />;
};

/**
 * getStaticProps
 */
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('http://localhost:3333/prefectures/7zsx4B9x6bi3hPXKJAUw');
  const data = await res.json();
  return { props: { data }, revalidate: 60 };
};

export default Home;
