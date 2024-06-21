import { PartialType } from '@nestjs/mapped-types';
import { CreateMotocycleGarageDto } from './create-motocycle-garage.dto';

export class UpdateMotocycleGarageDto extends PartialType(CreateMotocycleGarageDto) {}
