import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateProductDto } from './product.dto'

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() photo
  ): Promise<any> {
    if (!photo) {
      throw new BadRequestException('photo is required')
    }
    const imagePath = photo.filename
    return this.productsService.create(createProductDto, imagePath)
  }
}
