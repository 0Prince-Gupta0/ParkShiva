import { BadRequestException, Injectable } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { MinHeap } from '../common/utils/min-heap';

@Injectable()
export class ParkingService {
  private totalSlots = 0;
  private availableSlots: MinHeap;
  private parkingMap: Map<number, Car>;

  constructor() {
    this.availableSlots = new MinHeap();
    this.parkingMap = new Map();
  }

  initializeParkingLot(noOfSlots: number): { total_slot: number } {
    this.totalSlots = 0;
    this.availableSlots = new MinHeap(); 
    this.parkingMap.clear();             
  
    for (let i = 1; i <= noOfSlots; i++) {
      this.availableSlots.insert(i);
    }
    this.totalSlots = noOfSlots;
    return { total_slot: this.totalSlots };
  }
  

  expandParkingLot(increment: number): { total_slot: number } {
    const start = this.totalSlots + 1;
    const end = this.totalSlots + increment;
  
    for (let i = start; i <= end; i++) {
      this.availableSlots.insert(i);
    }
  
    this.totalSlots += increment;
    return { total_slot: this.totalSlots };
  }  

  parkCar(car: Car): { allocated_slot_number: number } {
    if (this.availableSlots.isEmpty()) {
      throw new Error('Parking lot is full');
    }
  
    const slot = this.availableSlots.extractMin();
if (slot === null) {
  throw new Error('Parking lot is full');
}
this.parkingMap.set(slot, car);
return { allocated_slot_number: slot };
  }

  clearSlot(payload: { slot_number?: number; car_registration_no?: string }): { freed_slot_number: number } {
    let slot: number | null = null;
  
    if (payload.slot_number !== undefined) {
      if (!this.parkingMap.has(payload.slot_number)) {
        throw new BadRequestException('Slot already free or does not exist');
      }
      slot = payload.slot_number;
    } else if (payload.car_registration_no) {
      for (const [key, car] of this.parkingMap.entries()) {
        if (car.registrationNumber === payload.car_registration_no) {
          slot = key;
          break;
        }
      }
      if (slot === null) throw new BadRequestException('Car not found');
    } else {
      throw new BadRequestException('Provide either slot_number or car_registration_no');
    }
  
    this.parkingMap.delete(slot);
    this.availableSlots.insert(slot);
    return { freed_slot_number: slot };
  }
  
}
