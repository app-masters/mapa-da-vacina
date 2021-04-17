import { NextPage } from 'next';

/**
 * Home page
 * @params NextPage
 */
const Home: NextPage = () => {
  return (
    <div>
      <h1>Filometro Admin</h1>
    </div>
  );
};

/**
 * getServerSideProps
 */
export const getServerSideProps = () => {
  return {
    redirect: {
      destination: '/auth',
      permanent: false
    }
  };
};

export default Home;
