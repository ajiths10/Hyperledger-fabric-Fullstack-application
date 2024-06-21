import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MotocycleGarageService } from "./motocycle-garage.service";
import { CreateMotocycleGarageDto } from "./dto/create-motocycle-garage.dto";
import { UpdateMotocycleGarageDto } from "./dto/update-motocycle-garage.dto";

@Controller("motocycle-garage")
export class MotocycleGarageController {
  constructor(
    private readonly motocycleGarageService: MotocycleGarageService
  ) {}

  @Post("/initLedger")
  initLedger() {
    return this.motocycleGarageService.initLedger();
  }

  @Post()
  create(@Body() createMotocycleGarageDto: CreateMotocycleGarageDto) {
    return this.motocycleGarageService.create(createMotocycleGarageDto);
  }

  @Get()
  findAll() {
    return this.motocycleGarageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.motocycleGarageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMotocycleGarageDto: UpdateMotocycleGarageDto) {
  //   return this.motocycleGarageService.update(+id, updateMotocycleGarageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.motocycleGarageService.remove(+id);
  // }
}
