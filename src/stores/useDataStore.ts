import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Category,
  Subcategory,
  SubcategoryWithoutCatId,
} from 'src/types/mall'

export const useDataStore = defineStore('data', () => {
  const categories = ref<Category[]>()
  const subcategories = ref<Subcategory[]>()

  interface ReducedCategoryForTable {
    id: number
    name: string
    subcategoriesCount: number
  }
  const reducedCategories = computed<ReducedCategoryForTable[]>(() => {
    if (categories.value) {
      return categories.value.map(c => {
        return {
          id: c.id,
          name: c.name,
          subcategoriesCount: c.subcategories.length,
        }
      })
    }
    return []
  })

  interface OptionForCategory {
    label: string
    value: number
  }
  const cateOptions = computed<OptionForCategory[]>(() => {
    if (categories.value)
      return categories.value.map(c => {
        return { label: c.name, value: c.id }
      })
    return []
  })

  // const subcategories = ref<Subcategory[] | undefined>([
  //   {
  //     id: 2,
  //     category_id: 10001,
  //     name: "Men's Tops",
  //     description: "Men's clothes",
  //   },
  //   {
  //     id: 5,
  //     category_id: 10001,
  //     name: "Women's Tops",
  //     description: "Shop for Women's Fashion",
  //   },
  //   {
  //     id: 7,
  //     category_id: 10001,
  //     name: "Men's Bottom Wear",
  //     description: 'Pants, Jeans and Leggings',
  //   },
  //   {
  //     id: 8,
  //     category_id: 10001,
  //     name: "Women's Bottom Wear",
  //     description: 'Pants, Jeans and Skirts',
  //   },
  //   {
  //     id: 9,
  //     category_id: 10002,
  //     name: 'Meat',
  //     description: 'Beef, Pork, Lamb, and Fish',
  //   },
  //   {
  //     id: 10,
  //     category_id: 10002,
  //     name: 'Drinks',
  //     description: 'Soda, Juice, Milk and Water',
  //   },
  //   {
  //     id: 11,
  //     category_id: 10002,
  //     name: 'Snacks',
  //     description: 'Chips, Candies and Crackers',
  //   },
  //   {
  //     id: 12,
  //     category_id: 10002,
  //     name: 'Fresh Vegetables',
  //     description: 'Sourced from Local Farmers',
  //   },
  //   {
  //     id: 14,
  //     category_id: 10010,
  //     name: 'Notebooks',
  //     description: 'MacBook, MS Surface, Asus, MSI, HP',
  //   },
  //   {
  //     id: 15,
  //     category_id: 10010,
  //     name: 'LCD Monitors',
  //     description: 'Asus, BenQ, SAMSUNG, LG, MSI',
  //   },
  //   {
  //     id: 16,
  //     category_id: 10011,
  //     name: 'Tables',
  //     description: 'Handcraft Wooden Tables',
  //   },
  //   {
  //     id: 20,
  //     category_id: 10028,
  //     name: 'Microsoft',
  //     description: 'OEM',
  //   },
  // ])
  // const categories = ref<Category[] | undefined>([
  //   {
  //     id: 10001,
  //     name: 'Clothes',
  //     subcategories: [
  //       {
  //         id: 2,
  //         name: "Men's Tops",
  //         description: "Men's clothes",
  //       },
  //       {
  //         id: 5,
  //         name: "Women's Tops",
  //         description: "Shop for Women's Fashion",
  //       },
  //       {
  //         id: 7,
  //         name: "Men's Bottom Wear",
  //         description: 'Pants, Jeans and Leggings',
  //       },
  //       {
  //         id: 8,
  //         name: "Women's Bottom Wear",
  //         description: 'Pants, Jeans and Skirts',
  //       },
  //     ],
  //   },
  //   {
  //     id: 10002,
  //     name: 'Food',
  //     subcategories: [
  //       {
  //         id: 9,
  //         name: 'Meat',
  //         description: 'Beef, Pork, Lamb, and Fish',
  //       },
  //       {
  //         id: 10,
  //         name: 'Drinks',
  //         description: 'Soda, Juice, Milk and Water',
  //       },
  //       {
  //         id: 11,
  //         name: 'Snacks',
  //         description: 'Chips, Candies and Crackers',
  //       },
  //       {
  //         id: 12,
  //         name: 'Fresh Vegetables',
  //         description: 'Sourced from Local Farmers',
  //       },
  //     ],
  //   },
  //   {
  //     id: 10010,
  //     name: '3C',
  //     subcategories: [
  //       {
  //         id: 14,
  //         name: 'Notebooks',
  //         description: 'MacBook, MS Surface, Asus, MSI, HP',
  //       },
  //       {
  //         id: 15,
  //         name: 'LCD Monitors',
  //         description: 'Asus, BenQ, SAMSUNG, LG, MSI',
  //       },
  //     ],
  //   },
  //   {
  //     id: 10011,
  //     name: 'Household',
  //     subcategories: [],
  //   },
  //   {
  //     id: 10028,
  //     name: 'Software',
  //     subcategories: [
  //       {
  //         id: 20,
  //         name: 'Microsoft',
  //         description: 'OEM',
  //       },
  //     ],
  //   },
  // ])

  const findDuplicate = (name: string): boolean => {
    const lowered = name.toLowerCase()
    let index = -1
    if (categories.value) {
      // find duplicate in category
      index = categories.value.findIndex(c => c.name.toLowerCase() == lowered)
    }
    return index != -1
  }

  const findDuplicateSub = (name: string, categoryId: number): boolean => {
    const lowered = name.toLowerCase()
    if (categories.value) {
      // find category
      const cateIndex = categories.value.findIndex(c => c.id == categoryId)
      const targetCategory = categories.value[cateIndex]

      // find duplicate in subcategory
      if (
        targetCategory &&
        targetCategory.subcategories &&
        targetCategory.subcategories.length > 0
      ) {
        return targetCategory.subcategories.some(
          sub => sub.name.toLowerCase() == lowered
        )
      } else return false
    }
    return true
  }

  const hasChild = (cId: number) => {
    if (categories.value) {
      const targetCategory = categories.value.find(c => c.id == cId)
      if (targetCategory) {
        return targetCategory.subcategories.length > 0
      }
    }
    return false
  }

  const updateCategories = (name: string, id: number) => {
    if (categories.value) {
      const targetIndex = categories.value.findIndex(c => c.id == id)
      if (targetIndex != -1) {
        categories.value[targetIndex].name = name
      } else {
        console.log('error update categories')
      }
    } else console.log('error update categories')
  }

  interface UpdateSubPayload {
    name: string
    description: string
  }
  const updateSubcategories = (payload: UpdateSubPayload, subId: number) => {
    const subWitoutId: SubcategoryWithoutCatId = {
      ...payload,
      id: subId,
    }
    let cId = 0

    // update const subcategories
    if (subcategories.value) {
      const targetSubIndex = subcategories.value.findIndex(
        sub => sub.id == subId
      )
      if (targetSubIndex != -1) {
        cId = subcategories.value[targetSubIndex].category_id
        const subFull: Subcategory = {
          ...payload,
          id: subId,
          category_id: cId,
        }
        subcategories.value[targetSubIndex] = subFull
      }
    } else console.log('error update subcategories')
    // update const categories
    if (categories.value) {
      const targetCate = categories.value.find(c => c.id == cId)
      if (targetCate) {
        const targetSubIndex = targetCate.subcategories.findIndex(
          sub => sub.id == subId
        )
        if (targetSubIndex > -1)
          targetCate.subcategories[targetSubIndex] = subWitoutId
        else console.log('error update subcategories')
      } else console.log('error update subcategories')
    } else console.log('error update subcategories')
  }

  const createCategory = (name: string, newCateId: number) => {
    const newCate = { id: newCateId, name: name, subcategories: [] }
    // update const categories
    if (categories.value) {
      categories.value.push(newCate)
    } else console.log('error create category')
  }

  interface NewSub {
    name: string
    description: string
    category_id: number
    id: number
  }
  const createSubcategory = (payload: NewSub, cId: number) => {
    // update const categories
    if (categories.value) {
      const newSub: SubcategoryWithoutCatId = {
        id: payload.id,
        name: payload.name,
        description: payload.description,
      }
      const targetCategory = categories.value.find(c => c.id == cId)
      if (targetCategory) {
        targetCategory.subcategories.push(newSub)
      } else console.log('error create subcategory')
    } else console.log('error create subcategory')
    // update const subcatgories
    if (subcategories.value) {
      subcategories.value.push(payload)
    } else console.log('error create subcategory')
  }

  const deleteCategory = (cId: number) => {
    if (categories.value) {
      const targetIndex = categories.value?.findIndex(c => c.id == cId)
      if (targetIndex) {
        categories.value.splice(targetIndex, 1)
      }
    }
  }

  const deleteSubategory = (subId: number) => {
    let cId = 0

    // update const subcategories
    if (subcategories.value) {
      const targetIndex = subcategories.value.findIndex(sub => sub.id == subId)
      if (targetIndex != -1) {
        cId = subcategories.value[targetIndex].category_id
        subcategories.value.splice(targetIndex, 1)
      }
    }
    // update const categories
    if (categories.value) {
      const targetCategory = categories.value.find(c => c.id == cId)
      if (targetCategory) {
        const targetIndex = targetCategory.subcategories.findIndex(
          s => s.id == subId
        )
        if (targetIndex != -1) {
          targetCategory.subcategories.splice(targetIndex, 1)
        }
      }
    }
  }

  return {
    categories,
    subcategories,
    reducedCategories,
    cateOptions,
    findDuplicate,
    findDuplicateSub,
    hasChild,
    updateCategories,
    updateSubcategories,
    createCategory,
    createSubcategory,
    deleteCategory,
    deleteSubategory,
  }
})
