import { ParkingService } from './parking.service';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(() => {
    service = new ParkingService();
  });

  it('should initialize parking lot with given number of slots', () => {
    const result = service.initializeParkingLot(5);
    expect(result.total_slot).toBe(5);
  });

  it('should expand parking lot', () => {
    service.initializeParkingLot(5);
    service.expandParkingLot(2);
    expect(service.getSummary().total_slots).toBe(7);
  });

  it('should park a car successfully', () => {
    service.initializeParkingLot(2);
    const car = { registrationNumber: 'ABC123', color: 'Red' };
    const slot = service.parkCar(car);
    expect(slot).toStrictEqual({ allocated_slot_number: 1 });
    const status = service.getOccupiedSlots();
    expect(status.length).toBe(1);
    expect(status[0].registration_no).toBe('ABC123');
  });

  it('should not park a car when parking is full', () => {
    service.initializeParkingLot(1);
    service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
    expect(() => 
      service.parkCar({ registrationNumber: 'DEF456', color: 'Blue' })
    ).toThrow('Parking lot is full');
  });

  it('should clear a parked slot by slot number', () => {
    service.initializeParkingLot(2);
    const car = { registrationNumber: 'ABC123', color: 'Red' };
    service.parkCar(car);
    const result = service.clearSlot({ slot_number: 1 });
    expect(result).toStrictEqual({ freed_slot_number: 1 }); 
    expect(service.getOccupiedSlots().length).toBe(0);
  });

  it('should clear a parked slot by registration number', () => {
    service.initializeParkingLot(2);
    const car = { registrationNumber: 'ABC123', color: 'Red' };
    service.parkCar(car);
    const result = service.clearSlot({ car_registration_no: 'ABC123' });
    expect(result).toStrictEqual({ freed_slot_number: 1 }); 
    expect(service.getOccupiedSlots().length).toBe(0);
  });

  it('should get registration numbers by color', () => {
    service.initializeParkingLot(2);
    service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
    service.parkCar({ registrationNumber: 'DEF456', color: 'Blue' });
    const redCars = service.getRegistrationNumbersByColor('Red');
    expect(redCars).toEqual(['ABC123']);
  });

  it('should get slot number by registration number', () => {
    service.initializeParkingLot(2);
    service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
    const slot = service.getSlotByRegistration('ABC123');
    expect(slot).toStrictEqual({ slot_number: 1 }); 
  });

  it('should get slot numbers by color', () => {
    service.initializeParkingLot(2);
    service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
    const redSlots = service.getSlotNumbersByColor('Red');
    expect(redSlots).toEqual([1]);
  });

  it('should park multiple cars', () => {
    service.initializeParkingLot(3);
    const cars = [
      { registrationNumber: 'ABC123', color: 'Red' },
      { registrationNumber: 'DEF456', color: 'Blue' }
    ];
    const slots = service.parkMultipleCars(cars);
    expect(slots).toStrictEqual([
      { allocated_slot_number: 1, registrationNumber: 'ABC123' },
      { allocated_slot_number: 2, registrationNumber: 'DEF456' }
    ]);
  });

  it('should return parking lot summary', () => {
    service.initializeParkingLot(5);
    service.parkCar({ registrationNumber: 'XYZ987', color: 'Black' });
    const summary = service.getSummary();
    expect(summary.total_slots).toBe(5);
    expect(summary.occupied_slots).toBe(1);
    expect(summary.available_slots).toBe(4);
  });
});
