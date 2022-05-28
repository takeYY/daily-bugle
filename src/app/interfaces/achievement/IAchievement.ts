export interface IAchievement {
  id?: string;
  userId: string;
  usersOrdinaries: {
    id: string;
    userId: string;
    ordinary: {
      id: string;
      name: string;
    };
    weekdays: {
      id: string;
      name: string;
      isChecked: boolean;
      order: number;
    }[];
    startedOn: {
      _seconds: number;
      _nanoseconds: number;
    };
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    updatedAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    isClosed: boolean;
  };
  isAchieved: boolean;
  comment: string;
  createdAt?:
    | {
        _seconds: number;
        _nanoseconds: number;
      }
    | string;
}
