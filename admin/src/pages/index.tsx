import { NextPage } from 'next';
import Router from 'next/router';

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
export const getServerSideProps = (ctx) => {
  if (ctx.res) {
    ctx.res.writeHead(301, {
      Location: '/auth'
    });
    return ctx.res.end();
  } else {
    return Router.push('/auth');
  }
};

export default Home;
