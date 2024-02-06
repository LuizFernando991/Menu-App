import { Controller, Get } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { IsPublic } from '../decorators/is-public.decorator'

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @IsPublic()
  async findAll() {
    return await this.categoriesService.findAll()
  }
}
