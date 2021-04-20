import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import Prefecture from 'App/Models/Prefecture';
import Place from 'App/Models/Place';

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

    // Force open places now, today, tomorrow
    const prefecture = await Prefecture.findByIdWithPlaces(this.prefectureId);
    if (!prefecture) {
      console.error("Couldn't find prefecture ");
      return;
    }
    const places = prefecture.places;
    console.log(`Places on ${this.prefectureId}: ${places?.length}`);
    if (places) {
      for (const place of places) {
        console.log('Updating ' + place.id + ' ...');
        await Place.save(
          {
            ...place,
            // open: true,
            openToday: true,
            openTomorrow: true
          },
          this.prefectureId
        );
      }
    }
  }
}
