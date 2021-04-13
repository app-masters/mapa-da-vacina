import { BaseRepository, BaseModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface AgendaType extends BaseModel {
  closedAt: Date;
  openedAt: Date;
  open: boolean;
  vaccines: number;
  date: Date;
}

export class AgendaRepository extends BaseRepository<AgendaType> {
  private static instance: AgendaRepository;
  /**
   * Constructor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!AgendaRepository.instance) {
      AgendaRepository.instance = new AgendaRepository();
    }
    return AgendaRepository.instance;
  }

  /**
   * listAgendaTodayAndTomorrow
   * @param prefId
   * @param placeId
   * @returns
   */
  public async listAgendaTodayAndTomorrow(prefId: string, placeId: string): Promise<AgendaType[]> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const documents = await this.query(
      (qb) => {
        return qb
          .where('date', '>=', new Date(today.toDateString()))
          .where('date', '<=', new Date(tomorrow.toDateString()));
      },
      prefId,
      placeId
    );
    return documents;
  }

  /**
   * Colection path
   * @param documentIds
   * @returns Agenda collection path
   */
  public getCollectionPath(...documentIds: string[]): string {
    const idPrefecture = documentIds.shift();
    if (!idPrefecture) {
      throw new Error('Prefecture id is missing');
    }
    const idPlace = documentIds.shift();
    if (!idPlace) {
      throw new Error('Prefecture id is missing');
    }

    return `prefecture/${idPrefecture}/place/${idPlace}/agenda`;
  }
}

export default AgendaRepository.getInstance();
