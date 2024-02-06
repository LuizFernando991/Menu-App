import { BadRequestException, Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { CategoryEntity } from 'src/categories/category.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`
          callback(null, filename)
        }
      }),
      fileFilter: (req, file, callback) => {
        const mimetype = file.mimetype
        if (!['image/jpeg', 'image/jpg'].includes(mimetype)) {
          return callback(
            new BadRequestException('only jpg or jpeg files are allowed'),
            false
          )
        }
        callback(null, true)
      }
    })
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
