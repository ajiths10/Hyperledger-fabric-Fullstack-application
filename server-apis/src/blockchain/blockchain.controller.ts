import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BlockchainService } from "./blockchain.service";
import { CreateBlockchainDto } from "./dto/create-blockchain.dto";
import { UpdateBlockchainDto } from "./dto/update-blockchain.dto";
import { UpdateAssetOwnerBlockchainDto } from "./dto/update-asset-owner-blockchain.dto";

@Controller("blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post("/initLedger")
  initLedger() {
    return this.blockchainService.initLedger();
  }

  @Post()
  create(@Body() createBlockchainDto: CreateBlockchainDto) {
    return this.blockchainService.create(createBlockchainDto);
  }

  @Get()
  findAll() {
    return this.blockchainService.findAll();
  }

  @Get(":assetId")
  findOne(@Param("assetId") assetId: string) {
    return this.blockchainService.findOne(assetId);
  }

  @Patch("/transferAsset/:assetId")
  updateAssetOwner(
    @Param("assetId") assetId: string,
    @Body() payload: UpdateAssetOwnerBlockchainDto
  ) {
    return this.blockchainService.updateAssetOwner(assetId, payload);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateBlockchainDto: UpdateBlockchainDto
  ) {
    return this.blockchainService.update(+id, updateBlockchainDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.blockchainService.remove(+id);
  }
}
