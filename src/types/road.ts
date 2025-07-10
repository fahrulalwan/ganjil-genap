export interface Road {
  id: number;
  name: string;
  isGanjilGenap: boolean;
  isActive: boolean;
  coordinates: [number, number][];
  createdAt: string;
  updatedAt: string;
}
