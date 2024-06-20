import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CarGarageService } from "./car-garage.service";
import { CreateCarGarageDto } from "./dto/create-car-garage.dto";
import { UpdateCarGarageDto } from "./dto/update-car-garage.dto";

@Controller("car-garage")
export class CarGarageController {
  constructor(private readonly carGarageService: CarGarageService) {}

  @Post()
  create(@Body() createCarGarageDto: CreateCarGarageDto) {
    return this.carGarageService.create(createCarGarageDto);
  }

  @Get()
  findAll() {
    return this.carGarageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.carGarageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCarGarageDto: UpdateCarGarageDto) {
  //   return this.carGarageService.update(+id, updateCarGarageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.carGarageService.remove(+id);
  // }
}
