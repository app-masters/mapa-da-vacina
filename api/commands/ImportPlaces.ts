import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import csvtojson from 'csvtojson';
import { getSlug, sanitizeZip } from 'App/Helpers';

export default class ImportPlaces extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  public static commandName = 'import:places';

  /**
   * Command Name is displayed in the "help" output
   */
  public static description = 'Import a CSV file to Places Document on Firestore';

  @args.string({ description: 'Path to CSV file' })
  public path: string;

  @args.string({ description: 'Firebase Prefecture Id' })
  public prefectureId: string;

  public static settings = {
    loadApp: true
  };

  /**
   * Run command
   */
  public async run() {
    this.logger.info('Running command...');
    console.log(this.path, this.prefectureId);

    try {
      // Read CSV file...
      const places = await csvtojson().fromFile(this.path);
      console.log(places);

      // Para cada linha com um "place"
      for (const place of places) {
        const slug = getSlug(place.title);
        // Ignore agenda for now
        delete place.agenda;
        const res = await FirebaseProvider.db
          .collection('prefecture')
          .doc(this.prefectureId)
          .collection('place')
          .doc(slug)
          .set(
            {
              ...place,
              addressZip: sanitizeZip(place.addressZip),
              active: true,
              open: false,
              prefectureId: this.prefectureId
            },
            { merge: true }
          );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
