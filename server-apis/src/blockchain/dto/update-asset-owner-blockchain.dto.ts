import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class UpdateAssetOwnerBlockchainDto {
  @IsString()
  @IsNotEmpty()
  newOwner: string;
}
