import { Configuration, LogArgument } from 'rollbar';

/**
 * Get the available token
 */
export const getRollbarToken = () => {
  const clientToken = process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN; // Always available
  const serverToken = process.env.ROLLBAR_SERVER_TOKEN || process.env.NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN; // Available on server

  if ((!clientToken || !serverToken) && process.env.NODE_ENV === 'production') {
    const message = 'Neither client nor server Rollbar tokens defined. Add them to your environment variables.';
    console.error(message, { clientToken, serverToken });
    throw new Error(message);
  }

  if (!process.browser) {
    // Server side
    return serverToken;
  }

  // Return the available
  return clientToken;
};

/**
 * Mount Rollbar environment string
 */
const getRollbarEnvironment = () => {
  // Local or Online?
  const deployment = process.env.NEXT_PUBLIC_FRONT_BASE_URL.indexOf('localhost') < 0 ? 'online' : 'local';
  return `front.${process.env.NODE_ENV}.${deployment}`;
};

/**
 * Convert user to person format and save it on the local storage
 * @param user API user
 */
export const saveUserAsPerson = (user: { id: string; name: string; email: string } | null) => {
  // Cleaning storage if not defined (logout)
  if (!user) return localStorage.setItem('rollbar-person', null);

  // Creating Rollbar person and adding it to localStorage
  const person = JSON.stringify({
    id: user.id,
    username: user.name,
    email: user.email
  });
  return localStorage.setItem('rollbar-person', person);
};

/**
 * Create and configure a new Rollbar instance
 */
const getRollbar = async () => {
  //Generating config
  const config: Configuration = {
    accessToken: getRollbarToken(),
    environment: getRollbarEnvironment(),
    captureUncaught: true,
    captureUnhandledRejections: true
  };

  if (typeof window !== 'undefined') {
    // It's on client, maybe the person is available
    const person = localStorage.getItem('rollbar-person');
    if (person) {
      config.payload = { person: JSON.parse(person) };
    }
  }
  const Rollbar = (await import('rollbar')).default;

  return new Rollbar(config);
};

type LoggingTypes = 'log' | 'error' | 'info' | 'debug' | 'critical' | 'warn' | 'warning';

/**
 * Generic Rollbar handler
 * @param type enum of possible rollbar loggings
 * @param args other arguments sent do rollbar
 */
const handleRollbarLog = (type: LoggingTypes) => async (...args: LogArgument[]) => {
  // Logging error on console;
  if (process.env.NODE_ENV !== 'production') {
    const message = `Error will be send to Rollbar as ${type}`;
    if (type === 'critical' || type === 'error') console.error(message, ...args);
    else if (type === 'warn' || type === 'warning') console.warn(message, ...args);
    else console.log(message, ...args);
  }
  if (getRollbarToken()) {
    // Logging to Rollbar only if the token is defined
    const rollbar = await getRollbar();
    try {
      return rollbar[type](...args);
    } catch (error) {
      if (process.env.NODE_ENV !== 'development') {
        console.error(`Rollbar is failing to send this ${type}. This need to be fixed now!`, ...args);
      }
    }
  } else {
    return console.log(`This error would be sent to rollbar as "${type}" on production`);
  }
};

// Creating logging object
const logging = {
  log: handleRollbarLog('log'),
  error: handleRollbarLog('error'),
  info: handleRollbarLog('info'),
  debug: handleRollbarLog('debug'),
  critical: handleRollbarLog('critical'),
  warn: handleRollbarLog('warn'),
  warning: handleRollbarLog('warning')
};

export default logging;
