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
    startedOn: string;
    createdAt: string;
    updatedAt: string;
    isClosed: boolean;
  };
  isAchieved: boolean;
  comment: string;
  createdAt: string;
}
