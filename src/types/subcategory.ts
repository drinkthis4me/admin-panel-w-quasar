import type { Category } from 'src/types/category'

export interface Subcategory extends Category {
  description: string
  category_id: number  
}