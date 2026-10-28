export type Unit = {
  id: string;
  title: string;
  position: number;
};

export type NewUnit = {
  title: string;
  position: number;
};

export type UnitChanges = Partial<NewUnit>;
