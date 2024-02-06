import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm'

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => CategoryEntity, { nullable: true })
  parent: CategoryEntity

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[]
}
