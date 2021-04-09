declare module '@ioc:Adonis/Core/Request' {
  import { UserType } from 'App/Models/User';
  import { AdminType } from 'App/Models/Admin';

  interface RequestContract {
    user?: UserType | AdminType;
  }
}
