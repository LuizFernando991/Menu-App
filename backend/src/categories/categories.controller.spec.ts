import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { CategoryEntity } from './category.entity'

jest.mock('./categories.service')

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService]
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories: CategoryEntity[] = [
        { id: 1, name: 'Category 1', parent: null, children: null },
        { id: 2, name: 'Category 2', parent: null, children: null }
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(mockCategories)

      const result = await controller.findAll()

      expect(result).toEqual(mockCategories)
    })

    it('should call categoriesService.findAll', async () => {
      const spy = jest.spyOn(service, 'findAll')

      await controller.findAll()

      expect(spy).toHaveBeenCalled()
    })
  })
})
