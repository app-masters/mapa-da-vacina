import initAuth from '../../utils/initAuth';
import logging from '../../utils/logging';

initAuth();

/**
 * login handle to set the cookies
 */
const handler = async (_, res) => {
  await logging.info('Rollbar is working as expected');
  return res.status(200).json({ rollbar: true });
};

export default handler;
