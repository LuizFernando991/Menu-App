import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { In, Repository } from 'typeorm'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { CategoryEntity } from '../categories/category.entity'
import { removeImageFromStorage } from '../helpers/deleteImage'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async findAll(page: number, search: string, categoriesIds: number[]) {
    const limit = 20
    const queryBuilder = this.productRepository.createQueryBuilder('product')

    if (search) {
      queryBuilder.where('product.name LIKE :search', { search: `%${search}%` })
    }

    if (categoriesIds.length > 0) {
      queryBuilder
        .innerJoinAndSelect('product.categories', 'category')
        .andWhere('category.id IN (:...categoryIds)')
        .setParameter('categoryIds', categoriesIds)
    } else {
      queryBuilder.leftJoinAndSelect('product.categories', 'category')
    }

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    const totalPages = Math.ceil(total / limit)

    return {
      page,
      totalPages,
      totalResults: total,
      data: products
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id
      },
      relations: { categories: true }
    })
    if (!product) {
      throw new NotFoundException('product not found')
    }

    return product
  }

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

  async delete(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id
      }
    })
    if (!product) {
      throw new NotFoundException('product not found')
    }

    removeImageFromStorage(product.photo)

    await this.productRepository.delete(product)

    return
  }
}
