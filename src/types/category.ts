import type {Basetype} from 'src/types/basetype'
import type { Subcategory } from './subcategory'
 
export interface Category extends Basetype {
  subcategories: Subcategory[]
}
