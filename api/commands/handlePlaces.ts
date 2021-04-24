import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import Prefecture from 'App/Models/Prefecture';
import Place from 'App/Models/Place';
// import { minutesDiff } from 'App/Helpers';

export default class HandlePlaces extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  public static commandName = 'handle:places';

  /**
   * Command Name is displayed in the "help" output
   */
  public static description = 'Handle Places to fix something when needed';

  @args.string({ description: 'Firebase Prefecture Id' })
  public prefectureId: string;

  // @args.string({ description: 'Deactivate places missing from file' })
  // public deactivateMissing: boolean;

  public static settings = {
    loadApp: true
  };

  /**
   * Run command
   */
  public async run() {
    this.logger.info('Running command...');
    console.log('prefectureId: ' + this.prefectureId);

    // Load all prefectures
    // const prefectures = await Prefecture.list();

    // for (const prefecture of prefectures) {
    //   // Places without prefectureId
    //   const placesWithoutPrefecture = (await Place.list({}, prefecture.id)).filter((p) => !p.prefectureId);
    //   // placesWithoutPrefecture;
    //   console.log(`Places without prefectureId in ${prefecture.id} : ${placesWithoutPrefecture?.length}`);
    //   // return;
    //   // if (places) {
    //   //   for (const place of places) {
    //   //     console.log('Updating ' + place.id + ' ...');
    //   //     await Place.save(
    //   //       {
    //   //         ...place,
    //   //         // open: true,
    //   //         openToday: true,
    //   //         openTomorrow: true
    //   //       },
    //   //       this.prefectureId
    //   //     );
    //   //   }
    //   //
    // }
    // return;
    //
    // Force open places now, today, tomorrow
    const prefecture = await Prefecture.findByIdWithPlaces(this.prefectureId);
    if (!prefecture) {
      console.error("Couldn't find prefecture ");
      return;
    }
    const places = prefecture.places;
    console.log(`Places on ${this.prefectureId}: ${places.length}`);
    if (places) {
      for (const place of places) {
        console.log('Updating ' + place.id + ' ...');
        // const zip = place.addressZip?.startsWith('3') ? place.addressZip?.substr(1) : '3' + place.addressZip;
        // console.log('zip', zip);
        await Place.save(
          {
            ...place,
            // addressZip: zip
            // open: true,
            // queueStatus: 'open',
            // openToday: true,
            openTomorrow: false
          },
          this.prefectureId
        );
      }
    }

    // Simualte open and close
    // const prefecture = await Prefecture.findByIdWithPlaces(this.prefectureId);
    // if (!prefecture) {
    //   console.error("Couldn't find prefecture ");
    //   return;
    // }
    // // console.log('prefecture', prefecture);
    // await Place.updateQueueStatusForDemonstration(prefecture.id);
  }
}
