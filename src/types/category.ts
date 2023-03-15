import { Subcategory } from 'src/types/subcategory'
import { Basetype } from 'src/types/basetype'

export interface Category extends Basetype {
  subcategories: Subcategory[]
}
