import { Test, TestingModule } from '@nestjs/testing'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { BadRequestException } from '@nestjs/common'

jest.mock('./products.service')

describe('ProductsController', () => {
  let controller: ProductsController
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
    service = module.get<ProductsService>(ProductsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should call productsService findAll method with correct parameters', async () => {
      await controller.findAll('1', 'test', '1,2')
      expect(service.findAll).toHaveBeenCalledWith(1, 'test', [1, 2])
    })
  })

  describe('findOne', () => {
    it('should call productsService findOne method with correct parameter', async () => {
      await controller.findOne('1')
      expect(service.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('create', () => {
    it('should call productsService create method with correct parameters', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        qty: 10,
        price: 20,
        categoryIds: [1, 2]
      }
      await controller.create(createProductDto, { filename: 'test.jpg' })
      expect(service.create).toHaveBeenCalledWith(createProductDto, 'test.jpg')
    })

    it('should throw BadRequestException if photo is not provided', async () => {
      await expect(
        controller.create({} as CreateProductDto, undefined)
      ).rejects.toBeInstanceOf(BadRequestException)
    })
  })

  describe('update', () => {
    it('should call productsService update method with correct parameters', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        qty: 20,
        price: 30,
        categoryIds: [3, 4]
      }
      await controller.update(1, updateProductDto, {
        filename: 'updated_test.jpg'
      })
      expect(service.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
        'updated_test.jpg'
      )
    })

    it('should call productsService update method without photo if photo is not provided', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        qty: 20,
        price: 30,
        categoryIds: [3, 4]
      }
      await controller.update(1, updateProductDto, undefined)
      expect(service.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
        undefined
      )
    })

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(
        controller.update(undefined, {} as UpdateProductDto, undefined)
      ).rejects.toBeInstanceOf(BadRequestException)
    })
  })

  describe('delete', () => {
    it('should call productsService delete method with correct parameter', async () => {
      await controller.delete(1)
      expect(service.delete).toHaveBeenCalledWith(1)
    })

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(controller.delete(undefined)).rejects.toBeInstanceOf(
        BadRequestException
      )
    })
  })
})
