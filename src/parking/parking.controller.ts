import { Body, Controller, Post, Patch, BadRequestException } from '@nestjs/common';
import { ParkingService } from './parking.service';

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
}
