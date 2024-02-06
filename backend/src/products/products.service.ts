import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { In, Repository } from 'typeorm'
import { CreateProductDto } from './product.dto'
import { CategoryEntity } from 'src/categories/category.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(
    productData: CreateProductDto,
    imagePath: string
  ): Promise<ProductEntity> {
    const categories = await this.categoryRepository.find({
      where: {
        id: In(productData.categoryIds)
      }
    })
    if (!categories.length) {
      throw new BadRequestException('invalid categories')
    }
    const product = this.productRepository.create({
      ...productData,
      photo: imagePath,
      categories: categories
    })
    return await this.productRepository.save(product)
  }
}
