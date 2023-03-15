import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useDataStore } from './useDataStore'
import type { Basetype } from 'src/types/basetype'
import type { Subcategory } from 'src/types/subcategory'
import type { Category } from 'src/types/category'
import type { Status } from 'src/types/status'

const API_URL = 'http://localhost:3000/mall'

export const useMysqlStore = defineStore('mysql', () => {
  const dataStore = useDataStore()

  // const categories = ref<Category[]>()
  // const subcategories = ref<Subcategory[]>()

  // dummy data
  const categories = ref<Category[] | undefined>([
    {
      id: 10001,
      name: '服裝',
      subcategories: [
        {
          id: 2,
          name: '男士上衣',
          description: 'T-shirt, 連帽T, 襯衫, 內衣',
          category_id: 10001,
        },
        {
          id: 7,
          name: "Men's Bottom Wear",
          description: 'Pants, Jeans and Leggings',
          category_id: 10001,
        },
      ],
    },
    {
      id: 10002,
      name: '食品',
      subcategories: [
        {
          id: 9,
          name: '肉類',
          description: '牛雞豬魚',
          category_id: 10002,
        },
        {
          id: 10,
          name: 'Drinks',
          description: 'Soda, Juice, Milk and Water',
          category_id: 10002,
        },
        {
          id: 11,
          name: 'Snacks',
          description: 'Chips, Candies and Crackers',
          category_id: 10002,
        },
        {
          id: 12,
          name: 'Fresh Vegetables',
          description: 'Sourced from Local Farmers',
          category_id: 10002,
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
          category_id: 10010,
        },
        {
          id: 15,
          name: 'LCD Monitors',
          description: 'Asus, BenQ, SAMSUNG, LG, MSI',
          category_id: 10010,
        },
      ],
    },
    {
      id: 10011,
      name: '家用電器',
      subcategories: [
        {
          id: 16,
          name: 'Tables',
          description: 'Handcraft Wooden Tables',
          category_id: 10011,
        },
      ],
    },
    {
      id: 10028,
      name: '軟體',
      subcategories: [
        {
          id: 23,
          name: 'Adobe',
          description: 'Photoshop',
          category_id: 10028,
        },
      ],
    },
    {
      id: 10031,
      name: '碗盤',
      subcategories: [
        {
          id: 22,
          name: 'LV',
          description: 'Original since 1854',
          category_id: 10031,
        },
      ],
    },
    {
      id: 10041,
      name: '清潔',
      subcategories: [
        {
          id: 33,
          name: '浴廁清潔',
          description: '水桶, 地板刷',
          category_id: 10041,
        },
        {
          id: 45,
          name: '廚房清潔',
          description: '抹布, 拖把',
          category_id: 10041,
        },
      ],
    },
    {
      id: 10042,
      name: '美妝',
      subcategories: [],
    },
  ])
  const subcategories = ref<Subcategory[] | undefined>([
    {
      id: 2,
      category_id: 10001,
      name: '男士上衣',
      description: 'T-shirt, 連帽T, 襯衫, 內衣',
    },
    {
      id: 7,
      category_id: 10001,
      name: "Men's Bottom Wear",
      description: 'Pants, Jeans and Leggings',
    },
    {
      id: 9,
      category_id: 10002,
      name: '肉類',
      description: '牛雞豬魚',
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
      id: 23,
      category_id: 10028,
      name: 'Adobe',
      description: 'Photoshop',
    },
    {
      id: 33,
      category_id: 10041,
      name: '浴廁清潔',
      description: '水桶, 地板刷',
    },
    {
      id: 45,
      category_id: 10041,
      name: '廚房清潔',
      description: '抹布, 拖把',
    },
    {
      id: 46,
      category_id: 10041,
      name: '車用',
      description: '手持吸塵器',
    },
    {
      id: 47,
      category_id: 10042,
      name: '口紅',
      description: '水噹噹',
    },
  ])

  interface ReducedCategoryForTable {
    id: number
    name: string
    subcategoriesCount: number
  }
  // categories for table rows
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
  // options for q-select
  const optionsOfCategories = computed<OptionForCategory[]>(() => {
    if (categories.value)
      return categories.value.map(c => {
        return { label: c.name, value: c.id }
      })
    return []
  })

  // Create, Update and Delete response
  const CUDStatus = ref<Status>()
  const errorStatus = ref('')

  const clearStatus = () => {
    CUDStatus.value = undefined
    errorStatus.value = ''
  }

  const apiGET = async (url: string) => {
    await axios
      .get(url)
      .then(res => {
        categories.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const listAll = async () => {
    const url = `${API_URL}/categories`
    await apiGET(url)
  }

  const listAllSub = async () => {
    const url = `${API_URL}/subcategories`
    await axios
      .get(url)
      .then(res => {
        subcategories.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const createCate = async (name: string) => {
    interface Payload {
      name: string
      description?: string
    }

    const url = `${API_URL}/categories`
    const payload: Payload = { name: name }
    const isDuplicate = dataStore.findDuplicate(name)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .post(url, payload)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const createSub = async (newSubcatgory: Omit<Subcategory, 'id'>) => {
    const { name, description, category_id } = newSubcatgory
    const url = `${API_URL}/categories/${category_id}/subcategories`
    const dataToSend = {
      name: name,
      description: description,
    }
    const isDuplicate = dataStore.findDuplicateSub(name, category_id)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .post(url, dataToSend)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const updateCate = async (category: Basetype) => {
    const url = `${API_URL}/categories/${category.id}`
    const isDuplicate = dataStore.findDuplicate(category.name)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .put(url, category)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const updateSub = async (subcategory: Subcategory) => {
    const { id, name, category_id } = subcategory
    const url = `${API_URL}/subcategories/${id}`
    const dataToSend = {
      name: subcategory.name,
      description: subcategory.description,
    }
    const isDuplicate = dataStore.findDuplicateSub(name, category_id)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .put(url, dataToSend)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const deleteCate = async (id: number) => {
    const url = `${API_URL}/categories/${id}`

    if (dataStore.hasChild(id)) {
      errorStatus.value = '子類別存在，無法刪除。'
      return
    }

    await axios
      .delete(url)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  const deleteSub = async (id: number) => {
    const url = `${API_URL}/subcategories/${id}`

    await axios
      .delete(url)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorStatus.value = '伺服器錯誤'
      })
  }

  return {
    categories,
    subcategories,
    reducedCategories,
    optionsOfCategories,
    CUDStatus,
    errorStatus,
    clearStatus,
    listAll,
    listAllSub,
    createCate,
    createSub,
    updateCate,
    updateSub,
    deleteCate,
    deleteSub,
  }
})
