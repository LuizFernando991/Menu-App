import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from './products.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductEntity } from './product.entity'
import { CategoryEntity } from '../categories/category.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('ProductsService', () => {
  let service: ProductsService
  let productRepository: Repository<ProductEntity>
  let categoryRepository: Repository<CategoryEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    )
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity)
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  const mockCategories = [
    { id: 1, name: 'Category 1', parent: null, children: null },
    { id: 2, name: 'Category 1', parent: null, children: null }
  ]
  describe('findAll', () => {
    it('should return an array of products', async () => {
      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0])
      } as any)

      const result = await service.findAll(1, '', [])
      expect(result).toEqual({
        page: 1,
        totalPages: 0,
        totalResults: 0,
        data: []
      })
    })
  })

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = new ProductEntity()
      mockProduct.id = 1
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(mockProduct)

      const result = await service.findOne(1)
      expect(result).toEqual(mockProduct)
    })

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      const mockProductData = {
        name: 'Test Product',
        qty: 10,
        price: 20,
        categoryIds: [1, 2]
      }
      const mockImagePath = '/test/image/path'
      const mockProduct = new ProductEntity()
      Object.assign(mockProduct, mockProductData)
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(mockCategories)
      jest.spyOn(productRepository, 'create').mockReturnValueOnce(mockProduct)
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce(mockProduct)

      const result = await service.create(mockProductData, mockImagePath)
      expect(result).toEqual(mockProduct)
    })

    it('should throw BadRequestException if categoryIds are invalid', async () => {
      const mockProductData = {
        name: 'Test Product',
        qty: 10,
        price: 20,
        categoryIds: []
      }
      const mockImagePath = '/test/image/path'
      jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([])

      await expect(
        service.create(mockProductData, mockImagePath)
      ).rejects.toBeInstanceOf(BadRequestException)
    })
  })

  describe('update', () => {
    it('should update a product', async () => {
      const mockProductData = {
        name: 'Updated Product',
        qty: 20,
        price: 30,
        categoryIds: [3, 4]
      }
      const mockImageName = 'updated_image.jpg'
      const mockProduct = new ProductEntity()
      mockProduct.id = 1
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(mockCategories)
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(mockProduct)
      jest
        .spyOn(productRepository, 'save')
        .mockImplementationOnce((product) => {
          Object.assign(mockProduct, product)
          return Promise.resolve(mockProduct)
        })

      const result = await service.update(1, mockProductData, mockImageName)
      expect(result.name).toEqual('Updated Product')
      expect(result.qty).toEqual(20)
      expect(result.price).toEqual(30)
      expect(result.categories).toEqual(mockCategories)
      expect(result.photo).toEqual('updated_image.jpg')
    })

    it('should update a product without changing photo if imageName is not provided', async () => {
      const mockProductData = {
        name: 'Updated Product',
        qty: 20,
        price: 30,
        categoryIds: [3, 4]
      }
      const mockProduct = new ProductEntity()
      mockProduct.id = 1
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(mockCategories)
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(mockProduct)
      jest
        .spyOn(productRepository, 'save')
        .mockImplementationOnce((product) => {
          Object.assign(mockProduct, product)
          return Promise.resolve(mockProduct)
        })

      const result = await service.update(1, mockProductData)
      expect(result.photo).toBeUndefined()
    })

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.update(1, {} as any)).rejects.toBeInstanceOf(
        NotFoundException
      )
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      const mockProduct = new ProductEntity()
      mockProduct.id = 1
      mockProduct.photo = '/test/image/path.jpg'
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(mockProduct)
      jest.spyOn(productRepository, 'delete').mockResolvedValueOnce(undefined)

      await expect(service.delete(1)).resolves.toBeUndefined()
    })

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.delete(1)).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
