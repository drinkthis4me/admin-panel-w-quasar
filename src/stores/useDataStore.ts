import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Category,
  Subcategory,
  SubcategoryWithoutCatId,
} from 'src/types/mall'

export const useDataStore = defineStore('data', () => {
  // const categories = ref<Category[]>()
  // const subcategories = ref<Subcategory[]>()

  const subcategories = ref<Subcategory[]>([
    {
      id: 2,
      category_id: 10001,
      name: "Men's Tops",
      description: "Men's clothes",
    },
    {
      id: 5,
      category_id: 10001,
      name: "Women's Tops",
      description: "Shop for Women's Fashion",
    },
    {
      id: 7,
      category_id: 10001,
      name: "Men's Bottom Wear",
      description: 'Pants, Jeans and Leggings',
    },
    {
      id: 8,
      category_id: 10001,
      name: "Women's Bottom Wear",
      description: 'Pants, Jeans and Skirts',
    },
    {
      id: 9,
      category_id: 10002,
      name: 'Meat',
      description: 'Beef, Pork, Lamb, and Fish',
    },
    {
      id: 10,
      category_id: 10002,
      name: 'Drinks',
      description: 'Soda, Juice, Milk and Water',
    },
    {
      id: 11,
      category_id: 10002,
      name: 'Snacks',
      description: 'Chips, Candies and Crackers',
    },
    {
      id: 12,
      category_id: 10002,
      name: 'Fresh Vegetables',
      description: 'Sourced from Local Farmers',
    },
    {
      id: 14,
      category_id: 10010,
      name: 'Notebooks',
      description: 'MacBook, MS Surface, Asus, MSI, HP',
    },
    {
      id: 15,
      category_id: 10010,
      name: 'LCD Monitors',
      description: 'Asus, BenQ, SAMSUNG, LG, MSI',
    },
    {
      id: 16,
      category_id: 10011,
      name: 'Tables',
      description: 'Handcraft Wooden Tables',
    },
    {
      id: 20,
      category_id: 10028,
      name: 'Microsoft',
      description: 'OEM',
    },
  ])
  const categories = ref<Category[]>([
    {
      id: 10001,
      name: 'Clothes',
      subcategories: [
        {
          id: 2,
          name: "Men's Tops",
          description: "Men's clothes",
        },
        {
          id: 5,
          name: "Women's Tops",
          description: "Shop for Women's Fashion",
        },
        {
          id: 7,
          name: "Men's Bottom Wear",
          description: 'Pants, Jeans and Leggings',
        },
        {
          id: 8,
          name: "Women's Bottom Wear",
          description: 'Pants, Jeans and Skirts',
        },
      ],
    },
    {
      id: 10002,
      name: 'Food',
      subcategories: [
        {
          id: 9,
          name: 'Meat',
          description: 'Beef, Pork, Lamb, and Fish',
        },
        {
          id: 10,
          name: 'Drinks',
          description: 'Soda, Juice, Milk and Water',
        },
        {
          id: 11,
          name: 'Snacks',
          description: 'Chips, Candies and Crackers',
        },
        {
          id: 12,
          name: 'Fresh Vegetables',
          description: 'Sourced from Local Farmers',
        },
      ],
    },
    {
      id: 10010,
      name: '3C',
      subcategories: [
        {
          id: 14,
          name: 'Notebooks',
          description: 'MacBook, MS Surface, Asus, MSI, HP',
        },
        {
          id: 15,
          name: 'LCD Monitors',
          description: 'Asus, BenQ, SAMSUNG, LG, MSI',
        },
      ],
    },
    {
      id: 10011,
      name: 'Household',
      subcategories: [],
    },
    {
      id: 10028,
      name: 'Software',
      subcategories: [
        {
          id: 20,
          name: 'Microsoft',
          description: 'OEM',
        },
      ],
    },
  ])

  const currentCategory = ref<Category | null>(null)
  const currentSubcategory = ref<SubcategoryWithoutCatId | null>(null)

  const updateCurrentCategory = (id: number) => {
    if (categories.value) {
      const target = categories.value.find((c) => c.id == id)
      if (target) {
        currentCategory.value = target
      }
    }
  }

  const updateCurrentSubategory = (id: number, subId: number) => {
    updateCurrentCategory(id)

    if (currentCategory.value) {
      const target = currentCategory.value.subcategories.find(
        (s) => s.id == Number(subId)
      )
      if (target) {
        currentSubcategory.value = target
      }
    }
  }

  const clearCurrent = () => {
    currentCategory.value = null
    currentSubcategory.value = null
  }

  const findDuplicate = (name: string, id?: number): boolean => {
    const lowered = name.toLowerCase()
    let targetIndex = -1
    if (!id) {
      // find duplicate in category
      const result = categories.value?.findIndex(
        (c) => c.name.toLowerCase() == lowered
      )
      if (result && result >= 0) targetIndex
    } else {
      // find duplicate in subcategory
      const category = categories.value?.find((c) => c.id == id)
      // empty subcategories
      if (!category || !category.subcategories.length) {
        return false
      }
      targetIndex = category.subcategories.findIndex(
        (sub) => sub.name.toLowerCase() == lowered
      )
    }

    return targetIndex >= 0
  }

  return {
    categories,
    subcategories,
    currentCategory,
    currentSubcategory,
    updateCurrentCategory,
    updateCurrentSubategory,
    clearCurrent,
    findDuplicate,
  }
})
