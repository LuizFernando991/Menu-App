import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { In, Repository } from 'typeorm'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { CategoryEntity } from 'src/categories/category.entity'
import { removeImageFromStorage } from 'src/helpers/deleteImage'

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

  async update(id: number, productData: UpdateProductDto, imageName?: string) {
    let categories: CategoryEntity[] = []
    if (productData.categoryIds && productData.categoryIds?.length) {
      categories = await this.categoryRepository.find({
        where: {
          id: In(productData.categoryIds)
        }
      })
    }

    const product = await this.productRepository.findOne({
      where: {
        id
      },
      relations: { categories: true }
    })

    if (!product) {
      throw new NotFoundException('product not found')
    }
    const oldImage = product.photo
    const data = {
      name: productData.name,
      qty: productData.qty,
      price: productData.price,
      categories: categories.length ? categories : undefined,
      photo: imageName ? imageName : undefined
    }

    // updating just new values
    Object.keys(data).forEach((value) => {
      if (data[value]) {
        product[value] = data[value]
      }
    })
    const updatedProduct = await this.productRepository.save(product)

    // removing old images
    if (imageName) {
      removeImageFromStorage(oldImage)
    }

    return updatedProduct
  }
}
