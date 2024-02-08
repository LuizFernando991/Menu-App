export type ProductFormType = {
  name?: string
  qty?: number
  price?: number
  photo?: File | null
  categoryIds?: number[]
}

export type ProductType = {
  name: string
  qty: number
  price: number
  photo: File | null
  categoryIds: number[]
}
