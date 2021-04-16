import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Place from 'App/Models/Place';
import ImportPlaceValidator from 'App/Validators/ImportPlaceValidator';
import csvtojson from 'csvtojson';

export default class PlacesController {
  /**
   * Import CSV
   * @param param0
   */
  public async importPlacesFromCSV({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ImportPlaceValidator);
    console.log('Received import data', data);

    // Adonis autoProcess is true, so file is stored temporarily in tempPath
    const csvFile = data.file;
    if (!csvFile.tmpPath) throw new Error('Failed processing path to file');
    const places = await csvtojson().fromFile(csvFile.tmpPath);

    console.log(places);
    Place.importJsonData(places, data.prefectureId, data.deactivateMissing);

    response.status(200).send({ status: 200 });
  }
}
