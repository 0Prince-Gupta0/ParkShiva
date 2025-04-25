import { Body, Controller, Post, Get,  Patch, BadRequestException } from '@nestjs/common';
import { ParkingService } from './parking.service'
import { ParkCarDto } from './dto/park-car.dto';

@Controller()
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('parking_lot')
  initialize(@Body() body: { no_of_slot: number }) {
    return this.parkingService.initializeParkingLot(body.no_of_slot);
  }

  @Patch('parking_lot')
  expand(@Body() body: { increment_slot: number }) {
    const increment = body.increment_slot;
    if (typeof increment !== 'number' || increment <= 0) {
      throw new BadRequestException('increment_slot must be a positive number');
    }
    return this.parkingService.expandParkingLot(increment);
  }


  @Post('park')
  parkCar(@Body() parkCarDto: ParkCarDto) {
    const car = {
      registrationNumber: parkCarDto.car_reg_no,
      color: parkCarDto.car_color,
    };
    return this.parkingService.parkCar(car);
  }
  
  @Post('clear')
  clearSlot(@Body() body: { slot_number?: number; car_registration_no?: string }) {
    return this.parkingService.clearSlot(body);
  }
  

  @Get('status')
getStatus() {
  return this.parkingService.getOccupiedSlots();
}
}
