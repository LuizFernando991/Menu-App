import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column()
  password: string
}
