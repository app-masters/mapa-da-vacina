/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Config from '@ioc:Adonis/Core/Config';

import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import Place from 'App/Models/Place';

import cron from 'node-cron';

let updateOpenTodayJobRunning = false;
let openOrClosePlaceJobRunning = false;

/**
 * Update Open Today Job
 */
const updateOpensTodayJob = async () => {
  console.log('cronJob - Job update openToday started ✔');
  if (updateOpenTodayJobRunning) return RollbarProvider.error('cronJob already running');

  try {
    updateOpenTodayJobRunning = true;
    console.log('cronJob - Updating boolean openToday in places ...');
    await Place.updateOpenTodayField();
    console.log('cronJob - Job update openToday ended ✔');
    updateOpenTodayJobRunning = false;
  } catch (err) {
    console.log('cronJob - Job update openToday ended with error ❌');
    RollbarProvider.error('Failed to execute job update openToday', { err });
    updateOpenTodayJobRunning = false;
  }
};

/**
 * Open and Close Place Job
 */
const openOrClosePlaceJob = async () => {
  // console.log('cronJob - Open or Close place Job started ✔');
  if (openOrClosePlaceJobRunning) return RollbarProvider.error('cronJob already running');

  try {
    openOrClosePlaceJobRunning = true;
    // console.log('cronJob - Opening or Closing Places ...');
    await Place.openOrClosePlaces();
    // console.log('cronJob - Open or Close place Job ended ✔');
    openOrClosePlaceJobRunning = false;
  } catch (err) {
    console.log('cronJob - Open or Close place Job ended with error ❌');
    console.log(err);
    RollbarProvider.error('Failed to execute Open or Close place Job', { err });
    openOrClosePlaceJobRunning = false;
  }
};

/**
 * Initialize cron
 */
const init = async () => {
  try {
    console.log('cronJob - Crons started');
    cron.schedule('1 0 */1 * *', () => updateOpensTodayJob()).start();
    cron.schedule('*/1 * * * *', () => openOrClosePlaceJob()).start();
  } catch (error) {
    RollbarProvider.error('Failed to execute crons', { error });
  }
};

try {
  const shouldRun = Config.get('app.nodeEnv') !== 'development';
  console.log('cronJob - Should run: ', shouldRun);
  if (shouldRun) {
    init();
  }
} catch (err) {
  console.log('Failed to execute cron', err);
}
