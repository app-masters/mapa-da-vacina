import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import csvtojson from 'csvtojson';
import Place from 'App/Models/Place';

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

  @args.string({ description: 'Deactivate places missing from file' })
  public deactivateMissing: boolean;

  public static settings = {
    loadApp: true
  };

  /**
   * Run command
   */
  public async run() {
    this.logger.info('Running command...');
    console.log(this.path, this.prefectureId, this.deactivateMissing);

    // Read CSV file...
    const places = await csvtojson().fromFile(this.path);
    // console.log("CSV file", places);
    await Place.importJsonData(places, this.prefectureId, this.deactivateMissing);
  }
}
