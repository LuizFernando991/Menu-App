import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { IsPublic } from '../decorators/is-public.decorator'

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page = '1',
    @Query('search') search: string,
    @Query('categories') categories: string
  ) {
    const categoryIds = categories ? categories.split(',').map((id) => +id) : []
    return this.productsService.findAll(+page, search, categoryIds)
  }

  @Get('/:id')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id)
  }

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
    if (!id) {
      throw new BadRequestException('id is required')
    }
    return this.productsService.update(+id, updateProductDto, imagePath)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('id is required')
    }
    return this.productsService.delete(id)
  }
}
