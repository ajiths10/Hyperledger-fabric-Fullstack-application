import { PartialType } from '@nestjs/mapped-types';
import { CreateCarGarageDto } from './create-car-garage.dto';

export class UpdateCarGarageDto extends PartialType(CreateCarGarageDto) {}
