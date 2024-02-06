import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async create(productData, imagePath: string): Promise<any> {
    const product = this.productRepository.create({
      ...productData,
      photo: imagePath
    })
    return await this.productRepository.save(product)
  }
}
