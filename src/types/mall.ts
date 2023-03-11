export interface Category {
  id: number
  name: string
  subcategories: SubcategoryWithoutCatId[]
}
export interface Subcategory {
  id: number
  name: string
  description: string
  category_id: number
}

export type SubcategoryWithoutCatId = Omit<Subcategory, 'category_id'>

export interface Status {
  affectedRows: number
  changedRows: number
  fieldCount: number
  info: string
  insertId: number
  serverStatus: number
  warningStatus: number
}
