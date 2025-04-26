import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  private checkIfInitialized() {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot has not been initialized');
    }
  }

  private checkCarRegistrationUnique(registrationNo: string) {
    for (const car of this.parkingMap.values()) {
      if (car.registrationNumber === registrationNo) {
        throw new BadRequestException(
          `Car with registration number ${registrationNo} is already parked`,
        );
      }
    }
  }

  initializeParkingLot(noOfSlots: number): { total_slot: number } {
    if (noOfSlots <= 0) {
      throw new BadRequestException('Number of slots must be greater than zero');
    }

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
    this.checkIfInitialized();

    if (increment <= 0) {
      throw new BadRequestException('Increment must be greater than zero');
    }

    const start = this.totalSlots + 1;
    const end = this.totalSlots + increment;

    for (let i = start; i <= end; i++) {
      this.availableSlots.insert(i);
    }

    this.totalSlots += increment;
    return { total_slot: this.totalSlots };
  }

  parkCar(car: Car): { allocated_slot_number: number } {
    this.checkIfInitialized();

    this.checkCarRegistrationUnique(car.registrationNumber);

    if (this.availableSlots.isEmpty()) {
      throw new BadRequestException('Parking lot is full');
    }

    const slot = this.availableSlots.extractMin();
    if (slot === null) {
      throw new BadRequestException('Parking lot is full');
    }

    this.parkingMap.set(slot, car);
    return { allocated_slot_number: slot };
  }

  clearSlot(payload: { slot_number?: number; car_registration_no?: string }): {
    freed_slot_number: number;
  } {
    this.checkIfInitialized();

    let slot: number | null = null;

    if (payload.slot_number !== undefined) {
      if (!this.parkingMap.has(payload.slot_number)) {
        throw new BadRequestException('Slot is already free or does not exist');
      }
      slot = payload.slot_number;
    } else if (payload.car_registration_no) {
      for (const [key, car] of this.parkingMap.entries()) {
        if (car.registrationNumber === payload.car_registration_no) {
          slot = key;
          break;
        }
      }
      if (slot === null) {
        throw new BadRequestException('Car with registration number not found');
      }
    } else {
      throw new BadRequestException(
        'Provide either slot_number or car_registration_no'
      );
    }

    this.parkingMap.delete(slot);
    this.availableSlots.insert(slot);
    return { freed_slot_number: slot };
  }

  getOccupiedSlots() {
    this.checkIfInitialized();

    const result = [];
    for (const [slot, car] of this.parkingMap.entries()) {
      result.push({
        slot_no: slot,
        registration_no: car.registrationNumber,
        color: car.color,
      });
    }
    return result.sort((a, b) => a.slot_no - b.slot_no);
  }

  getRegistrationNumbersByColor(color: string): string[] {
    this.checkIfInitialized();

    const result = Array.from(this.parkingMap.values())
      .filter((car) => car.color.toLowerCase() === color.toLowerCase())
      .map((car) => car.registrationNumber);

    if (result.length === 0) {
      throw new NotFoundException(`No cars found with color: ${color}`);
    }

    return result;
  }

  getSlotByRegistration(regNo: string): { slot_number: number } {
    this.checkIfInitialized();

    for (const [slot, car] of this.parkingMap.entries()) {
      if (car.registrationNumber === regNo) {
        return { slot_number: slot };
      }
    }
    throw new NotFoundException('Car with registration number not found');
  }

  getSlotNumbersByColor(color: string): number[] {
    this.checkIfInitialized();

    const result = Array.from(this.parkingMap.entries())
      .filter(([_, car]) => car.color.toLowerCase() === color.toLowerCase())
      .map(([slot]) => slot);

    if (result.length === 0) {
      throw new NotFoundException(`No slots found for color: ${color}`);
    }

    return result;
  }

  parkMultipleCars(
    cars: Car[],
  ): { registrationNumber: string; allocated_slot_number: number }[] {
    this.checkIfInitialized();

    const responses = [];

    for (const car of cars) {
      // Check if the registration number is already taken
      this.checkCarRegistrationUnique(car.registrationNumber);

      if (this.availableSlots.isEmpty()) {
        responses.push({
          registrationNumber: car.registrationNumber,
          allocated_slot_number: -1,
        });
        continue;
      }

      const slot = this.availableSlots.extractMin()!;
      this.parkingMap.set(slot, car);
      responses.push({
        registrationNumber: car.registrationNumber,
        allocated_slot_number: slot,
      });
    }

    return responses;
  }

  getSummary() {
    this.checkIfInitialized();

    const occupied = this.parkingMap.size;
    const available = this.totalSlots - occupied;
    return {
      total_slots: this.totalSlots,
      occupied_slots: occupied,
      available_slots: available,
    };
  }
}
