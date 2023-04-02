import type { Basetype } from './basetype'

export interface Product extends Basetype {
  description: string
  sub_category_id: number
  size: string
  color: string
  image_path?: string | null
  price: number
  quantity: number
}
