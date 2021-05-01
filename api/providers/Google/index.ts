import { ConfigContract } from '@ioc:Adonis/Core/Config';

import { Client } from '@googlemaps/google-maps-services-js';

export default class Google {
  public client: Client;
  /**
   * Constructor
   * @param Config
   */
  constructor(Config: ConfigContract) {
    this.client = new Client({});
  }
}
