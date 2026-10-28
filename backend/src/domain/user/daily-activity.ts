export type DailyActivityKey = {
  userId: string;
  date: Date;
};

export type DailyActivity = {
  userId: string;
  date: Date;
  count: number;
};

export type NewDailyActivity = {
  userId: string;
  date: Date;
  count?: number;
};

export type DailyActivityChanges = Partial<Omit<NewDailyActivity, "userId" | "date">>;
