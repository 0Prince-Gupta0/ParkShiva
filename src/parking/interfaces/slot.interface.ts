import { Car } from './car.interface';

export interface Slot {
  slotNumber: number;
  car: Car | null;
}
