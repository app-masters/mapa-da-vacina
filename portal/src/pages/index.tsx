import { GetStaticProps, NextPage } from 'next';
import HomeView from '../views/Home';

/**
 * Home page
 * @params NextPage
 */
const Home: NextPage = () => {
  return <HomeView />;
};

/**
 * getStaticProps
 */
// export const getStaticProps: GetStaticProps = async (context) => {
//   const res = await fetch('https://...');
//   const data = await res.json();
//   return { props: { data }, revalidate: 20 };
// };

export default Home;
