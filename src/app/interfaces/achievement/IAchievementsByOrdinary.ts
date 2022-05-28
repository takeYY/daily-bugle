export interface IAchievementsByOrdinary {
  name: string;
  scene: 'everyday' | 'week' | 'weekday';
  hasAchieved: number;
  count: number;
}
