import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Place from 'App/Models/Place';
import ImportPlaceValidator from 'App/Validators/ImportPlaceValidator';
import csvtojson from 'csvtojson';

export default class PlacesController {
  /**
   * Import CSV
   * @param param0
   */
  public async importPlacesFromCSV({ request, response }: HttpContextContract) {
    console.log('importPlacesFromCSV');
    const data = await request.validate(ImportPlaceValidator);
    console.log('Received import data', data);
    console.log(request.decodedIdToken);
    //if there's no token, isn't super admin or isn't prefecture admin for a given prefecture, deny.
    if (
      !(
        request.decodedIdToken &&
        (request.decodedIdToken.role === 'superAdmin' ||
          (request.decodedIdToken.role === 'prefectureAdmin' &&
            request.decodedIdToken.prefectureId === data.prefectureId))
      )
    ) {
      throw new Error('Only authenticated superAdmin or prefectureAdmin can load CSV file.');
    }

    // Adonis autoProcess is true, so file is stored temporarily in tempPath
    const csvFile = data.file;
    if (!csvFile.tmpPath) throw new Error('Failed processing path to file');
    const places = await csvtojson().fromFile(csvFile.tmpPath);

    await Place.importJsonData(places, data.prefectureId, data.deactivateMissing);

    response.status(200).send({ status: 200 });
  }
}
