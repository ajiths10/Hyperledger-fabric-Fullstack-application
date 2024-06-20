import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class CreateCarGarageDto {
  @IsString()
  @IsNotEmpty()
  Model: string;

  @IsString()
  @IsNotEmpty()
  Color: string;

  @IsString()
  @IsNotEmpty()
  Owner: string;

  @IsString()
  @IsNotEmpty()
  Year: string;

  @IsString()
  @IsNotEmpty()
  VIN: string;

  @IsString()
  @IsNotEmpty()
  EngineType: string;

  @IsString()
  @IsNotEmpty()
  Mileage: string;
}
