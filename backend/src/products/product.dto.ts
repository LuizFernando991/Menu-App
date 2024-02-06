import {
  IsString,
  Min,
  IsInt,
  IsNumber,
  ArrayNotEmpty,
  IsNotEmpty
} from 'class-validator'
import { Transform } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'
import { BadRequestException } from '@nestjs/common'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @Transform(({ value }) => parseFloat(value))
  @IsInt()
  @Min(1)
  qty: number

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  price: number

  @Transform(({ value }) => {
    try {
      const parsedArray: number[] = JSON.parse(value)
      return parsedArray
    } catch (error) {
      throw new BadRequestException(
        'invalid categoryIds: must be a valid JSON array'
      )
    }
  })
  @ArrayNotEmpty()
  categoryIds: number[]
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
