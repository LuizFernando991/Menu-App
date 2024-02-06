import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { CategoryEntity } from '../categories/category.entity'

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  qty: number

  @Column()
  price: number

  @Column()
  photo: string

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  categories: CategoryEntity[]
}
