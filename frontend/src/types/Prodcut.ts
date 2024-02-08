import { Category } from './Category'

export type ProductFormType = {
  name?: string
  qty?: number
  price?: number
  photo?: File | null
  categoryIds?: number[]
}

export type ProductType = {
  id: number
  name: string
  qty: number
  price: number
  photo: string
  categories: Category[]
}
