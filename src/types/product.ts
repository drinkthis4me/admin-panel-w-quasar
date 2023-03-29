import type { Basetype } from './basetype'

export interface Product extends Basetype {
  description: string
  subcategory_id: number
  size: string
  color: string
  image_path?: string
  price: number
  quantity: number
}
