import logging from '../../utils/logging';

/**
 * Health route to test things
 */
const handler = async (_, res) => {
  const rollbar = await logging.info('Rollbar is working as expected');
  return res.status(200).json({ rollbar: !!rollbar?.uuid });
};

export default handler;
