// import original module declarations
import 'dayjs';

type ExtendModule = {
  fromNow: () => void;
};

declare module 'dayjs' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Dayjs extends ExtendModule {}
}
