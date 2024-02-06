import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { CategoryEntity } from './category.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

describe('CategoriesService', () => {
  let service: CategoriesService
  let repository: Repository<CategoryEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
    repository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity)
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories: CategoryEntity[] = [
        { id: 1, name: 'Category 1', parent: null, children: null },
        { id: 2, name: 'Category 2', parent: null, children: null }
      ]

      jest.spyOn(repository, 'find').mockResolvedValue(mockCategories)

      const result = await service.findAll()

      expect(result).toEqual(mockCategories)
    })

    it('should return an empty array if no categories found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })
})
