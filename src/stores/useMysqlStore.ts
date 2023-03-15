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

  const categories = ref<Category[]>()
  const subcategories = ref<Subcategory[]>()

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
