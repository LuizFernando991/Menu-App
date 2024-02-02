import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  email: string

  @Column()
  password: string
}
