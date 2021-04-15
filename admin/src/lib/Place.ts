export type Place = {
  id: string;
  prefectureId: string;
  title: string;
  internalTitle?: string;
  addressStreet?: string;
  addressDistrict?: string;
  addressCityState?: string;
  addressZip?: string;
  googleMapsUrl?: string;
  type?: string;
  open?: boolean;
  openToday?: boolean;
  openTomorrow?: boolean;
  active?: boolean;
  openAt?: {
    seconds: number;
  };
  closeAt?: {
    seconds: number;
  };
  queueStatus?: string;
  queueUpdatedAt?: {
    seconds: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
