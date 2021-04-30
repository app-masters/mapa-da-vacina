import { args, BaseCommand } from '@adonisjs/core/build/standalone';
import { PlaceInputType } from '@googlemaps/google-maps-services-js';
import GoogleProvider from '@ioc:Adonis/Providers/Google';
import Place from 'App/Models/Place';
import Config from '@ioc:Adonis/Core/Config';

export default class SearchMapsUrl extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  public static commandName = 'search:maps_url';

  @args.string({ description: 'Firebase Prefecture Id' })
  public prefectureId: string;

  public static settings = {
    loadApp: true
  };

  /**
   * Command Name is displayed in the "help" output
   */
  public static description = '';

  /**
   * Run command
   */
  public async run() {
    this.logger.info('search:maps_url');
    const googleApiKey = Config.get('app.googleApiKey');
    const placesWithoutMapsUrl = await Place.findWithoutMapsUrl(this.prefectureId);
    console.log('Places without URL', placesWithoutMapsUrl.length);

    for (const place of placesWithoutMapsUrl) {
      const result = await GoogleProvider.client.findPlaceFromText({
        params: {
          key: googleApiKey,
          input: place.title + ' ' + place.addressCityState,
          inputtype: PlaceInputType.textQuery,
          fields: ['formatted_address', 'name', 'geometry', 'place_id']
        }
      });
      console.log(place.id, result.data.candidates.length, result.data);
      if (result.statusText === 'OK' && result.data.candidates.length > 0) {
        const bestPlace = result.data.candidates[0];
        if (bestPlace.place_id && bestPlace.geometry) {
          place.latitude = bestPlace.geometry.location.lat;
          place.longitude = bestPlace.geometry.location.lng;
          place.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}&query_place_id=${bestPlace.place_id}`;
          await Place.save({ ...place }, this.prefectureId);
        }
      }
    }
  }
}
