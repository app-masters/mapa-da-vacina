declare module '@ioc:Adonis/Providers/Google' {
  import Google, { Client } from '@googlemaps/google-maps-services-js';

  export interface GoogleInterface {
    client: Client;
    googleMaps: typeof Google;
  }

  const GoogleProvider: GoogleInterface;
  export default GoogleProvider;
}
