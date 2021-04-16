import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ImportPlaceValidator from 'App/Validators/ImportPlaceValidator';
import csvtojson from 'csvtojson';

export default class PlacesController {
  /**
   * Import CSV
   * @param param0
   */
  public async importPlacesFromCSV({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ImportPlaceValidator);
    console.log(data);
    const csvFile = data.file;
    console.log(csvFile.move);
    if (!csvFile.tmpPath) throw new Error('Failed processing pathto file');
    const places = await csvtojson().fromFile(csvFile.tmpPath); // .fromFile(csvFile.tmpPath);
    console.log(places);
  }
}
