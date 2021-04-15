import { unsetAuthCookies } from 'next-firebase-auth';
import initAuth from '../../utils/initAuth';
import logging from '../../utils/logging';

initAuth();

/**
 * logout handle to set the cookies
 */
const handler = async (req, res) => {
  try {
    await unsetAuthCookies(req, res);
  } catch (e) {
    logging.error(e);
    return res.status(500).json({ error: 'Unexpected error.' });
  }
  return res.status(200).json({ status: true });
};

export default handler;
