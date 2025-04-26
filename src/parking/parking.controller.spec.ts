import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

describe('ParkingController', () => {
  let controller: ParkingController;
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: ParkingService,
          useValue: {
            initializeParkingLot: jest.fn(),
            expandParkingLot: jest.fn(),
            parkCar: jest.fn(),
            clearSlot: jest.fn(),
            getOccupiedSlots: jest.fn(),
            getRegistrationNumbersByColor: jest.fn(),
            getSlotByRegistration: jest.fn(),
            getSlotNumbersByColor: jest.fn(),
            parkMultipleCars: jest.fn(),
            getSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    service = module.get<ParkingService>(ParkingService);
  });

  it('should initialize parking lot', () => {
    controller.initialize({ no_of_slot: 5 });
    expect(service.initializeParkingLot).toHaveBeenCalledWith(5);
  });

  it('should expand parking lot', () => {
    controller.expand({ increment_slot: 2 });
    expect(service.expandParkingLot).toHaveBeenCalledWith(2);
  });

  it('should park a car', () => {
    const car = { car_reg_no: 'ABC123', car_color: 'Red' };
    controller.parkCar(car);
    expect(service.parkCar).toHaveBeenCalledWith({
      registrationNumber: 'ABC123',
      color: 'Red',
    });
  });

  it('should clear a slot', () => {
    const body = { slot_number: 1 };
    controller.clearSlot(body);
    expect(service.clearSlot).toHaveBeenCalledWith(body);
  });

  it('should get occupied slots', () => {
    controller.getStatus();
    expect(service.getOccupiedSlots).toHaveBeenCalled();
  });

  it('should get registration numbers by color', () => {
    controller.getRegistrationNumbers('Red');
    expect(service.getRegistrationNumbersByColor).toHaveBeenCalledWith('Red');
  });

  it('should get slot number by registration number', () => {
    controller.getSlotByRegistrationNumber('ABC123');
    expect(service.getSlotByRegistration).toHaveBeenCalledWith('ABC123');
  });

  it('should get slot numbers by color', () => {
    controller.getSlotNumbersByColor('Red');
    expect(service.getSlotNumbersByColor).toHaveBeenCalledWith('Red');
  });

  it('should park multiple cars', () => {
    const cars = [
      { car_reg_no: 'ABC123', car_color: 'Red' },
      { car_reg_no: 'XYZ987', car_color: 'Blue' }
    ];
    controller.parkMultipleCars(cars);
    expect(service.parkMultipleCars).toHaveBeenCalledWith([
      { registrationNumber: 'ABC123', color: 'Red' },
      { registrationNumber: 'XYZ987', color: 'Blue' },
    ]);
  });

  it('should get parking lot summary', () => {
    controller.getParkingLotSummary();
    expect(service.getSummary).toHaveBeenCalled();
  });
});
