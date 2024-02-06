import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateProductDto, UpdateProductDto } from './product.dto'

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() photo
  ) {
    if (!photo) {
      throw new BadRequestException('photo is required')
    }
    const imagePath = photo.filename
    return this.productsService.create(createProductDto, imagePath)
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() photo
  ) {
    let imagePath: string
    if (photo) {
      imagePath = photo.filename
    }
    return this.productsService.update(id, updateProductDto, imagePath)
  }
}
