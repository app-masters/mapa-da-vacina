declare module '@ioc:Adonis/Core/Validator' {
  import { Rule } from '@ioc:Adonis/Core/Validator';

  export interface Rules {
    phone(): Rule;
    nameSurname(): Rule;
  }
}
