import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class CreateBlockchainDto {
  @IsString()
  @IsNotEmpty()
  AppraisedValue: string;

  @IsString()
  @IsNotEmpty()
  Color: string;

  @IsString()
  @IsNotEmpty()
  Owner: string;

  @IsString()
  @IsNotEmpty()
  Size: string;

  @IsString()
  @IsNotEmpty()
  docType: string;
}
