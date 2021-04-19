export type Place = {
  id: string;
  prefectureId: string;
  title: string;
  internalTitle: string;
  addressStreet: string;
  addressDistrict: string;
  addressCityState: string;
  addressZip: string;
  googleMapsUrl: string;
  type: string;
  open: boolean;
  queueStatus: string;
  //Timestamp firebase
  queueUpdatedAt: {
    _seconds: number;
  };
  createdAt: Date;
  updatedAt: Date;
  openToday?: boolean;
  openTomorrow?: boolean;

  openAt?: {
    _seconds: number;
  };
  closeAt?: {
    _seconds: number;
  };
};
