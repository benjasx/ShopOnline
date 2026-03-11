import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Tener relacion en bbdd a la tabla de usuarios, para autenticar.
@Entity('users')
export class User {
  @ApiProperty({
    example: '227756fa-17c8-48c9-bada-ff124b46c895',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test1@google.com',
    description: 'User Email',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: '$2b$10$S5wnvbqMyuxAyUFsPkhaBu0JeqE5HxKmVvbEkzYrfJVf/BbzO52Bu',
    description: 'User Password',
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'Benja Sanchez',
    description: 'User FullName',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'User is Active',
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'User Roles',
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    example: '8765120-00-A_0_2000.jpg',
    description: 'User Product',
  })
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
