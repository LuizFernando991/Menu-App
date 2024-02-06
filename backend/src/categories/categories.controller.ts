import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { IsPublic } from '../decorators/is-public.decorator'

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.categoriesService.findAll()
  }
}
