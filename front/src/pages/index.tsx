import { useEffect, useState, useCallback } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Prefectures } from '../lib/Prefectures';
import { getPrefectureData } from '../utils/prefecture';
import HomeView from '../views/Home';

/**
 * Home page
 * @params NextPage
 */
const Home: NextPage<{ data: Prefectures }> = () => {
  // Local state
  const [data, setData] = useState({} as Prefectures);

  // Dealing with the fetch and re-fetch of the data
  const getAndSetPrefectureData = useCallback(async () => {
    const prefectureData = await getPrefectureData();
    setData(prefectureData);
    if (prefectureData) {
      // If the data is defined, update it after some time
      setTimeout(getAndSetPrefectureData, 10000);
    }
  }, []);

  // Fetching prefecture data
  useEffect(() => {
    getAndSetPrefectureData();
  }, [getAndSetPrefectureData]);

  return <HomeView data={data} />;
};

/**
 * Generating static page with no data
 */
export const getStaticProps: GetStaticProps = async () => {
  return { props: { data: {} } };
};

export default Home;
